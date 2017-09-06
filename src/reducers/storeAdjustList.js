/**
 * @file storeAdjustList.js
 * @author wtt
 *
 * 库存调整 reducer
 */

import Immutable from 'immutable';
import ActionType from '../actions/ActionType';

const initState = Immutable.fromJS({
    // 库存调整列表数据
    storeAdjustData: {},
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.RECEIVE_STORE_ADJUST_LIST:
            return state.set('storeAdjustData', action.payload);
        default:
            return state;
    }
}
