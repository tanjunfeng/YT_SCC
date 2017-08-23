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
    poList: {},
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
    poPrintList: {},
    // 采购收货单管理列表
    poRcvMngList: {},
    // 采购单收货列表  列表内容为 已审核且未收货采购单
    poRcvList: {},
    // 采购收货单详情信息
    poRcv: {},
    // 新增商品信息
    newPcOdData: {},
});

export default function (state = initState, action) {
    let po;
    let poRcv;
    let poLines;
    let basicInfo;
    let payload;
    switch (action.type) {
        // 查询采购单管理列表
        case ActionType.RECEIVE_PO_MNG_LIST:
            return state.set('poList', fromJS(action.payload));

        // 删除采购单
        case ActionType.DELETE_PO_BY_IDS:
            return state;

        // 获取采购单打印列表
        case ActionType.RECEIVE_PO_PRINT_LIST:
            return state.set('poPrintList', fromJS(action.payload));

        case ActionType.CHANGE_PO_MNG_SELECTED_ROWS:// 采购单列表界面 选中采购单
            return state.set('selectedPoMngRows', fromJS(action.payload));
        case ActionType.RECEIVE_PO_MATERIAL_BY_CD://商品编码获取商品详情
            return state.set("poMaterial", fromJS(action.payload));

        case ActionType.GET_WAREHOUSE_ADDRESS_MAP:
            //不改变state
            return state;
        // 采购单详情
        case ActionType.RECEIVE_PO_DETAIL:
            return state.set('po', fromJS(action.payload));

        case ActionType.INIT_PO_DETAIL://初始采购单详情
            return state.set('po', fromJS(action.payload));

        case ActionType.UPDATE_PO_BASICINFO://更新采购单基本信息
            po = Object.assign(
                {},
                state.toJS().po);
            basicInfo = po.basicInfo || {};
            basicInfo = Object.assign(basicInfo, action.payload);
            po.basicInfo = basicInfo;
            return state.set("po", po);

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
            poLines.forEach(function (element, index, array) {
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
            poLines = po.poLines || [];
            payload = action.payload || {};
            let newPoLines = poLines.filter(function (line) {
                return line.productCode !== payload.productCode;
            });
            po.poLines = newPoLines;
            return state.set("po", fromJS(po));

        case ActionType.RECEIVE_PO_RCV_MNG_LIST://采购收货单管理列表
            return state.set('poRcvMngList', fromJS(action.payload));

        case ActionType.RECEIVE_PO_RCV_LIST://采购单收货列表
            return state.set('poRcvList', fromJS(action.payload));

        case ActionType.RECEIVE_PO_RCV_DETAIL://收货单详情
            return state.set('poRcv', fromJS(action.payload));

        case ActionType.RECEIVE_NEW_PURCHASE_ORDER://收货单详情
            return state.set('newPcOdData', fromJS(action.payload));

        case ActionType.RECEIVE_PO_RCV_INIT://初始收货单详情
            payload = action.payload || {};
            return state.set('poRcv', fromJS(action.payload));

        case ActionType.UPDATE_PO_RCV_LINE://更新收货单商品行
            poRcv = Object.assign(
                {},
                state.toJS().poRcv);
            poLines = poRcv.poLines || [];
            payload = action.payload || {};
            poLines.forEach(function (element, index, array) {
                if (element.materialCd == payload.materialCd) {
                    array[index] = payload;
                }
            });
            poRcv.poLines = poLines;
            return state.set("poRcv", poRcv);

        case ActionType.UPDATE_PO_RCV_BASICINFO://更新收货单基本信息
            poRcv = Object.assign(
                {},
                state.toJS().poRcv);
            basicInfo = poRcv.basicInfo || {};
            payload = action.payload || {};
            basicInfo = Object.assign(basicInfo, payload);
            poRcv.basicInfo = basicInfo;
            return state.set("poRcv", poRcv);
        default:
            return state;
    }
}
