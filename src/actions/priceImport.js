/**
 * @file priceImport.js
 * @author liujinyu
 *
 * 售价导入相关action
 */

import ActionType from './ActionType';

import {
    sellPriceChangeList,
    isSellVaild,
    createSell
} from '../service';

/**
 * 查询售价导入列表action
 */
const receivePriceImportList = (data) => ({
    type: ActionType.RECEIVE_PRICE_IMPORT_LIST,
    payload: data,
})

/**
 * 售价导入列表请求
 */
export const getPriceImportList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        sellPriceChangeList(params)
            .then(res => {
                dispatch(
                    receivePriceImportList(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

/**
 * 创建变价单是否可用action
 */
const receiveIsSellVaild = (data) => ({
    type: ActionType.RECEIVE_PRICE_IMPORT_SELL_VAILD,
    payload: data,
})

/**
 * 创建变价单是否可用请求
 */
export const getIsSellVaild = (params) => dispatch => (
    new Promise((resolve, reject) => {
        isSellVaild(params)
            .then(res => {
                dispatch(
                    receiveIsSellVaild(res)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

/**
 * 创建变价单action
 */
const receiveCreateSell = (data) => ({
    type: ActionType.RECEIVE_PRICE_IMPORT_CREATE_SELL,
    payload: data,
})

/**
 * 创建变价单
 */
export const getCreateSell = (params) => dispatch => (
    new Promise((resolve, reject) => {
        createSell(params)
            .then(res => {
                dispatch(
                    receiveCreateSell(res)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)
