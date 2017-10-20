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
import { goodsColumns as columns } from '../columns';

const confirm = Modal.confirm;
const { TextArea } = Input;

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
    state = {
        textAreaNote: this.props.orderDetailData.description,
        description: this.props.orderDetailData.description
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

    id = this.props.match.params.id;

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
                        orderId: this.id,
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
                    id: this.id
                }).then(res => {
                    this.props.fetchOrderDetailInfo({ id: this.id });
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
            <div className="detail-message">
                <div className="detail-message-header">
                    <Icon type="picture" className="detail-message-header-icon" />
                    商品信息
                    <Button type="primary" style={{ float: 'right' }} onClick={this.addSubOrders}>添加子订单</Button>
                </div>
                <Table
                    dataSource={orderDetailData.items}
                    columns={columns}
                    pagination={false}
                    rowKey="id"
                    footer={tableFooter}
                />
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
