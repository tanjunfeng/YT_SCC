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
    region: [],
    categorys: [],
    // 所选区域列表
    companies: [],
    // 值列表数据
    valueList: [],
    categorysById: [],
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

        case ActionType.RECEIVE_NEXT_CATEGORYS:
            return state.set('region', action.payload);

        case ActionType.RECEIVE_All_CATEGORYS: {
            return state.set('categorys', action.payload);
        }

        case ActionType.RECEIVE_CATEGORYS_BY_ID: {
            return state.set('categorysById', action.payload)
        }

        case ActionType.RECEIVE_VALUES_LIST: {
            return state.set('valueList', Immutable.fromJS(action.payload));
        }

        case ActionType.FIND_ALL_COMPANIES:
        case ActionType.CLEAR_ALL_COMPANIES:
            return state.set('companies', Immutable.fromJS(action.payload));

        default:
            return state;
    }
}
