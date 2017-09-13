/**
 * @file stockListDetail.js
 * @author zhangbaihua
 *
 */

import Promise from 'bluebird';
import { queryAdjustDetail } from '../service';
import ActionType from './ActionType';

const adjustDetail = (data) => ({
    type: ActionType.STOCK_ADJUST_LIST_CB_DETAIL,
    payload: data,
});

export default (data) => dispatch => (
    new Promise((resolve, reject) => {
        queryAdjustDetail(data)
        .then(res => {
            dispatch(adjustDetail(res));
        })
        .catch(err => {
            reject(err);
        })
    })
)
