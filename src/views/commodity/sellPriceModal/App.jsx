import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, InputNumber } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SteppedPrice from '../steppedPrice';
import SearchMind from '../../../components/searchMind';
import {
    fetchTest,
} from '../../../actions/classifiedList';
import { productAddPriceVisible } from '../../../actions/producthome';
import { fetchAddProdPurchase } from '../../../actions';

const FormItem = Form.Item;

@connect(
    state => ({
        toAddPriceVisible: state.toJS().commodity.toAddPriceVisible
    }),
    dispatch => bindActionCreators({
        productAddPriceVisible,
        fetchAddProdPurchase
    }, dispatch)
)

class SellPriceModal extends Component {
    constructor(props) {
        super(props);
        this.handleOk = ::this.handleOk;
        this.handlePriceChange = ::this.handlePriceChange;
        this.handleCancel = ::this.handleCancel;
    }


    getValue(isContinuity) {
        const { defaultValue } = this.state;
        return {
            results: defaultValue,
            isContinuity: isContinuity(defaultValue)
        }
    }

    handleTestFetch = ({ value, pagination }) => {
        // console.log(value, pagination);

        return fetchTest({
            value,
        });
    }

    handleOk() {
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
        validateFields((err, values) => {
            // console.log(values);
            const result = values;
            result.sellSectionPrices = results;
            // TODO post data
        })
        this.props.fetchAddProdPurchase({
            spId: formData.spId,
            spAdrId: formData.spAdrId,
            productId: formData.productId
        })
    }

    handleCancel() {
        this.props.productAddPriceVisible({isVisible: false});
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

    render() {
        const { prefixCls, form } = this.props;
        const { getFieldDecorator } = form;
        const { sellPriceInfoVo = {} } = this.props;
        const { sellSectionPrices = [] } = sellPriceInfoVo;
        const formData = this.props.form.getFieldsValue();
        // console.log(formData);

        return (
            <Modal
                title="新增销售价格"
                visible={this.props.toAddPriceVisible}
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
                                            initialValue: sellPriceInfoVo.salesInsideNumber
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
                                            initialValue: sellPriceInfoVo.minNumber
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
                                            initialValue: sellPriceInfoVo.deliveryDay
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
                                        initialValue: sellSectionPrices
                                    })(
                                        <SteppedPrice
                                            ref={node => (this.steppedPrice = node)}
                                            handleChange={this.handlePriceChange}
                                            inputSize="default"
                                        />
                                    )}
                                </FormItem>
                                <FormItem>
                                    <span>* 建议零售价(元)：</span>
                                    <span>
                                        {getFieldDecorator('suggestPrice', {
                                            rules: [{ required: true, message: '请输入建议零售价!' }],
                                            initialValue: sellPriceInfoVo.suggestPrice
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
                                        fetch={(value, pager) => this.handleTestFetch(value, pager)}
                                        onChoosed={this.handleTestChoose}
                                        renderChoosedInputRaw={(data) => (
                                            <div>{data.id} - {data.name}</div>
                                        )}
                                        pageSize={2}
                                        columns={[
                                            {
                                                title: 'Name',
                                                dataIndex: 'name',
                                                width: 150,
                                            }, {
                                                title: 'Address',
                                                dataIndex: 'address',
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
    productAddPriceVisible: PropTypes.func
};

SellPriceModal.defaultProps = {
    prefixCls: 'sell-modal',
}

export default Form.create()(SellPriceModal);
