/**
 * @file queryproductsbypages.js
 * @author zhangbaihua
 *
 * 根据条件分页查询商品清单，并排序
 */

import { queryproductsbypages } from '../service';
import ActionType from './ActionType';
import Promise from 'bluebird';

const queryCommodityList = (data) => ({
    type: ActionType.QUERY_COMMODITY_DETAILED_LIST,
    payload: data
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryproductsbypages(params)
            .then(res => {
                dispatch(queryCommodityList(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)
