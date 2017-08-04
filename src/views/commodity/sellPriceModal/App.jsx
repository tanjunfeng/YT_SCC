import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, InputNumber, message } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SteppedPrice from '../steppedPrice';
import SearchMind from '../../../components/searchMind';
import {
    fetchTest,
} from '../../../actions/classifiedList';
import {
    pubFetchValueList
} from '../../../actions/pub'
import { productAddPriceVisible } from '../../../actions/producthome';
import { fetchAddProdPurchase } from '../../../actions';

const FormItem = Form.Item;

@connect(
    state => ({
        toAddPriceVisible: state.toJS().commodity.toAddPriceVisible
    }),
    dispatch => bindActionCreators({
        productAddPriceVisible,
        fetchAddProdPurchase,
        pubFetchValueList
    }, dispatch)
)
class SellPriceModal extends Component {
    constructor(props) {
        super(props);
        this.handleOk = ::this.handleOk;
        this.handlePriceChange = ::this.handlePriceChange;
        this.handleCancel = ::this.handleCancel;
        this.childCompany = props.datas.branchCompanyId ? {
            branchCompanyId: props.datas.branchCompanyId,
            branchCompanyName: props.datas.branchCompanyName
        } : null;
    }

    handleOk() {
        const { datas, handlePostAdd, isEdit } = this.props;
        const { validateFields, setFields } = this.props.form;
        const { isContinuity, results } = this.steppedPrice.getValue();
        const formData = this.props.form.getFieldsValue();
        if (!isContinuity) {
            setFields({
                sellSectionPrices: {
                    errors: [new Error('价格区间不连续，无法提交')],
                },
            })
            return;
        }
        if (!this.childCompany) {
            message.error('请选择子公司');
        }
        validateFields((err, values) => {
            const result = values;
            result.sellSectionPrices = results;
            result.productId = datas.id || datas.productId;
            Object.assign(result, this.childCompany);
            if (isEdit) {
                Object.assign(result, {
                    id: datas.id,
                    productId: datas.productId
                })
            }
            handlePostAdd(result, isEdit);
        })
    }

    handleCancel() {
        this.props.handleClose();
    }

    handlePriceChange(result) {
        const { setFields } = this.props.form;
        const { isContinuity } = result;
        if (isContinuity) {
            setFields({
                sellSectionPrices: {
                    errors: null,
                },
            })
        }
    }

    handleChoose = ({ record, compKey, index, event }) => {
        this.childCompany = {
            branchCompanyId: record.id,
            branchCompanyName: record.name
        };
    }

    handleClear = () => {
        this.childCompany = null;
    }

    render() {
        const { prefixCls, form, datas, isEdit } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                title="新增销售价格"
                visible={true}
                className={prefixCls}
                onOk={this.handleOk}
                width={'447px'}
                onCancel={this.handleCancel}
                maskClosable={false}
            >
                <div className={`${prefixCls}-body-wrap`}>
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <div className={`${prefixCls}-item`}>
                            <div className={`${prefixCls}-item-title`}>货运条件</div>
                            <div className={`${prefixCls}-item-content`}>
                                <FormItem>
                                    <span>*销售内装数：</span>
                                    <span>
                                        {getFieldDecorator('salesInsideNumber', {
                                            rules: [{ required: true, message: '请输入销售内装数' }],
                                            initialValue: datas.salesInsideNumber
                                        })(
                                            <InputNumber min={0} />
                                        )}
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span>*起订量：</span>
                                    <span>
                                        {getFieldDecorator('minNumber', {
                                            rules: [{ required: true, message: '请输入最小起订量!' }],
                                            initialValue: datas.minNumber
                                        })(
                                            <InputNumber min={0} />
                                        )}
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span>*承诺发货时间：下单后</span>
                                    <span className={`${prefixCls}-day-input`}>
                                        {getFieldDecorator('deliveryDay', {
                                            rules: [{ required: true, message: '请输入承诺发货时间!' }],
                                            initialValue: datas.deliveryDay
                                        })(
                                            <InputNumber min={0} />
                                        )}
                                    </span>
                                    天内发货
                                </FormItem>
                            </div>
                        </div>
                        <div className={`${prefixCls}-item`}>
                            <div className={`${prefixCls}-item-title`}>
                                添加阶梯价格
                                <span className={`${prefixCls}-item-tip`}>
                                    &nbsp;(请按从小到大的顺序添加)
                                </span>
                            </div>
                            <div className={`${prefixCls}-item-content`}>
                                <FormItem>
                                    {getFieldDecorator('sellSectionPrices', {
                                    })(
                                        <SteppedPrice
                                            ref={node => (this.steppedPrice = node)}
                                            handleChange={this.handlePriceChange}
                                            defaultValue={isEdit ? datas.sellSectionPrices : []}
                                            inputSize="default"
                                        />
                                    )}
                                </FormItem>
                                <FormItem>
                                    <span>* 建议零售价(元)：</span>
                                    <span>
                                        {getFieldDecorator('suggestPrice', {
                                            rules: [{ required: true, message: '请输入建议零售价!' }],
                                            initialValue: datas.suggestPrice
                                        })(
                                            <InputNumber min={0} />
                                        )}
                                    </span>
                                </FormItem>
                            </div>
                        </div>
                        <div className={`${prefixCls}-item`}>
                            <FormItem>
                                <span className={`${prefixCls}-label`}>子公司：</span>
                                <span className={`${prefixCls}-data-pic`}>
                                    <SearchMind
                                        compKey="search-mind-key1"
                                        ref={ref => { this.searchMind = ref }}
                                        fetch={(param) => this.props.pubFetchValueList({
                                            branchCompanyName: param.value
                                        }, 'findCompanyBaseInfo')}
                                        placeholder="请输入公司名"
                                        onChoosed={this.handleChoose}
                                        defaultValue={datas.branchCompanyId ? `${datas.branchCompanyId} - ${datas.branchCompanyName}` : undefined}
                                        onClear={this.handleClear}
                                        renderChoosedInputRaw={(data) => (
                                           <div>{data.id} - {data.name}</div>
                                        )}
                                        pageSize={4}
                                        columns={[
                                            {
                                                title: '公司编号',
                                                dataIndex: 'id',
                                                width: 150,
                                            }, {
                                                title: '公司名',
                                                dataIndex: 'name',
                                                width: 200,
                                            }
                                        ]}
                                    />
                                </span>
                            </FormItem>
                        </div>
                    </Form>
                </div>
            </Modal>
        );
    }
}

SellPriceModal.propTypes = {
    prefixCls: PropTypes.string,
    form: PropTypes.objectOf(PropTypes.any),
    sellPriceInfoVo: PropTypes.objectOf(PropTypes.any),
    toAddPriceVisible: PropTypes.bool,
    productAddPriceVisible: PropTypes.func,
    handleClose: PropTypes.func,
    datas: PropTypes.objectOf(PropTypes.any),
    isEdit: PropTypes.bool,
};

SellPriceModal.defaultProps = {
    prefixCls: 'sell-modal',
    handleClose: () => {},
    datas: {},
    isEdit: false
}

export default Form.create()(SellPriceModal);
