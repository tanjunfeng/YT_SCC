/**
 * @file payInfo.jsx
 * @author caoyanxuan
 *
 * 订单管理详情页-支付信息
 */

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Form, Icon, Table, Row, Col, Button, message } from 'antd';
import moment from 'moment';

class PayInformation extends PureComponent {
    constructor(props) {
        super(props);

        this.columns = [{
            title: '序号',
            dataIndex: 'payNumber',
            key: 'payNumber',
        }, {
            title: '类型',
            dataIndex: 'payType',
            key: 'payType',
        }, {
            title: '日期',
            dataIndex: 'payDate',
            key: 'payDate',
            render: (text) => (
                <span>
                    {moment(parseInt(text, 10)).format('YYYY-MM-DD')}
                </span>
            )
        }, {
            title: '金额',
            dataIndex: 'payMoney',
            key: 'payMoney',
            render: (text) => (
                <span>￥{text}</span>
            )
        }, {
            title: '方式',
            dataIndex: 'payWay',
            key: 'payWay',
        }, {
            title: '凭证号',
            dataIndex: 'payPromiseNum',
            key: 'payPromiseNum',
        }, {
            title: '退款原因',
            dataIndex: 'refundCause',
            key: 'refundCause',
        }, {
            title: '备注',
            dataIndex: 'payNote',
            key: 'payNote',
        }, {
            title: '操作人',
            dataIndex: 'payOperater',
            key: 'payOperater',
        }, {
            title: '操作日期',
            dataIndex: 'payOperateDate',
            key: 'payOperateDate',
            render: (text) => (
                <span>
                    {moment(parseInt(text, 10)).format('YYYY-MM-DD HH:mm:ss')}
                </span>
            )
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record) => {
                switch (text) {
                    case 0:
                        return (<a
                            onClick={() => {
                                this.handleAuditRefund(record);
                            }}
                        >审核退款</a>)
                    case 1:
                        return (<a
                            onClick={() => {
                                this.handleRefundOk(record);
                            }}
                        >确认退款</a>)
                    default:
                        return null;
                }
            }
        }];

        this.handleAuditRefund = ::this.handleAuditRefund;
        this.handleRefundOk = ::this.handleRefundOk;

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
        // ToDo: 带数据发请求
        message.success(record)
    }

    /**
     * 确认退款
     * @param {Object} record 该行数据
     */
    handleRefundOk(record) {
        // ToDo: 带数据发请求
        message.success(record)
    }

    render() {
        const { initialData } = this.props;
        const {
            totalMoney,
            payMoney,
            refungMoney,
            differMoney
        } = initialData.payInfoFooter;
        const tableFooter = () =>
            (<div>
                <span className="table-footer-item">
                    <span>总金额： ￥</span>
                    <span className="red-number">{totalMoney}</span>
                </span>
                <span className="table-footer-item">
                    <span>付款： ￥</span>
                    <span className="red-number">{payMoney}</span>
                </span>
                <span className="table-footer-item">
                    <span>退款： ￥</span>
                    <span className="red-number">{refungMoney}</span>
                </span>
                <span className="table-footer-item">
                    <span>差额： ￥</span>
                    <span className="red-number">{differMoney}</span>
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
                        <div>
                            <Table
                                dataSource={initialData.payInfo}
                                columns={this.columns}
                                pagination={false}
                                rowKey="payNumber"
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
                                    window.history.back();
                                }}
                            >返回</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

PayInformation.propTypes = {
    initialData: PropTypes.objectOf(PropTypes.any),
}

PayInformation.defaultProps = {
}

export default withRouter(Form.create()(PayInformation));
