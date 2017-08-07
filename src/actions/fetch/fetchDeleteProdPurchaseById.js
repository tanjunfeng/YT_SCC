/**
 * @file fetchDeleteProdPurchaseById.js
 * @author Tanjunfeng
 *
 * 删除商品价格信息
 */

import Promise from 'bluebird';
import { fetchDeleteProdPurchaseById } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.DELETE_PROD_PRUCHASE_BYID,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchDeleteProdPurchaseById(params)
            .then(res => {
                dispatch(receive(res.data));
                resolve(res.data)
            })
            .catch(err => {
                reject(err);
            })
    })
)
