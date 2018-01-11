import React, { Component } from 'react';
import immutable from 'immutable';
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
    preHarvestPinStatusOption,
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

        this.state = {
            isEditPrice: false,
            currentInside: null,
            confirmVisible: false,
            salesInsideNumber: null
        }
        this.choose = 0;
        this.minNumber = null;
        this.maxNumber = null;
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
            deliveryDay,
            preHarvestPinStatus
        } = this.props.form.getFieldsValue();
        return Util.removeInvalid({
            salesInsideNumber: this.salesInsideNumber || salesInsideNumber,
            minNumber: this.minNumber || minNumber,
            maxNumber: this.maxNumber || maxNumber,
            deliveryDay,
            preHarvestPinStatus: this.choose || preHarvestPinStatus
        });
    }

    handlePropsValues = () => {
        const { isEdit } = this.props;
        const service = isEdit ? this.props.onFreConditChange : this.props.onReactChange;
        service(this.getFormData());
    }

    handleSelectChange = (item) => {
        this.choose = item === '-1' ? null : item;
        this.handlePropsValues();
    }

    handleDelayChange = () => {
        this.handlePropsValues()
    }

    /**
     * 销售内装数
     */
    handleInsideChange = (num) => {
        this.salesInsideNumber = num;
        this.setState({
            currentInside: num,
        }, () => {
            this.props.form.setFieldsValue({ minNumber: null });
        })
        this.minNumber = null;
        this.handlePropsValues();
    }

    /**
     * 最小起订数量
     */
    handleMinChange = (num) => {
        this.minNumber = num;
        this.setState({
            startNumber: num,
            isEditPrice: true,
        });
        this.handlePropsValues();
    }

    /**
     * 最大销售数量
     */
    handleMaxChange = (num) => {
        this.maxNumber = num;
        this.handlePropsValues();
    }

    handleConfirm = () => {
        this.setState({
            confirmVisible: true
        })
    }

    render() {
        const {
            prefixCls, form, getProductById, newDatas = {},
            isAfter, isEdit, values = {}, isSub
        } = this.props;
        const { getFieldDecorator } = form;
        const { currentInside } = this.state;
        const data = newDatas;
        const { sellPricesInReview = {} } = data;
        const preHarvestPinStatusChange = data.sellPricesInReview ? String(data.sellPricesInReview.preHarvestPinStatus) : '0';
        return (
            <div className={`${prefixCls}-body-wrap`}>
                {
                    ((isEdit && isAfter) || !isEdit) &&
                    <Form
                        layout="inline"
                        onSubmit={this.handleSubmit}
                    >
                        <div className={`${prefixCls}-item`}>
                            <div className={`${prefixCls}-item-title`}>货运条件</div>
                            <div className={`${prefixCls}-item-content`}>
                                <FormItem label="销售内装数">
                                    {getFieldDecorator('salesInsideNumber', {
                                        rules: [{ required: true, message: '请输入销售内装数' }],
                                        initialValue: isEdit ? sellPricesInReview.salesInsideNumber : values.salesInsideNumber
                                    })(<InputNumber
                                        min={0}
                                        className={
                                            sellPricesInReview.salesInsideNumber
                                                !== newDatas.salesInsideNumber
                                                ? 'sell-modal-border' : null
                                        }
                                        disabled={isSub}
                                        onChange={this.handleInsideChange}
                                    />)}
                                </FormItem>
                                <FormItem label="起订量">
                                    {getFieldDecorator('minNumber', {
                                        rules: [
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
                                        initialValue: isEdit ? sellPricesInReview.minNumber : values.minNumber
                                    })(<InputNumber
                                        min={0}
                                        disabled={isSub}
                                        className={sellPricesInReview.minNumber
                                            !== newDatas.minNumber
                                            ? 'sell-modal-border' : null}
                                        onChange={this.handleMinChange}
                                        step={currentInside || sellPricesInReview.salesInsideNumber}
                                    />)}
                                </FormItem>
                                <FormItem label="最大销售数量">
                                    {getFieldDecorator('maxNumber', {
                                        initialValue: isEdit ? sellPricesInReview.maxNumber : values.maxNumber
                                    })(
                                        <InputNumber
                                            min={0}
                                            className={sellPricesInReview.maxNumber
                                                !== newDatas.maxNumber
                                                ? 'sell-modal-border' : null}
                                            disabled={isSub}
                                            onChange={this.handleMaxChange}
                                            step={currentInside || data.salesInsideNumber}
                                        />
                                        )}
                                </FormItem>
                                <FormItem label="承诺发货时间：下单后">
                                    {getFieldDecorator('deliveryDay', {
                                        rules: [{ required: true, message: '请输入承诺发货时间!' }],
                                        initialValue: isEdit ? sellPricesInReview.deliveryDay : values.deliveryDay
                                    })(<InputNumber
                                        min={0}
                                        className={sellPricesInReview.deliveryDay
                                            !== newDatas.deliveryDay
                                            ? 'sell-modal-border' : null}
                                        disabled={isSub}
                                        onChange={this.handleDelayChange}
                                    />)}
                                    天内发货
                                    </FormItem>
                                <FormItem label="是否整箱销售">
                                    {getProductById.sellFullCase === 1 ? '是' : '否'}
                                </FormItem>
                                <FormItem label="整箱销售单位">
                                    {getProductById.fullCaseUnit || '-'}
                                </FormItem>
                                <FormItem lable="采购模式">
                                    {getFieldDecorator('preHarvestPinStatus', {
                                        initialValue: preHarvestPinStatusChange
                                    })(<Select
                                        style={{ width: '140px' }}
                                        className="sc-form-item-select"
                                        size="default"
                                        disabled={isSub}
                                        className={sellPricesInReview.preHarvestPinStatus
                                            !== newDatas.preHarvestPinStatus
                                            ? 'sell-modal-border' : null}
                                        onChange={this.handleSelectChange}
                                    >
                                        {
                                            preHarvestPinStatusOption.data.map((item) =>
                                                (<Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Option>)
                                            )
                                        }
                                    </Select>)}
                                </FormItem>
                            </div>
                        </div>
                    </Form>
                }
                {
                    (isEdit && !isAfter && newDatas) &&
                    <Form layout="inline">
                        <div className={`${prefixCls}-item last-freightConditions`}>
                            <div className={`${prefixCls}-item-title`}>货运条件</div>
                            <div className={`${prefixCls}-item-content`}>
                                <FormItem label="销售内装数">
                                    {newDatas.salesInsideNumber}
                                </FormItem>
                                <FormItem label="起订量">
                                    {newDatas.minNumber}
                                </FormItem>
                                <FormItem label="最大销售数量">
                                    {newDatas.maxNumber}
                                </FormItem>
                                <FormItem label="承诺发货时间：下单后">
                                    {newDatas.deliveryDay}
                                    天内发货
                                </FormItem>
                                <FormItem label="是否整箱销售">
                                    {getProductById.sellFullCase === 1 ? '是' : '否'}
                                </FormItem>
                                <FormItem label="整箱销售单位">
                                    {getProductById.fullCaseUnit || '-'}
                                </FormItem>
                                <FormItem label="采购模式">
                                    {data.preHarvestPinStatus === 1 ? '先采后销' : '先销后采'}
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
    isAfter: PropTypes.bool,
    isEdit: PropTypes.bool,
    form: PropTypes.objectOf(PropTypes.any),
    values: PropTypes.objectOf(PropTypes.any),
    getProductById: PropTypes.objectOf(PropTypes.any),
    newDatas: PropTypes.objectOf(PropTypes.any),
    datas: PropTypes.objectOf(PropTypes.any),
    onReactChange: PropTypes.func,
    onFreConditChange: PropTypes.func
}

FreightConditions.defaultProps = {
    prefixCls: 'sell-modal',
    handleClose: () => { },
    datas: {},
    isEdit: false
}

export default Form.create()(FreightConditions);
