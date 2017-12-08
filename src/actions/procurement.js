/**
 * @file procurement.js
 * @author twh
 *
 * 采购管理相关action
 */
import ActionType from './ActionType';
import {
    fetchPurchaseOrderInfo,
    deletePurchaseList,
    queryPoPrintInfo,
    createPo as svcCreatePo,
    auditPo as svcAuditPo,
    queryPoDetail as queryPoDetailService,
    queryMaterialMap as svcQueryMateriMap,
    queryPurchaseOrderBrands as queryPurchaseOrderBrandsService,
    queryPoRcvMngInfo,
    queryPoRcvList,
    queryPoRcvDetail,
    createPoRcv as svcCreatePoRcv,
    findStepPriceInfo,
    getNewPmPurchaseOrderItem,
    auditPurchaseOrderInfo,
    updatePmPurchaseOrder,
    repushPurchaseReceipt as repushPurchaseReceiptService,
    fetchReturnMngInfoprocessMsgList as queryReturnMngListService,
    queryApprovalInfo as queryApprovalInfoService,
    getRefundNo as getRefundNoActionService,
    queryDirectInfo as queryDirectInfoService,
    queryGoodsInfo as queryGoodsInfoService,
    updateGoodsInfo as updateGoodsInfoService,
    insertDirectOrder as insertDirectOrderService,
    fetchReturnPoRcvDetail as queryReturnPoDetailSevice,
    deleteBatchRefundOrder as deleteBatchRefundOrderService,
    batchCheckStorage as batchCheckStorageService,
    queryProcessDefinitions as ueryProcessDefinitionsService,
    approveRefund as approveRefundService,
    cancelRefund as cancelRefundService,
    addRefundProducts,
    queryCommentHis as queryCommentHisService
} from '../service';
import { ProcurementDt } from '../view-model';

/**
 * 查询商品值清单
 * @param {*} data
 */
export const getMaterialMap = (params) => () => (
    new Promise((resolve, reject) => {
        svcQueryMateriMap(params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 查询品牌值清单
 * @param {*} data
 */
export const queryPurchaseOrderBrands = (params) => () => (
    new Promise((resolve, reject) => {
        queryPurchaseOrderBrandsService(params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 查询采购打印详情
 * @param {*} data
 */
const rcvPoPrintList = (data) => ({
    type: ActionType.RECEIVE_PO_PRINT_LIST,
    payload: data
});

export const fetchPoPrintList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryPoPrintInfo(params)
            .then(res => {
                dispatch(rcvPoPrintList(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 采购单相关
 */

/**
 * 采购单列表选择list
 * @param {*} data
 */
export const changePoMngSelectedRows = (data) => ({
    type: ActionType.CHANGE_PO_MNG_SELECTED_ROWS,
    payload: data
});

/**
 * 查询采购单列表
 * @param {*} data  Duplicate declaration
 */
const rcvPoMngList = (data) => ({
    type: ActionType.RECEIVE_PO_MNG_INFO,
    payload: data
});

export const fetchPoMngList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchPurchaseOrderInfo(params)
            .then(res => {
                dispatch(rcvPoMngList(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 创建采购单
 * @param {*} params
 */
export const createPo = (params) => () => (
    new Promise((resolve, reject) => {
        svcCreatePo(params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 修改采购单
 * @param {*} params
 */
export const ModifyPo = (params) => () => (
    new Promise((resolve, reject) => {
        updatePmPurchaseOrder(params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 审批采购单
 * @param {*} params
 */
export const auditPo = (params) => () => (
    new Promise((resolve, reject) => {
        svcAuditPo(params).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
);

/**
 * 查询采购单详情
 * @param {*} data
 */
const rcvPoDetail = (data) => ({
    type: ActionType.RECEIVE_PO_DETAIL,
    payload: data
});

export const queryPoDetail = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryPoDetailService(params)
            .then(res => {
                dispatch(
                    rcvPoDetail(
                        ProcurementDt(res.data)
                    )
                );
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 删除采购单
 */
const deletePoByIdsAction = (data) => ({
    type: ActionType.DELETE_PO_BY_IDS,
    payload: data
});

export const deletePoByIds = (params) => dispatch => (
    new Promise((resolve, reject) => {
        deletePurchaseList(params)
            .then(res => {
                dispatch(deletePoByIdsAction(res.data));
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
    payload: data
});

export const initPoDetail = (params) => dispatch => (
    new Promise((resolve) => {
        dispatch(initPoDetailAction(params));
        // 返回操作结果
        resolve(params);
    })
);

/**
 * 更新采购单基本信息
 * @param {*} data
 */
export const updatePoBasicinfo = (data) => ({
    type: ActionType.UPDATE_PO_BASICINFO,
    payload: data
});

/**
 * 添加采购单商品行
 * @param {*} data
 */
export const addPoLines = (data) => ({
    type: ActionType.ADD_PO_LINES,
    payload: data
});

/**
 * 更新采购单商品行
 * @param {*} data
 */
export const updatePoLine = (data) => ({
    type: ActionType.UPDATE_PO_LINE,
    payload: data
});

/**
 * 删除采购单商品行
 * @param {*} data
 */
export const deletePoLine = (data) => ({
    type: ActionType.DELETE_PO_LINE,
    payload: data
});

// 收货相关

/**
 * 查询采购收货单管理列表
 * @param {*} data
 */
const rcvPoRcvMngList = (data) => ({
    type: ActionType.RECEIVE_PO_RCV_MNG_LIST,
    payload: data
});

export const fetchPoRcvMngList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryPoRcvMngInfo(params)
            .then(res => {
                dispatch(rcvPoRcvMngList(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 查询采购单收货列表
 * @param {*} data
 */
const rcvPoRcvList = (data) => ({
    type: ActionType.RECEIVE_PO_RCV_LIST,
    payload: data
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
);

/**
 * 查询收货单详情
 * @param {*} data
 */
const rcvPoRcvDetail = (data) => ({
    type: ActionType.RECEIVE_PO_RCV_DETAIL,
    payload: data
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
 * 查询收货单详情
 * @param {*} data
 */
const rcvPoRcvInit = (data) => ({
    type: ActionType.RECEIVE_PO_RCV_INIT,
    payload: data
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
);

/**
 * 查询退货单详情
 * @param {*} data
 */
const returnPoRcvInit = (data) => ({
    type: ActionType.RETURN_PO_RCV_INIT,
    payload: data
});

export const fetchReturnPoRcvDetail = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryReturnPoDetailSevice(params)
            .then(res => {
                dispatch(returnPoRcvInit(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 更新采购收货单基本信息
 * @param {*} data
 */
export const updatePoRcvBasicinfo = (data) => ({
    type: ActionType.UPDATE_PO_RCV_BASICINFO,
    payload: data
});

/**
 * 更新采购收货单商品行
 * @param {*} data
 */
export const updatePoRcvLine = (data) => ({
    type: ActionType.UPDATE_PO_RCV_LINE,
    payload: data
});

/**
 * 创建采购收货单
 * @param {*} params
 */
export const createPoRcv = (params) => () => (
    new Promise((resolve, reject) => {
        svcCreatePoRcv(params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 审批
 * @param {*} params
 */
export const modifyAuditPurchaseOrderInfo = (data) => (
    new Promise((resolve, reject) => {
        auditPurchaseOrderInfo(data)
            .then(res => {
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 根据条件查询销售价格区间列表
 * @param {*} data
 */
const rcvPriceInfo = (data) => ({
    type: ActionType.RECEIVE_PRICE_INFO,
    payload: data
});

export const fetchPriceInfo = (params) => dispatch => (
    new Promise((resolve, reject) => {
        findStepPriceInfo(params)
            .then(res => {
                dispatch(rcvPriceInfo(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

/**
 * 根据条件查询采购单商品信息（新增时）
 * @param {*} data
 */
const receiveNewPurchaseOrder = (data) => ({
    type: ActionType.RECEIVE_NEW_PURCHASE_ORDER,
    payload: data
});

export const fetchNewPmPurchaseOrderItem = (params) => dispatch => (
    new Promise((resolve, reject) => {
        getNewPmPurchaseOrderItem(params)
            .then(res => {
                dispatch(receiveNewPurchaseOrder(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 重新推送采购收货单
 *
 * @param {*object} data
 */
const repushPurchaseReceiptAction = (data) => ({
    type: ActionType.REPUSH_PURCHASE_RECEIPT,
    payload: data
});

export const repushPurchaseReceipt = (params) => dispatch => (
    new Promise((resolve, reject) => {
        repushPurchaseReceiptService(params)
            .then(res => {
                dispatch(repushPurchaseReceiptAction(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 查询采购退货单管理列表
 * @param {*} data
 */
const returnMngListAction = (data) => ({
    type: ActionType.RECEIVE_RETURN_MNG_LIST,
    payload: data
});

export const fetchReturnMngList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryReturnMngListService(params)
            .then(res => {
                dispatch(returnMngListAction(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 查看退货单审批意见
 * @param {*} data
 */
const queryApprovalInfoAction = (data) => ({
    type: ActionType.QUERY_APPROVAL_INFO,
    payload: data
});

export const queryApprovalInfo = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryApprovalInfoService(params)
            .then(res => {
                dispatch(queryApprovalInfoAction(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 查询退货单审批流程
 * @param {*} data
 */
const queryProcessDefinitionsAction = (data) => ({
    type: ActionType.QUERY_PRO_DEFINITIONS,
    payload: data
});

export const queryProcessDefinitions = (params) => dispatch => (
    new Promise((resolve, reject) => {
        ueryProcessDefinitionsService(params)
            .then(res => {
                dispatch(queryProcessDefinitionsAction(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 查询退货单审批流程
 * @param {*} data
 */
const cancelRefundAction = (data) => ({
    type: ActionType.CANCEL_REFUND,
    payload: data
});

export const cancelRefund = (params) => dispatch => (
    new Promise((resolve, reject) => {
        cancelRefundService(params)
            .then(res => {
                dispatch(cancelRefundAction(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 退货单审批
 * @param {*} data
 */
const approveRefundAction = (data) => ({
    type: ActionType.APPROVE_REFUND,
    payload: data
});

export const approveRefund = (params) => dispatch => (
    new Promise((resolve, reject) => {
        approveRefundService(params)
            .then(res => {
                dispatch(approveRefundAction(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 查询采购退货流水号
 * @param {*} data
 */
const getRefundNoAction = (data) => ({
    type: ActionType.GET_REFUND_NO_ACTION,
    payload: data
});

export const getRefundNo = (params) => dispatch => (
    new Promise((resolve, reject) => {
        getRefundNoActionService(params)
            .then(res => {
                dispatch(getRefundNoAction(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

// 清除采购退货流水号
export const clearRefundNo = () => dispatch => (dispatch({
    type: ActionType.CLEAR_REFUND_NO_INFO,
    payload: {}
}));

// 清除采购退货数据
export const clearReturnInfo = () => dispatch => (dispatch({
    type: ActionType.CLEAR_RETURN_INFO,
    payload: {}
}))

/**
 * 批量删除处于草稿状态的退货单
 * @param {*} data
 */
const deleteBatchRefundOrderAction = (data) => ({
    type: ActionType.DELETE_BATCH_REFOND_ORDER,
    payload: data
});

export const deleteBatchRefundOrder = (params) => dispatch => (
    new Promise((resolve, reject) => {
        deleteBatchRefundOrderService(params)
            .then(res => {
                dispatch(deleteBatchRefundOrderAction(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/*
* 查询根据门店编号直营店信息
*
* @param {*object} data
*/
const queryDirectInfoAction = (data) => ({
    type: ActionType.FETCH_DIRECT_INFO,
    payload: data
});

export const queryDirectInfo = params => dispatch => (
    new Promise((resolve, reject) => {
        queryDirectInfoService(params)
            .then(res => {
                dispatch(queryDirectInfoAction(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 直营店下单商品提交
 *
 * @param {*object} data
 */
const insertDirectOrderAction = (data) => ({
    type: ActionType.INSERT_DIRECT_ORDER,
    payload: data
});

export const insertDirectOrder = params => dispatch => (
    new Promise((resolve, reject) => {
        insertDirectOrderService(params)
            .then(res => {
                dispatch(insertDirectOrderAction(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 直营店下单批量检查库存
 *
 * @param {*object} data
 */
const batchCheckStorageAction = (data) => ({
    type: ActionType.VALIDATE_DIRECT_ORDER,
    payload: data
});

export const batchCheckStorage = params => dispatch => (
    new Promise((resolve, reject) => {
        batchCheckStorageService(params)
            .then(res => {
                dispatch(batchCheckStorageAction(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

// 清除直营店信息
export const clearDirectInfo = () => dispatch => (dispatch({
    type: ActionType.CLEAR_DIRECT_INFO,
    payload: {}
}));

/**
 * 查询单个商品详情
 *
 * @param {*object} data
 */
const queryGoodsInfoAction = (data) => ({
    type: ActionType.FETCH_GOODS_INFO,
    payload: data
});

export const queryGoodsInfo = params => dispatch => (
    new Promise((resolve, reject) => {
        queryGoodsInfoService(params)
            .then(res => {
                dispatch(queryGoodsInfoAction(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 查询单个商品详情
 *
 * @param {*object} data
 */
const updateGoodsInfoAction = (data) => ({
    type: ActionType.UPDATE_GOODS_INFO,
    payload: data
});

export const updateGoodsInfo = params => dispatch => (
    new Promise((resolve, reject) => {
        updateGoodsInfoService(params)
            .then(res => {
                dispatch(updateGoodsInfoAction(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
);

/**
 * 根据采购单号、逻辑仓编号、商品code、品牌id添加退货商品
 * @param {*} data
 */
const addRefundProductsAction = (data) => ({
    type: ActionType.ADD_REFUND_PRODUCTS,
    payload: data
})

export const putRefundProducts = (params) => dispatch => (
    new Promise((resolve, reject) => {
        addRefundProducts(params)
            .then(res => {
                dispatch(addRefundProductsAction(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

/**
 * 清除退货列表
 */
export const clearList = () => dispatch => {
    dispatch({
        type: ActionType.CLEAR_RETURN_LISTS,
        payload: []
    })
}

/**
 * 根据采购单号、逻辑仓编号、商品code、品牌id添加退货商品
 * @param {*} data
 */
const queryCommentHisAction = (data) => ({
    type: ActionType.QUERY_COMMENT_HIS,
    payload: data
})

export const queryCommentHis = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryCommentHisService(params)
            .then(res => {
                dispatch(queryCommentHisAction(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)
