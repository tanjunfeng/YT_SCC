/**
 * @file fetchGoods.js
 *
 * @author shixinyuan
 *
 * 获取商品分类
 */

import Promise from 'bluebird';
import {
    findPriceinfo,
    fetchShelfProductsByLike,
    toaddsellprice,
    commodityDetail,
    purchasePriceDetail,
    addPurchasement,
    updateOffShelfProducts,
    addSellPrice,
    getPurchasePrice,
    queryAllSupplier,
    toUpdateSellPrice,
    updateSellPrice,
    updatePurchasePrice,
    deletePurchasePriceById,
    getProductById,
    addProdPurchase,
    getProdPurchaseById,
    queryProdPurchaseExtByCondition,
    fetchChangeSupType,
    updateProdPurchase,
    changeProPurchaseStatus,
    getWarehouseInfo1
} from '../service';
import ActionType from './ActionType';

const receivePrice = (data) => ({
    type: ActionType.RECEIVE_FIND_PRICE_INFO,
    payload: data,
});

export const findPrice = (params) => dispatch => (
    new Promise((resolve, reject) => {
        findPriceinfo(params)
            .then(res => {
                dispatch(receivePrice(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)

const receiveShelf = (data) => ({
    type: ActionType.RECEIVE_SELF_PRODUCT_LIST,
    payload: data,
});

export const fetchShelfProducts = (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchShelfProductsByLike(params)
            .then(res => {
                dispatch(receiveShelf(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 跳转新增价格弹窗
const receiveAddPriceVisible = (data) => ({
    type: ActionType.PRODUCT_TO_ADD_SELL_PRICE,
    payload: data,
});

export const productAddPriceVisible = (isShow) => dispatch =>
    dispatch(receiveAddPriceVisible(isShow));

// 跳转采购价格弹窗
const receivePurchaseVisible = (data) => ({
    type: ActionType.PRODUCT_ADD_PURCHASEMENT_PRICE,
    payload: data,
});

export const purchasePriceVisible = (isShow) => dispatch =>
    dispatch(receivePurchaseVisible(isShow));

// 跳转新增价格
const receiveAddPrice = (data) => ({
    type: ActionType.RECEIVE_TO_ADD_SELL_PRICE,
    payload: data,
});

export const AddPrice = (params) => dispatch => (
    new Promise((resolve, reject) => {
        toaddsellprice(params)
            .then(res => {
                dispatch(receiveAddPrice(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 跳转到修改销售价格页面
const receivetoUpdate = (data) => ({
    type: ActionType.RECEIVE_TO_UPDATE_SELL_PRICE,
    payload: data,
});

export const toUpdateSell = (params) => dispatch => (
    new Promise((resolve, reject) => {
        toUpdateSellPrice(params)
            .then(res => {
                dispatch(receivetoUpdate(res.data));
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 商品管理详情页-commidifyDetail
const receiveDetail = (data) => ({
    type: ActionType.RECEIVE_COMMODITY_DETAIL,
    payload: data,
});

export const commodityDetails = (params) => dispatch => (
    new Promise((resolve, reject) => {
        commodityDetail(params)
            .then(res => {
                dispatch(receiveDetail(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)

const receivePurchaseDetail = (data) => ({
    type: ActionType.RECEIVE_GET_PURCHASE_PRICE_DETAIL,
    payload: data,
});

export const PurchasePriceDetail = (params) => dispatch => (
    new Promise((resolve, reject) => {
        purchasePriceDetail(params)
            .then(res => {
                dispatch(receivePurchaseDetail(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)

const receiveaddPurchasement = (data) => ({
    type: ActionType.REQUEST_ADD_PURCHASEMENT_PRICE,
    payload: data,
});

export const addPurchasementDetail = (params) => dispatch => (
    new Promise((resolve, reject) => {
        addPurchasement(params)
            .then(res => {
                dispatch(receiveaddPurchasement(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)
// 下架商品
const receiveUpdateOffShelf = (data) => ({
    type: ActionType.RECEIVE_UPDATE_OFFSHELF_PRODUCTS,
    payload: data,
});

export const updateOffShelf = (params) => dispatch => (
    new Promise((resolve, reject) => {
        const { offStatus, productIds, ...data } = params;
        updateOffShelfProducts({ offStatus, productIds })
            .then((res) => {
                dispatch(receiveUpdateOffShelf({ ...data }));
                resolve(res)
            })
            .catch(err => {
                reject(err);
            })
    })
)

const receiveProductUpdateVisible = (data) => ({
    type: ActionType.PRODUCT_UPDATE_OFFSHELF,
    payload: data,
});

export const ProductUpdateVisible = (isShow) => dispatch =>
    dispatch(receiveProductUpdateVisible(isShow));

// 新增销售价格
const receiveAddSellPrice = (data) => ({
    type: ActionType.REQUEST_ADD_SELL_PRICE,
    payload: data,
});

export const AddSellPrice = (params) => dispatch => (
    new Promise((resolve, reject) => {
        addSellPrice(params)
            .then(res => {
                dispatch(receiveAddSellPrice(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 修改采购价格
const receiveUpdatePurchase = (data) => ({
    type: ActionType.REQUEST_UPDATE_PURCHASE_PRICE,
    payload: data,
});

export const updatePurchase = (params) => dispatch => (
    new Promise((resolve, reject) => {
        updatePurchasePrice(params)
            .then(res => {
                dispatch(receiveUpdatePurchase(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 删除采购价格
const receiveDeletePurchasePrice = (data) => ({
    type: ActionType.REQUEST_DELETE_PURCHASE_PRICE_BY_ID,
    payload: data,
});

export const deletePurchasePrice = (params) => dispatch => (
    new Promise((resolve, reject) => {
        deletePurchasePriceById(params)
            .then(res => {
                dispatch(receiveDeletePurchasePrice(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 修改销售价格
const receiveupdateSell = (data) => ({
    type: ActionType.REQUEST_UPDATE_SELL_PRICE,
    payload: data,
});

export const updateSell = (params) => dispatch => (
    new Promise((resolve, reject) => {
        updateSellPrice(params)
            .then(res => {
                dispatch(receiveupdateSell(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 查询阶梯价格信息
const receivegetPurchasePrice = (data) => ({
    type: ActionType.RECEIVE_GET_PURCHASE_PRICE_EXT_BY_PRICE_ID,
    payload: data,
});

export const getPurchase = (params) => dispatch => (
    new Promise((resolve, reject) => {
        getPurchasePrice(params)
            .then(res => {
                dispatch(receivegetPurchasePrice(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 查询供应商
const receivequeryAllSupplier = (data) => ({
    type: ActionType.RECEIVE_QUERY_ALL_SUPPLIER,
    payload: data,
});

export const QueryAllSupplier = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryAllSupplier(params)
            .then(res => {
                dispatch(receivequeryAllSupplier(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 新增商品采购关系
const receiveAddProdPurchase = (data) => ({
    type: ActionType.REQUEST_ADD_SELL_PRICE,
    payload: data,
});

export const AddProdPurchase = (params) => dispatch => (
    new Promise((resolve, reject) => {
        addProdPurchase(params)
            .then(res => {
                dispatch(receiveAddProdPurchase(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 查询商品信息
const receiveGetProductById = (data) => ({
    type: ActionType.GET_PRODUCT_BY_ID,
    payload: data,
});

export const GetProductById = (params) => dispatch => (
    new Promise((resolve, reject) => {
        getProductById(params)
            .then(res => {
                dispatch(receiveGetProductById(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 查询商品信息
const receiveGetProdPurchaseById = (data) => ({
    type: ActionType.GET_PRODPURCHASE_BYID,
    payload: data,
});

export const GetProdPurchaseById = (params) => dispatch => (
    new Promise((resolve, reject) => {
        getProdPurchaseById(params)
            .then(res => {
                dispatch(receiveGetProdPurchaseById(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 根据条件查询商品价格信息
const receiveQueryProdPurchaseExtByCondition = (data) => ({
    type: ActionType.QUERY_PRODBY_CONDITION,
    payload: data,
});

export const QueryProdPurchaseExtByCondition = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryProdPurchaseExtByCondition(params)
            .then(res => {
                dispatch(receiveQueryProdPurchaseExtByCondition(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 更改供应商类型
const receiveChangeSupplierType = (data) => ({
    type: ActionType.QUERY_PRODBY_CONDITION,
    payload: data,
});

export const ChangeSupplierType = (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchChangeSupType(params)
            .then(res => {
                dispatch(receiveChangeSupplierType(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 修改采购关系
const receiveUpdateProdPurchase = (data) => ({
    type: ActionType.UPDATE_PROD_PURCHASE_BYID,
    payload: data,
});

export const UpdateProdPurchase = (isShow) => dispatch =>
    dispatch(receiveUpdateProdPurchase(isShow));

// 修改采购关系
const receiveUpdateProd = (data) => ({
    type: ActionType.UPDATE_PROD_PURCHASE_BY_ID,
    payload: data,
});

export const ChangeUpdateProd = (params) => dispatch => (
    new Promise((resolve, reject) => {
        updateProdPurchase(params)
            .then(res => {
                dispatch(receiveUpdateProd(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 修改采购关系
const receiveChangeProPurchaseStatus = (data) => ({
    type: ActionType.CHANGE_PROPURCHASE_STATUS,
    payload: data,
});

export const ChangeProPurchaseStatus = (params) => dispatch => (
    new Promise((resolve, reject) => {
        changeProPurchaseStatus(params)
            .then(res => {
                dispatch(receiveChangeProPurchaseStatus(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 查询逻辑仓库列表
const receiveGetWarehouseInfo1 = (data) => ({
    type: ActionType.GER_WARE_HOUSE_LOGIC_INFO,
    payload: data,
});

export const GetWarehouseInfo1 = (params) => dispatch => (
    new Promise((resolve, reject) => {
        getWarehouseInfo1(params)
            .then(res => {
                dispatch(receiveGetWarehouseInfo1(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)
