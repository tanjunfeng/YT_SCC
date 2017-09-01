/**
 * @file stockAdjust.js
 * @author zhangbaihua
 *
 */

import Promise from 'bluebird';
import { queryAdjustLibList } from '../service';
import ActionType from './ActionType';

const stockAdjust = (data) => ({
    type: ActionType.STOCK_ADJUST_LIST,
    payload: data,
});

export default () => dispatch => (
    new Promise((resolve, reject) => {
        queryAdjustLibList()
            .then(res => {
                dispatch(stockAdjust(res));
            })
            .catch(err => {
                reject(err);
            })
    })
)
