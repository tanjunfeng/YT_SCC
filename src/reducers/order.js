/**
 * @file order.js
 *
 * @author caoyanxuan
 * 订单管理相关reducer
 */

import { fromJS } from 'immutable';
import ActionType from '../actions/ActionType';

const initState = fromJS({
    auditModalVisible: false,
    visibleData: {},
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.MODIFY_AUDIT_MODAL_VISIBLE: {
            const { isVisible, record } = action.payload;
            return state.set('auditModalVisible', isVisible).set('visibleData', record);
        }

        default:
            return state;
    }
}
