/**
 * @file fetchProviderEnterList.js
 *
 * @author shijh
 * 获取供应商区域action
 */

import Promise from 'bluebird';
import { querySettledList } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.QUERY_SETTLED_LIST,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        querySettledList(params)
            .then(res => {
                dispatch(receive(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)
