/**
 * @file promotion.js
 * @author taoqiyu
 *
 * 促销活动action
 */
import ActionType from './ActionType';
import {
    queryWhitelist as queryWhiteListService,
    onlineOffline as onlineOfflineService,
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
 * 上线下线
 */
const onlineOfflineAction = (data) => ({
    type: ActionType.ONLINE_OFFLINE,
    payload: data
});

export const onlineOffline = (params) => dispatch => (
    new Promise((resolve, reject) => {
        onlineOfflineService(params)
            .then(res => {
                dispatch(
                    onlineOfflineAction(res.data)
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

