/**
 * 商品管理-采购进价
 */

// 查询采购价格变更申请列表

import ActionType from './ActionType';
import {queryPurchasePriceInfo as queryPurchasePriceInfoService} from '../service';

const queryPurchasePriceAction = (data) => ({
    type: ActionType.QUERY_PURCHASE_PRICE_INFO,
    payload: data
});

export const queryPurchasePriceInfo = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryPurchasePriceInfoService(params)
            .then(res => {
                dispatch(queryPurchasePriceAction(res.data));
                resolve(res);
            })
            .catch(err => reject(err));
    })
)
