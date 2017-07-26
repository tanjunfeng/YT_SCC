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
    insertOrUpdateSupplierInfo
} from '../service';

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

/**
 * 供应商入驻列表action
 */
const receiveSettledList = (data) => ({
    type: ActionType.RECEIVE_SUPPLIER_SETTLED_LIST,
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
        queryManageList(params)
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

export const fetchSupplierInfo = (params) => dispatch => (
    new Promise((resolve, reject) => {
        insertOrUpdateSupplierInfo(params)
            .then(res => {
                dispatch(
                    receiveinSupplierInfo(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)
