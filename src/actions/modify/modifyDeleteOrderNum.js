/**
 * @file modifyCategoryVisible.js
 *
 * @author Tanjunfeng
 * 删除table行记录
 */

import Promise from 'bluebird';
import ActionType from '../ActionType';
import { fetchDeleteOrderNum } from '../../service';

const receive = (data) => ({
    type: ActionType.MODIFY_DELETE_ORDER_NUM,
    payload: data,
})

export default (data) => dispatch => (
    fetchDeleteOrderNum(data)
        .then(res => {
            dispatch(
                receive(res.data)
            );
        })
        .catch(err => Promise.reject(err))
)
