/**
 * @file supplier.js
 * @author shijh
 *
 * 供应商相关action
 */

import ActionType from './ActionType';

import { queryProviderDetail } from '../service';

const receiveDetail = (data) => ({
    type: ActionType.RECEIVE_SUPPLIER_DETAIL,
    payload: data,
})

export const getSupplierDetail = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryProviderDetail(params)
            .then(res => {
                dispatch(
                    receiveDetail(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)
