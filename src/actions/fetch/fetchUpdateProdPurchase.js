/**
 * @file fetchUpdateProdPurchase.js
 * @author Tanjunfeng
 *
 * 更新商品采购关系
 */

import Promise from 'bluebird';
import { updateProdPurchase } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.UPDATE_PROD_PURCHASE,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        updateProdPurchase(params)
            .then(res => {
                dispatch(receive(res.success));
                resolve(res)
            })
            .catch(err => {
                reject(err);
            })
    })
)
