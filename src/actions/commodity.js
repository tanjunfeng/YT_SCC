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
    queryProdPlacePage,
    prodPlaceBulkDelete,
    prodPlacePpdate as updateSiteManageById,
    queryproductsbypages as searchProductsByCondition,
    addDistinctProductSiteRelations as createRelations,
    queryProductSiteRelationById as queryDetail
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

const getSitesManageListAction = data => ({
    type: ActionType.RECEIVE_SITES_MANAGE_LIST,
    payload: data
});

/**
 * 商品地点关系列表
 *
 * @param {Object} params 传参
 */
export const getSitesManageList = params => dispatch => (
    new Promise((resolve, reject) => {
        queryProdPlacePage(params)
            .then(res => {
                dispatch(getSitesManageListAction(res.data));
                resolve(res);
            })
            .catch(err => reject(err))
    }));

/**
 * 批量删除商品地点关系
 * @param {Object} data
 */
const deleteSiteManagesByIdsAction = data => ({
    type: ActionType.DELETE_SITEMANAGES_BY_IDS,
    payload: data
});

export const removeSiteManagesByIds = params => dispatch => (
    new Promise((resolve, reject) => {
        prodPlaceBulkDelete(params)
            .then(res => {
                dispatch(deleteSiteManagesByIdsAction(res.data));
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 编辑商品地点关系
 * @param {Object} data
 */
const editSiteManageByIdAction = data => ({
    type: ActionType.EDIT_SITE_MANAGE_BY_ID,
    payload: data
});

export const editSiteManageById = params => dispatch => (
    new Promise((resolve, reject) => {
        updateSiteManageById(params)
            .then(res => {
                dispatch(editSiteManageByIdAction(res.data));
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 *查询商品
 * @param {Object} data
 */
const queryProductsByConditionAction = data => ({
    type: ActionType.QUERY_PRODUCTS_BY_CONDITION,
    payload: data
});

export const queryProductsByCondition = params => dispatch => (
    new Promise((resolve, reject) => {
        searchProductsByCondition(params)
            .then(res => {
                dispatch(queryProductsByConditionAction(res.data));
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 创建商品地点关系
 * @param {Object} data
 */
const createProductSiteRelationsAction = data => ({
    type: ActionType.CREATE_PRODUCT_SITE_RELATIONS,
    payload: data
});

export const createProductSiteRelations = params => dispatch => (
    new Promise((resolve, reject) => {
        createRelations(params)
            .then(res => {
                dispatch(createProductSiteRelationsAction(res.data));
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 查询商品地点关系详情
 */

const queryDetailByIdAction = data => ({
    type: ActionType.QUERY_PRODUCT_SITE_RELATION_BY_ID,
    payload: data
});

export const queryDetailById = params => dispatch => (
    new Promise((resolve, reject) => {
        queryDetail(params)
            .then(res => {
                dispatch(queryDetailByIdAction(res.data));
                resolve(res);
            })
            .catch(err => reject(err))
    })
);
