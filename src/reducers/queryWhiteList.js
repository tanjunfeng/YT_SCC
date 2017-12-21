/**
 * @file queryWhiteList.js
 *
 * @author tanjf
 * 根据条件分页查询白名单列表
 */

import { fromJS } from 'immutable';
import ActionType from '../actions/ActionType';

const initState = fromJS({
    // 根据条件分页查询白名单列表
    data: {},
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.QUERY_WHITE_LIST:
            return state.set('data', action.payload);
        default:
            return state;
    }
}
