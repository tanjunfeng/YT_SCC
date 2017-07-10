/**
 * @file Updatecategorygoodsordernum.js
 *
 * @author Tanjunfeng
 *
 * 修改分类商品排序号
 */

import Promise from 'bluebird';
import { fetchUpDateCategoryGoodsOrderNum } from '../../service';
import ActionType from '../ActionType';

/**
 * @file Updatecategorygoodsordernum.js
 *
 * 修改分类商品排序号
 */

const receiveCategoryOder = (data) => ({
    type: ActionType.UPDATE_CATEGORY,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        fetchUpDateCategoryGoodsOrderNum(params)
            .then(res => {
                dispatch(receive(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)