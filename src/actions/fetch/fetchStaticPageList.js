/**
 * @file fetchStaticPageList.js
 * @author Tanjunfeng
 *
 * 分类列表页商品排序管理
 */

import Promise from 'bluebird';
import { fetchFindStaticPageList } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.RECEIVE_GET_MEDIA_MANAGEMENT,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchFindStaticPageList(params)
            .then(res => {
                dispatch(receive(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)
