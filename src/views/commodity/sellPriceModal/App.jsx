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
    getCostPrice
} from '../../../actions/commodity';
import FreightConditions from './freightConditions';
import OnlyReadSteps from './onlyReadSteps';
import EditSteps from './editSteps';

@connect(
    state => ({
        productId: state.toJS().commodity.getProductById.id,
        costPrice: state.toJS().commodity.costPrice
    }),
    dispatch => bindActionCreators({
        getCostPrice
    }, dispatch)
)

class SellPriceModal extends Component {
    constructor(props) {
        super(props);
        this.handleMaxChange = this.handleMaxChange.bind(this);

        this.state = {
            suggestPrice: null,
            branchCompanyId: null,
            branchCompanyName: null,
            editIsContinue: true,
            cretFreConditObj: {},
            freCondit: {},
            sellSectionPrices: []
        }
        this.isSub = false; // 判断是否为已提交状态(true为已提交)
        this.isDisabled = false;
        this.successPost = true;
        this.messageAlert = true;
        this.newDatas = { ...props.datas.data };
        this.referenceDatas = { ...props.datas.data };
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
        const { datas, isEdit, values = {} } = this.props;
        const { validateFields } = this.props.form;
        const { branchCompanyId, branchCompanyName, cretFreConditObj, freCondit, editIsContinue, sellSectionPrices } = this.state;
        const newDatas = datas.data;
        const createData = {};
        const editData = {};
        Object.assign(createData, {
            branchCompanyId: this.state.branchCompanyId || newDatas.branchCompanyId,
            branchCompanyName: this.state.branchCompanyName || newDatas.branchCompanyName,
            suggestPrice: this.state.suggestPrice || values.suggestPrice,
            productId: values.id,
            sellSectionPrices,
            ...cretFreConditObj,
            ...freCondit
        })
        Object.assign(editData, {
            branchCompanyId: this.state.branchCompanyId || newDatas.branchCompanyId,
            branchCompanyName: this.state.branchCompanyName || newDatas.branchCompanyName,
            suggestPrice: this.state.suggestPrice || values.suggestPrice,
            productId: this.newDatas.productId,
            auditStatus: this.newDatas.auditStatus,
            sellSectionPrices,
            id: this.newDatas.id,
            ...cretFreConditObj,
            ...freCondit
        })
        validateFields((err, values) => {
            if (err) return null;
            const result = values;
            result.productId = datas.id || datas.productId;
            if (!isEdit && (!branchCompanyId || !branchCompanyName)) {
                message.error('请选择子公司！');
                return null;
            }
            if (!isEdit && !cretFreConditObj.minNumber) {
                message.error('请输入最小起订量！');
                return null;
            }
            if (!isEdit && !cretFreConditObj.maxNumber) {
                message.error('请输入最大销售数量！');
                return null;
            }
            if (!editIsContinue) {
                message.error('阶梯价格不连续!');
                return null;
            }
            if (isEdit) {
                Object.assign(result, {
                    id: datas.id,
                    productId: datas.productId
                })
            }
            if (isEdit) {
                this.props.handlePostAdd(editData, isEdit);
            } else {
                this.props.handlePostAdd(createData, isEdit);
            }
            return null;
        })
    }

    handleCancel = () => {
        this.props.handleClose();
    }

    handleCreatPrice = (num) => {
        this.setState({
            suggestPrice: num
        })
    }

    handleCompyChange = (record) => {
        const { productId } = this.props;
        const branchCompanyId = record.id;
        this.setState({
            branchCompanyId,
            branchCompanyName: record.name,
        });
        // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/prodPurchase/queryPurchasePriceForSellPrice
        this.props.getCostPrice({
            productId, branchCompanyId
        });2
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

    handleEditSteps = (num) => {
        this.setState({
            suggestPrice: num
        })
    }

    handleEditPriceChange = (prices, isContinue) => {
        this.setState({
            sellSectionPrices: prices,
            editIsContinue: isContinue
        })
    }

    handleCreatPriceChange = (prices, isContinue) => {
        this.setState({
            sellSectionPrices: prices,
            editIsContinue: isContinue
        })
    }

    handleOnFreConditChange = (data) => {
        this.setState({
            freCondit: data
        })
    }

    handleonCretFreConditChange = (data) => {
        this.setState({
            cretFreConditObj: data
        })
    }

    render() {
        const { prefixCls, isEdit, values, costPrice } = this.props;
        const isAfter = this.isAfter === true;
        const isReadOnly = true;
        const { freCondit, cretFreConditObj } = this.state;
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
                                <div>
                                    <FreightConditions
                                        isEdit={isEdit}
                                        isAfter={isAfter}
                                        isSub={this.newDatas.auditStatus === 1}
                                        newDatas={this.newDatas}
                                        onFreConditChange={this.handleOnFreConditChange}
                                    />
                                    <EditSteps
                                        newDatas={this.newDatas}
                                        isEdit={isEdit}
                                        isSub={this.newDatas.auditStatus === 1}
                                        startNumber={freCondit.minNumber || this.newDatas.minNumber}
                                        onEditChange={this.handleEditSteps}
                                        onEditPriceChange={this.handleEditPriceChange}
                                    />
                                </div>
                            </div>
                            <div className={`${prefixCls}-body-wrap sell-modal-body-width`}>
                                <FreightConditions
                                    isEdit={isEdit}
                                    isAfter={!isAfter}
                                    isSub={this.newDatas.auditStatus === 1}
                                    newDatas={this.newDatas}
                                />
                                <OnlyReadSteps
                                    newDatas={this.referenceDatas}
                                    isReadOnly={isReadOnly}
                                    startNumber={freCondit.minNumber || this.newDatas.minNumber}
                                />
                            </div >
                            <Row className="edit-state-list">
                                <Col>
                                    <span>提交人：</span>
                                    <span>{this.newDatas.firstCreated === 1 ?
                                        this.newDatas.createUserName :
                                        this.newDatas.modifyUserName || '-'}</span>
                                </Col>
                                <Col>
                                    <span>审核人：</span>
                                    <span>{this.newDatas.auditUserName || '-'}</span>
                                </Col>
                                <Col>
                                    <span>审核状态：</span>
                                    <span>
                                        <i className={`new-price-state-${this.newDatas.auditStatus}`} />
                                        {this.catchAuditstate() || '-'}
                                    </span>
                                </Col>
                            </Row>
                        </div > :
                        <div>
                            <div className={`${prefixCls}-body-wrap sell-modal-body-width`}>
                                <div>
                                    <FreightConditions
                                        isEdit={isEdit}
                                        values={values}
                                        newDatas={this.newDatas}
                                        onDataChange={this.handleonCretFreConditChange}
                                    />
                                    <EditSteps
                                        newDatas={this.newDatas}
                                        isEdit={isEdit}
                                        startNumber={cretFreConditObj.minNumber || values.minNumber}
                                        onCreateChange={this.handleCreatPrice}
                                        onCreateComChange={this.handleCompyChange}
                                        onCreatPriceChange={this.handleCreatPriceChange}
                                        values={values}
                                    />
                                </div>
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
