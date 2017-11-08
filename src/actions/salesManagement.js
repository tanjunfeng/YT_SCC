/**
 * @file salesManagement.js
 * @author liujinyu
 *
 */
import Promise from 'bluebird';
import { getReturnGoodsList, getReturnGoodsDetail,
    getReturnGoodsOperation, getReturnGoodsDetailSave,
    getReturnDescriptionSave
} from '../service';
import ActionType from './ActionType';

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


// 页面返回定位参数
export const returnGoodsListFormData = (params) => ({
    type: ActionType.RETURN_GOODS_LIST_FORM_DATA,
    payload: params
})

// 页面确定、取消操作
export const returnGoodsOperation = (params) => (
    new Promise((resolve, reject) => {
        getReturnGoodsOperation(params)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 退货-详情页保存
export const returnGoodsDetailSave = (params) => (
    new Promise((resolve, reject) => {
        getReturnGoodsDetailSave(params)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 换货-详情页保存
export const returnDescriptionSave = (params) => (
    new Promise((resolve, reject) => {
        getReturnDescriptionSave(params)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err);
            })
    })
)
// 重置清空form数据
export const returnGoodsListFormDataClear = () => ({
    type: ActionType.RETURN_GOODS_LIST_FORM_DATA_CLEAR,
    payload: {
        data: {},
        franchiseeIdName: '',
        branchCompany: { id: '', name: '' }
    }
})

