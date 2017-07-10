/**
 * @file mpdifyUpDateCategory.js
 * @author Tanjunfeng
 *
 * 新增静态页
 */

import Promise from 'bluebird';
import { insertstaticpage } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.PRODUCT_TO_ADD_MANAGEMENT,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        insertstaticpage(params)
            .then(res => {
                dispatch(receive(res.data));
                resolve();
            })
            .catch(err => {
                reject(err);
            })
    })
)
