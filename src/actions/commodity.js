/**
 * @file supplier.js
 * @author shijh
 *
 * 供应商相关action
 */

import ActionType from './ActionType';

import {
    addStepSellPrice,
    updateStepSellPrice,
    updateSellPriceStatus,
    getSellPriceInfoByIdAction as getSellPriceInfoByIdService,
    getCostPrice as getCostPriceService,
    getAreaGroup as getAreaGroupService,
    createAreaGroup as createAreaGroupService,
    isAreaGroupExists as isAreaGroupExistsService,
    deleteAreaGroup as deleteAreaGroupService
} from '../service';

/**
 * 供应商详情action
 */
const receiveAddPrice = (data) => ({
    type: ActionType.RECEIVE_ADD_PRICE,
    payload: data,
})

/**
 * 新增销售价格
 * @param {Object} params 传参
 */
export const postSellPrice = (params) => dispatch => (
    new Promise((resolve, reject) => {
        addStepSellPrice(params)
            .then(res => {
                dispatch(
                    receiveAddPrice(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

const receiveUpdateSellPrice = (data) => ({
    type: ActionType.RECEIVE_UPDATE_PRICE,
    payload: data,
})

/**
 * 编辑销售价格
 * @param {Object} params 传参
 */
export const updateSellPrice = (params) => dispatch => (
    new Promise((resolve, reject) => {
        updateStepSellPrice(params)
            .then(res => {
                dispatch(
                    receiveUpdateSellPrice(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

/**
 * 跳转到修改页面
 * @param {Object} params 传参
 */

const receiveGetSellPriceInfoById = (data) => ({
    type: ActionType.RECEIVE_GET_SELL_PRICE,
    payload: data
});

export const getSellPriceInfoByIdAction = (params) => dispatch => (
    new Promise((resolve, reject) => {
        getSellPriceInfoByIdService(params)
            .then(res => {
                dispatch(
                    receiveGetSellPriceInfoById(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 价格起停用
 */
export const updatePriceStatus = (params) => dispatch => (
    new Promise((resolve, reject) => {
        updateSellPriceStatus(params)
            .then(res => {
                dispatch(
                    receiveAddPrice(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

/**
 * 获取成本价
 *
 * @param {Object} params 传参
 */
const getCostPriceAction = data => ({
    type: ActionType.GET_COST_PRICE,
    payload: data
});

export const getCostPrice = params => dispatch => (
    new Promise((resolve, reject) => {
        getCostPriceService(params)
            .then(res => {
                dispatch(
                    getCostPriceAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

export const clearCostPrice = () => dispatch => (dispatch({
    type: ActionType.CLEAR_COST_PRICE,
    payload: null
}));

/**
 * 查询所有区域组
 *
 * @param {Object} params 传参
 */
const getAreaGroupActionType = data => ({
    type: ActionType.RECEIVE_AREA_GROUP,
    payload: data
});

export const getAreaGroup = params => dispatch => (
    new Promise((resolve, reject) => {
        getAreaGroupService(params)
            .then(res => {
                dispatch(
                    getAreaGroupActionType(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 新增区域组
 *
 * @param {Object} params 传参
 */
const createAreaGroupActionType = data => ({
    type: ActionType.CREATE_AREA_GROUP,
    payload: data
});

export const createAreaGroup = params => dispatch => (
    new Promise((resolve, reject) => {
        createAreaGroupService(params)
            .then(res => {
                dispatch(
                    createAreaGroupActionType(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 区域组名是否存在
 *
 * @param {Object} params 传参
 */
const isAreaGroupExistsActionType = data => ({
    type: ActionType.IS_AREA_GROUP_EXISTS,
    payload: data
});

export const isAreaGroupExists = params => dispatch => (
    new Promise((resolve, reject) => {
        isAreaGroupExistsService(params)
            .then(res => {
                dispatch(
                    isAreaGroupExistsActionType(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 删除选中区域组
 *
 * @param {Object} params 传参
 */
const deleteAreaGroupActionType = data => ({
    type: ActionType.DELETE_AREA_GROUP,
    payload: data
});

export const deleteAreaGroup = params => dispatch => (
    new Promise((resolve, reject) => {
        deleteAreaGroupService(params)
            .then(res => {
                dispatch(
                    deleteAreaGroupActionType(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

export const clearAreaGroup = () => dispatch => (dispatch({
    type: ActionType.CLEAR_AREA_GROUP,
    payload: { pageNum: 1, pageSize: 20, total: 0, data: [] }
}));
