/**
 * @file promotion.js
 *
 * @author taoqiyu
 * 促销活动管理相关 reducer
 */

import { fromJS } from 'immutable';
import ActionType from '../actions/ActionType';

const initState = fromJS({
    processData: {}, // 流程管理列表
    flowChartData: {} // 流程图数据
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.FETCH_PROCESS_DATA:
        case ActionType.CLEAR_PROCESS_DATA:
            return state.set('processData', fromJS(action.payload));
        case ActionType.FETCH_CHART_DATA:
            return state.set('flowChartData', fromJS(action.payload));
        default:
            return state;
    }
}
