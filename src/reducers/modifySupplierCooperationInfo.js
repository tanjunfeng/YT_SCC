/**
 * @file modifySupplierCooperationInfo.js
 * @author shijh
 *
 * 修改供应商合作信息
 */

import Promise from 'bluebird';
import { modifySupplierCooperationInfo } from '../service';
import ActionType from '../actions/ActionType';

const receive = (data) => ({
    type: ActionType.RECEIVE_CHANGE_COOPERATION_INFO,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        modifySupplierCooperationInfo(params)
            .then(res => {
                dispatch(receive(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)
