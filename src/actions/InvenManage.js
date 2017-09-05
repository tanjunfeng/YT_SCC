/**
 * @file InvenManage.js
 * @author shijh
 *
 * 库存管理action
 */

import Promise from 'bluebird';
import ActionType from './ActionType';
import {
    getImadJustMent,
} from '../service';

/**
 * 库存管理action
 */
const receiveDetail = (data) => ({
    type: ActionType.STOCK_ADJUST_LIST,
    payload: data,
})

export const getImadJustMentList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        getImadJustMent(params)
            .then(res => {
                dispatch(
                    receiveDetail(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)
