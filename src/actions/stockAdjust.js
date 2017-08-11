/**
 * @file stockAdjust.js
 * @author zhangbaihua
 *
 */

import { queryAdjustLibList } from '../service';
import ActionType from './ActionType';
import Promise from 'bluebird';

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
