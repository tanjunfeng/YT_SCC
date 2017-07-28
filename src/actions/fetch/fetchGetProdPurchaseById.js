/**
 * @file fetchGetProdPurchaseById.js
 * @author Tanjunfeng
 *
 * 查询商品价格信息
 */

import Promise from 'bluebird';
import { getProdPurchaseById } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.GET_PRODPURCHASE_BYID,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        getProdPurchaseById(params)
            .then(res => {
                dispatch(receive(res.data));
                resolve(res.data)
            })
            .catch(err => {
                reject(err);
            })
    })
)
