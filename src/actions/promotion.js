/**
 * @file promotion.js
 * @author taoqiyu
 *
 * 促销活动action
 */
import ActionType from './ActionType';
import {
    fetchPromotionList as promotionListService,
    createPromotion as createPromotionService,
    fetchPromotionDetail as fetchPromotionDetailService,
    updatePromotionStatus as updatePromotionStatusService,
    queryCategoriesByParentId as findCategoriesService,
    createCoupons as createCouponsActionService,
    queryCouponsList as queryCouponsListService,
    queryAliveCouponsList as queryAliveCouponsListService,
    queryFranchiseeList as queryFranchiseeListService,
    getCouponsDetail as fetchCouponsDetailService,
    fetchUsedCouponParticipate as fetchUsedCouponParticipateService,
    fetchUnUsedCouponParticipate as fetchUnUsedCouponParticipateService,
    fetchPromotionParticipateData as fetchPromotionParticipateDataService,
    grantCoupon as grantCouponService,
    garbageCouponParticipate as invalidRecordService,
    cancelCoupons as cancelCouponsService,
} from '../service';

/**
 * 促销活动-下单打折 Action
 */
const fetchPromotionListAction = (data) => ({
    type: ActionType.FETCH_PROMOTION_LIST,
    payload: data
});

export const getPromotionList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        promotionListService(params)
            .then(res => {
                dispatch(
                    fetchPromotionListAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 下单打折参与数据 Action
 */
const fetchParticipateDataAction = (data) => ({
    type: ActionType.FETCH_PROMOTION_PATICIPATE_LIST,
    payload: data
});

export const getPromotionParticipate = (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchPromotionParticipateDataService(params)
            .then(res => {
                dispatch(
                    fetchParticipateDataAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 优惠券参与数据-已使用 Action
 */
const fetchUsedCouponParticipateAction = (data) => ({
    type: ActionType.FETCH_USED_COUPON_PATICIPATE_LIST,
    payload: data
});

export const getUsedCouponParticipate = (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchUsedCouponParticipateService(params)
            .then(res => {
                dispatch(
                    fetchUsedCouponParticipateAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 优惠券参与数据-未使用 Action
 */
const fetchUnUsedCouponParticipateAction = (data) => ({
    type: ActionType.FETCH_UN_USED_COUPON_PATICIPATE_LIST,
    payload: data
});

export const getUnUsedCouponParticipate = (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchUnUsedCouponParticipateService({ ...params, queryType: 1 })
            .then(res => {
                dispatch(
                    fetchUnUsedCouponParticipateAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 优惠券参与数据-已作废 Action
 */
const fetchGarbageCouponParticipateAction = (data) => ({
    type: ActionType.FETCH_GARBAGE_COUPON_PATICIPATE_LIST,
    payload: data
});

export const getGarbageCouponParticipate = (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchUnUsedCouponParticipateService({ ...params, queryType: 2 })
            .then(res => {
                dispatch(
                    fetchGarbageCouponParticipateAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 优惠券参与数据-作废记录 Action
 */
const invalidRecordAction = (data) => ({
    type: ActionType.FETCH_GARBAGE_COUPON_PATICIPATE_LIST,
    payload: data
});

export const garbageCouponParticipate = (params) => dispatch => (
    new Promise((resolve, reject) => {
        invalidRecordService(params)
            .then(res => {
                dispatch(
                    invalidRecordAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

const findCategoriedAction = (data) => ({
    type: ActionType.FETCH_CATEGORY_BY_PARENT,
    payload: data
});

export const getCategoriesByParentId = (params) => dispatch => (
    new Promise((resolve, reject) => {
        findCategoriesService(params)
            .then(res => {
                dispatch(
                    findCategoriedAction(res)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

export const clearCategoriesList = () => dispatch => (dispatch({
    type: ActionType.CLEAR_CATEGORIES,
    payload: []
}));

const createPromotionAction = (data) => ({
    type: ActionType.CREATE_PROMOTION,
    payload: data
});

export const createPromotion = (params) => dispatch => (
    new Promise((resolve, reject) => {
        createPromotionService(params)
            .then(res => {
                dispatch(
                    createPromotionAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err));
    })
);

// 优惠券
const createCouponsAction = (data) => ({
    type: ActionType.CREATE_COUPONS,
    payload: data
});

export const createCoupons = (params) => dispatch => (
    new Promise((resolve, reject) => {
        createCouponsActionService(params)
            .then(res => {
                dispatch(
                    createCouponsAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err));
    })
);

// 优惠券
const queryCouponsListAction = (data) => ({
    type: ActionType.FETCH_COUPONS_LIST,
    payload: data
});

export const queryCouponsList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryCouponsListService(params)
            .then(res => {
                dispatch(
                    queryCouponsListAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err));
    })
);

// 查询可发放的优惠券
const queryAliveCouponsListAction = (data) => ({
    type: ActionType.FETCHA_ALIVE_COUPONS_LIST,
    payload: data
});

export const queryAliveCouponsList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryAliveCouponsListService(params)
            .then(res => {
                dispatch(
                    queryAliveCouponsListAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err));
    })
);

// 查询加盟商列表
const queryFranchiseeListAction = (data) => ({
    type: ActionType.FETCH_FRANCHISEE_LIST,
    payload: data
});

export const queryFranchiseeList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryFranchiseeListService(params)
            .then(res => {
                dispatch(
                    queryFranchiseeListAction(res.data)
                );
                resolve(res);
            })
            .catch(err => {
                if (err.code === 10006) {
                    dispatch(
                        queryFranchiseeListAction(err.data)
                    )
                } else reject(err);
            });
    })
);

const fetchPromotionDetailAction = (data) => ({
    type: ActionType.FETCH_PROMOTION_DETAIL,
    payload: data
});

export const getPromotionDetail = (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchPromotionDetailService(params)
            .then(res => {
                dispatch(
                    fetchPromotionDetailAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err));
    })
);

// 新增促销活动 - 优惠券详情
const fetchCouponsDetailAction = (data) => ({
    type: ActionType.FETCH_COUPONS_DETAIL,
    payload: data
});

export const getCouponsDetail = (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchCouponsDetailService(params)
            .then(res => {
                dispatch(
                    fetchCouponsDetailAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err));
    })
);

// 发放优惠券
const grantCouponAction = (data) => ({
    type: ActionType.GRANT_COUPON,
    payload: data
});

export const grantCoupon = (params) => dispatch => (
    new Promise((resolve, reject) => {
        grantCouponService(params)
            .then(res => {
                dispatch(
                    grantCouponAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err));
    })
);

export const clearCouponsDetail = () => dispatch => (dispatch({
    type: ActionType.CLEAR_COUPONS_DETAIL,
    payload: []
}));

export const clearPromotionDetail = () => dispatch => (dispatch({
    type: ActionType.CLEAR_PROMOTION_DETAIL,
    payload: []
}));


const updatePromotionAction = (data) => ({
    type: ActionType.UPDATE_PROMOTION_STATUS,
    payload: data
});

export const updatePromotionStatus = (params) => dispatch => (
    new Promise((resolve, reject) => {
        updatePromotionStatusService(params)
            .then(res => {
                dispatch(
                    updatePromotionAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err));
    })
);

const cancelCouponsAction = (data) => ({
    type: ActionType.CANCEL_COUPONS,
    payload: data
});

export const cancelCoupons = (params) => dispatch => (
    new Promise((resolve, reject) => {
        cancelCouponsService(params)
            .then(res => {
                dispatch(
                    cancelCouponsAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err));
    })
);

/**
 * 清空促销活动列表
 */
export const clearPromotionList = () => dispatch => (dispatch({
    type: ActionType.CLEAR_PROMOTION_LIST,
    payload: []
}));

/**
 * 清空优惠券列表
 */
export const clearCouponsList = () => dispatch => (dispatch({
    type: ActionType.CLEAR_COUPONS_LIST,
    payload: []
}));

export const clearPromotionParticipate = () => dispatch => (dispatch({
    type: ActionType.CLEAR_PROMOTION_PATICIPATE_LIST,
    payload: {}
}));

export const clearUsedCouponPatipate = () => dispatch => (dispatch({
    type: ActionType.CLEAR_USED_COUPON_PATICIPATE_LIST,
    payload: {}
}));

export const clearUnUsedCouponPatipate = () => dispatch => (dispatch({
    type: ActionType.CLEAR_UN_USED_COUPON_PATICIPATE_LIST,
    payload: {}
}));

export const clearGarbageCouponPatipate = () => dispatch => (dispatch({
    type: ActionType.CLEAR_GARBAGE_COUPON_PATICIPATE_LIST,
    payload: {}
}));

export const clearCompaniesList = () => dispatch => (dispatch({
    type: ActionType.CLEAR_ALL_COMPANIES,
    payload: []
}));

export const clearFranchiseeList = () => dispatch => (dispatch({
    type: ActionType.CLEAR_FRANCHISEE_LIST,
    payload: []
}));
