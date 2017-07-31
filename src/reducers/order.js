/**
 * @file order.js
 *
 * @author caoyanxuan
 * 订单管理相关reducer
 */

import { fromJS } from 'immutable';
import ActionType from '../actions/ActionType';

const initState = fromJS({
    auditModalVisible: false,
    visibleData: {},
    recordData: {},
    initialData: {
        orderNumber: 'YT000999',
        parentOrderNumber: 'XXXXXXXXX',
        orderType: '正常销售',
        orderStatus: '待审核',
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
        deliveryDate: '1500876718',
        logisticsNumber: 'YT00000999',
        willArrivalDate: '1500876718',
        deliverier: '张三',
        contact: '186XXX26940',
        commodifyNumber: '24',
        commifyTotalMoney: '3257.5',
        unit: '袋',

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
            payOperateDate: '1500876718',
            operation: 0
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
            payOperateDate: '1500876718',
            operation: 1
        }, {
            payNumber: '3',
            payType: '付款',
            payDate: '1500876718',
            payMoney: '140.00',
            payWay: '微信',
            payPromiseNum: '支付流水000000000001',
            refundCause: '取消订单',
            payNote: 'XXXXXXXXXX',
            payOperater: '张三',
            payOperateDate: '1500876718',
            operation: 2
        }],
        payInfoFooter: {
            totalMoney: 140,
            payMoney: 140,
            refungMoney: 140,
            differMoney: 0,
        },
        // ********************************
        distributionInfo: [{
            commodifyNumber: 'SKU000000001',
            commodifyName: '巴马火麻素食营养餐巴马特产冲食产品',
            number: 8,
            deliveryNumber: 8,
            price: 100,
            getNumber: 0,
            differMoney: 800,
        }, {
            commodifyNumber: 'SKU000000002',
            commodifyName: '巴马火麻素食营养餐巴马特产冲食产品',
            number: 8,
            deliveryNumber: 8,
            price: 50,
            getNumber: 0,
            differMoney: 400,
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
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.MODIFY_AUDIT_MODAL_VISIBLE: {
            const { isVisible, record } = action.payload;
            return state.set('auditModalVisible', isVisible).set('visibleData', record);
        }

        case ActionType.MODIFY_DISTRIBUTION_COLUMNS: {
            const { index, value, witchInput } = action.payload;
            const { initialData } = state.toJS();
            const item = initialData.distributionInfo[index];
            if (witchInput === 'deliveryNumber') {
                item.deliveryNumber = value
                if (value < item.getNumber) {
                    item.getNumber = value
                }
            } else {
                item.getNumber = value
            }
            item.differMoney =
            (item.deliveryNumber - item.getNumber) * item.price;

            return state.set('initialData', fromJS(initialData));
        }

        default:
            return state;
    }
}
