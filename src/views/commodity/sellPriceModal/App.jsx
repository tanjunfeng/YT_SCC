import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, message, Row, Col } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import {
} from '../../../constant/searchParams';
import {
    getCostPrice, clearCostPrice
} from '../../../actions/commodity';
import FreightConditions from './freightConditions';
import OnlyReadSteps from './onlyReadSteps';
import EditSteps from './editSteps';
import Utils from '../../../util/util';

@connect(
    state => ({
        productId: state.toJS().commodity.getProductById.id,
        costPrice: state.toJS().commodity.costPrice
    }),
    dispatch => bindActionCreators({
        getCostPrice, clearCostPrice
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
            editIsContinue: false,
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
            priceList.forEach(obj => {
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

    /**
     * 模态框点击确定按钮时，进行逐行校验，（必输项及是否合规项）
     */
    handleOk = () => {
        const { datas, isEdit, values = {} } = this.props;
        const { validateFields } = this.props.form;
        const {
            branchCompanyId, branchCompanyName, cretFreConditObj,
            freCondit, editIsContinue, sellSectionPrices
        } = this.state;
        const newDatas = datas.data;
        const createData = {};
        const editData = {};
        const noChangePrices = [];
        Object.assign(createData, {
            branchCompanyId: this.state.branchCompanyId || values.branchCompanyId,
            branchCompanyName: this.state.branchCompanyName || values.branchCompanyName,
            suggestPrice: this.state.suggestPrice || values.suggestPrice,
            productId: values.id,
            sellSectionPrices: sellSectionPrices || values.sellSectionPrices,
            ...cretFreConditObj,
            ...freCondit
        })
        if (isEdit) {
            const { deliveryDay, minNumber, salesInsideNumber, suggestPrice } = newDatas;
            this.newDatas.sellPricesInReview.sellSectionPrices.forEach(item => (
                noChangePrices.push({
                    endNumber: item.endNumber,
                    price: item.price,
                    startNumber: item.startNumber,
                    percentage: item.percentage
                })
            ))
            Object.assign(editData, {
                branchCompanyId: this.state.branchCompanyId || newDatas.branchCompanyId,
                branchCompanyName: this.state.branchCompanyName || newDatas.branchCompanyName,
                suggestPrice: this.state.suggestPrice || suggestPrice,
                productId: this.newDatas.productId,
                auditStatus: this.newDatas.auditStatus,
                sellSectionPrices: sellSectionPrices.length === 0 ? noChangePrices : sellSectionPrices,
                deliveryDay,
                minNumber,
                salesInsideNumber,
                id: this.newDatas.id,
                ...cretFreConditObj,
                ...freCondit
            })
        }
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
            if (!editIsContinue) {
                message.error('阶梯价格不连续或越界!');
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
            if (this.newDatas.auditStatus === 1) {
                return null;
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
        if (branchCompanyId !== '') {
            // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/prodPurchase/queryPurchasePriceForSellPrice
            this.props.getCostPrice({
                productId, branchCompanyId
            });
        } else {
            this.props.clearCostPrice();
        }
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

    /**
     * 建议零售价回传值
     * @param {*} num number
     */
    handleEditSteps = (num) => {
        this.setState({
            suggestPrice: num
        })
    }

    /**
     * 编辑阶梯价格回传值
     * @param {*} prices list
     * @param {*} isContinue bool
     */
    handleEditPriceChange = (prices, isContinue) => {
        const newArr = [];
        const priceArrMore = [];
        if (prices.length === 1) {
            prices.forEach(item => (
                newArr.push({
                    endNumber: item.endNumber,
                    price: item.price,
                    startNumber: item.startNumber,
                    percentage: item.percentage
                })
            ))
            this.setState({
                sellSectionPrices: newArr,
                editIsContinue: isContinue
            })
        }
        if (prices.length > 1) {
            prices.forEach(item => {
                priceArrMore.push({
                    endNumber: item.endNumber,
                    price: item.price,
                    startNumber: item.startNumber,
                    percentage: item.percentage
                })
            })
            this.setState({
                sellSectionPrices: priceArrMore,
                editIsContinue: isContinue
            })
        }
    }

    /**
     * 新建阶梯价格回传值
     * @param {*} prices list
     * @param {*} isContinue bool
     */
    handleCreatPriceChange = (prices, isContinue) => {
        const newArr = [];
        const priceArrMore = [];
        if (prices.length === 1) {
            prices.forEach(item => (
                newArr.push({
                    endNumber: item.endNumber,
                    price: item.price,
                    startNumber: item.startNumber
                })
            ))
            this.setState({
                sellSectionPrices: newArr,
                editIsContinue: isContinue
            })
        } else if (prices.length > 1) {
            prices.forEach(item => {
                priceArrMore.push({
                    endNumber: item.endNumber,
                    price: item.price,
                    startNumber: item.startNumber
                })
            })
            this.setState({
                sellSectionPrices: priceArrMore,
                editIsContinue: isContinue
            })
        }
    }

    /**
     * 编辑货运条件头部form表单回传值
     * @param {*} data Object
     */
    handleOnFreConditChange = (data) => {
        this.setState({
            freCondit: data
        })
    }

    /**
     * 创建货运条件头部form表单回传值
     * @param {*} data Object
     */
    handleonCretFreConditChange = (data) => {
        this.setState({
            cretFreConditObj: data
        })
    }

    render() {
        const { prefixCls, isEdit, values } = this.props;
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
                maskClosable
                destroyOnClose
                confirmLoading={this.isDisabled}
            >
                {
                    isEdit &&
                    <div>
                        <span className="changeBefore">当前销售价格:</span>
                        <span className="changeAfter">修改销售价格:</span>
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
                                    />
                                </div>
                                <OnlyReadSteps
                                    newDatas={this.referenceDatas}
                                    isReadOnly={isReadOnly}
                                    startNumber={freCondit.minNumber || this.newDatas.minNumber}
                                />
                            </div>
                            <div className={`${prefixCls}-body-wrap sell-modal-body-width`}>
                                <FreightConditions
                                    isEdit={isEdit}
                                    isAfter={!isAfter}
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
                                    <span>
                                        {this.newDatas.auditUserName || '-'}
                                        {Utils.getTime(this.newDatas.auditTime)}
                                    </span>
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
                                        onReactChange={this.handleonCretFreConditChange}
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
    productId: PropTypes.string,
    form: PropTypes.objectOf(PropTypes.any),
    handlePostAdd: PropTypes.func,
    getCostPrice: PropTypes.func,
    clearCostPrice: PropTypes.func,
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
