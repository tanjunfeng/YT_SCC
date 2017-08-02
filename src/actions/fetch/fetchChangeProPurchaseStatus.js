/**
 * @file fetchChangeSupType.js
 * @author Tanjunfeng
 *
 * 分类列表页商品排序管理
 */

import Promise from 'bluebird';
import { changeProPurchaseStatus } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.CHANGE_PROPUR_CHASE_STATUS,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        changeProPurchaseStatus(params)
            .then(res => {
                dispatch(receive(res.data));
                resolve(res.data)
            })
            .catch(err => {
                reject(err);
            })
    })
)
