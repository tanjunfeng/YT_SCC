/**
 * @file order.js
 *
 * @author caoyanxuan
 * 订单管理相关reducer
 */

import { fromJS } from 'immutable';
import ActionType from '../actions/ActionType';

const initState = fromJS({
    causeModalVisible: false,
    payAuditModalVisible: false,
    recordData: {},
    chooseData: [],
    orderListData: {},
    causeRecordId: null,
    orderDetailData: {},
    paymentDetailData: {},
    shippingDetailData: {},
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.MODIFY_CAUSE_MODAL_VISIBLE: {
            const { isShow, choose, id, record, isVisible } = action.payload;
            return state.set('causeModalVisible', isShow)
            .set('payAuditModalVisible', isVisible)
            .set('chooseData', choose)
            .set('causeRecordId', id)
            .set('recordData', record);
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

        case ActionType.FETCH_ORDER_LIST: {
            return state.set('orderListData', fromJS(action.payload));
        }

        case ActionType.FETCH_ORDER_DETAIL: {
            return state.set('orderDetailData', fromJS(action.payload));
        }

        case ActionType.FETCH_PAYMENT_DETAIL: {
            return state.set('paymentDetailData', fromJS(action.payload));
        }

        case ActionType.FETCH_SHIPPING_DETAIL: {
            return state.set('shippingDetailData', fromJS(action.payload));
        }

        default:
            return state;
    }
}
