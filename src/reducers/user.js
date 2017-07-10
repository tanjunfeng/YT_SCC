/**
 * @file userinfo.js
 * @author deo
 */

import Immutable from 'immutable';
import ActionType from '../actions/ActionType';

const initState = Immutable.fromJS({
    // 用户信息
    data: {},

    rights: {},
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.RECEIVE_USER: {
            return state.set('data', action.payload);
        }

        case ActionType.RECEIVE_RIGHTS: {
            return state.set('rights', action.payload);
        }

        default:
            return state;
    }
}
