import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, InputNumber, message, Select, Button, Input, Row, Col } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    pubFetchValueList
} from '../../../actions/pub';
import { productAddPriceVisible, toAddSellPrice } from '../../../actions/producthome';
import { fetchAddProdPurchase } from '../../../actions';
import {
} from '../../../constant/searchParams';
import {
    getSellPriceInfoByIdAction
} from '../../../actions/commodity';
import FreightConditions from './freightConditions';
import OnlyReadModal from './onlyReadModal';
import EditModal from './editModal';

@connect(
    state => ({
        toAddPriceVisible: state.toJS().commodity.toAddPriceVisible,
        getProductById: state.toJS().commodity.getProductById
    }),
    dispatch => bindActionCreators({
        productAddPriceVisible,
        fetchAddProdPurchase,
        pubFetchValueList,
        getSellPriceInfoByIdAction,
        toAddSellPrice
    }, dispatch)
)
class SellPriceModal extends Component {
    constructor(props) {
        super(props);
        this.handleMaxChange = this.handleMaxChange.bind(this);
        this.handleMinChange = this.handleMinChange.bind(this);
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

    handleOk = () => {
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
            this.props.toAddSellPrice(this.getFormData()).then((res) => {
                if (res.code === 200) {
                    this.props.onCancel();
                }
            })
            return null;
        })
    }

    handleCancel = () => {
        this.props.handleClose();
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

    handleChange = (data) => {
        this.setState({
            branchCompanyId: data
        })
    }

    handleMaxChange = (num) => {
        this.props.form.setFieldsValue({ maxNumber: num });
    }

    catchAuditstate = () => {
        const { datas } = this.props;
        const newDatas = JSON.parse(JSON.stringify(datas.data));
        switch (newDatas.auditStatus) {
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
        const { prefixCls, form, datas, isEdit, values } = this.props;
        const newDatas = datas.data;
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
                        <span className="changeBefore">修改前:</span>
                        <span className="changeAfter">修改后:</span>
                    </div>
                }
                {
                    isEdit ?
                        <div>
                            <div className={`${prefixCls}-body-wrap sell-modal-body-width`}>
                                <Form layout="inline" onSubmit={this.handleSubmit}>
                                    <FreightConditions
                                        isEdit={isEdit}
                                        isAfter={isAfter}
                                        isSub={newDatas.auditStatus === 1}
                                        newDatas={newDatas}
                                    />
                                    <EditModal
                                        newDatas={newDatas}
                                        startNumber={this.state.startNumber}
                                    />
                                </Form>
                            </div>
                            <div className={`${prefixCls}-body-wrap sell-modal-body-width`}>
                                <FreightConditions
                                    isEdit={isEdit}
                                    isAfter={!isAfter}
                                    isSub={newDatas.auditStatus === 1}
                                    newDatas={newDatas}
                                />
                                <OnlyReadModal
                                    newDatas={newDatas}
                                    startNumber={this.state.startNumber}
                                />
                            </div >
                            <Row className="edit-state-list">
                                <Col>
                                    <span>提交人：</span>
                                    <span>{newDatas.firstCreated === 1 ?
                                        newDatas.createUserName :
                                        newDatas.modifyUserName || '-'}</span>
                                </Col>
                                <Col>
                                    <span>审核人：</span>
                                    <span>{newDatas.auditUserName || '-'}</span>
                                </Col>
                                <Col>
                                    <span>售价状态：</span>
                                    <span>
                                        <i className={`new-price-state-${newDatas.auditStatus}`} />
                                        {this.catchAuditstate() || '-'}
                                    </span>
                                </Col>
                            </Row>
                        </div > :
                        <div>
                            <div className={`${prefixCls}-body-wrap sell-modal-body-width`}>
                                <Form layout="inline" onSubmit={this.handleSubmit}>
                                    <FreightConditions
                                        isEdit={isEdit}
                                        values={values}
                                        newDatas={newDatas}
                                        isAfter={isAfter}
                                    />
                                    <EditModal
                                        startNumber={this.state.startNumber}
                                        onchange={this.handleChange}
                                        values={values}
                                    />
                                </Form>
                            </div>
                        </div>
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
    datas: PropTypes.objectOf(PropTypes.any)
};

SellPriceModal.defaultProps = {
    prefixCls: 'sell-modal',
    handleClose: () => { },
    datas: {},
    isEdit: false
}

export default Form.create()(SellPriceModal);
