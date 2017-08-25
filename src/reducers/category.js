/**
 * @file commodityS.js
 *
 * @author Tanjunfeng
 * 供应商管理相关reducer
 */

import Immutable, { fromJS } from 'immutable';
import ActionType from '../actions/ActionType';

const initState = fromJS({
    // 弹出框数据
    visibleData: {},
    // 控制弹出框显示影藏
    auditVisible: false,
    informationVisible: false,
    checkResonVisible: false,
    areaVisible: false
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.RECEIVE_GET_CATEGORYS:
            return state.set('data', fromJS(action.payload));

        case ActionType.MODIFY_CATEGORY_VISIBLE: {
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

        case ActionType.RECEIVE_INSERT_SETTLEMENT_INFO: {
            return state.set('insertSettlementResult', true).set('auditVisible', false);
        }

        case ActionType.FIND_AUTH_FAILED_REASON: {
            return state.set('resonData', action.payload);
        }

        case ActionType.RECEIVE_SUPPLIER_DETAIL: {
            return state.set('detailData', action.payload);
        }

        case ActionType.RECEIVE_SHOW_DATA:
            return state.set('changeData', fromJS(action.payload))
        default:
            return state;
    }
}
