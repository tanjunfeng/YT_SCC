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
    promotionParticipate: {}, // 下单打折-参与数据
    usedCouponParticipate: {}, // 优惠券-参与数据-已使用
    unUsedCouponParticipate: {}, // 优惠券-参与数据-未使用
    categories: [],  // 品类列表
    promotionDetail: {},   // 促销详情
    couponsDetail: {}, // 优惠券详情
    franchiseeList: {},  // 加盟供应商列表
    garbageCouponParticipate: {}  // 作废记录
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.FETCH_PROMOTION_LIST:
        case ActionType.CLEAR_PROMOTION_LIST:
            return state.set('list', fromJS(action.payload));
        case ActionType.FETCH_COUPONS_LIST:
        case ActionType.CLEAR_COUPONS_LIST:
        case ActionType.FETCHA_ALIVE_COUPONS_LIST:
            return state.set('couponsList', fromJS(action.payload));
        case ActionType.FETCH_FRANCHISEE_LIST:
        case ActionType.CLEAR_FRANCHISEE_LIST:
            return state.set('franchiseeList', fromJS(action.payload));
        case ActionType.FETCH_PROMOTION_PATICIPATE_LIST:
        case ActionType.CLEAR_PROMOTION_PATICIPATE_LIST:
            return state.set('promotionParticipate', fromJS(action.payload));
        case ActionType.FETCH_USED_COUPON_PATICIPATE_LIST:
        case ActionType.CLEAR_USED_COUPON_PATICIPATE_LIST:
            return state.set('usedCouponParticipate', fromJS(action.payload));
        case ActionType.FETCH_UN_USED_COUPON_PATICIPATE_LIST:
        case ActionType.CLEAR_UN_USED_COUPON_PATICIPATE_LIST:
            return state.set('unUsedCouponParticipate', fromJS(action.payload));
        case ActionType.INVALID_RECORD:
        case ActionType.CLEAR_INVALID_RECORD:
            return state.set('garbageCouponParticipate', fromJS(action.payload));
        case ActionType.FETCH_CATEGORY_BY_PARENT:
        case ActionType.CLEAR_CATEGORIES:
            return state.set('categories', fromJS(action.payload));
        case ActionType.FETCH_PROMOTION_DETAIL:
        case ActionType.CLEAR_PROMOTION_DETAIL:
            return state.set('promotionDetail', fromJS(action.payload));
        case ActionType.FETCH_COUPONS_DETAIL:
        case ActionType.CLEAR_COUPONS_DETAIL:
            return state.set('couponsDetail', fromJS(action.payload));
        default:
            return state;
    }
}
