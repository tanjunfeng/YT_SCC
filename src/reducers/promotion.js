/**
 * @file promotion.js
 *
 * @author taoqiyu
 * 促销活动管理相关 reducer
 */

import { fromJS } from 'immutable';
import ActionType from '../actions/ActionType';

const initState = fromJS({
    list: []    // 促销活动管理列表
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.FETCH_PROMOTION_LIST:
            return state.set('list', fromJS(action.payload));
        default:
            return state;
    }
}
