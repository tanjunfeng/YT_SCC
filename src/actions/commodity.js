/**
 * @file supplier.js
 * @author shijh
 *
 * 供应商相关action
 */

import ActionType from './ActionType';

import {
    addStepSellPrice,
    updateStepSellPrice,
    updateSellPriceStatus,
    getSellPriceInfoByIdAction as getSellPriceInfoByIdService,
    getCostPrice as getCostPriceService,
    queryGoodsSitesManageList
} from '../service';

/**
 * 供应商详情action
 */
const receiveAddPrice = (data) => ({
    type: ActionType.RECEIVE_ADD_PRICE,
    payload: data,
})

/**
 * 新增销售价格
 * @param {Object} params 传参
 */
export const postSellPrice = (params) => dispatch => (
    new Promise((resolve, reject) => {
        addStepSellPrice(params)
            .then(res => {
                dispatch(
                    receiveAddPrice(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

const receiveUpdateSellPrice = (data) => ({
    type: ActionType.RECEIVE_UPDATE_PRICE,
    payload: data,
})

/**
 * 编辑销售价格
 * @param {Object} params 传参
 */
export const updateSellPrice = (params) => dispatch => (
    new Promise((resolve, reject) => {
        updateStepSellPrice(params)
            .then(res => {
                dispatch(
                    receiveUpdateSellPrice(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

/**
 * 跳转到修改页面
 * @param {Object} params 传参
 */

const receiveGetSellPriceInfoById = (data) => ({
    type: ActionType.RECEIVE_GET_SELL_PRICE,
    payload: data
});

export const getSellPriceInfoByIdAction = (params) => dispatch => (
    new Promise((resolve, reject) => {
        getSellPriceInfoByIdService(params)
            .then(res => {
                dispatch(
                    receiveGetSellPriceInfoById(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 价格起停用
 */
export const updatePriceStatus = (params) => dispatch => (
    new Promise((resolve, reject) => {
        updateSellPriceStatus(params)
            .then(res => {
                dispatch(
                    receiveAddPrice(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

/**
 * 获取成本价
 *
 * @param {Object} params 传参
 */
const getCostPriceAction = data => ({
    type: ActionType.GET_COST_PRICE,
    payload: data
});

export const getCostPrice = params => dispatch => (
    new Promise((resolve, reject) => {
        getCostPriceService(params)
            .then(res => {
                dispatch(
                    getCostPriceAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

export const clearCostPrice = () => dispatch => (dispatch({
    type: ActionType.CLEAR_COST_PRICE,
    payload: null
}));

/**
 * 商品地点关系列表
 *
 * @param {Object} params 传参
 */
const getSitesManageListAction = data => ({
    type: ActionType.RECEIVE_SITES_MANAGE_LIST,
    payload: data
});

export const getSitesManageList = params => dispatch => (
    new Promise((resolve, reject) => {
        queryGoodsSitesManageList(params)
            .then(res => {
                dispatch(getSitesManageListAction(res.data));
            })
            .catch(err => reject(err))
    }));
