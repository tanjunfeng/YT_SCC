/**
 * @file fetchProviderEnterList.js
 * @author tanjf
 *
 * 供应商管理列表
 */

import Promise from 'bluebird';
import { fetchQueryManageList } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.QUERY_MANAGE_LIST,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchQueryManageList(params)
            .then(res => {
                dispatch(receive(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)
