/**
 * 商品管理-采购进价
 */

import { fromJS } from 'immutable';
import ActionType from '../actions/ActionType';

const initState = fromJS({
    purchasePriceInfo: null,
    isPurchaseVaild: false,
})

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.QUERY_PURCHASE_PRICE_INFO:
            return state.set('purchasePriceInfo', action.payload);
        case ActionType.IS_PURCHASE_VAILD:
            return state.set('isPurchaseVaild', action.payload);
        default:
            return state;
    }
}
