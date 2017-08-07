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
import { fetchOrderDetailInfo, fetchPaymentDetailInfo, fetchShippingDetailInfo } from '../../../actions/order';


const TabPane = Tabs.TabPane;
const orderDT = 'order-details';

@connect(
    state => ({
        initialData: state.toJS().order.initialData,
    }),
    dispatch => bindActionCreators({
        fetchOrderDetailInfo,
        fetchPaymentDetailInfo,
        fetchShippingDetailInfo,
    }, dispatch)
)
class OrderManagementDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.fetchOrderDetailInfo({id});
        this.props.fetchPaymentDetailInfo({orderId: id});
        this.props.fetchShippingDetailInfo({id});
    }

    render() {
        return (
            <div>
                <Tabs
                    defaultActiveKey="1"
                    className={`${orderDT}`}
                    style={{marginTop: '16px'}}
                >
                    <TabPane tab="订单信息" key="1">
                        <OrderInformation />
                    </TabPane>
                    <TabPane tab="支付信息" key="2">
                        <PayInformation />
                    </TabPane>
                    <TabPane tab="配送信息" key="3">
                        <DistributionInformation />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

OrderManagementDetails.propTypes = {
    match: PropTypes.objectOf(PropTypes.any),
    fetchOrderDetailInfo: PropTypes.func,
    fetchPaymentDetailInfo: PropTypes.func,
    fetchShippingDetailInfo: PropTypes.func,
}

OrderManagementDetails.defaultProps = {
}

export default withRouter(Form.create()(OrderManagementDetails));
