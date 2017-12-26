/**
 * 商品管理-采购进价
 */

import { fromJS } from 'immutable';
import ActionType from '../actions/ActionType';

const initState = fromJS({
    purchasePriceInfo: null,
})

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.QUERY_PURCHASE_PRICE_INFO:
            return state.set('purchasePriceInfo', action.payload);
        default:
            return state;
    }
}
