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
    queryAllLargerRegionProvince
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