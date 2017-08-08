/**
 * @file procurement.js
 * @author twh
 *
 * 采购管理相关action
 */

import ActionType from './ActionType';
import {
    fetchPurchaseOrder,
    fetchMaterialByCd as svcFetchMaterialByCd,
    deletePoByIds as svcDeletePoByIds,
    queryPoPrintList as svcQueryPoPrintList,
    createPo as svcCreatePo,
    auditPo as svcAuditPo,
    queryPoDetail,
    queryShopAddressMap,
    queryWarehouseAddressMap,
    querySupplierMap,
    querySupplierLocMap,
    queryBigClassMap,
    queryMaterialMap as svcQueryMateriMap,
    queryPoRcvMngList,
    queryPoRcvList,
    queryPoRcvDetail,
    createPoRcv as svcCreatePoRcv
} from '../service';


/**
 * 查询商品值清单
 * @param {*} data 
 */
export const getMaterialMap = (params) => dispatch => (
    new Promise((resolve, reject) => {
        svcQueryMateriMap(params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)


/**
 * 查询采购打印详情
 * @param {*} data 
 */
const rcvPoPrintList = (data) => ({
    type: ActionType.RECEIVE_PO_PRINT_LIST,
    payload: data,
});

export const fetchPoPrintList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchPoMngList(params)
            .then(res => {
                dispatch(rcvPoPrintList(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

/**
 * 仓库值清单 promise
 * @param {*} data
 */
export const getWarehouseAddressMap = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryWarehouseAddressMap(params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

/**
 * 门店值清单 promise
 * @param {*} data 
 */
export const getShopAddressMap = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryShopAddressMap(params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

/**
 * 供应商值清单 promise
 * @param {*} data 
 */
export const getSupplierMap = (params) => dispatch => (
    new Promise((resolve, reject) => {
        querySupplierMap(params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

/**
 * 供应商地点值清单 promise
 * @param {*} data 
 */
export const getSupplierLocMap = (params) => dispatch => (
    new Promise((resolve, reject) => {
        querySupplierLocMap(params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

/**
 * 大类值清单 promise
 * @param {*} data 
 */
export const getBigClassMap = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryBigClassMap(params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)


/////////////////采购单相关/////////////////////////////

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
 * @param {*} data  Duplicate declaration
 */
const rcvPoMngList = (data) => ({
    type: ActionType.RECEIVE_PO_MNG_LIST,
    payload: data,
});


export const fetchPoMngList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchPurchaseOrder(params)
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
 * 创建采购单
 * @param {*} params 
 */
export const createPo = (params) => dispatch => (
    new Promise((resolve, reject) => {
        svcCreatePo(params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

/**
 * 审批采购单
 * @param {*} params 
 */
export const auditPo = (params) => dispatch => (
    new Promise((resolve, reject) => {
        svcAuditPo(params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)


/**
 * 查询采购单详情
 * @param {*} data 
 */
const rcvPoDetail = (data) => ({
    type: ActionType.RECEIVE_PO_DETAIL,
    payload: data,
});
export const fetchPoDetail = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryPoDetail(params)
            .then(res => {
                dispatch(rcvPoDetail(res.data));
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
                //返回操作结果
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)


/**
 *初始化采购单详情
 * @param {*} data 
 */
export const initPoDetailAction = (data) => ({
    type: ActionType.INIT_PO_DETAIL,
    payload: data,
});
export const initPoDetail = (params) => dispatch => (
    new Promise((resolve, reject) => {
        dispatch(initPoDetailAction(params));
        // 返回操作结果
        resolve(params);
    })
)

/**
 * 更新采购单基本信息
 * @param {*} data 
 */
export const updatePoBasicinfo = (data) => ({
    type: ActionType.UPDATE_PO_BASICINFO,
    payload: data,
});


/**
 * 添加采购单商品行
 * @param {*} data 
 */
export const addPoLines = (data) => ({
    type: ActionType.ADD_PO_LINES,
    payload: data,
});

/**
 * 更新采购单商品行
 * @param {*} data 
 */
export const updatePoLine = (data) => ({
    type: ActionType.UPDATE_PO_LINE,
    payload: data,
});

/**
 * 删除采购单商品行
 * @param {*} data 
 */
export const deletePoLine = (data) => ({
    type: ActionType.DELETE_PO_LINE,
    payload: data,
});


/////////////////////////////////////收货相关

/**
 * 查询采购收货单管理列表
 * @param {*} data 
 */
const rcvPoRcvMngList = (data) => ({
    type: ActionType.RECEIVE_PO_RCV_MNG_LIST,
    payload: data,
});
export const fetchPoRcvMngList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryPoRcvMngList(params)
            .then(res => {
                dispatch(rcvPoRcvMngList(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

/**
 * 查询采购单收货列表
 * @param {*} data 
 */
const rcvPoRcvList = (data) => ({
    type: ActionType.RECEIVE_PO_RCV_LIST,
    payload: data,
});
export const fetchPoRcvList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryPoRcvList(params)
            .then(res => {
                dispatch(rcvPoRcvList(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

/**
 * 查询收货单详情
 * @param {*} data 
 */
const rcvPoRcvDetail = (data) => ({
    type: ActionType.RECEIVE_PO_RCV_DETAIL,
    payload: data,
});
export const fetchPoRcvDetail = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryPoRcvDetail(params)
            .then(res => {
                dispatch(rcvPoRcvDetail(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)


/**
 * 查询采购单详情并创建收货单初始信息
 * 1.根据采购单id查询采购单相关信息
 * 2.根据查询结果初始显示采购收货单
 * @param {*} data 
 */
const rcvPoRcvInit = (data) => ({
    type: ActionType.RECEIVE_PO_RCV_INIT,
    payload: data,
});
export const fetchPoRcvInit = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryPoDetail(params)
            .then(res => {
                dispatch(rcvPoRcvInit(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)


/**
 * 更新采购收货单基本信息
 * @param {*} data 
 */
export const updatePoRcvBasicinfo = (data) => ({
    type: ActionType.UPDATE_PO_RCV_BASICINFO,
    payload: data,
});

/**
 * 更新采购收货单商品行
 * @param {*} data 
 */
export const updatePoRcvLine = (data) => ({
    type: ActionType.UPDATE_PO_RCV_LINE,
    payload: data,
});

/**
 * 创建采购收货单
 * @param {*} params 
 */
export const createPoRcv = (params) => dispatch => (
    new Promise((resolve, reject) => {
        svcCreatePoRcv(params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)
