/**
 * @file fetchGetProductById.js
 * @author Tanjunfeng
 *
 * 查询商品价格信息
 */

import Promise from 'bluebird';
import { getProductById } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.GET_PRODUCT_BY_ID,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        getProductById(params)
            .then(res => {
                console.log(res)
                dispatch(receive(res.data));
                resolve(res.data)
            })
            .catch(err => {
                console.log(err)
                reject(err);
            })
    })
)
