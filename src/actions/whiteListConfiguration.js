/**
 * @file promotion.js
 * @author taoqiyu
 *
 * 促销活动action
 */
import ActionType from './ActionType';
import {
    queryWhitelist as queryWhiteListService,
    onlineWhitelist as onlineService,
    offlineWhitelist as offlineService,
} from '../service';
/**
 * 白名单列表 Action
 */
const queryWhiteListAction = (data) => ({
    type: ActionType.QUERY_WHITE_LIST,
    payload: data
});

export const queryWhitelist = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryWhiteListService(params)
            .then(res => {
                dispatch(
                    queryWhiteListAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 上线
 */
const onlineAction = (data) => ({
    type: ActionType.ONLINE_WHITE_LIST,
    payload: data
});

export const onlineWhitelist = (params) => dispatch => (
    new Promise((resolve, reject) => {
        onlineService(params)
            .then(res => {
                dispatch(
                    onlineAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 下线
 */
const offlineAction = (data) => ({
    type: ActionType.ONLINE_WHITE_LIST,
    payload: data
});

export const offlineWhitelist = (params) => dispatch => (
    new Promise((resolve, reject) => {
        offlineService(params)
            .then(res => {
                dispatch(
                    offlineAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 清空优惠券列表
 */
export const clearWhiteList = () => dispatch => (dispatch({
    type: ActionType.CLEAR_WHITE_LIST,
    payload: []
}));

