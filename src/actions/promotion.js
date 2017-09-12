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
    findCompanyBaseInfo as findCompaniesService
} from '../service';

/**
 * 促销活动列表 Action
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

/**
 * 清空促销活动列表
 */
export const clearPromotionList = () => dispatch => (dispatch({
    type: ActionType.CLEAR_PROMOTION_LIST,
    payload: []
}));

export const clearCompaniesList = () => dispatch => (dispatch({
    type: ActionType.CLEAR_ALL_COMPANIES,
    payload: []
}));
