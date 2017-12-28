import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, message, Select } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    pubFetchValueList
} from '../../../actions/pub';
import Util from '../../../util/util';
import { productAddPriceVisible, toAddSellPrice } from '../../../actions/producthome';
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
        pubFetchValueList,
        toAddSellPrice
    }, dispatch)
)
class FreightConditions extends Component {
    constructor(props) {
        super(props);
        this.childCompany = props.datas.branchCompanyId ? {
            branchCompanyId: props.datas.branchCompanyId,
            branchCompanyName: props.datas.branchCompanyName
        } : {};

        this.state = {
            isEditPrice: false,
            currentInside: null,
            insideValue: null,
            confirmVisible: false,
        }
        this.choose = 0;
        this.isDisabled = false;
        this.successPost = true;
        this.messageAlert = true;
    }

    componentDidMount() {
        const { datas } = this.props;
        const { validateFields, setFields } = this.props.form;
        validateFields((err, values) => {
            if (err) return null;
            const result = values;
            result.productId = datas.id || datas.productId;
        })
    }

    /**
     * 获取表单数据
     */
    getFormData = () => {
        const {
            salesInsideNumber,
            minNumber,
            maxNumber,
            deliveryDay
        } = this.props.form.getFieldsValue();
        return Util.removeInvalid({
            salesInsideNumber,
            minNumber,
            maxNumber,
            deliveryDay,
            preHarvestPinStatus: this.choose
        });
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
            isEditPrice: true,
        }, () => {
            this.props.form.setFieldsValue({ minNumber: num });
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
    }

    handleMaxChange = (num) => {
        this.props.form.setFieldsValue({ maxNumber: num });
    }

    handleConfirm = () => {
        this.setState({
            confirmVisible: true
        })
    }

    render() {
        const { prefixCls, form, getProductById, newDatas = {}, isAfter, isEdit, values = {} } = this.props;
        const { getFieldDecorator } = form;
        const { currentInside } = this.state;
        const data = newDatas;
        const preHarvestPinStatusChange =
            (data.preHarvestPinStatus === 1 ? '1' : '0');
        return (
            <div className={`${prefixCls}-body-wrap`}>
                {
                    ((isEdit && !isAfter) || !isEdit) &&
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <div className={`${prefixCls}-item`}>
                            <div className={`${prefixCls}-item-title`}>货运条件</div>
                            <div className={`${prefixCls}-item-content`}>
                                <FormItem>
                                    <span>*销售内装数：</span>
                                    <span>
                                        {getFieldDecorator('salesInsideNumber', {
                                            rules: [{ required: true, message: '请输入销售内装数' }],
                                            initialValue: isEdit ? data.salesInsideNumber : values.salesInsideNumber
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
                                            initialValue: data.minNumber
                                        })(
                                            <InputNumber
                                                min={0}
                                                onChange={this.handleMinChange}
                                                step={currentInside || data.salesInsideNumber}
                                            />
                                            )}
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span>*最大销售数量：</span>
                                    <span>
                                        {getFieldDecorator('maxNumber', {
                                            initialValue: data.maxNumber
                                        })(
                                            <InputNumber
                                                min={0}
                                                onChange={this.handleMaxChange}
                                                step={currentInside || data.salesInsideNumber}
                                            />
                                            )}
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span>*承诺发货时间：下单后</span>
                                    <span className={`${prefixCls}-day-input`}>
                                        {getFieldDecorator('deliveryDay', {
                                            rules: [{ required: true, message: '请输入承诺发货时间!' }],
                                            initialValue: isEdit ? data.deliveryDay : values.deliveryDay
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
                                        {isEdit ? data.fullCaseUnit : values.fullCaseUnit || '-'}
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
                    </Form>
                }
                {
                    (isEdit && isAfter) &&
                    <Form layout="inline">
                        <div className={`${prefixCls}-item last-freightConditions`}>
                            <div className={`${prefixCls}-item-title`}>货运条件</div>
                            <div className={`${prefixCls}-item-content`}>
                                <FormItem>
                                    <span>*销售内装数：</span>
                                    <span className={
                                        newDatas.sellPricesInReview.salesInsideNumber !== newDatas.salesInsideNumber ?
                                            'sell-modal-border' : null}
                                    >{newDatas.sellPricesInReview.salesInsideNumber}</span>
                                </FormItem>
                                <FormItem>
                                    <span>*起订量：</span>
                                    <span className={
                                        newDatas.sellPricesInReview.minNumber !== newDatas.minNumber ?
                                            'sell-modal-border' : null}
                                    >{newDatas.sellPricesInReview.minNumber}</span>
                                </FormItem>
                                <FormItem>
                                    <span>*最大销售数量：</span>
                                    <span className={
                                        newDatas.sellPricesInReview.maxNumber !== newDatas.maxNumber ?
                                            'sell-modal-border' : null}
                                    >{newDatas.sellPricesInReview.maxNumber}</span>
                                </FormItem>
                                <FormItem>
                                    <span>*承诺发货时间：下单后</span>
                                    <span className={
                                        newDatas.sellPricesInReview.deliveryDay !== newDatas.deliveryDay ?
                                            'sell-modal-border' : null}
                                    >{newDatas.sellPricesInReview.deliveryDay}</span>
                                    天内发货
                                    </FormItem>
                                <FormItem>
                                    <span>是否整箱销售:</span>
                                    <span>{getProductById.sellFullCase === 1 ? '是' : '否'}</span>
                                </FormItem>
                                <FormItem>
                                    <span>整箱销售单位:</span>
                                    <span>{getProductById.fullCaseUnit || '-'}</span>
                                </FormItem>
                                {/* 采购模式 */}
                                <FormItem className={`${prefixCls}-qy`}>
                                    <span className={`${prefixCls}-select`}> 采购模式 : </span>
                                    <span>{preHarvestPinStatusChange === '0' ? '先销后采' : '先采后销'}</span>
                                </FormItem>
                            </div>
                        </div>
                    </Form>
                }
            </div >
        )
    }
}

FreightConditions.propTypes = {
    prefixCls: PropTypes.string,
    form: PropTypes.objectOf(PropTypes.any),
    getProductById: PropTypes.objectOf(PropTypes.any),
    handlePostAdd: PropTypes.func,
    datas: PropTypes.objectOf(PropTypes.any),
};

FreightConditions.defaultProps = {
    prefixCls: 'sell-modal',
    handleClose: () => { },
    datas: {},
    isEdit: false
}

export default Form.create()(FreightConditions);
