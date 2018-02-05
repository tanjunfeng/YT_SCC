/**
 * @file orderInfo.jsx
 * @author caoyanxuan
 *
 * 订单管理详情页-订单信息
 */

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Icon, Row, Col, Input, Button, Modal, message } from 'antd';
import CauseModal from '../orderList/causeModal';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';
import {
    savaOrderDescription,
    modifyApprovalOrder,
    fetchOrderDetailInfo,
    clearOrderDetailInfo,
    splitorderbyinventory,
    interfaceInventory
} from '../../../actions/order';
import GoodsInfo from '../goodsInfo';
import Utils from '../../../util/util';

const confirm = Modal.confirm;
const { TextArea } = Input;

@connect(
    state => ({
        orderDetailData: state.toJS().order.orderDetailData,
    }),
    dispatch => bindActionCreators({
        modifyCauseModalVisible,
        fetchOrderDetailInfo,
        clearOrderDetailInfo,
        splitorderbyinventory,
        interfaceInventory
    }, dispatch)
)

class OrderInformation extends PureComponent {
    state = {
        textAreaNote: this.props.orderDetailData.description,
        description: this.props.orderDetailData.description,
        manualSplitOrder: {},
        isMultiple: true
    }

    componentWillMount() {
        this.props.clearOrderDetailInfo();
    }

    /**
     * 将刷新后的categorys值，push到数组中
     * @param {Object} nextProps 刷新后的属性
     */
    componentWillReceiveProps(nextProps) {
        const { orderDetailData } = nextProps;
        this.setState({
            textAreaNote: orderDetailData.description,
            description: orderDetailData.description
        });
    }

    getAmount = amount => (`￥${Number(amount).toFixed(2)}`);

    /**
     * 保存备注信息
     */
    handleOrderSave = () => {
        const { textAreaNote, description } = this.state;
        confirm({
            title: '保存',
            content: '确认保存备注信息？',
            onOk: () => {
                if (textAreaNote === description) {
                    message.error('备注未作修改！')
                } else {
                    savaOrderDescription({
                        orderId: this.orderId,
                        description: textAreaNote,
                    }).then(() => {
                        message.success('保存成功！')
                    }).catch(() => {
                        message.success('保存失败！')
                    })
                }
            },
            onCancel() { },
        });
    }

    /**
     * 单个审核
     */
    handleOrderAudit = () => {
        confirm({
            title: '审核',
            content: '确认审核？',
            onOk: () => {
                modifyApprovalOrder({
                    id: this.orderId
                }).then(res => {
                    this.props.fetchOrderDetailInfo({ id: this.orderId });
                    message.success(res.message);
                })
            },
            onCancel() { },
        });
    }

    /**
     * 单个取消
     */
    handleOrderCancel = () => {
        this.props.modifyCauseModalVisible({ isShow: true, id: this.orderId });
    }

    /**
     * 拆单返回数组
     */
    handleGoodsSplit = (splitGroups, isMultiple) => {
        const manualSplitOrder = {
            parentOrderId: this.orderId,
            groups: splitGroups
        }
        this.setState({ manualSplitOrder, isMultiple });
    }

    /**
     * 获取实时库存后拆单
     */
    realTimeDisassembly = () => {
        const { orderDetailData } = this.props;
        this.props.splitorderbyinventory({
            orderId: orderDetailData.id
        }).then((res) => {
            if (res.code === 200) {
                message.success('实时拆单成功!')
            }
        })
    }

    /**
     * 基于界面显示库存拆单
     */
    displayInventory = () => {
        const { manualSplitOrder = null, isMultiple } = this.state;
        if (!isMultiple) {
            message.error('不是销售内装数的整数倍');
            return;
        }
        if (manualSplitOrder.groups === undefined) {
            message.error('请完整填写拆单数据!');
            return;
        }
        this.props.interfaceInventory({
            ...manualSplitOrder
        }).then((res) => {
            if (res.code === 200) {
                message.success('界面拆单成功！')
            }
        }).catch((res) => {
            message.error(res.message)
        })
    }

    orderId = this.props.match.params.id;

    render() {
        const { orderDetailData } = this.props;
        const { orderState, shippingState } = orderDetailData;
        return (
            <div>
                <div className="order-details-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />
                            基础信息
                        </div>
                        <div className="detail-message-body">
                            <Row>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">订单编号:</span>
                                    <span>{orderDetailData.id}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">父订单编号:</span>
                                    <span>{orderDetailData.createdByOrderId}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">订单类型:</span>
                                    <span>{orderDetailData.orderTypeDesc}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">商品总金额:</span>
                                    <span>{this.getAmount(orderDetailData.rawSubtotal)}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">订单状态:</span>
                                    <span>{orderDetailData.orderStateDesc}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">支付状态:</span>
                                    <span>{orderDetailData.paymentStateDesc}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">物流状态:</span>
                                    <span>{orderDetailData.shippingStateDesc}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">运费:</span>
                                    <span>{this.getAmount(orderDetailData.shipping)}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">子公司:</span>
                                    <span>{orderDetailData.branchCompanyName}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">加盟商编号:</span>
                                    <span>{orderDetailData.franchiseeId}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">门店名称:</span>
                                    <span>{orderDetailData.franchiseeStoreName}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">优惠券优惠:</span>
                                    <span>-{
                                        this.getAmount(orderDetailData.couponDiscountAmount)
                                    }</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">出货仓:</span>
                                    <span>{orderDetailData.branchCompanyArehouse}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">门店编号:</span>
                                    <span>{orderDetailData.franchiseeStoreId}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">电商单据编号:</span>
                                    <span>{orderDetailData.thirdPartOrderNo}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">活动优惠:</span>
                                    <span>-{this.getAmount(orderDetailData.discount)}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">下单时间:</span>
                                    <span>
                                        {Utils.getTime(orderDetailData.creationTime)}
                                    </span>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <span className="details-info-lable">配送方:</span>
                                    <span>{orderDetailData.spName}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">会员等级优惠:</span>
                                    <span>
                                        {this.getAmount(orderDetailData.userDiscountAmount)}
                                    </span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">备注:</span>
                                    <TextArea
                                        autosize={{ minRows: 3, maxRows: 6 }}
                                        value={this.state.textAreaNote}
                                        style={{ resize: 'none' }}
                                        maxLength="250"
                                        onChange={(e) => {
                                            this.setState({
                                                textAreaNote: e.target.value
                                            })
                                        }}
                                    />
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <span className="details-info-lable">取消原因:</span>
                                    <TextArea
                                        autosize={{ minRows: 3, maxRows: 6 }}
                                        value={orderDetailData.cancelReason}
                                        style={{ resize: 'none' }}
                                        maxLength="250"
                                        onChange={(e) => {
                                            this.setState({
                                                textAreaNote: e.target.value
                                            })
                                        }}
                                    />
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">实付金额:</span>
                                    <span className="red-star">{this.getAmount(orderDetailData.total)}</span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <div className="order-details-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="gift" className="detail-message-header-icon" />
                            收货信息
                        </div>
                        <div className="detail-message-body">
                            <Row>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">收货人:</span>
                                    <span>{orderDetailData.consigneeName}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">所在地区:</span>
                                    <span>{orderDetailData.province}</span>
                                    <span>{orderDetailData.city}</span>
                                    <span>{orderDetailData.district}</span>
                                </Col>
                                <Col className="gutter-row" span={10}>
                                    <span className="details-info-lable">街道地址:</span>
                                    <span>{orderDetailData.detailAddress}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">手机:</span>
                                    <span>{orderDetailData.cellphone}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">固定电话:</span>
                                    <span>{orderDetailData.telephone}</span>
                                </Col>
                                <Col className="gutter-row" span={10}>
                                    <span className="details-info-lable">邮编:</span>
                                    <span>{orderDetailData.postcode}</span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <div className="order-details-item">
                    <GoodsInfo
                        value={orderDetailData}
                        onChange={this.handleGoodsSplit}
                        canBeSplit={orderDetailData.canSplitByInventory
                            || orderDetailData.canSplitManual}
                    />
                    <div className="order-details-split-btn" style={{ textAlign: 'right' }}>
                        {orderDetailData.canSplitByInventory
                            ? <Button
                                size="default"
                                type="primary"
                                className="details-split-btns"
                                onClick={this.realTimeDisassembly}
                            >
                                获取实时库存后拆单
                            </Button>
                            : null}
                        {orderDetailData.canSplitManual
                            ? <Button
                                size="default"
                                className="details-split-btns"
                                onClick={this.displayInventory}
                            >
                                基于界面显示库存拆单
                            </Button>
                            : null}
                        {orderDetailData.canSplitByInventory
                            || orderDetailData.canSplitManual
                            ? <Button
                                size="default"
                                type="default"
                                className="details-split-btns"
                                onClick={() => {
                                    this.props.history.replace('/orderList');
                                }}
                            >
                                取消
                            </Button>
                            : null}
                    </div>
                </div>
                <div className="order-details-btns">
                    <Row>
                        <Col
                            className="gutter-row"
                            span={14}
                            offset={10}
                        >
                            <Button
                                size="default"
                                onClick={this.handleOrderSave}
                                type="primary"
                            >
                                保存
                            </Button>
                            {
                                ['W', 'M'].indexOf(orderState) > -1
                                    ? <Button
                                        size="default"
                                        onClick={this.handleOrderAudit}
                                    >
                                        审核
                                    </Button>
                                    : null
                            }
                            {
                                ['W', 'M', 'A'].indexOf(orderState) > -1
                                    && ['DCL', 'WCS', 'DCK', 'WJS', 'QXZ', 'CGWDH'].indexOf(shippingState) > -1
                                    ? <Button
                                        size="default"
                                        onClick={this.handleOrderCancel}
                                        type="danger"
                                    >
                                        取消
                                    </Button>
                                    : null
                            }
                            {orderDetailData.returnOrder === 1 ?
                                <Button
                                    size="default"
                                    onClick={() => {
                                        this.props.history.replace(`/orderList/orderBackstageBack/${this.orderId}`);
                                    }}
                                >
                                    后台退货
                                </Button>
                                : null}
                        </Col>
                    </Row>
                </div>
                <div>
                    <CauseModal />
                </div>
            </div>
        );
    }
}

OrderInformation.propTypes = {
    orderDetailData: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
    match: PropTypes.objectOf(PropTypes.any),
    modifyCauseModalVisible: PropTypes.func,
    fetchOrderDetailInfo: PropTypes.func,
    clearOrderDetailInfo: PropTypes.func,
    splitorderbyinventory: PropTypes.func,
    interfaceInventory: PropTypes.func
}

OrderInformation.defaultProps = {
}

export default withRouter(Form.create()(OrderInformation));
