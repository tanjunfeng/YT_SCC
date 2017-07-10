/**
 * @file fetchStaticPageHome.js
 *
 * @author Tanjunfeng
 *
 * 静态页面列表查询
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
