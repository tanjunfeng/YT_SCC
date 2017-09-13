// 获取供应商列表数据
import fetchSupplierList from './fetch/fetchSupplierList';
import modifyInformationVisible from './modify/modifyInformationVisible';
// 获取供应区域列表数据
import fetchSaleRegion from './fetch/fetchSaleRegion';
// 获取供应商申请列表
import fetchProviderEnterList from './fetch/fetchProviderEnterList';

import modifySupplierFrozen from './modify/modifySupplierFrozen';

import modifyAuditVisible from './modify/modifyAuditVisible';
import modifyCheckReasonVisible from './modify/modifyCheckReasonVisible';
import modifyAreaVisible from './modify/modifyAreaVisible';
import saleRegionsDtail from './fetch/saleRegionsDtail';

import fetchGoods from './fetch/fetchGoods';
import fetchSelfProduct from './fetch/fetchSelfProduct';

import fetchCategory from './fetch/fetchCategory';
import modifyToAddCategory from './modify/modifyToAddCategory';
import modifyCategoryVisible from './modify/modifyCategoryVisible';
import modifyQuerygoodsname from './modify/modifyQuerygoodsname';
import modifyDeleteOrderNum from './modify/modifyDeleteOrderNum';
import modifyUpDateCategory from './modify/modifyUpDateCategory';

import modifyCollaboration from './modify/modifyCollaboration';
import modifySupplierCooperationInfo from './modify/modifySupplierCooperationInfo';
import fetchSupplierEditApply from './fetch/fetchSupplierEditApply';

import insertSupplierSettlementInfo from './add/insertSupplierSettlementInfo';

import modifyMediaAddVisible from './modify/modifyMediaAddVisible';
import modifyToAddInsertpage from './modify/modifyToAddInsertpage';
import modifyUpdatePageBase from './modify/modifyUpdatePageBase';
import fetchFindStaticPageList from './fetch/fetchStaticPageHome';
import fectheEditorContent from './fetch/fectheEditorContent';
import fetchDeleteProdPurchaseById from './fetch/fetchDeleteProdPurchaseById';

/*
 * procurement added by twh
 */
import {
    changePoMngSelectedRows,
    fetchPoMngList,
    deletePoByIds,
    fetchPoPrintList,
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
    getBigClassMap,
    getMaterialMap,
    initPoDetail,
    createPo,
    auditPo,
    fetchPoDetail,
    updatePoBasicinfo,
    addPoLines,
    updatePoLine,
    deletePoLine,
    fetchPoRcvMngList,
    fetchPoRcvList,
    fetchPoRcvDetail,
    fetchPoRcvInit,
    updatePoRcvLine,
    updatePoRcvBasicinfo,
    createPoRcv
} from './procurement';

// IBM
import fetchCheckMainSupplier from './fetch/fetchCheckMainSupplier';
import fetchChangeSupType from './fetch/fetchChangeSupType'

import fetchQuerySettledList from './fetch/fetchQuerySettledList';
import fetchQueryManageList from './fetch/fetchQueryManageList';
import fetchGetProductById from './fetch/fetchGetProductById';
import fetchEditBeforeAfter from './fetch/fetchEditBeforeAfter';
import fetchAddProdPurchase from './fetch/fetchAddProdPurchase';
import fetchUpdateProdPurchase from './fetch/fetchUpdateProdPurchase';
import fetchChangeProPurchaseStatus from './fetch/fetchChangeProPurchaseStatus';
import suppplierSettledAudit from './fetch/suppplierSettledAudit';
import supplierAdrSettledAudit from './fetch/supplierAdrSettledAudit';
import modifyAuditAdrVisible from './modify/modifyAuditAdrVisible';
import auditSupplierEditInfoAction from '../actions/supplier';
import {
    UpdateProdPurchase,
    getProductById,
    queryProdPurchaseExtByCondition,
    ChangeProPurchaseStatus,
    GetWarehouseInfo1
} from './producthome';

// 库存调整
import stockAdjust from './stockAdjust';
import stockListDetail from './stockListDetail';
import storeAdList from './storeAdjustList';

// 促销活动
import { getPromotionList, createPromotion, getPromotionDetail } from './promotion';

// 商品管理列表
// 根据条件分页查询商品清单，并排序
import queryCommodityList from './queryCommodityList';

export {
    fetchSupplierList,
    modifyInformationVisible,
    modifyCategoryVisible,
    fetchSaleRegion,
    fetchProviderEnterList,
    modifySupplierFrozen,
    modifyAuditVisible,
    modifyCheckReasonVisible,
    modifyAreaVisible,
    fetchGoods,
    fetchSelfProduct,
    modifyCollaboration,
    modifySupplierCooperationInfo,
    fetchSupplierEditApply,
    saleRegionsDtail,
    insertSupplierSettlementInfo,
    modifyQuerygoodsname,
    fetchCategory,
    fectheEditorContent,
    modifyUpDateCategory,
    modifyUpdatePageBase,
    modifyToAddCategory,
    modifyMediaAddVisible,
    modifyDeleteOrderNum,
    modifyToAddInsertpage,
    fetchFindStaticPageList,
    // procurement added by twh
    fetchPoMngList,
    changePoMngSelectedRows,
    deletePoByIds,
    fetchPoPrintList,
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
    getBigClassMap,
    getMaterialMap,
    initPoDetail,
    createPo,
    auditPo,
    fetchPoDetail,
    updatePoBasicinfo,
    addPoLines,
    updatePoLine,
    deletePoLine,
    fetchPoRcvMngList,
    fetchPoRcvList,
    fetchPoRcvDetail,
    fetchPoRcvInit,
    updatePoRcvLine,
    updatePoRcvBasicinfo,
    createPoRcv,

    // IBM
    fetchCheckMainSupplier,
    fetchChangeSupType,

    fetchQuerySettledList,
    suppplierSettledAudit,
    supplierAdrSettledAudit,
    modifyAuditAdrVisible,
    getProductById,
    queryProdPurchaseExtByCondition,
    UpdateProdPurchase,
    ChangeProPurchaseStatus,
    GetWarehouseInfo1,

    // 库存调整
    stockAdjust,
    stockListDetail,
    fetchQueryManageList,
    fetchGetProductById,
    fetchEditBeforeAfter,
    auditSupplierEditInfoAction,
    storeAdList,

    // 促销活动
    getPromotionList,
    createPromotion,
    getPromotionDetail,

    // 根据条件分页查询商品清单，并排序
    queryCommodityList,
    fetchAddProdPurchase,
    fetchUpdateProdPurchase,
    fetchChangeProPurchaseStatus,
    fetchDeleteProdPurchaseById
}
