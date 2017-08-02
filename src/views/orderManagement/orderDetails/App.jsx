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

const TabPane = Tabs.TabPane;
const orderDT = 'order-details';

@connect(
    state => ({
        // ToDo：接受回显相关数据
        initialData: state.toJS().order.initialData,
    }),
    dispatch => bindActionCreators({

    }, dispatch)
)
class OrderManagementDetails extends Component {
    constructor(props) {
        super(props);
        this.handleTabsClick = ::this.handleTabsClick;

        this.state = {
        }
    }

    componentDidMount() {
        // const { orderNumber } = this.props.match.params;
        // ToDo 根据url带过来的参数orderNumber，发请求，获取回显数据
    }

    handleTabsClick() {
    }

    render() {
        return (
            <div>
                <Tabs
                    defaultActiveKey="1"
                    onChange={this.handleTabsClick}
                    className={`${orderDT}`}
                    style={{marginTop: '16px'}}
                >
                    <TabPane tab="订单信息" key="1">
                        <OrderInformation initialData={this.props.initialData} />
                    </TabPane>
                    <TabPane tab="支付信息" key="2">
                        <PayInformation initialData={this.props.initialData} />
                    </TabPane>
                    <TabPane tab="配送信息" key="3">
                        <DistributionInformation initialData={this.props.initialData} />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

OrderManagementDetails.propTypes = {
    match: PropTypes.objectOf(PropTypes.any),
    initialData: PropTypes.objectOf(PropTypes.any),

}

OrderManagementDetails.defaultProps = {
}

export default withRouter(Form.create()(OrderManagementDetails));
