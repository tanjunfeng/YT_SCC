/**
 * @file addSupplier.js
 * @author shijh
 *
 */

import Immutable, { fromJS } from 'immutable';
import ActionType from '../actions/ActionType';

const data = {};
const initState = Immutable.fromJS({
    data: {},
    // 大地区数据
    largeRegin: [],
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.ADD_SUPPLIER_MESSAGE:
            Object.assign(data, action.payload)
            return state.set('data', Immutable.fromJS(data));

        case ActionType.RECEIVE_LARGER_REGIN:
            return state.set('largeRegin', fromJS(action.payload))

        default:
            return state;
    }
}
