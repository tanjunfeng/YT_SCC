/**
 * @file procurement.js
 *
 * @author twh
 * 采购管理相关reducer
 */

import Immutable, { fromJS } from 'immutable';
import ActionType from '../actions/ActionType';

const initState = fromJS({
    // 采购单列表
    poList: {},
    //采购单选中行
    selectedPoMngRows: {},
    //采购单商品明细列表
    poLines: {
        "data": [
            {
                materialCd: "0001",
                "id": "xxxxxxxxxxxxxxx"
            }]

    },
    poMaterial: {},
    //采购单打印列表
    poPrintList: []

});

export default function (state = initState, action) {
    console.log("state", state);
    switch (action.type) {
        case ActionType.RECEIVE_PO_MNG_LIST://查询采购单
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

        default:
            return state;
    }
}
