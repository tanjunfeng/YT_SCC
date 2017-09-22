/**
 * @file promotion.js
 *
 * @author taoqiyu
 * 促销活动管理相关 reducer
 */

import { fromJS } from 'immutable';
import ActionType from '../actions/ActionType';

const initState = fromJS({
    list: [],    // 管理列表
    couponsList: [],    // 优惠券列表
    participate: {}, // 参与数据显示列表
    participate2: {}, // 参与数据显示列表
    couParticipate: {}, // 优惠券-参与数据显示列表
    categories: [],  // 品类列表
    promotion: {},   // 促销详情
    couponsDetail: {}, // 优惠券详情
    franchiseeList: []  // 加盟供应商列表
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.FETCH_PROMOTION_LIST:
        case ActionType.CLEAR_PROMOTION_LIST:
            return state.set('list', fromJS(action.payload));
        case ActionType.FETCH_COUPONS_LIST:
        case ActionType.CLEAR_COUPONS_LIST:
            return state.set('couponsList', fromJS(action.payload));
        case ActionType.FETCH_FRANCHISEE_LIST:
        case ActionType.CLEAR_FRANCHISEE_LIST:
            return state.set('franchiseeList', fromJS(action.payload));
        case ActionType.FETCH_PATICIPATE_LIST:
        case ActionType.CLEAR_PATICIPATE_LIST:
            return state.set('participate', fromJS(action.payload));
        case ActionType.FETCH_PATICIPATETWO_LIST:
        case ActionType.CLEAR_PATICIPATETWO_LIST:
            return state.set('participate2', fromJS(action.payload));
        case ActionType.FETCH_COUPATICIPATE_LIST:
        case ActionType.CLEAR_COUPATICIPATE_LIST:
            return state.set('couParticipate', fromJS(action.payload));
        case ActionType.FETCH_CATEGORY_BY_PARENT:
        case ActionType.CLEAR_CATEGORIES:
            return state.set('categories', fromJS(action.payload));
        case ActionType.FETCH_PROMOTION_DETAIL:
        case ActionType.CLEAR_PROMOTION_DETAIL:
            return state.set('promotion', fromJS(action.payload));
        case ActionType.FETCH_COUPONS_DETAIL:
        case ActionType.CLEAR_COUPONS_DETAIL:
            return state.set('couponsDetail', fromJS(action.payload));
        default:
            return state;
    }
}
