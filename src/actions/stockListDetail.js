/**
 * @file stockListDetail.js
 * @author zhangbaihua
 *
 */

import { queryAdjustDetail } from '../service';
import ActionType from './ActionType';
import Promise from 'bluebird';

const adjustDetail = (data) => ({
    type: ActionType.STOCK_ADJUST_LIST_DETAIL,
    payload: data,
});

export default () => dispatch => (
    new Promise((resolve, reject) => {
        queryAdjustDetail()
            .then(res => {
                dispatch(adjustDetail(res));
            })
            .catch(err => {
                reject(err);
            })
    })
)
