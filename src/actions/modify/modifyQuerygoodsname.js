/**
 * @file mpdifyUpDateCategory.js
 * @author Tanjunfeng
 *
 * 通过商品编号获取商品名称
 */

import Promise from 'bluebird';
import { fetchQuerygoodsname } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.QUERY_GOODS_NAME,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchQuerygoodsname(params)
            .then(res => {
                dispatch(receive(res.data));
                // resolve(res.data);
            })
            .catch(err => {
                reject(err);
            })
    })
)
