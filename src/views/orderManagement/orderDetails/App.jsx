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
    }

    handleTabsClick() {
    }

    render() {
        const initialData = {
            orderNumber: 'YT000999',
            parentOrderNumber: 'XXXXXXXXX',
            orderType: '正常销售',
            orderStatus: '已审核（自动）',
            payStatus: '已支付',
            logisticsStatus: '未传送',
            subCompany: '雅堂小超北京子公司',
            joiner: 'A000999',
            outOfWarehouse: '雅堂小超北京市和平里XX仓库',
            orderData: '1500876718',
            consignee: '张三',
            localErea: '上海市上海市嘉定区',
            streetAdress: '博乐路蓝宫大饭店',
            telephone: '186XXX26940',
            cellphone: '028 - XXXXXXXX',
            mail: '210800',
            logisticsProvider: 'EMS',
            deliveryDate: '2017-07-25',
            logisticsNumber: 'YT00000999',
            willArrivalDate: '2017-07-25',
            deliverier: '张三',
            contact: '186XXX26940',
            commodifyInfo: [{
                commodifyImg: 'http://sit.image.com/group1/M00/00/FB/rB4KPVlsFXOAGDZWAABb5O0UTso681.jpg',
                commodifyNumber: 'SKU000000001',
                commodifyCode: 'XXXXXXXXXX',
                commodifyName: '巴马天成火麻橄榄油会议爆品厂家大量批发',
                commodifyClassify: ['中类', '小类'],
                number: '8把',
                price: 20,
                money: 140.00,
            }, {
                commodifyNumber: 'SKU000000002',
                commodifyCode: 'XXXXXXXXXX',
                commodifyName: '巴马天成火麻橄榄油会议爆品厂家大量批发',
                commodifyClassify: ['中类', '小类'],
                number: '8把',
                price: 20,
                money: 140.00,
            }],
            payInfo: [{
                payNumber: '1',
                payType: '付款',
                payDate: '1500876718',
                payMoney: '140.00',
                payWay: '微信',
                payPromiseNum: '支付流水000000000001',
                refundCause: '取消订单',
                payNote: 'XXXXXXXXXX',
                payOperater: '张三',
                payOperateDate: '1500876718'
            }, {
                payNumber: '2',
                payType: '付款',
                payDate: '1500876718',
                payMoney: '140.00',
                payWay: '微信',
                payPromiseNum: '支付流水000000000001',
                refundCause: '取消订单',
                payNote: 'XXXXXXXXXX',
                payOperater: '张三',
                payOperateDate: '1500876718'
            }],
            payInfoFooter: {
                totalMoney: 140,
                payMoney: 140,
                refungMoney: 140,
                differMoney: 0,
            },
            distributionInfo: [{
                commodifyNumber: 'SKU000000001',
                commodifyName: '巴马火麻素食营养餐巴马特产冲食产品',
                number: '8袋',
                deliveryNumber: '8袋',
                price: '140',
                getNumber: '0袋',
                differMoney: '0',
            }, {
                commodifyNumber: 'SKU000000002',
                commodifyName: '巴马火麻素食营养餐巴马特产冲食产品',
                number: '8袋',
                deliveryNumber: '8袋',
                price: '140',
                getNumber: '0袋',
                differMoney: '0',
            }],
            logisticsProviders: [
                '全部',
                '顺丰速递',
                'EMS',
                '圆通快递',
                '中通快递',
                '百世汇通',
                '韵达快递',
            ],
        }
        return (
            <div>
                <Tabs
                    defaultActiveKey="1"
                    onChange={this.handleTabsClick}
                    className={`${orderDT}`}
                    style={{marginTop: '16px'}}
                >
                    <TabPane tab="订单信息" key="1">
                        <OrderInformation initialData={initialData} />
                    </TabPane>
                    <TabPane tab="支付信息" key="2">
                        <PayInformation initialData={initialData} />
                    </TabPane>
                    <TabPane tab="配送信息" key="3">
                        <DistributionInformation initialData={initialData} />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

OrderManagementDetails.propTypes = {
    match: PropTypes.objectOf(PropTypes.any),

}

OrderManagementDetails.defaultProps = {
}

export default withRouter(Form.create()(OrderManagementDetails));
