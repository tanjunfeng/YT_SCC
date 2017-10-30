/**
 * @file salesManagement.js
 * @author liujinyu
 *
 */

import { getReturnGoodsList, getReturnGoodsDetail } from '../service';
import ActionType from './ActionType';
import Promise from 'bluebird';


// 获取list数据
const receive = (data) => ({
    type: ActionType.RECEIVE_RETURN_GOODS_LIST,
    payload: data,
});

export const returnGoodsList = (params) => dispatch => (
    new Promise((resolve, reject) => {
        getReturnGoodsList(params)
            .then(res => {
                dispatch(receive(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 退货详情页数据获取

const detailReceive = (data) => ({
    type: ActionType.RETURN_GOODS_DETAIL,
    payload: data
});

export const returnGoodsDetail = (params) => dispatch => (
    new Promise((resolve, reject) => {
        getReturnGoodsDetail(params)
            .then(res => {
                dispatch(detailReceive(res.data))
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 退货详情页数据清空

export const returnGoodsDetailClearData = () => ({
    type: ActionType.RETURN_GOODS_DETAIL_CLEAR_DATA
})

