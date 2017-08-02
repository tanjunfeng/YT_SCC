/**
 * @file procurement.js
 *
 * @author twh
 * 采购管理相关reducer
 */

import Immutable, { fromJS } from 'immutable';
import ActionType from '../actions/ActionType';
import { poTypeCodes } from '../constant/procurement';

const initState = fromJS({
    // 采购单管理列表
    poList: {},
    //采购单管理列表选中行
    selectedPoMngRows: {},
    //采购单详情信息
    po: {
        //采购单基本信息
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
        //采购单详情商品明细列表
        poLines: [],
    },

    poMaterial: {},
    //采购单打印列表
    poPrintList: {},
    //采购收货单管理列表
    poRcvMngList: {},
    //采购单收货列表  列表内容为 已审核且未收货采购单
    poRcvList: {},
    //采购收货单详情信息
    poRcv: {
        //收货单基本信息
        basicInfo: {
        },
        //收货单商品明细列表
        poLines: [],
    },

});

export default function (state = initState, action) {
    let po, poRcv;
    let poLines, basicInfo;
    let payload;
    switch (action.type) {
        case ActionType.RECEIVE_PO_MNG_LIST://查询采购单管理列表
            return state.set('poList', fromJS(action.payload));
        case ActionType.CHANGE_PO_MNG_SELECTED_ROWS://采购单列表界面 选中采购单
            return state.set('selectedPoMngRows', fromJS(action.payload));
        case ActionType.RECEIVE_PO_MATERIAL_BY_CD://商品编码获取商品详情
            return state.set("poMaterial", fromJS(action.payload));
        case ActionType.DELETE_PO_BY_IDS://删除采购单
            //不改变state
            return state;
        case ActionType.RECEIVE_PO_PRINT_LIST://获取采购单打印列表
            return state.set("poPrintList", fromJS(action.payload));
        case ActionType.GET_WAREHOUSE_ADDRESS_MAP:
            //不改变state
            return state;
        case ActionType.RECEIVE_PO_DETAIL://采购单详情
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
        case ActionType.ADD_PO_LINES://添加采购单商品行(单数或复数)
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
            return state.set("po", po);
        case ActionType.UPDATE_PO_LINE://更新采购单商品行
            po = Object.assign(
                {},
                state.toJS().po);
            poLines = po.poLines || [];
            payload = action.payload || {};
            poLines.forEach(function (element, index, array) {
                if (element.materialCd == payload.materialCd) {
                    array[index] = payload;
                }

            });
            po.poLines = poLines;
            return state.set("po", po);;
        case ActionType.DELETE_PO_LINE://删除采购单商品行
            po = Object.assign(
                {},
                state.toJS().po);
            poLines = po.poLines || [];
            payload = action.payload || {};
            let newPoLines = poLines.filter(function (line) {
                return line.materialCd != payload.materialCd;
            });
            po.poLines = newPoLines;
            return state.set("po", po);

        case ActionType.RECEIVE_PO_RCV_MNG_LIST://采购收货单管理列表
            return state.set('poRcvMngList', fromJS(action.payload));

        case ActionType.RECEIVE_PO_RCV_LIST://采购单收货列表
            return state.set('poRcvList', fromJS(action.payload));

        case ActionType.RECEIVE_PO_RCV_DETAIL://收货单详情
            return state.set('poRcv', fromJS(action.payload));

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
