/**
 * @file supperList.js
 *
 * @author shijh
 * 获取供应商列表action
 */

import Promise from 'bluebird';
import { fectheEditorContent } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.UPDATE_EDITOR_CONTENT,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        fectheEditorContent(params)
            .then(res => {
                // dispatch(receive(res.data));
                resolve(res.data)
            })
            .catch(err => {
                reject(err);
            })
    })
)
