/**
 * @file commodityS.js
 *
 * @author shixinyuan
 * 供应商管理相关reducer
 */

import Immutable, { fromJS } from 'immutable';
import ActionType from '../actions/ActionType';

const initState = fromJS({
    // 供应商管理列表
    data: {},
    // 弹出框数据
    visibleData: {},
    // 地区管理列表
    areaData: {},
    // 供应商申请列表
    applicationData: {},
    // 修改申请列表
    modifyData: {},
    // 地区详情
    areaDetailData: [],
    // 查看不通过原因
    resonData: {},
    // 插入数据入驻审核结果
    insertSettlementResult: false,
    // 控制弹出框显示影藏
    auditVisible: false,
    // 供应商详情
    detailData: {},
    // 供应商新老数据对比
    changeData: [],
    // 供应商或供应商地点id
    supplierId: 0,
    // 新增或修改供应商结果
    supplierInfo: false,
    // 供应商供应省市信息
    placeRegion: [],
    informationVisible: false,
    checkResonVisible: false,
    areaVisible: false,

    // 供应商入驻列表
    querySettledList: {},
    // 供应商入驻列表
    queryManageList: {},
    // 查询供应商修改前修改后的信息
    editBeforeAfter: []

});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.RECEIVE_SUPPLIER_MANAGE_LIST:
            return state.set('data', fromJS(action.payload));

        case ActionType.MODIFY_INFORMATION_VISIBLE: {
            const { isVisible, record = {} } = action.payload;
            return state.set('informationVisible', isVisible).set('visibleData', record);
        }

        case ActionType.RECEIVE_AREA_LIST:
            return state.set('areaData', action.payload);

        case ActionType.RECEIVE_APPLICATION_LIST:
            return state.set('applicationData', action.payload);

        case ActionType.RECEIVE_EDIT_APPLY_LIST: {
            return state.set('modifyData', action.payload);
        }

        case ActionType.MODIFY_SUPPLIER_FROZEN: {
            const data = state.toJS().data;
            const { index, isFrozen } = action.payload;
            data.data[index].status = isFrozen ? 3 : 2;
            return state.set('data', Immutable.fromJS(data));
        }

        case ActionType.MODIFY_SUPPLIER_COLLABORATION: {
            const data = state.toJS().data;
            const { index, isCloseCollaboration } = action.payload;
            data.data[index].status = isCloseCollaboration ? 4 : 2;
            return state.set('data', Immutable.fromJS(data));
        }

        case ActionType.MODIFY_AUDIT_VISIBLE: {
            const { isVisible, record } = action.payload;
            return state.set('auditVisible', isVisible).set('visibleData', record);
        }

        case ActionType.MODIFY_CHECK_REASON_VISIBLE: {
            const { isVisible, record } = action.payload;
            return state.set('checkResonVisible', isVisible).set('visibleData', record);
        }

        case ActionType.MODIFY_AREA_VISIBLE: {
            const { isVisible, record } = action.payload;
            return state.set('areaVisible', isVisible).set('visibleData', record);
        }

        case ActionType.RECEIVE_SALE_REGIONS_DETAIL: {
            return state.set('areaDetailData', action.payload);
        }

        case ActionType.RECEIVE_CHANGE_COOPERATION_INFO: {
            return state.set('informationVisible', false);
        }
        case ActionType.RECEIVE_INSERT_SETTLEMENT_INFO: {
            return state.set('insertSettlementResult', true).set('auditVisible', false);
        }

        case ActionType.FIND_AUTH_FAILED_REASON: {
            return state.set('resonData', action.payload);
        }

        case ActionType.RECEIVE_SUPPLIER_DETAIL: {
            return state.set('detailData', action.payload);
        }

        case ActionType.RECEIVE_SUPPLIER_NO:
            return state.set('supplierId', action.payload);

        case ActionType.RECEIVE_INSERT_SUPPLIER_INFO:
            return state.set('supplierInfo', action.payload);

        case ActionType.RECEIVE_SHOW_DATA:
            return state.set('changeData', fromJS(action.payload));

        case ActionType.QUERY_SETTLED_LIST:
            return state.set('querySettledList', fromJS(action.payload));

        case ActionType.QUERY_MANAGE_LIST:
            return state.set('queryManageList', fromJS(action.payload));

        case ActionType.EDIT_BEFORE_AFTER:
            return state.set('editBeforeAfter', fromJS(action.payload));

        case ActionType.RECEIVE_PLACE_REGION:
            return state.set('placeRegion', fromJS(action.payload))

        default:
            return state;
    }
}
