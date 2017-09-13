/**
 * @file promotion.js
 *
 * @author taoqiyu
 * 促销活动管理相关 reducer
 */

import { fromJS } from 'immutable';
import ActionType from '../actions/ActionType';

const initState = fromJS({
    list: [],    // 促销活动管理列表
    categories: [],  // 品类列表
    companies: [],   // 所选区域列表
    promotion: {}   // 促销详情
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.FETCH_PROMOTION_LIST:
        case ActionType.CLEAR_PROMOTION_LIST:
            return state.set('list', fromJS(action.payload));
        case ActionType.FIND_ALL_COMPANIES:
        case ActionType.CLEAR_ALL_COMPANIES:
            return state.set('companies', fromJS(action.payload));
        case ActionType.FETCH_CATEGORY_BY_PARENT:
        case ActionType.CLEAR_CATEGORIES:
            return state.set('categories', fromJS(action.payload));
        case ActionType.FETCH_PROMOTION_DETAIL:
            return state.set('promotion', fromJS(action.payload));
        default:
            return state;
    }
}
