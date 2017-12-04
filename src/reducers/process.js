/**
 * @file promotion.js
 *
 * @author chenghaojie
 * 流程管理和流程管理相关 reducer
 */

import { fromJS } from 'immutable';
import ActionType from '../actions/ActionType';

const initState = fromJS({
    processData: {}, // 流程管理列表
    flowChartData: null, // 流程图数据
    highChartData: null // 高亮流程图数据
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.FETCH_PROCESS_DATA:
        case ActionType.CLEAR_PROCESS_DATA:
        // case ActionType.DELECT_PROCESS_DATA:
            return state.set('processData', fromJS(action.payload));
        case ActionType.FETCH_CHART_DATA:
        case ActionType.CLEAR_CHART_DATA:
            return state.set('flowChartData', fromJS(action.payload));
        case ActionType.FETCH_HIGH_CHART_DATA:
        case ActionType.CLEAR_HIGH_CHART_DATA:
            return state.set('highChartData', fromJS(action.payload));
        default:
            return state;
    }
}
