/**
 * @file pub.js
 * @author denglingbo
 *
 */

import Immutable from 'immutable';
import ActionType from '../actions/ActionType';

const gegion = []
const initState = Immutable.fromJS({
    // 导航是否收拢
    collapsed: false,
    gegion: [],
    categorys: []
});

export default (state = initState, action) => {
    switch (action.type) {
        case ActionType.PUB_COLLAPSED:
            return state.set('collapsed', action.payload);

        case ActionType.PUB_GET_REGION: {
            const { type, data, parentCode } = action.payload;
            gegion[type] = gegion[type] ? gegion[type] : {};
            gegion[type][parentCode] = data;
            return initState.set('gegion', Immutable.fromJS(gegion));
        }

        case ActionType.RECEIVE_All_CATEGORYS: {
            return state.set('categorys', action.payload)
        }

        default:
            return state;
    }
}
