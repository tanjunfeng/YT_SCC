/**
 * @file supplier.js
 * @author shijh, denglingbo
 *
 * 商品管理 reducer
 */
import Immutable from 'immutable';
import ActionType from '../actions/ActionType';
import { PAGE_SIZE } from '../constant';

const initState = Immutable.fromJS({

    // 供应商管理列表
    data: {},

    // 弹出框数据
    visibleData: false,

    informationVisible: false,

    // 地区管理列表
    areaData: {},

    // 供应商申请列表
    applicationData: {},

    // 控制弹出框显示影藏
    toAddPriceVisible: false,
    // 修改采购关系
    updateProdPurchase: false,
    // 是否是编辑
    isEdit: false,
    purchasingPiceVisible: false,

    // 商品分类列表
    goods: [],

    // 在售商品列表
    selfProduct: {},

    // 销售价格详情
    price: {},

    // 查看新增销售价格
    addPrice: {},

    // 跳转到修改销售价格页面
    toUpdate: {},
    // 商品分类
    classifiedList: [],

    // 查看商品详情
    commodityDetail: {},

    // 查看采购价格list
    purchasePrice: {},

    // 查询供应商
    queryAll: [],

    // IBM 修改
    // 查看是否存在主供应商
    checkMainSupplier: false,
    // 查询商品价格信息
    getProdPurchaseById: {},
    // 根据主键查询商品采购关系
    getProdPurchaseByIds: {},

    // 根据条件查询商品价格信息
    purchaseCardData: {},

    // 根据条件查询商品价格信息
    changeSupType: {},

    // 查询商品信息
    getProductById: {},

    // 阶梯价格列表
    stepPriceDetail: {},

    // 更新商品信息
    updateProdRecord: {},

    // 地点关联
    getWarehouseLogicInfo: {},

    // 删除当前关系
    deleteProd: {},

    // 跳转到修改页面
    getSellPriceInfoById: {},

    // 成本价
    costPrice: null,

    // 区域组
    areaGroup: { pageNum: 1, pageSize: PAGE_SIZE, total: 0, data: [] },

    // 已分组的门店列表
    groupedStores: { pageNum: 1, pageSize: PAGE_SIZE, total: 0, data: [] },

    // 未分组的门店列表
    freeStores: { pageNum: 1, pageSize: PAGE_SIZE, total: 0, data: [] },

    // 商品地点关系列表
    goodsSitesManageList: {},
    // 商品信息列表
    productsData: {},
    // 单条商品地点关系记录详情
    proSiteDetail: {},
    // 添加商品地点关系时的参数(下载重复数据需要重用)
    relationAddParams: {},
    // 添加商品地点关系时重复数据
    repeatRelations: {}
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.RECEIVE_PARAMETER_LIST:
            return state.set('data', action.payload);

        case ActionType.RECEIVE_SELF_PRODUCT_LIST:
            return state.set('selfProduct', action.payload);

        case ActionType.RECEIVE_CLASSIFIED_LIST:
            return state.set('classifiedList', action.payload);

        case ActionType.RECEIVE_FIND_PRICE_INFO:
            return state.set('price', action.payload);

        case ActionType.RECEIVE_TO_ADD_SELL_PRICE: {
            return state.set('addPrice', action.payload);
        }
        case ActionType.RECEIVE_TO_UPDATE_SELL_PRICE: {
            return state.set('toUpdate', action.payload);
        }
        // 查询阶梯价格信息
        case ActionType.RECEIVE_GET_PURCHASE_PRICE_EXT_BY_PRICE_ID: {
            return state.set('getPurchasePrice', action.payload);
        }
        // 新增销售价格弹窗
        case ActionType.PRODUCT_TO_ADD_SELL_PRICE: {
            const { isVisible, id, isEdit, pricingId } = action.payload;
            return state
                .set('toAddPriceVisible', isVisible)
                .set('visibleData', id)
                .set('isEdit', isEdit)
                .set('pricingId', pricingId)
                .set('id', id);
        }

        // 新增采购价格弹窗
        case ActionType.PRODUCT_ADD_PURCHASEMENT_PRICE: {
            const { isVisible, id, isEdit, supplierId, companyName, pricingId } = action.payload;
            return state
                .set('toPurchasePriceVisible', isVisible)
                .set('visibleData', id)
                .set('isEdit', isEdit)
                .set('id', id)
                .set('supplierId', supplierId)
                .set('companyName', companyName)
                .set('pricingId', pricingId);
        }

        // 修改采购价格弹窗
        case ActionType.UPDATE_PROD_PURCHASE_BYID: {
            const { isVisible, record } = action.payload;
            return state.set('updateProdPurchase', isVisible).set('updateProdRecord', record)
        }

        case ActionType.RECEIVE_COMMODITY_DETAIL:
            return state.set('commodityDetail', action.payload);

        case ActionType.RECEIVE_GET_PURCHASE_PRICE_DETAIL:
            return state.set('purchasePrice', action.payload);

        // case ActionType.REQUEST_ADD_SELL_PRICE:
        //     return state.set('toAddPriceVisible', action.payload);

        case ActionType.REQUEST_ADD_PURCHASEMENT_PRICE:
            return state.set('toPurchasePriceVisible', action.payload);

        // 查询供应商
        case ActionType.RECEIVE_QUERY_ALL_SUPPLIER:
            return state.set('queryAll', action.payload);

        case ActionType.RECEIVE_UPDATE_OFFSHELF_PRODUCTS: {
            // 在售商品列表下架功能
            return state;
        }

        case ActionType.CHECK_MAIN_SUPPLIER:
            return state.set('checkMainSupplier', action.payload);

        case ActionType.RECEIVE_GET_SELL_PRICE: {
            return state.set('getSellPriceInfoById', action.payload);
        }

        case ActionType.GET_PRODPURCHASE_BYID:
            return state.set('getProdPurchaseByIds', action.payload);

        case ActionType.QUERY_PRODPURCHASE_BYID:
            return state.set('getProdPurchaseById', action.payload);

        case ActionType.CHANGE_SUPPLIER_TYPE:
            return state.set('changeSupType', action.payload);

        case ActionType.GET_PRODUCT_BY_ID:
            return state.set('getProductById', action.payload);

        case ActionType.RECEIVE_PRICE_INFO:
            return state.set('stepPriceDetail', action.payload)

        case ActionType.QUERY_PRODBY_CONDITION:
            return state.set('purchaseCardData', action.payload);

        case ActionType.DELETE_PROD_PRUCHASE_BYID:
            return state.set('deleteProd', action.payload);

        case ActionType.GET_WARE_HOUSE_LOGIC_INFO:
            return state.set('getWarehouseLogicInfo', action.payload);

        case ActionType.GET_COST_PRICE:
        case ActionType.CLEAR_COST_PRICE:
            return state.set('costPrice', action.payload);

        case ActionType.RECEIVE_AREA_GROUP:
        case ActionType.CLEAR_AREA_GROUP:
            return state.set('areaGroup', action.payload);

        case ActionType.GET_GROUPED_STORES:
        case ActionType.CLEAR_GROUPED_STORES:
            return state.set('groupedStores', action.payload);

        case ActionType.GET_FREE_STORES:
        case ActionType.CLEAR_FREE_STORES:
            return state.set('freeStores', action.payload);

        case ActionType.RECEIVE_SITES_MANAGE_LIST:
            return state.set('goodsSitesManageList', action.payload);
        case ActionType.QUERY_PRODUCTS_BY_CONDITION:
            return state.set('productsData', action.payload);
        case ActionType.QUERY_PRODUCT_SITE_RELATION_BY_ID:
            return state.set('proSiteDetail', action.payload);
        case ActionType.RECEIVE_ADD_RELATION_PARAMS:
            return state.set('relationAddParams', action.payload);
        case ActionType.PAGE_REPEAT_SITE_RELATIONS:
            return state.set('repeatRelations', action.payload);
        default:
            return state;
    }
}
