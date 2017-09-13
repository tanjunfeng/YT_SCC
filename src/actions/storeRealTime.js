/**
 * @file storeRealTime.js
 * @author zhaozj
 *
 * 实时库存查询action
 */

import ActionType from './ActionType';

import {
    queryStoreRealTime
} from '../service';

/**
 * 请求列表数据
 */
const receiveData = (data) => ({
    type: ActionType.RECEIVE_STOREREALTIME_LIST,
    payload: data,
})

export const getListData = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryStoreRealTime(params)
            .then(res => {
                dispatch(
                    receiveData(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

/**
 * 清空列表数据
 */
const clearData = () => ({
    type: ActionType.CLEAR_STOREREALTIME_LIST
})
export const getListDataEmpty = () => (dispatch) => dispatch(clearData());
