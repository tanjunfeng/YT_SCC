/**
 * @file procurement.js
 * @author twh
 *
 * 采购管理相关action
 */

import ActionType from './ActionType';
import { fetchPoMngList as svcFetchPoMngList, fetchMaterialByCd as svcFetchMaterialByCd, deletePoByIds as svcDeletePoByIds, queryPoPrintList as svcQueryPoPrintList } from '../service';

/**
 * 采购单列表选择list
 * @param {*} data 
 */
export const changePoMngSelectedRows = (data) => ({
    type: ActionType.CHANGE_PO_MNG_SELECTED_ROWS,
    payload: data,
});


/**
 * 查询采购单列表
 * @param {*} data 
 */
const rcvPoMngList = (data) => ({
    type: ActionType.RECEIVE_PO_MNG_LIST,
    payload: data,
});
export const fetchPoMngList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        svcFetchPoMngList(params)
            .then(res => {
                dispatch(rcvPoMngList(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

/**
 * 删除采购单
 */
const deletePoByIdsAction = (data) => ({
    type: ActionType.DELETE_PO_BY_IDS,
    payload: data,
});
export const deletePoByIds = (params) => dispatch => (
    new Promise((resolve, reject) => {
        svcDeletePoByIds(params)
            .then(res => {
                // 返回操作结果
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

/**
 * 查询商品详情
 * @param {*} data 
 */
const rcvMaterialByCd = (data) => ({
    type: ActionType.RECEIVE_PO_MATERIAL_BY_CD,
    payload: data,
});
export const fetchMaterialByCd = (params) => dispatch => (
    new Promise((resolve, reject) => {
        svcFetchMaterialByCd(params)
            .then(res => {
                dispatch(rcvMaterialByCd(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)


/**
 * 查询商品详情
 * @param {*} data 
 */
const rcvPoPrintList = (data) => ({
    type: ActionType.RECEIVE_PO_PRINT_LIST,
    payload: data,
});
export const fetchPoPrintList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        svcQueryPoPrintList(params)
            .then(res => {
                dispatch(rcvPoPrintList(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)
