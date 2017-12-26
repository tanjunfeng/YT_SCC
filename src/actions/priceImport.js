/**
 * @file priceImport.js
 * @author liujinyu
 *
 * 售价导入相关action
 */

import ActionType from './ActionType';

import {
    sellPriceChangeList
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
