/**
 * @file supplier.js
 * @author shijh
 *
 * 供应商相关action
 */

import ActionType from './ActionType';

import {
    queryProviderDetail,
    getSupplierNo,
    queryProviderPlaceInfo,
    insertSupplierInfo,
    updateSupplierInfo,
    insertSupplierAddressInfo,
    updateSupplierAddressInfo,
    insertOrUpdateSupplierInfo,
    querySettledList,
    fetchQueryManageList,
    querySupplierPlaceRegion,
    auditSupplierEditInfo
} from '../service';

const handleServer = {
    insertSupplierInfo,
    updateSupplierInfo,
    insertSupplierAddressInfo,
    updateSupplierAddressInfo
}

/**
 * 供应商详情action
 */
const receiveDetail = (data) => ({
    type: ActionType.RECEIVE_SUPPLIER_DETAIL,
    payload: data,
})

export const getSupplierDetail = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryProviderDetail(params)
            .then(res => {
                dispatch(
                    receiveDetail(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

export const getProviderDetail = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryProviderPlaceInfo(params)
            .then(res => {
                dispatch(
                    receiveDetail(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

/**
 * 供应商入驻列表action
 */
const receiveSettledList = (data) => ({
    type: ActionType.QUERY_SETTLED_LIST,
    payload: data,
})

export const getSupplierSettledList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        querySettledList(params)
            .then(res => {
                dispatch(
                    receiveSettledList(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

/**
 * 供应商管理列表action
 */
const receiveManageList = (data) => ({
    type: ActionType.RECEIVE_SUPPLIER_MANAGE_LIST,
    payload: data,
})

export const getSupplierManageList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchQueryManageList(params)
            .then(res => {
                dispatch(
                    receiveManageList(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

/**
 * 获取供应商或者
 */
const receiveSupplierNo = (data) => ({
    type: ActionType.RECEIVE_SUPPLIER_NO,
    payload: data,
})

export const fetchSupplierNo = (params) => dispatch => (
    new Promise((resolve, reject) => {
        getSupplierNo(params)
            .then(res => {
                dispatch(
                    receiveSupplierNo(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

/**
 * 新增或编辑供应商
 */
const receiveinSupplierInfo = (data) => ({
    type: ActionType.RECEIVE_INSERT_SUPPLIER_INFO,
    payload: data,
})

export const hanldeSupplier = (params, type) => dispatch => (
    new Promise((resolve, reject) => {
        handleServer[type](params)
            .then(res => {
                dispatch(
                    receiveinSupplierInfo(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

/**
 * 获取供应商供应省市
 */
 const receiveinPlaceRegion = (data) => ({
    type: ActionType.RECEIVE_PLACE_REGION,
    payload: data,
})

export const queryPlaceRegion = (params) => dispatch => (
    new Promise((resolve, reject) => {
        querySupplierPlaceRegion(params)
            .then(res => {
                dispatch(
                    receiveinPlaceRegion(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

/**
 * 供应商信息
 */
const receiveAudit = (data) => ({
    type: ActionType.MODIFY_CHECK_REASON_VISIBLE,
    payload: data,
});

export const modifyAuthVisible = (isShow) => dispatch => dispatch(receiveAudit(isShow));

/**
 * 供应商地点信息
 */
const receiveAdr = (data) => ({
    type: ActionType.MODIFY_CHECK_REASON_ADR_VISIBLE,
    payload: data,
});

export const modifyAdrVisible = (isShow) => dispatch => dispatch(receiveAdr(isShow));

/**
 * 供应商修改审核
 */
const receiveAuditSupplierEditInfo = (data) => ({
    type: ActionType.QUERY_SETTLED_LIST,
    payload: data,
})

export const AuditSupplierEditInfo = (params) => dispatch => (
    new Promise((resolve, reject) => {
        auditSupplierEditInfo(params)
            .then(res => {
                dispatch(
                    receiveAuditSupplierEditInfo(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)
