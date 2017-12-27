import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, InputNumber, message, Select, Button, Input, Row, Col } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    pubFetchValueList
} from '../../../actions/pub';
import { MAXGOODS } from '../../../constant'
import { productAddPriceVisible } from '../../../actions/producthome';
import { fetchAddProdPurchase } from '../../../actions';
import {
} from '../../../constant/searchParams';
import {
    getSellPriceInfoByIdAction
} from '../../../actions/commodity';
import FreightConditions from './freightConditions';
import EditableTable from './editableTable';

const FormItem = Form.Item;

@connect(
    state => ({
        toAddPriceVisible: state.toJS().commodity.toAddPriceVisible,
        getProductById: state.toJS().commodity.getProductById
    }),
    dispatch => bindActionCreators({
        productAddPriceVisible,
        fetchAddProdPurchase,
        pubFetchValueList,
        getSellPriceInfoByIdAction
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
            insideValue: null,
            confirmVisible: false,
        }
        this.isSub = false; // 判断是否为已提交状态(true为已提交)
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
            const priceList = [];
            priceList.forEach((obj) => {
                if (obj === null || obj === undefined) {
                    this.successPost = true;
                    setFields({
                        sellSectionPrices: {
                            errors: [new Error('价格不能为空，无法提交')],
                        },
                    })
                    return;
                }

                if (obj === 0) {
                    this.messageAlert = true;
                } else {
                    this.messageAlert = false;
                }
                if (obj >= 0) {
                    this.successPost = false;
                }
            })
            return null;
        })
    }

    getEditableTableValues = (list) => {
        const { isEdit, datas } = this.props;
        const { startNumber } = this.state;
        const newDates = JSON.parse(JSON.stringify(datas.data));
        const { auditStatus } = newDates;
        return {
            isEdit,
            list,
            startNumber,
            data: datas.sellSectionPrices,
            readOnly: false,
            isSub: auditStatus === 1
        };
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
            if (priceList.length === 0) {
                setFields({
                    sellSectionPrices: {
                        errors: [new Error('价格不能为空，无法提交')],
                    },
                })
                return false;
            }
            priceList.forEach((obj) => {
                if (obj === null || obj === undefined) {
                    this.successPost = true;
                    setFields({
                        sellSectionPrices: {
                            errors: [new Error('价格不能为空，无法提交')],
                        },
                    })
                    return;
                }
                if (obj === 0) {
                    this.messageAlert = true;
                } else {
                    this.messageAlert = false;
                }
                if (obj >= 0) {
                    this.successPost = false;
                }
            })
            if (this.successPost) {
                this.isDisabled = true;
                if (this.messageAlert) {
                    message.error('请仔细核对销售价格，确认为当前显示的价格!')
                }
                if (!this.isDisabled) {
                    handlePostAdd(result, isEdit, choose).then((res) => {
                        if (res.code === 200) {
                            this.isDisabled = false;
                        }
                    }).catch(() => {
                        this.isDisabled = false;
                    })
                }
            }
            if (this.successPost === false) {
                if (this.messageAlert) {
                    message.error('请仔细核对销售价格，确认为当前显示的价格!', 2, () => {
                        handlePostAdd(result, isEdit, choose);
                    })
                } else {
                    handlePostAdd(result, isEdit, choose);
                }
            }
            return null;
        })
    }

    handleCancel() {
        this.props.handleClose();
    }

    handlePriceChange(result) {
        const { setFields, getFieldError } = this.props.form;
        const { isContinuity, results } = result;

        if (isContinuity && getFieldError('sellSectionPrices')) {
            setFields({
                sellSectionPrices: {
                    errors: null,
                },
            })
        }
        this.isDisabled = false;
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
        });
    }

    handleMaxChange = (num) => {
        this.props.form.setFieldsValue({ maxNumber: num });
    }

    handleConfirm = () => {
        this.setState({
            confirmVisible: true
        })
    }

    catchAuditstate = () => {
        const { datas } = this.props;
        const newDates = JSON.parse(JSON.stringify(datas.data));
        switch (newDates.auditStatus) {
            case 1:
                return '已提交';
            case 2:
                return '已审核';
            case 3:
                return '已拒绝';
            default:
                return null;
        }
    }

    render() {
        const { prefixCls, form, datas, isEdit } = this.props;
        const { getFieldDecorator } = form;
        const newDates = JSON.parse(JSON.stringify(datas.data));
        const { sellSectionPrices } = newDates;
        const isAfter = this.isAfter === true;
        return (
            <Modal
                title={isEdit ? '编辑销售价格' : '新增销售价格'}
                visible
                className={isEdit ? prefixCls : 'createCls'}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                maskClosable={false}
                confirmLoading={this.isDisabled}
            >
                {
                    isEdit &&
                    <div>
                        <div>
                            <span className="changeBefore">修改前:</span>
                            <span className="changeAfter">修改后:</span>
                        </div>
                        <div className={`${prefixCls}-body-wrap sell-modal-body-width`}>
                            <Form layout="inline" onSubmit={this.handleSubmit}>
                                <FreightConditions isEdit={isEdit} isAfter={isAfter} isSub={newDates.auditStatus === 1} newDates={newDates} />
                                <div className={`${prefixCls}-item item-max-height`}>
                                    <div className={`${prefixCls}-item-title`}>
                                        添加阶梯价格
                                            <span className={`${prefixCls}-item-tip`}>
                                            &nbsp;(请按从小到大的顺序，最大值为{MAXGOODS})
                                            </span>
                                    </div>
                                    <div className={`${prefixCls}-item-content`}>
                                        <FormItem>
                                            {getFieldDecorator('sellSectionPrices', {
                                                initialValue: this.getEditableTableValues(sellSectionPrices)
                                            })(<EditableTable />)}
                                        </FormItem>
                                    </div>
                                    <Row>
                                        <Col>
                                            <FormItem label="*建议零售价(元)：">
                                                <span>{newDates.suggestPrice}</span>
                                            </FormItem>
                                            <FormItem label="商品采购价格：">
                                                <span><i className={`new-price-state-${newDates.state}`} />{newDates.state || '-'}</span>
                                            </FormItem>
                                            <FormItem label="子公司:" className="edit-input">
                                                <span>{newDates.branchCompanyId} - {newDates.branchCompanyName}</span>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </div>
                            </Form>
                        </div>
                        <div className={`${prefixCls}-body-wrap sell-modal-body-width`}>
                            <FreightConditions isEdit={isEdit} isAfter={!isAfter} isSub={newDates.auditStatus === 1} newDates={newDates} />
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
                                            initialValue: this.getEditableTableValues(sellSectionPrices)
                                        })(
                                            <EditableTable />)}
                                    </FormItem>
                                </div>
                                <div>
                                    <span>*建议零售价(元):</span>
                                    <span className={
                                        newDates.sellPricesInReview.suggestPrice !== newDates.suggestPrice ?
                                            'sell-modal-border' : null}
                                    >{newDates.sellPricesInReview.suggestPrice}</span>
                                    <span>商品采购价格：</span>
                                    <span className={
                                        newDates.sellPricesInReview.purchasePrice !== newDates.purchasePrice ?
                                            'sell-modal-border' : null}
                                    >{newDates.sellPricesInReview.state || '-'}</span>
                                    <span className="edit-input">商品采购价格：</span>
                                    <span className={
                                        newDates.sellPricesInReview.branchCompanyId !== newDates.branchCompanyId ?
                                            'sell-modal-border' : null}
                                    >{newDates.sellPricesInReview.branchCompanyId} - {newDates.sellPricesInReview.branchCompanyName}</span>
                                </div>
                            </div>
                        </div>
                        <Row className="edit-state-list">
                            <Col>
                                <span>提交人：</span>
                                <span>{newDates.submit || '-'}</span>
                            </Col>
                            <Col>
                                <span>审核人：</span>
                                <span>{newDates.examine || '-'}</span>
                            </Col>
                            <Col>
                                <span>售价状态：</span>
                                <span><i className={`new-price-state-${newDates.auditStatus}`} />{this.catchAuditstate() || '-'}</span>
                            </Col>
                        </Row>
                    </div >
                }
            </Modal>
        );
    }
}

SellPriceModal.propTypes = {
    prefixCls: PropTypes.string,
    form: PropTypes.objectOf(PropTypes.any),
    handlePostAdd: PropTypes.func,
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
