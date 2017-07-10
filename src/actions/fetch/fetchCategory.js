/**
 * @file fetchCategory.js
 *
 * @author Tanjunfeng
 *
 * 分类列表页商品排序管理
 */

import Promise from 'bluebird';
import { fetchCategoryList } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.RECEIVE_GET_CATEGORYS,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchCategoryList(params)
            .then(res => {
                dispatch(receive(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)
