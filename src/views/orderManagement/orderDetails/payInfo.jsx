/**
 * @file payInfo.jsx
 * @author caoyanxuan
 *
 * 订单管理详情页-支付信息
 */

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Icon, Table, Row, Col, Button } from 'antd';
import moment from 'moment';
import RefundModal from './refundModal';
import PayModal from './payModal';
import { DATE_FORMAT } from '../../../constant/index';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';
import { modifyPayModalVisible } from '../../../actions/modify/modifyPayModalVisible';
import { modifyConfirmPayment } from '../../../actions/order';

@connect(
    state => ({
        paymentDetailData: state.toJS().order.paymentDetailData,
    }),
    dispatch => bindActionCreators({
        modifyCauseModalVisible,
        modifyPayModalVisible,
        modifyConfirmPayment,
    }, dispatch)
)
class PayInformation extends PureComponent {
    constructor(props) {
        super(props);

        this.columns = [{
            title: '序号',
            dataIndex: 'sort',
            key: 'sort',
            render: (text, record, index) => index + 1
        }, {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (text) => {
                switch (text) {
                    case 1:
                        return '付款记录';
                    case 2:
                        return '退款记录';
                    default:
                        return '';
                }
            }
        }, {
            title: '日期',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (timestampBack) => {
                let text = '-'
                if (timestampBack) {
                    text = moment(new Date(timestampBack)).format(DATE_FORMAT);
                }
                return text;
            }
        }, {
            title: '金额',
            dataIndex: 'amount',
            key: 'amount',
            render: (text) => (
                <span>￥{text}</span>
            )
        }, {
            title: '方式',
            dataIndex: 'channel',
            key: 'channel',
        }, {
            title: '凭证号',
            dataIndex: 'transNum',
            key: 'transNum',
        }, {
            title: '退款原因',
            dataIndex: 'refundReason',
            key: 'refundReason',
        }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: '操作人',
            dataIndex: 'operatorName',
            key: 'operatorName',
        }, {
            title: '操作日期',
            dataIndex: 'operationTime',
            key: 'operationTime',
            render: (timestampBack) => {
                let text = '-'
                if (timestampBack) {
                    text = moment(new Date(timestampBack)).format(DATE_FORMAT);
                }
                return text;
            }
        }, {
            title: '操作',
            dataIndex: 'state',
            key: 'state',
            render: (text, record) => {
                switch (text) {
                    case 'pending_audit':
                        return (<a
                            onClick={() => {
                                this.handleAuditRefund(record);
                            }}
                        >审核退款</a>)
                    case 'approved':
                        return (<a
                            onClick={() => {
                                this.handleRefundOk(record);
                            }}
                        >确认退款</a>)
                    default:
                        if ( record.shouldConfirm ) {
                            return (<a
                                onClick={() => {
                                    this.handlePayOk(record);
                                }}
                            >确认支付</a>)
                        } else {
                            return  null;
                        }

                }
            }
        }];

        this.handleAuditRefund = ::this.handleAuditRefund;
        this.handleRefundOk = ::this.handleRefundOk;
        this.handlePayOk = ::this.handlePayOk;
        this.handleAddPay = ::this.handleAddPay;

        this.state = {
        }
    }

    componentDidMount() {
    }

    /**
     * 审核退款
     * @param {Object} record 该行数据
     */
    handleAuditRefund(record) {
        this.props.modifyCauseModalVisible({ isVisible: true, record })
    }

    /**
     * 确认退款
     * @param {Object} record 该行数据
     */
    handleRefundOk(record) {
        this.props.modifyCauseModalVisible({ isVisible: true, record })
    }

    /**
     * 确认支付
     * @param {Object} record 该行数据
     */
    handlePayOk(record) {
        const { id, orderId } = record;
        this.props.modifyConfirmPayment({
            orderId: orderId,
            paymentId: id
        })
        .then((res) => {
            console.log(res);
        })
    }

    /**
     * 新增付款
     *
     */
    handleAddPay() {
        this.props.modifyPayModalVisible({ isVisible: true })
    }

    render() {
        const { paymentDetailData } = this.props;
        const { totalAmount, totalPaidAmount, totalRefundedAmount } = paymentDetailData;
        const tableFooter = () =>
            (<div>
                <span className="table-footer-item">
                    <span>总金额： ￥</span>
                    <span className="red-number">{totalAmount}</span>
                </span>
                <span className="table-footer-item">
                    <span>付款： ￥</span>
                    <span className="red-number">{totalPaidAmount}</span>
                </span>
                <span className="table-footer-item">
                    <span>退款： ￥</span>
                    <span className="red-number">{totalRefundedAmount}</span>
                </span>
                <span className="table-footer-item">
                    <span>差额： ￥</span>
                    <span className="red-number">{totalPaidAmount - totalRefundedAmount}</span>
                </span>
            </div>)
        return (
            <div>
                <div className="order-details-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="wallet" className="detail-message-header-icon" />
                            支付信息
                        </div>
                        <div className="order-details-btns">
                            <Row>
                                <Col
                                    className="gutter-row"
                                    span={8}
                                    style={{ marginLeft: 18}}
                                >
                                    <Button
                                        size="default"
                                        onClick={this.handleAddPay}
                                    >新增付款</Button>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <Table
                                dataSource={paymentDetailData.paymentGroups}
                                columns={this.columns}
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
                    <RefundModal totalAmount={totalAmount} />
                </div>
                <div>
                    <PayModal totalAmount={totalAmount}/>
                </div>
            </div>
        );
    }
}

PayInformation.propTypes = {
    paymentDetailData: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
    modifyCauseModalVisible: PropTypes.func,
    modifyPayModalVisible: PropTypes.func,
    modifyConfirmPayment: PropTypes.objectOf(PropTypes.any)
}

PayInformation.defaultProps = {
}

export default withRouter(Form.create()(PayInformation));
