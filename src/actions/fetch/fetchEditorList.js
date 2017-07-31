/**
 * @file fetchEditorList.js
 * @author Tanjunfeng
 *
 * 页面编辑数据列表
 */

import Promise from 'bluebird';
import { fectheEditorList } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.RECEIVE_GET_MEDIA_EDITOR,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        fectheEditorList(params)
            .then(res => {
                dispatch(receive(res.data));
                resolve(res.data)
            })
            .catch(err => {
                reject(err);
            })
    })
)
