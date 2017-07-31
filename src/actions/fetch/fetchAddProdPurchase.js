/**
 * @file fetchChangeSupType.js
 * @author Tanjunfeng
 *
 * 分类列表页商品排序管理
 */

import Promise from 'bluebird';
import { fetchAddProdPurchase } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.ADD_PROD_PURCHASE,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchAddProdPurchase(params)
            .then(res => {
                dispatch(receive(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)
