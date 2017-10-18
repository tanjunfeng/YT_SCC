/**
 * @file syncProductByManual.js
 * @author tanjf
 *
 * 根据商品id同步商品
 */

import Promise from 'bluebird';
import { syncProductByManualService } from '../service';
import ActionType from './ActionType';

const syncProductByManual = (data) => ({
    type: ActionType.SYNC_PRODUCT_BY_MANUAL,
    payload: data
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        syncProductByManualService(params)
        .then(res => {
            dispatch(
                syncProductByManual(res.data)
            );
            resolve(res);
        })
        .catch(err => reject(err))
    })
)
