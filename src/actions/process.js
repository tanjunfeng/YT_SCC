/**
 * @file process.js
 * @author chenghaojie
 *
 * 流程action
 */
import ActionType from './ActionType';
import {
    queryProcessList as queryProcessListService,
    delectProcessList as delectProcessListService,
    queryChartData as queryChartDataService,
    processImage as processImageService,
    queryProcessMsgInfo as queryProcessMsgInfoService,
    processImageByBusi as processImageByBusiService,
    queryCommentHisByBusi as queryCommentHisByBusiService,
    queryProdPriceChangeList as queryProdPriceChangeListService,
    auditInfo as auditInfoService,
} from '../service';

// 流程管理下获取所有流程信息
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
// 流程管理下根据ID删除一条流程信息
const delectProcessListAction = (data) => ({
    type: ActionType.DELECT_PROCESS_DATA,
    payload: data
});

export const delectProcessData = (params) => dispatch => (
    new Promise((resolve, reject) => {
        delectProcessListService(params)
            .then(res => {
                dispatch(
                    delectProcessListAction(res.data));
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
 * 清空流程图数据
 */
export const clearChartData = () => dispatch => (dispatch({
    type: ActionType.CLEAR_CHART_DATA,
    payload: null
}));

// 待办事项下采购单审批列表获取高亮流程图数据
const queryHighChartAction = (data) => ({
    type: ActionType.FETCH_HIGH_CHART_DATA,
    payload: data
});

export const queryHighChart = (params) => dispatch => (
    new Promise((resolve, reject) => {
        processImageService(params)
            .then(res => {
                dispatch(
                    queryHighChartAction(res.data));
                resolve(res);
            })
            .catch(err => reject(err));
    })
);

/**
 * 清空高亮流程图数据
 */
export const clearHighChart = () => dispatch => (dispatch({
    type: ActionType.CLEAR_HIGH_CHART_DATA,
    payload: null
}));

/**
 * 查询待办事项下获取审批列表数据
 * @param {*} data
 */
const queryProcessMsgInfoAction = (data) => ({
    type: ActionType.QUERY_PROCESS_MSG_LIST,
    payload: data
});

export const queryProcessMsgInfo = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryProcessMsgInfoService(params)
            .then(res => {
                dispatch(queryProcessMsgInfoAction(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

/**
 * 查询待办事项下价格变更记录列表数据
 * @param {*} data
 */
const queryPriceChangeListAction = data => ({
    type: ActionType.QUERY_PRICE_CHANGE_LIST,
    payload: data
});

export const queryPriceChangeList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryProdPriceChangeListService(params)
            .then(res => {
                dispatch(queryPriceChangeListAction(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 业务中获取高亮流程图数据
const processImageBusiAction = (data) => ({
    type: ActionType.PROCESS_IMAGE_BY_BUSI,
    payload: data
});

export const processImageBusi = (params) => dispatch => (
    new Promise((resolve, reject) => {
        processImageByBusiService(params)
            .then(res => {
                dispatch(
                    processImageBusiAction(res.data));
                resolve(res);
            })
            .catch(err => reject(err));
    })
);

/**
 * 清空业务中高亮流程图数据
 */
export const clearprocessImageBusi = () => dispatch => (dispatch({
    type: ActionType.CLEAR_PROCESS_IMAGE_BUSI,
    payload: null
}));

/**
 * 查询待办事项下获取审批列表数据
 * @param {*} data
 */
const queryCommentHisBusiAction = (data) => ({
    type: ActionType.QUERY_COMMENT_HIS_BUSI,
    payload: data
});

export const queryCommentHisBusi = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryCommentHisByBusiService(params)
            .then(res => {
                dispatch(queryCommentHisBusiAction(res.data));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)

/**
 * 审批代办事项
 * @param {*} data
 */
const returnAuditInfoAction = (data) => ({
    type: ActionType.RETURN_AUDIT_INFO,
    payload: data
});

export const returnAuditInfo = (params) => dispatch => (
    new Promise((resolve, reject) => {
        auditInfoService(params)
            .then(res => {
                dispatch(returnAuditInfoAction(res));
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
)
