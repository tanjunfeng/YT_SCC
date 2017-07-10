/**
 * @file fetchApplication.js
 *
 * @author shijh
 * 获取供应商区域action
 */

import Promise from 'bluebird';
import { fetchApplicationList } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.RECEIVE_APPLICATION_LIST,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchApplicationList(params)
            .then(res => {
                dispatch(receive(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)
