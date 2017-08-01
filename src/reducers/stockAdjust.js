/**
 * @file stockAdjust.js
 * @author zhangbaihua
 *
 */
import Immutable from 'immutable';
import ActionType from '../actions/ActionType';

const initState = Immutable.fromJS({
    data: [],
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.STOCK_ADJUST_LIST:
            return state.set('data', action.payload);

        default:
            return state;
    }
}
