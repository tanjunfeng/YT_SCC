/**
 * @file supplier.js
 * @author shijh, denglingbo
 * 
 * 商品管理 reducer
 */

import Immutable from 'immutable';
import ActionType from '../actions/ActionType';

const initState = Immutable.fromJS({

    data: {},

    // 弹出框数据
    visibleData: {},
    dictionaryVisible: false,
    maintenanceVisible: false,
    // 是否是编辑
    isEdit: false,

    // 查询字典分页列表
    dictionaryData: {},

    // 查询显示字典维护内容列表
    contentlistData: {},
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.RECEIVE_DICTIONARY_LIST:
            return state.set('dictionaryData', action.payload);
        case ActionType.RECEIVE_DICTIONARY_CONTENTLIST:
            return state.set('contentlistData', action.payload);
        // 新增/修改字典内容弹窗
        case ActionType.MODIFY_DICTIONARY_VISIBLE: {
            const { isVisible, isEdit } = action.payload;
            return state
                .set('dictionaryVisible', isVisible)
                .set('isEdit', isEdit)
                ;
        }
        // 维护字典内容
        case ActionType.MAINTENANCE_DICTIONARY_VISIBLE: {
            const { isVisible, id } = action.payload;
            return state
                .set('maintenanceVisible', isVisible)
                .set('id', id)
                ;
        }
        default:
            return state;
    }
}
