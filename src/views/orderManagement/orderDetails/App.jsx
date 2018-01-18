/**
 * @file App.jsx
 * @author caoyanxuan
 *
 * 订单管理详情页
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Tabs } from 'antd';
import OrderInformation from './orderInfo';
import PayInformation from './payInfo';
import DistributionInformation from './distributionInfo';
import {
    fetchOrderDetailInfo,
    fetchPaymentDetailInfo,
    fetchShippingDetailInfo,
    confirmation
} from '../../../actions/order';

const TabPane = Tabs.TabPane;
const orderDT = 'order-details';

@connect(
    state => ({
        orderListData: state.toJS().order.orderListData,
    }),
    dispatch => bindActionCreators({
        fetchOrderDetailInfo,
        fetchPaymentDetailInfo,
        fetchShippingDetailInfo,
        confirmation
    }, dispatch)
)

class OrderManagementDetails extends Component {
    state = {
        oldData: [],
        coupData: {}
    }

    componentWillMount() {
        const { id } = this.props.match.params;
        this.props.fetchOrderDetailInfo({ id }).then((res) => {
            if (res.code === 200) {
                this.orderId = res.data.id;
            }
        });
        this.props.fetchPaymentDetailInfo({ orderId: id });
        this.props.fetchShippingDetailInfo({ id }).then((res) => {
            if (res.code === 200) {
                this.setState({
                    oldData: [...res.data.shippingProductDtos]
                })
            }
        });
    }

    orderId = null;

    handleSendChange = (goodsList) => {
        const coupData = this.state.coupData;
        this.setState({
            oldData: goodsList || this.state.oldData,
        })
        const commerceItemList = [];
        goodsList.forEach((item) => {
            commerceItemList.push({
                commerceId: item.id,
                completedQuantity: item.completedQuantity
            })
        });
        Object.assign(coupData, {
            commerceItemList
        })
    }

    /**
     * 确认签收发送签收数量
     */
    handleReceipt = () => {
        const { oldData } = this.state;
        const oldNumObj = {};
        const commerceItemList = [];
        oldData.forEach((item) => {
            commerceItemList.push({
                commerceId: item.id,
                completedQuantity: item.completedQuantity
            })
        });
        Object.assign(oldNumObj, {
            commerceItemList
        })
        this.props.confirmation({
            orderId: this.orderId,
            commerceItemDatas: commerceItemList
        })
    }

    /**
     * 查看签收凭证
     */
    handleVoucher = (singedCertImg) => {
        console.log('查看凭证')
    }

    render() {
        return (
            <div>
                <Tabs
                    defaultActiveKey="1"
                    className={`${orderDT}`}
                    style={{ marginTop: '16px' }}
                >
                    <TabPane tab="订单信息" key="1">
                        <OrderInformation />
                    </TabPane>
                    <TabPane tab="支付信息" key="2">
                        <PayInformation />
                    </TabPane>
                    <TabPane tab="配送信息" key="3">
                        <DistributionInformation
                            value={this.state.oldData}
                            onChange={this.handleSendChange}
                            onReceipt={this.handleReceipt}
                            onVoucher={this.handleVoucher}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

OrderManagementDetails.propTypes = {
    match: PropTypes.objectOf(PropTypes.any),
    fetchOrderDetailInfo: PropTypes.func,
    confirmation: PropTypes.func,
    fetchPaymentDetailInfo: PropTypes.func,
    fetchShippingDetailInfo: PropTypes.func,
}

OrderManagementDetails.defaultProps = {
}

export default withRouter(Form.create()(OrderManagementDetails));
