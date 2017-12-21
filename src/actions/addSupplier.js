/**
 * @file addSupplier.js
 * @author shijh
 *
 * 添加供应商相关
 */
import Promise from 'bluebird';
import ActionType from './ActionType';

import {
    insertSupplierSettlementInfo,
    findAuditFailedReason,
    queryAllLargerRegionProvince,
    getWarehouseLogic,
    getWarehousePhysical,
    insertSupplierAddressInfo
} from '../service';

const receiveData = (data) => ({
    type: ActionType.ADD_SUPPLIER_MESSAGE,
    payload: data,
});

export const addSupplierMessage1 = (data) => dispatch => dispatch(receiveData(data));


const receiveInfo = (data) => ({
    type: ActionType.ADD_SUPPLIER_BASIC_MESSAGE,
    payload: data,
})

export const insertSupplierInfo = (data) => dispatch => (
    new Promise((resolve, reject) => {
        insertSupplierSettlementInfo(data)
            .then(res => {
                dispatch(
                    receiveInfo(data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

const receiveReson = (data) => ({
    type: ActionType.FIND_AUTH_FAILED_REASON,
    payload: data
})

export const findFailedReason = (data) => dispatch => (
    findAuditFailedReason(data)
        .then(res => {
            dispatch(
                receiveReson(res.data)
            );
        })
        .catch(err => Promise.reject(err))
)

/**
 * 获取所有大区
 */
const receiveLargerRegion = (data) => ({
    type: ActionType.RECEIVE_LARGER_REGIN,
    payload: data,
})

export const getLargerRegion = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryAllLargerRegionProvince(params)
            .then(res => {
                dispatch(
                    receiveLargerRegion(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

/**
 * 查询仓库编码和仓库名称
 */
const receiveWarehouse = (data) => ({
    type: ActionType.RECEIVE_WARE_HOUSE,
    payload: data,
})

export const getWarehouse = (params) => dispatch => (
    new Promise((resolve, reject) => {
        getWarehouseLogic(params)
            .then(res => {
                dispatch(
                    receiveWarehouse(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

/**
 * 获取仓库详情
 */
const receiveWarehouseInfo = (data) => ({
    type: ActionType.RECEIVE_WARE_HOUSE_INFO,
    payload: data,
})

export const fetchWarehouseInfo = (params) => dispatch => (
    new Promise((resolve, reject) => {
        getWarehousePhysical(params)
            .then(res => {
                dispatch(
                    receiveWarehouseInfo(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

export const deleteWarehouseInfo = (params) => dispatch => (
    dispatch({
        type: ActionType.RECEIVE_DELETE_WARE_HOUSE_INFO,
        payload: params
    })
)

/**
 * 新增供应商地点
 */
const receiveSupplierAddress = (data) => ({
    type: ActionType.RECEIVE_INSERT_SUPPLIER_ADDRESS,
    payload: data,
})

export const insertSupplierAddress = (params) => dispatch => (
    new Promise((resolve, reject) => {
        insertSupplierAddressInfo(params)
            .then(res => {
                dispatch(
                    receiveSupplierAddress(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)
