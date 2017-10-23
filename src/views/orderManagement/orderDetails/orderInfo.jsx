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
import moment from 'moment';
import { TIME_FORMAT } from '../../../constant/index';
import CauseModal from '../orderList/causeModal';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';
import { savaOrderDescription, modifyApprovalOrder, fetchOrderDetailInfo,
    splitorderbyinventory, interfaceInventory } from '../../../actions/order';
import GoodsInfo from '../goodsInfo';

const confirm = Modal.confirm;
const { TextArea } = Input;

@connect(
    state => ({
        orderDetailData: state.toJS().order.orderDetailData
    }),
    dispatch => bindActionCreators({
        modifyCauseModalVisible,
        fetchOrderDetailInfo,
        splitorderbyinventory,
        interfaceInventory
    }, dispatch)
)

class OrderInformation extends PureComponent {
    state = {
        textAreaNote: this.props.orderDetailData.description,
        description: this.props.orderDetailData.description,
        manualSplitOrder: {}
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

    orderId = this.props.match.params.id;

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
    handleGoodsSplit = (splitGroups) => {
        const manualSplitOrder = {
            parentOrderId: this.orderId,
            groups: splitGroups
        }
        this.setState({ manualSplitOrder });
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
        }).catch(() => {
            message.error('实时拆单失败!')
        })
    }

    /**
     * 基于界面显示库存拆单
     */
    displayInventory = () => {
        const { manualSplitOrder } = this.state;
        this.props.interfaceInventory({
            ...manualSplitOrder
        }).then((res) => {
            if (res.code === 200) {
                message.success('手动分组拆单成功!')
            }
        }).catch(() => {
            message.error('手动分组拆单失败!')
        })
    }

    render() {
        const { orderDetailData } = this.props;
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
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">订单编号:</span>
                                    <span>{orderDetailData.id}</span>
                                </Col>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">父订单编号:</span>
                                    <span>{orderDetailData.createdByOrderId}</span>
                                </Col>
                                <Col className="gutter-row" span={10}>
                                    <span className="details-info-lable">订单类型:</span>
                                    <span>{orderDetailData.orderTypeDesc}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">订单状态:</span>
                                    <span>{orderDetailData.orderStateDesc}</span>
                                </Col>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">支付状态:</span>
                                    <span>{orderDetailData.paymentStateDesc}</span>
                                </Col>
                                <Col className="gutter-row" span={10}>
                                    <span className="details-info-lable">物流状态:</span>
                                    <span>{orderDetailData.shippingStateDesc}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">子公司:</span>
                                    <span>{orderDetailData.branchCompanyName}</span>
                                </Col>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">加盟商:</span>
                                    <span>{orderDetailData.franchiseeId}</span>
                                </Col>
                                <Col className="gutter-row" span={10}>
                                    <span className="details-info-lable">出货仓:</span>
                                    <span>{orderDetailData.branchCompanyArehouse}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">电商单据编号:</span>
                                    <span>{orderDetailData.thirdPartOrderNo}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={14}>
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
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">下单日期:</span>
                                    <span>
                                        {moment(parseInt(orderDetailData.creationTime, 10))
                                            .format(TIME_FORMAT)}
                                    </span>
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
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">收货人</span>
                                    <span>{orderDetailData.consigneeName}</span>
                                </Col>
                                <Col className="gutter-row" span={7}>
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
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">手机</span>
                                    <span>{orderDetailData.cellphone}</span>
                                </Col>
                                <Col className="gutter-row" span={7}>
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
                        value={this.props.orderDetailData}
                        onChange={this.handleGoodsSplit}
                        canBeSplit={this.props.orderDetailData.canSplitByInventory
                            || this.props.orderDetailData.canSplitManual}
                    />
                    {
                        this.props.orderDetailData.canSplitByInventory
                            || this.props.orderDetailData.canSplitManual
                            ? <div className="order-details-split-btn" style={{ textAlign: 'right' }}>
                                <Button
                                    size="default"
                                    type="primary"
                                    className="details-split-btns"
                                    onClick={this.realTimeDisassembly}
                                >
                                    获取实时库存后拆单
                                </Button>
                                <Button
                                    size="default"
                                    type="primary"
                                    className="details-split-btns"
                                    onClick={this.displayInventory}
                                >
                                    基于界面显示库存拆单
                                </Button>
                                <Button
                                    size="default"
                                    type="default"
                                    className="details-split-btns"
                                    onClick={() => {
                                        this.props.history.replace('/orderList');
                                    }}
                                >
                                    取消
                                </Button>
                            </div>
                            : null
                    }
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
                                (orderDetailData.orderStateDesc === '待审核'
                                    || orderDetailData.orderStateDesc === '待人工审核')
                                && <Button
                                    size="default"
                                    onClick={this.handleOrderAudit}
                                >
                                    审核
                                </Button>
                            }
                            {
                                orderDetailData.shippingStateDesc !== '待收货'
                                && orderDetailData.shippingStateDesc !== '未送达'
                                && orderDetailData.shippingStateDesc !== '已签收'
                                && orderDetailData.orderStateDesc !== '已取消'
                                && <Button
                                    size="default"
                                    onClick={this.handleOrderCancel}
                                    type="danger"
                                >
                                    取消
                                </Button>
                            }
                            <Button
                                size="default"
                                onClick={() => {
                                    this.props.history.replace('/orderList');
                                }}
                            >
                                返回
                            </Button>
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
    splitorderbyinventory: PropTypes.func,
    interfaceInventory: PropTypes.func
}

OrderInformation.defaultProps = {
}

export default withRouter(Form.create()(OrderInformation));
