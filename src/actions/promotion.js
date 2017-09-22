/**
 * @file promotion.js
 * @author taoqiyu
 *
 * 促销活动action
 */
import ActionType from './ActionType';
import {
    fetchPromotionList as promotionListService,
    fetchParticipateData as participateDataService,
    createPromotion as createPromotionService,
    fetchPromotionDetail as fetchPromotionDetailService,
    updatePromotionStatus as updatePromotionStatusService,
    queryCategoriesByParentId as findCategoriesService,
    createCoupons as createCouponsActionService,
    queryCouponsList as queryCouponsListService,
    queryFranchiseeList as queryFranchiseeListService,
    getCouponsDetail as fetchCouponsDetailService,
    getParticipate2 as participateData2Service
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
 * 促销活动参与数据1 Action
 */
const fetchParticipateData = (data) => ({
    type: ActionType.FETCH_PATICIPATE_LIST,
    payload: data
});

export const getParticipate = (params) => dispatch => (
    new Promise((resolve, reject) => {
        participateDataService(params)
            .then(res => {
                dispatch(
                    fetchParticipateData(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 促销活动参与数据2 Action
 */
const fetchParticipateData2 = (data) => ({
    type: ActionType.FETCH_PATICIPATETWO_LIST,
    payload: data
});

export const getParticipate2 = (params) => dispatch => (
    new Promise((resolve, reject) => {
        participateData2Service(params)
            .then(res => {
                dispatch(
                    fetchParticipateData2(res.data)
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
            .catch(err => reject(err));
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

export const clearParticipate = () => dispatch => (dispatch({
    type: ActionType.CLEAR_PATICIPATE_LIST,
    payload: {}
}));

export const clearCouParticipate = () => dispatch => (dispatch({
    type: ActionType.CLEAR_COUPATICIPATE_LIST,
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
