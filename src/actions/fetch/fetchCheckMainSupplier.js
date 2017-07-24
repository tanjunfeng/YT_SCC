/**
 * @file fetchEditorList.js
 *
 * @author Tanjunfeng
 *
 * 页面编辑数据列表
 */

import Promise from 'bluebird';
import { checkMainSupplier } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.CHECK_MAIN_SUPPLIER,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        checkMainSupplier(params)
            .then(res => {
                dispatch(receive(res.data));
                resolve(res.data)
            })
            .catch(err => {
                reject(err);
            })
    })
)
