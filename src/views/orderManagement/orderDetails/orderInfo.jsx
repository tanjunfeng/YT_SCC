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
import { Form, Icon, Row, Col, Input, Table, Button, Modal, message } from 'antd';
import moment from 'moment';
import { TIME_FORMAT } from '../../../constant/index';
import CauseModal from '../orderList/causeModal';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';
import { savaOrderDescription, modifyApprovalOrder, fetchOrderDetailInfo } from '../../../actions/order';

const confirm = Modal.confirm;
const { TextArea } = Input;

const columns = [{
    title: '商品图片',
    dataIndex: 'productImg',
    key: 'productImg',
    render: (text) => (
        <img
            src={text}
            alt="未上传"
            style={{width: 50, height: 50 }}
        />
    )
}, {
    title: '商品编码',
    dataIndex: 'skuId',
    key: 'skuId',
}, {
    title: '商品条码',
    dataIndex: 'productCode',
    key: 'productCode',
}, {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName',
}, {
    title: '商品分类',
    dataIndex: 'commodifyClassify',
    key: 'commodifyClassify',
    render: (text, record) => (
        <span>{record.secondLevelCategoryName}&gt;{record.thirdLevelCategoryName}</span>
    )
}, {
    title: '数量',
    dataIndex: 'quantity',
    key: 'quantity',
}, {
    title: '单价',
    dataIndex: 'price',
    key: 'price',
    render: (text, record) => (
        <span>￥{record.itemPrice.salePrice}</span>
    )
}, {
    title: '金额',
    dataIndex: 'money',
    key: 'money',
    render: (text, record) => (
        <span>￥{record.itemPrice.amount}</span>
    )
}];

@connect(
    state => ({
        orderDetailData: state.toJS().order.orderDetailData,
    }),
    dispatch => bindActionCreators({
        modifyCauseModalVisible,
        fetchOrderDetailInfo,
    }, dispatch)
)
class OrderInformation extends PureComponent {
    constructor(props) {
        super(props);
        this.handleOrderSave = ::this.handleOrderSave;
        this.handleOrderAudit = ::this.handleOrderAudit;
        this.handleOrderCancel = ::this.handleOrderCancel;
        this.id = this.props.match.params.id;
        this.state = {
            textAreaNote: this.props.orderDetailData.description,
            description: this.props.orderDetailData.description
        }
    }

    componentDidMount() {
    }

    /**
     * 将刷新后的categorys值，push到数组中
     * @param {Object} nextProps 刷新后的属性
     */
    componentWillReceiveProps(nextProps) {
        const { orderDetailData } = nextProps;
        this.setState({
            textAreaNote: orderDetailData.description,
            description: orderDetailData.description,
        })
    }

    /**
     * 保存备注信息
     */
    handleOrderSave() {
        const { textAreaNote, description } = this.state;
        confirm({
            title: '保存',
            content: '确认保存备注信息？',
            onOk: () => {
                if (textAreaNote === description) {
                    message.error('备注未作修改！')
                } else {
                    savaOrderDescription({
                        orderId: this.id,
                        description: textAreaNote,
                    }).then(() => {
                        message.success('保存成功！')
                    }).catch(() => {
                        message.success('保存失败！')
                    })
                }
            },
            onCancel() {},
        });
    }

    /**
     * 单个审核
     */
    handleOrderAudit() {
        confirm({
            title: '审核',
            content: '确认审核？',
            onOk: () => {
                modifyApprovalOrder({
                    id: this.id
                }).then(res => {
                    this.props.fetchOrderDetailInfo({id: this.id});
                    message.success(res.message);
                }).catch(err => {
                    message.success(err.message);
                })
            },
            onCancel() {},
        });
    }

    /**
     * 单个取消
     */
    handleOrderCancel() {
        this.props.modifyCauseModalVisible({ isShow: true, id: this.id });
    }

    render() {
        const { orderDetailData } = this.props;
        const tableFooter = () =>
            (<div>
                <span className="table-footer-item">
                    <span>共</span>
                    <span className="red-number">{orderDetailData.countOfItem}</span>
                    <span>件商品</span>
                </span>
                <span className="table-footer-item">
                    <span>总金额： ￥</span>
                    <span className="red-number">{orderDetailData.amount}</span>
                </span>
            </div>)
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
                                <Col className="gutter-row" span={14}>
                                    <span className="details-info-lable">备注:</span>
                                    <TextArea
                                        autosize={{ minRows: 3, maxRows: 6 }}
                                        value={this.state.textAreaNote}
                                        style={{resize: 'none' }}
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
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="picture" className="detail-message-header-icon" />
                            商品信息
                        </div>
                        <div>
                            <Table
                                dataSource={orderDetailData.items}
                                columns={columns}
                                pagination={false}
                                rowKey="id"
                                footer={tableFooter}
                            />
                        </div>
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
                                    this.props.history.goBack();
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
}

OrderInformation.defaultProps = {
}

export default withRouter(Form.create()(OrderInformation));
