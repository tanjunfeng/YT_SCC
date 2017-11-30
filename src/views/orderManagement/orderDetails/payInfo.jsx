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
import { Form, Icon, Table, Row, Col, Button, message } from 'antd';
import moment from 'moment';
import RefundModal from './refundModal';
import PayModal from './payModal';
import { DATE_FORMAT } from '../../../constant/index';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';
import { modifyPayModalVisible } from '../../../actions/modify/modifyPayModalVisible';
import { modifyConfirmPayment, fetchPaymentDetailInfo, fetchOrderDetailInfo } from '../../../actions/order';

@connect(
    state => ({
        paymentDetailData: state.toJS().order.paymentDetailData,
    }),
    dispatch => bindActionCreators({
        modifyCauseModalVisible,
        modifyPayModalVisible,
        fetchPaymentDetailInfo,
        fetchOrderDetailInfo
    }, dispatch)
)

class PayInformation extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            amount: null
        }

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
            render: (amount) => (
                <span>￥{Number(amount).toFixed(2)}</span>
            )
        }, {
            title: '方式',
            dataIndex: 'channel',
            key: 'channel',
        }, {
            title: '支付帐号',
            dataIndex: 'payAccount',
            key: 'payAccount',
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
                        if (record.shouldConfirm) {
                            return (<a
                                onClick={() => {
                                    this.handlePayOk(record);
                                }}
                            >确认支付</a>)
                        }
                        return null;
                }
            }
        }];
    }

    /**
     * 审核退款
     * @param {Object} record 该行数据
     */
    handleAuditRefund = (record) => {
        this.props.modifyCauseModalVisible({ isVisible: true, record })
        this.setState({
            amount: record.amount
        })
    }

    /**
     * 确认退款
     * @param {Object} record 该行数据
     */
    handleRefundOk = (record) => {
        this.props.modifyCauseModalVisible({ isVisible: true, record })
    }

    /**
     * 确认支付
     * @param {Object} record 该行数据
     */
    handlePayOk = (record) => {
        const { id, orderId } = record;
        modifyConfirmPayment({
            orderId,
            paymentId: id
        }).then((res) => {
            if (res.code === 200 && res.success) {
                this.props.fetchPaymentDetailInfo({ orderId });
                this.props.fetchOrderDetailInfo({ id: this.props.match.params.id });
            } else if (!res.success) {
                message.error(res.message);
            }
        })
    }

    /**
     * 新增付款
     *
     */
    handleAddPay = () => {
        this.props.modifyPayModalVisible({ isVisible: true })
    }

    render() {
        const { paymentDetailData } = this.props;
        const { totalAmount, totalPaidAmount, totalRefundedAmount } = paymentDetailData;
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
                                    style={{ marginLeft: 18 }}
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
                            />
                        </div>
                        <div className="table-statistics" style={{ textAlign: 'right' }}>
                            <span className="table-statistics-item">
                                <span>总金额： ￥</span>
                                <span className="red">{totalAmount}</span>
                            </span>
                            <span className="table-statistics-item">
                                <span>付款： ￥</span>
                                <span className="red">{totalPaidAmount}</span>
                            </span>
                            <span className="table-statistics-item">
                                <span>退款： ￥</span>
                                <span className="red">{totalRefundedAmount}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <RefundModal
                        totalAmount={totalAmount}
                        totalPaidAmount={totalPaidAmount}
                        value={this.state.amount}
                    />
                </div>
                <div>
                    <PayModal totalAmount={totalAmount} />
                </div>
            </div>
        );
    }
}

PayInformation.propTypes = {
    paymentDetailData: PropTypes.objectOf(PropTypes.any),
    modifyCauseModalVisible: PropTypes.func,
    modifyPayModalVisible: PropTypes.func,
    fetchPaymentDetailInfo: PropTypes.func,
    fetchOrderDetailInfo: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(PayInformation));
