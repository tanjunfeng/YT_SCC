import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, InputNumber, message, Select } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SteppedPrice from '../steppedPrice';
import SearchMind from '../../../components/searchMind';
import {
    pubFetchValueList
} from '../../../actions/pub';
import { MAXGOODS } from '../../../constant'
import { productAddPriceVisible } from '../../../actions/producthome';
import { fetchAddProdPurchase } from '../../../actions';
import {
    preHarvestPinStatus,
} from '../../../constant/searchParams';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({
        toAddPriceVisible: state.toJS().commodity.toAddPriceVisible,
        getProductById: state.toJS().commodity.getProductById
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
        this.handleOk = this.handleOk.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleMaxChange = this.handleMaxChange.bind(this);
        this.handleMinChange = this.handleMinChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.childCompany = props.datas.branchCompanyId ? {
            branchCompanyId: props.datas.branchCompanyId,
            branchCompanyName: props.datas.branchCompanyName
        } : {};
        this.state = {
            isEditPrice: false,
            currentInside: null,
            insideValue: null
        }
        this.choose = 0;
        this.success = false;
    }

    handleOk() {
        const { datas, handlePostAdd, isEdit } = this.props;
        const { validateFields, setFields } = this.props.form;
        const { isContinuity, results } = this.steppedPrice.getValue();
        const choose = this.choose;
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
            if (err) return null;
            const result = values;
            result.sellSectionPrices = results;
            result.productId = datas.id || datas.productId;
            const { branchCompanyId, branchCompanyName } = this.childCompany;
            if (!isEdit && (!branchCompanyId || !branchCompanyName)) {
                message.error('请选择子公司！');
                return null;
            }
            Object.assign(result, this.childCompany);
            if (isEdit) {
                Object.assign(result, {
                    id: datas.id,
                    productId: datas.productId
                })
            }
            const priceList = [];
            results.forEach((item) => (
                priceList.push(item.price)
            ))
            priceList.forEach((obj) => {
                if (obj === 0 || obj === null) {
                    this.success = true;
                } else {
                    this.success = false;
                }
            })
            if (this.success) {
                message.error('请仔细核对销售价格，确认为当前显示的价格，请点击确认按钮继续操作!', 2, () => { handlePostAdd(result, isEdit, choose) })
            } else {
                handlePostAdd(result, isEdit, choose);
            }
            return null;
        })
    }

    handleCancel() {
        this.props.handleClose();
    }

    handlePriceChange(result) {
        const { setFields, getFieldError } = this.props.form;
        const { isContinuity } = result;
        if (isContinuity && getFieldError('sellSectionPrices')) {
            setFields({
                sellSectionPrices: {
                    errors: null,
                },
            })
        }
    }

    handleChoose = ({ record }) => {
        this.childCompany = {
            branchCompanyId: record.id,
            branchCompanyName: record.name
        };
    }

    handleClear = () => {
        this.childCompany = null;
    }

    handleSelectChange = (item) => {
        this.choose = item === '-1' ? null : item;
    }

    /**
     * 销售内装数
     */
    handleInsideChange = (num) => {
        this.setState({
            currentInside: num
        }, () => {
            this.props.form.setFieldsValue({ minNumber: null })
        })

        this.steppedPrice.reset();
    }

    /**
     * 最小起订数量
     */
    handleMinChange = (num) => {
        this.setState({
            startNumber: num,
            isEditPrice: true
        }, () => {
            this.props.form.setFieldsValue({ minNumber: num });
            this.steppedPrice.reset();
        })
    }

    /**
     * 最大销售数量
     */
    handleInsideChange = (num) => {
        this.setState({
            currentInside: num
        }, () => {
            this.props.form.setFieldsValue({ maxNumber: null })
        })

        // this.steppedPrice.reset();
    }

    handleMaxChange = (num) => {
        // this.setState({
        //     startNumber: num
        // }, () => {
        this.props.form.setFieldsValue({ maxNumber: num });
            // this.steppedPrice.reset();
        // })
    }

    render() {
        const { prefixCls, form, datas, isEdit, getProductById } = this.props;
        const { getFieldDecorator } = form;
        const { currentInside, startNumber } = this.state;
        const newDates = JSON.parse(JSON.stringify(datas));
        const preHarvestPinStatusChange =
            (newDates.preHarvestPinStatus === 1 ? '1' : '0')
        return (
            <Modal
                title={isEdit ? '编辑销售价格' : '新增销售价格'}
                visible
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
                                            initialValue: newDates.salesInsideNumber
                                        })(
                                            <InputNumber
                                                min={0}
                                                onChange={this.handleInsideChange}
                                            />
                                            )}
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span>*起订量：</span>
                                    <span>
                                        {getFieldDecorator('minNumber', {
                                            rules: [
                                                { required: true, message: '请输入最小起订量!' },
                                                {
                                                    validator: (rule, value, callback) => {
                                                        const { getFieldValue } = this.props.form
                                                        if ((value / getFieldValue('salesInsideNumber')) % 1 !== 0) {
                                                            callback('起订量需为内装数整数倍！')
                                                        }

                                                        callback()
                                                    }
                                                }
                                            ],
                                            initialValue: newDates.minNumber
                                        })(
                                            <InputNumber
                                                min={0}
                                                onChange={this.handleMinChange}
                                                step={currentInside || newDates.salesInsideNumber}
                                            />
                                            )}
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span>*最大销售数量：</span>
                                    <span>
                                        {getFieldDecorator('maxNumber', {
                                            initialValue: newDates.maxNumber
                                        })(
                                            <InputNumber
                                                min={0}
                                                onChange={this.handleMaxChange}
                                                step={currentInside || newDates.salesInsideNumber}
                                            />
                                            )}
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span>*承诺发货时间：下单后</span>
                                    <span className={`${prefixCls}-day-input`}>
                                        {getFieldDecorator('deliveryDay', {
                                            rules: [{ required: true, message: '请输入承诺发货时间!' }],
                                            initialValue: newDates.deliveryDay
                                        })(
                                            <InputNumber min={0} />
                                            )}
                                    </span>
                                    天内发货
                                </FormItem>
                                <FormItem>
                                    <span>是否整箱销售:</span>
                                    <span className={`${prefixCls}-day-input`}>
                                        {getProductById.sellFullCase === 1 ? '是' : '否'}
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span>整箱销售单位:</span>
                                    <span className={`${prefixCls}-day-input`}>
                                        {getProductById.fullCaseUnit || '-'}
                                    </span>
                                </FormItem>
                                {/* 采购模式 */}
                                <FormItem className={`${prefixCls}-qy`}>
                                    <span className={`${prefixCls}-select`}> 采购模式 : </span>
                                    {getFieldDecorator('preHarvestPinStatus', {
                                        initialValue: isEdit ? preHarvestPinStatusChange : '0'
                                    })(
                                        <Select
                                            style={{ width: 90 }}
                                            className="sc-form-item-select"
                                            size="default"
                                            onChange={this.handleSelectChange}
                                        >
                                            {
                                                preHarvestPinStatus.data.map((item) =>
                                                    (<Option key={item.key} value={item.key}>
                                                        {item.value}
                                                    </Option>)
                                                )
                                            }
                                        </Select>
                                        )}
                                </FormItem>
                            </div>
                        </div>
                        <div className={`${prefixCls}-item`}>
                            <div className={`${prefixCls}-item-title`}>
                                添加阶梯价格
                                <span className={`${prefixCls}-item-tip`}>
                                    &nbsp;(请按从小到大的顺序，最大值为{MAXGOODS})
                                </span>
                            </div>
                            <div className={`${prefixCls}-item-content`}>
                                <FormItem>
                                    {getFieldDecorator('sellSectionPrices', {
                                    })(
                                        <SteppedPrice
                                            isEdit={this.state.isEditPrice}
                                            ref={node => { this.steppedPrice = node }}
                                            handleChange={this.handlePriceChange}
                                            startNumber={startNumber}
                                            defaultValue={isEdit ? newDates.sellSectionPrices : []}
                                            inputSize="default"
                                            initvalue={getProductById.minUnit}
                                        />
                                        )}
                                </FormItem>
                                <FormItem>
                                    <span>* 建议零售价(元)：</span>
                                    <span>
                                        {getFieldDecorator('suggestPrice', {
                                            rules: [{ required: true, message: '请输入建议零售价!' }],
                                            initialValue: newDates.suggestPrice
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
                                            branchCompanyName: param.value,
                                            productId: newDates.productId || newDates.id
                                        }, 'queryBranchCompanyInfo')}
                                        placeholder="请输入公司名"
                                        onChoosed={this.handleChoose}
                                        disabled={isEdit}
                                        defaultValue={
                                            newDates.branchCompanyId ?
                                            `${newDates.branchCompanyId} - ${newDates.branchCompanyName}` :
                                            undefined}
                                        onClear={this.handleClear}
                                        renderChoosedInputRaw={(data) => (
                                            <div>{data.id} - {data.name}</div>
                                        )}
                                        pageSize={6}
                                        columns={[
                                            {
                                                title: '公司编号',
                                                dataIndex: 'id',
                                                width: 98
                                            }, {
                                                title: '公司名',
                                                dataIndex: 'name',
                                                width: 140
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
    getProductById: PropTypes.objectOf(PropTypes.any),
    handlePostAdd: PropTypes.func,
    pubFetchValueList: PropTypes.func,
    handleClose: PropTypes.func,
    datas: PropTypes.objectOf(PropTypes.any),
    isEdit: PropTypes.bool,
};

SellPriceModal.defaultProps = {
    prefixCls: 'sell-modal',
    handleClose: () => { },
    datas: {},
    isEdit: false
}

export default Form.create()(SellPriceModal);
