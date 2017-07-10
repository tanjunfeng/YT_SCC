/**
 * @file addSupplier.js
 * @author shijh
 *
 */

import Immutable from 'immutable';
import ActionType from '../actions/ActionType';

const data = {};
const initState = Immutable.fromJS({
    data: {}
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.ADD_SUPPLIER_MESSAGE:
            Object.assign(data, action.payload)
            return state.set('data', Immutable.fromJS(data));

        default:
            return state;
    }
}
