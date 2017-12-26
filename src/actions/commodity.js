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
