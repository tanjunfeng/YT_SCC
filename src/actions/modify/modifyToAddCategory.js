/**
 * @file mpdifyUpDateCategory.js
 * @author Tanjunfeng
 *
 * 新增分类商品排序
 */

import Promise from 'bluebird';
import { fetchInsertCategoryGoodsOrder } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.PRODUCT_TO_ADD_CATEGORY,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchInsertCategoryGoodsOrder(params)
            .then(res => {
                dispatch(receive(res.data));
                resolve();
            })
            .catch(err => {
                reject(err);
            })
    })
)
