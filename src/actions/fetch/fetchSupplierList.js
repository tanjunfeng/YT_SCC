/**
 * @file supperList.js
 *
 * @author shijh
 * 获取供应商列表action
 */

import Promise from 'bluebird';
import { fetchSupplierList } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.RECEIVE_SUPPLIER_LIST,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchSupplierList(params)
            .then(res => {
                dispatch(receive(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)
