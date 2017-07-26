/**
 * @file fetchEditBeforeAfter.js
 *
 * @author Tanjunfeng
 *
 * 查询供应商修改前修改后的信息
 */

import Promise from 'bluebird';
import { editBeforeAfter } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.EDIT_BEFORE_AFTER,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        editBeforeAfter(params)
            .then(res => {
                dispatch(receive(res.data));
                resolve(res.data)
            })
            .catch(err => {
                reject(err);
            })
    })
)
