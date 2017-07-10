/**
 * @file modifySupplierFrozen.js
 * @author shijh
 *
 * 供应商冻结状态
 */

import Promise from 'bluebird';
import { editSupplierStatus } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.MODIFY_SUPPLIER_FROZEN,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        const { status, id, ...data } = params;
        editSupplierStatus({status, id})
            .then(() => {
                resolve();
            })
            .catch(err => {
                reject(err);
            })
    })
)
