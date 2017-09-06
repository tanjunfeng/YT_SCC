/**
 * @file StoreAdjustList.js
 *
 * @author wtt
 *
 * 获取商品分类
 */

import Promise from 'bluebird';
import {
    queryStoreAdList,
} from '../service';
import ActionType from './ActionType';

// 查询字典分页列表
const receiveStoreAdList = (data) => ({
    type: ActionType.RECEIVE_STORE_ADJUST_LIST,
    payload: data,
});

export const storeAdList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryStoreAdList(params)
            .then(res => {
                dispatch(receiveStoreAdList(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)
