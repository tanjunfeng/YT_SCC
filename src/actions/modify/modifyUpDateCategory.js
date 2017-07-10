/**
 * @file modifyUpDateCategory.js
 *
 * @author Tanjunfeng
 *
 * 修改分类商品排序号
 */
import Promise from 'bluebird';
import { fetchOrderNum } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.UPDATE_CATEGORY,
    payload: data
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchOrderNum(params)
            .then(res => {
                dispatch(receive(res.data));
                resolve();
            })
            .catch(error => {
                reject(error);
            })
    })
)

