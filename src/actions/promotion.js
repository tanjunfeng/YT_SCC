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
    findCompanyBaseInfo as findCompaniesService,
    queryCategoriesByParentId as findCategoriesService
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
 * 促销活动参与数据 Action
 */
const fetchParticipateListAction = (data) => ({
    type: ActionType.FETCH_PATICIPATE_LIST,
    payload: data
});

export const getParticipateList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        participateDataService(params)
            .then(res => {
                dispatch(
                    fetchParticipateListAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

const findCompaniesAction = (data) => ({
    type: ActionType.FIND_ALL_COMPANIES,
    payload: data
});

export const getAllCompanies = (params) => dispatch => (
    new Promise((resolve, reject) => {
        findCompaniesService(params)
            .then(res => {
                dispatch(
                    findCompaniesAction(res.data)
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
                    findCategoriedAction(res.data)
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

export const clearParticipateList = () => dispatch => (dispatch({
    type: ActionType.CLEAR_PATICIPATE_LIST,
    payload: []
}));

export const clearCompaniesList = () => dispatch => (dispatch({
    type: ActionType.CLEAR_ALL_COMPANIES,
    payload: []
}));
