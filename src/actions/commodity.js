/**
 * @file supplier.js
 * @author shijh
 *
 * 供应商相关action
 */

import ActionType from './ActionType';
import { PAGE_SIZE } from '../constant';

import {
    addStepSellPrice,
    updateStepSellPrice,
    updateSellPriceStatus,
    getSellPriceInfoByIdAction as getSellPriceInfoByIdService,
    getCostPrice as getCostPriceService,
    getAreaGroup as getAreaGroupService,
    createAreaGroup as createAreaGroupService,
    isAreaGroupExists as isAreaGroupExistsService,
    deleteAreaGroup as deleteAreaGroupService,
    getGroupedStores as getGroupedStoresService,
    insertStoreToGroup as insertStoreToGroupService,
    insertAllStoresToGroup as insertAllStoresToGroupService,
    deleteStoreFromArea as deleteStoreFromAreaService,
    deleteAllStoresFromArea as deleteAllStoresFromAreaService,
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
 * 清空区域组列表
 */
export const clearAreaGroup = () => dispatch => (dispatch({
    type: ActionType.CLEAR_AREA_GROUP,
    payload: { pageNum: 1, pageSize: PAGE_SIZE, total: 0, data: [] }
}));

/**
 * 查询已在区域组下的门店
 *
 * existsAreaGroup: true
 * @param {Object} params 传参
 */
const getGroupedStoresActionType = data => ({
    type: ActionType.GET_GROUPED_STORES,
    payload: data
});

export const getGroupedStores = params => dispatch => (
    new Promise((resolve, reject) => {
        getGroupedStoresService({
            existsAreaGroup: true,
            ...params
        }).then(res => {
            dispatch(getGroupedStoresActionType(res.data));
            resolve(res);
        }).catch(err => reject(err))
    })
);

/**
 * 查询未分组门店
 *
 * 重用 getGroupedStoresService
 * existsAreaGroup: false
 * @param {Object} params 传参
 */
const getFreeStoresActionType = data => ({
    type: ActionType.GET_FREE_STORES,
    payload: data
});

export const getFreeStores = params => dispatch => (
    new Promise((resolve, reject) => {
        getGroupedStoresService({
            existsAreaGroup: false,
            ...params
        }).then(res => {
            dispatch(getFreeStoresActionType(res.data));
            resolve(res);
        }).catch(err => reject(err))
    })
);

/**
 * 将未分组门店添加至区域组
 *
 * @param {Object} params 传参
 */
const insertStoreToGroupActionType = data => ({
    type: ActionType.INSERT_STORE_TO_GROUP,
    payload: data
});

export const insertStoreToGroup = params => dispatch => (
    new Promise((resolve, reject) => {
        insertStoreToGroupService(params).then(res => {
            dispatch(insertStoreToGroupActionType(res.data));
            resolve(res);
        }).catch(err => reject(err))
    })
);

/**
 * 将全部未分组门店添加至区域组
 *
 * @param {Object} params 传参
 */
const insertAllStoresToGroupActionType = data => ({
    type: ActionType.INSERT_ALL_STORE_TO_GROUP,
    payload: data
});

export const insertAllStoresToGroup = params => dispatch => (
    new Promise((resolve, reject) => {
        insertAllStoresToGroupService(params).then(res => {
            dispatch(insertAllStoresToGroupActionType(res.data));
            resolve(res);
        }).catch(err => reject(err))
    })
);

/**
 * 按查询条件删除区域组中所有门店
 *
 * @param {Object} params 传参
 */
const deleteAllStoresFromAreaActionType = data => ({
    type: ActionType.DELETE_ALL_STORE_FROM_GROUP,
    payload: data
});

export const deleteAllStoresFromArea = params => dispatch => (
    new Promise((resolve, reject) => {
        deleteAllStoresFromAreaService(params).then(res => {
            dispatch(deleteAllStoresFromAreaActionType(res.data));
            resolve(res);
        }).catch(err => reject(err))
    })
);

/**
 * 将未分组门店添加至区域组
 *
 * @param {Object} params 传参
 */
const deleteStoreFromAreaActionType = data => ({
    type: ActionType.DELETE_STORE_FROM_AREA,
    payload: data
});

export const deleteStoreFromArea = params => dispatch => (
    new Promise((resolve, reject) => {
        deleteStoreFromAreaService(params).then(res => {
            dispatch(deleteStoreFromAreaActionType(res.data));
            resolve(res);
        }).catch(err => reject(err))
    })
);

/**
 * 清空已分组门店列表
 */
export const clearGroupedStores = () => dispatch => (dispatch({
    type: ActionType.CLEAR_GROUPED_STORES,
    payload: { pageNum: 1, pageSize: PAGE_SIZE, total: 0, data: [] }
}));

/**
 * 清空未分组门店列表
 */
export const clearFreeStores = () => dispatch => (dispatch({
    type: ActionType.CLEAR_FREE_STORES,
    payload: { pageNum: 1, pageSize: PAGE_SIZE, total: 0, data: [] }
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
                    createAreaGroupActionType(res.record)
                );
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
 * 查询商品
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

/**
 * 保存添加商品地点关系参数
 */
export const receiveAddRelationParams = data => ({
    type: ActionType.RECEIVE_ADD_RELATION_PARAMS,
    payload: data
});
