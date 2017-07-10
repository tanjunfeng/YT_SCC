/**
 * @file fetchSupplierEditApply.js
 * @author shijh
 *
 * 供应商修改申请列表
 */

import Promise from 'bluebird';
import { fetchSupplierEditApply } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.RECEIVE_EDIT_APPLY_LIST,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchSupplierEditApply(params)
            .then(res => {
                dispatch(receive(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)
