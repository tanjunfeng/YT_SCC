/**
 * @file procurement.js
 *
 * @author twh
 * 采购管理相关reducer
 */

import { fromJS } from 'immutable';
import ActionType from '../actions/ActionType';

const initState = fromJS({
    // 采购单管理列表
    poInfo: {},
    // 采购单管理列表选中行
    selectedPoMngRows: {},
    // 采购单详情信息
    po: {
        // 采购单基本信息
        basicInfo: {
            // id: null,//pk
            // poNo: null,//采购单号
            // poTypeCd: poTypeCodes.normal,//采购单类型
            // poStatus: null,
            // supplierCd: null,
            // supplierName: null,
            // supplierLocCd: null,
            // supplierLocName: null,
            // estDeliveryDate: null,
            // locTypeCd: null,
            // locTypeName: null,
            // addressCd: null,
            // address: null,
            // bigCLassCd: null,
            // bigCLassName: null
        },
        // 采购单详情商品明细列表
        poLines: [],
    },

    poMaterial: {},
    // 采购单打印列表
    poPrintInfo: {},
    // 采购收货单管理列表
    poRcvMngInfo: {},
    // 采购单收货列表  列表内容为 已审核且未收货采购单
    poRcvInfo: {},
    // 采购收货单详情信息
    poRcv: {},
    // 新增商品信息
    newPcOdData: {},
    // 采购退货清单
    returnMngInfo: {},
    // 直营店信息
    directInfo: {},
    // 单个商品详情
    goodsInfo: {},
    // 退货详情
    poReturn: {},
    // 查询退货流水号
    getRefundNumebr: '',
    // 退货单审批意见
    approvalInfoList: [],
    // 查询审批列表
    processMsgInfo: {},
    // 查询退货单审批流程
    processDefinitions: [],
    // 退货商品列表
    returnLists: [],
    // 原始退货上品列表
    originReturnList: [],
    // 采购单审批列表
    approvalList: []
});

export default function (state = initState, action) {
    let po;
    let poRcv;
    let poLines;
    let basicInfo;
    let payload;
    switch (action.type) {
        // 查询采购单管理列表
        case ActionType.RECEIVE_PO_MNG_INFO:
            return state.set('poInfo', fromJS(action.payload));

        // 删除采购单
        case ActionType.DELETE_PO_BY_IDS:
            return state;

        // 获取采购单打印列表
        case ActionType.RECEIVE_PO_PRINT_LIST:
            return state.set('poPrintInfo', fromJS(action.payload));

        case ActionType.CHANGE_PO_MNG_SELECTED_ROWS:// 采购单列表界面 选中采购单
            return state.set('selectedPoMngRows', fromJS(action.payload));
        case ActionType.RECEIVE_PO_MATERIAL_BY_CD:// 商品编码获取商品详情
            return state.set('poMaterial', fromJS(action.payload));

        case ActionType.GET_WAREHOUSE_ADDRESS_MAP:
            // 不改变state
            return state;
        // 采购单详情
        case ActionType.RECEIVE_PO_DETAIL:
            return state.set('po', fromJS(action.payload));

        case ActionType.INIT_PO_DETAIL:// 初始采购单详情
            return state.set('po', fromJS(action.payload));

        case ActionType.UPDATE_PO_BASICINFO:// 更新采购单基本信息
            po = Object.assign(
                {},
                state.toJS().po);
            basicInfo = po.basicInfo || {};
            basicInfo = Object.assign(basicInfo, action.payload);
            po.basicInfo = basicInfo;
            return state.set('po', po);

        // 添加采购单商品行(单数或复数)
        case ActionType.ADD_PO_LINES:
            po = Object.assign(
                {},
                state.toJS().po);
            poLines = po.poLines || [];
            if (Array.isArray(action.payload)) {
                poLines.concat(action.payload);
            } else {
                poLines.push(action.payload);
            }
            po.poLines = poLines;
            return state.set('po', fromJS(po));

        // 更新采购单商品行
        case ActionType.UPDATE_PO_LINE:
            po = Object.assign(
                {},
                state.toJS().po);
            poLines = po.poLines || [];
            payload = action.payload || {};
            poLines.forEach((element, index, arr) => {
                const array = arr;
                if (element.productCode === payload.productCode) {
                    array[index] = payload;
                }
            });
            po.poLines = poLines;
            return state.set('po', fromJS(po));

        // 删除采购单商品行
        case ActionType.DELETE_PO_LINE:
            po = Object.assign(
                {},
                state.toJS().po);
            payload = action.payload || {};
            po.poLines = po.poLines.filter((line) =>
                line.productCode !== payload.productCode
            );
            return state.set('po', fromJS(po));

        case ActionType.RECEIVE_PO_RCV_MNG_LIST:// 采购收货单管理列表
            return state.set('poRcvMngInfo', fromJS(action.payload));

        case ActionType.RECEIVE_PO_RCV_LIST:// 采购单收货列表
            return state.set('poRcvInfo', fromJS(action.payload));

        case ActionType.RECEIVE_PO_RCV_DETAIL:// 收货单详情
            return state.set('poRcv', fromJS(action.payload));
        case ActionType.RETURN_PO_RCV_INIT:// 退货单详情
            return state.set('poReturn', fromJS(action.payload));
        case ActionType.GET_REFUND_NO_ACTION:// 退货单详情
            return state.set('getRefundNumebr', fromJS(action.payload));
        case ActionType.QUERY_APPROVAL_INFO:// 退货单审批意见
            return state.set('approvalInfoList', fromJS(action.payload));
        case ActionType.QUERY_COMMENT_HIS:// 采购审批意见表
            return state.set('approvalList', fromJS(action.payload));
        case ActionType.RECEIVE_NEW_PURCHASE_ORDER:// 收货单详情
            return state.set('newPcOdData', fromJS(action.payload));

        case ActionType.RECEIVE_PO_RCV_INIT:// 初始收货单详情
            payload = action.payload || {};
            return state.set('poRcv', fromJS(action.payload));

        case ActionType.QUERY_PROCESS_MSG_LIST:// 采购审批列表下查询采购单审批列表
            return state.set('processMsgInfo', fromJS(action.payload));
        case ActionType.QUERY_PRO_DEFINITIONS:// 查询退货单审批流程
            return state.set('processDefinitions', fromJS(action.payload));
        case ActionType.RECEIVE_RETURN_MNG_LIST:// 采购退货列表
            payload = action.payload || {};
            return state.set('returnMngInfo', fromJS(action.payload));

        case ActionType.UPDATE_PO_RCV_LINE:// 更新收货单商品行
            poRcv = Object.assign(
                {},
                state.toJS().poRcv);
            poLines = poRcv.poLines || [];
            payload = action.payload || {};
            poLines.forEach((element, index, arr) => {
                const array = arr;
                if (element.materialCd === payload.materialCd) {
                    array[index] = payload;
                }
            });
            poRcv.poLines = poLines;
            return state.set('poRcv', poRcv);

        case ActionType.UPDATE_PO_RCV_BASICINFO:// 更新收货单基本信息
            poRcv = Object.assign(
                {},
                state.toJS().poRcv);
            basicInfo = poRcv.basicInfo || {};
            payload = action.payload || {};
            basicInfo = Object.assign(basicInfo, payload);
            poRcv.basicInfo = basicInfo;
            return state.set('poRcv', poRcv);

        // 直营店详情
        case ActionType.FETCH_DIRECT_INFO:
        case ActionType.CLEAR_DIRECT_INFO:
            return state.set('directInfo', fromJS(action.payload));
        case ActionType.FETCH_GOODS_INFO:
            return state.set('goodsInfo', fromJS(action.payload));
        case ActionType.ADD_REFUND_PRODUCTS: {
            return state.set('returnLists', fromJS(action.payload));
        }
        case ActionType.CLEAR_RETURN_INFO:
            return state
                .set('returnLists', fromJS([]))
                .set('poReturn', fromJS({}))
                .set('getRefundNumebr', fromJS(''))
        case ActionType.CLEAR_RETURN_LISTS:
            return state.set('returnLists', fromJS([]))
        default:
            return state;
    }
}
