/**
 * @file promotion.js
 * @author taoqiyu
 *
 * 促销活动action
 */
import ActionType from './ActionType';

import {
    fetchPromotionList
} from '../service';

/**
 * 促销活动列表 Action
 */
const fetchPromotionListAction = (data) => ({
    type: ActionType.FETCH_PROMOTION_LIST,
    payload: data
});

export const getPromotionList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchPromotionList(params)
            .then(res => {
                dispatch(
                    fetchPromotionListAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 清空促销活动列表
 */
const clearPromotionListAction = () => ({
    type: ActionType.CLEAR_PROMOTION_LIST,
    payload: {}
});

export const clearPromotionList = () => dispatch =>
    dispatch(clearPromotionListAction());
