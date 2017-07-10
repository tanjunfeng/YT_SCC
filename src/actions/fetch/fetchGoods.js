/**
 * @file fetchGoods.js
 *
 * @author shijh
 *
 * 获取商品分类
 */

import Promise from 'bluebird';
import { fetchFirstLevelCategorys, queryCategorys } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.RECEIVE_GOODS_LIST,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchFirstLevelCategorys(params)
            .then(res => {
                dispatch(receive(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)
