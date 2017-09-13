/**
 * @file search.js
 * @author zhaozj
 *
 */
import Immutable from 'immutable';
import ActionType from '../actions/ActionType';

const initState = Immutable.fromJS({
    // 列表数据
    data: []
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.RECEIVE_STOREREALTIME_LIST:
            return state.set('data', action.payload);

        case ActionType.CLEAR_STOREREALTIME_LIST: {
            return state.set('data', []);
        }

        default:
            return state;
    }
}
