/**
 * @file checkSupplier.js
 * @author shijh
 *
 * 检验供应商信息
 */

import Promise from 'bluebird';
import ActionType from './ActionType';
import * as ViewModel from '../view-model';
import {
    settlementInfo,
    taxpayerNumber,
    bankAccount,
    showOldAndNewLicenseInfo,
    showOldAndNewOrgCodeInfo,
    showOldAndNewOperTaxContent,
    showOldAndNewBankContent,
    showOldAndNewEmerContInfo,
    showOldAndNewSettledContInfo,
    approveSupplierLicense,
    approveSupplierOrgCode,
    approveSupplierOperTax,
    approveSupplierBank,
    approveSupplierEmerCont,
    approveSupplierSettledCont
} from '../service';

const Service = {
    LicenseInfo: showOldAndNewLicenseInfo,
    OrgCodeInfo: showOldAndNewOrgCodeInfo,
    OperTaxContent: showOldAndNewOperTaxContent,
    BankContent: showOldAndNewBankContent,
    EmerContInfo: showOldAndNewEmerContInfo,
    SettledContInfo: showOldAndNewSettledContInfo
}

const Approve = {
    LicenseInfo: approveSupplierLicense,
    OrgCodeInfo: approveSupplierOrgCode,
    OperTaxContent: approveSupplierOperTax,
    BankContent: approveSupplierBank,
    EmerContInfo: approveSupplierEmerCont,
    SettledContInfo: approveSupplierSettledCont

}


export const receiveData = (data) => ({
    type: ActionType.RECEIVE_CLASSIFIED_LIST,
    payload: data,
});

/**
 * 请求列表信息
 * @param params
 */
export const fetchAction = (params) => dispatch => (
    settlementInfo(params)
        .then(res => {dispatch(receiveData(res.data)) })
        .catch(err => Promise.reject(err))
)

export const receiveShow = (data) => ({
    type: ActionType.RECEIVE_SHOW_DATA,
    payload: data,
});

/**
 * 获取修改前后的内容
 * @param ser 请求方法
 * @param type ViewModal 类型
 */
export const fetchOldAndNew = (params, type) => dispatch => (
    Service[type](params)
        .then(res => {
            dispatch(receiveShow(ViewModel[type](res.data)));
        })
        .catch(err => Promise.reject(err))
)


export const approveSupplier = (params, type) => dispatch => (
    new Promise((resolve, reject) => {
        Approve[type](params).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
)
