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
    dictionaryVisible:false,

    // 查询字典分页列表
    dictionaryData: {},

    // 显示字典内容
    contentlistData: {},
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.RECEIVE_DICTIONARY_LIST:
            return state.set('dictionaryData', action.payload);
        case ActionType.RECEIVE_DICTIONARY_CONTENTLIST:
            return state.set('contentlistData', action.payload);
        // 新增销售价格弹窗
        case ActionType.MODIFY_DICTIONARY_VISIBLE: {
            return state.set('dictionaryVisible', action.payload);
        }
        default:
            return state;
    }
}
