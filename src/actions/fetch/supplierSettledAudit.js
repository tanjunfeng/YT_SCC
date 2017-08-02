/**
 * @file fetchCheckMainSupplier.js
 * @author Tanjunfeng
 *
 * 查看是否存在主供应商
 */

import Promise from 'bluebird';
import { supplierSettledAudit } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.SETTLED_AUDIT,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        supplierSettledAudit(params)
            .then(res => {
                dispatch(receive(res.success));
                resolve(res)
            })
            .catch(err => {
                reject(err);
            })
    })
)

