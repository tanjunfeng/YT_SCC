import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, message, Select } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    pubFetchValueList
} from '../../../actions/pub';
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
        pubFetchValueList,
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

    handleOk() {
        const { datas, handlePostAdd, isEdit } = this.props;
        const { validateFields, setFields } = this.props.form;
        const choose = this.choose;
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
            this.props.onCancel();
            return null;
        })
    }

    handleCancel() {
        this.props.onCancel();
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
        const { results } = this.steppedPrice.getValue();
        this.setState({
            startNumber: num,
            isEditPrice: true,
            price: results[0].price
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

    handleConfirm = () => {
        this.setState({
            confirmVisible: true
        })
    }

    render() {
        const { prefixCls, form, getProductById, newDates, isAfter, isEdit } = this.props;
        const { getFieldDecorator } = form;
        const { currentInside } = this.state;
        const data = newDates;
        const datas = JSON.parse(JSON.stringify(data));
        const preHarvestPinStatusChange =
            (datas.preHarvestPinStatus === 1 ? '1' : '0');
        return (
            <div className={`${prefixCls}-body-wrap`}>
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    {
                        isEdit && !isAfter ?
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
                                                initialValue: datas.minNumber
                                            })(
                                                <InputNumber
                                                    min={0}
                                                    onChange={this.handleMinChange}
                                                    step={currentInside || datas.salesInsideNumber}
                                                />
                                                )}
                                        </span>
                                    </FormItem>
                                    <FormItem>
                                        <span>*最大销售数量：</span>
                                        <span>
                                            {getFieldDecorator('maxNumber', {
                                                initialValue: datas.maxNumber
                                            })(
                                                <InputNumber
                                                    min={0}
                                                    onChange={this.handleMaxChange}
                                                    step={currentInside || datas.salesInsideNumber}
                                                />
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
                            : <div className={`${prefixCls}-item`} style={{ minHeight: '211px' }}>
                                <div className={`${prefixCls}-item-title`}>货运条件</div>
                                <div className={`${prefixCls}-item-content`}>
                                    <FormItem>
                                        <span>*销售内装数：</span>
                                        <span className={
                                            datas.sellPricesInReview.salesInsideNumber !== datas.salesInsideNumber ?
                                                'sell-modal-border' : null}
                                        >{datas.sellPricesInReview.salesInsideNumber}</span>
                                    </FormItem>
                                    <FormItem>
                                        <span>*起订量：</span>
                                        <span className={
                                            datas.sellPricesInReview.minNumber !== datas.minNumber ?
                                                'sell-modal-border' : null}
                                        >{datas.sellPricesInReview.minNumber}</span>
                                    </FormItem>
                                    <FormItem>
                                        <span>*最大销售数量：</span>
                                        <span className={
                                            datas.sellPricesInReview.maxNumber !== datas.maxNumber ?
                                                'sell-modal-border' : null}
                                        >{datas.sellPricesInReview.maxNumber}</span>
                                    </FormItem>
                                    <FormItem>
                                        <span>*承诺发货时间：下单后</span>
                                        <span className={
                                            datas.sellPricesInReview.deliveryDay !== datas.deliveryDay ?
                                                'sell-modal-border' : null}
                                        >{datas.sellPricesInReview.deliveryDay}</span>
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
                    }
                </Form>
            </div>
        )
    }
}

FreightConditions.propTypes = {
    prefixCls: PropTypes.string,
    form: PropTypes.objectOf(PropTypes.any),
    getProductById: PropTypes.objectOf(PropTypes.any),
    handlePostAdd: PropTypes.func,
    datas: PropTypes.objectOf(PropTypes.any),
    isEdit: PropTypes.bool,
};

FreightConditions.defaultProps = {
    prefixCls: 'sell-modal',
    handleClose: () => { },
    datas: {},
    isEdit: false
}

export default Form.create()(FreightConditions);
