/**
 * @file fetchGoods.js
 *
 * @author shijh
 *
 * 获取商品分类
 */

import Promise from 'bluebird';
import { fetchShelfProductsByLike } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.RECEIVE_SELF_PRODUCT_LIST,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchShelfProductsByLike(params)
            .then(res => {
                dispatch(receive(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)
