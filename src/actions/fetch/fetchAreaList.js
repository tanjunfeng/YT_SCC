/**
 * @file fetchAreaList.js
 *
 * @author shijh
 * 获取供应商区域action
 */

import Promise from 'bluebird';
import { fetchAreaList } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.RECEIVE_AREA_LIST,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchAreaList(params)
            .then(res => {
                dispatch(receive(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)
