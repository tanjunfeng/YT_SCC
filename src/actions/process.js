/**
 * @file promotion.js
 * @author taoqiyu
 *
 * 促销活动action
 */
import ActionType from './ActionType';
import {
    queryProcessList as queryProcessListService,
    queryChartData as queryChartDataService
} from '../service';

// 流程管理
const queryProcessListAction = (data) => ({
    type: ActionType.FETCH_PROCESS_DATA,
    payload: data
});

export const queryProcessData = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryProcessListService(params)
            .then(res => {
                dispatch(
                    queryProcessListAction(res.data));
                resolve(res);
            })
            .catch(err => reject(err));
    })
);
// 流程管理下获取流程图数据
const queryChartDataAction = (data) => ({
    type: ActionType.FETCH_CHART_DATA,
    payload: data
});

export const queryChartData = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryChartDataService(params)
            .then(res => {
                dispatch(
                    queryChartDataAction(res.data));
                resolve(res);
            })
            .catch(err => reject(err));
    })
);

/**
 * 清空流程管理列表
 */
export const clearProcessData = () => dispatch => (dispatch({
    type: ActionType.CLEAR_PROCESS_DATA,
    payload: {}
}));

/**
 * 清空流程管理列表
 */
export const clearChartData = () => dispatch => (dispatch({
    type: ActionType.CLEAR_CHART_DATA,
    payload: {}
}));
