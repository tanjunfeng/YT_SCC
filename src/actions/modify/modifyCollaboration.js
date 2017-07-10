/**
 * @file modifyCollaboration.js
 * @author shijh
 *
 * 供应商是否终止合作
 */

import Promise from 'bluebird';
import { editSupplierStatus } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.MODIFY_SUPPLIER_COLLABORATION,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        const { status, id, ...data } = params;
        editSupplierStatus({status, id})
            .then(() => {
                resolve()
            })
            .catch(err => {
                reject(err);
            })
    })
)
