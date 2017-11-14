/**
 * @file salesManagement.js
 * @author liujinyu
 *
 */
import Immutable from 'immutable';
import ActionType from '../actions/ActionType';

const initState = Immutable.fromJS({
    data: null,
    detail: {},
    exchangeList: {}
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.RECEIVE_RETURN_GOODS_LIST:
            return state.set('data', action.payload);
        case ActionType.RETURN_GOODS_DETAIL:
            return state.set('detail', action.payload);
        case ActionType.RETURN_GOODS_DETAIL_CLEAR_DATA:
            return state.set('detail', {});
        default:
            return state;
    }
}

