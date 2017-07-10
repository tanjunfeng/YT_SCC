/**
 * @file insertSupplierSettlementInfo.js
 *
 * @author shijh
 * 审核入驻申请action
 */

import Promise from 'bluebird';
import { insertSupplierAuditInfo } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.RECEIVE_INSERT_SETTLEMENT_INFO,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        insertSupplierAuditInfo(params)
            .then(res => {
                dispatch(receive(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)
