/**
 * @file saleRegionsDtail.js
 * @author shijh
 * 
 * 获取供应商列表action
 */

import Promise from 'bluebird';
import { fetchSaleRegionsDtail } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.RECEIVE_SALE_REGIONS_DETAIL,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchSaleRegionsDtail(params)
            .then(res => {
                dispatch(receive(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)
