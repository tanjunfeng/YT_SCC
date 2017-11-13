/**
 * @file salesManagement.js
 * @author liujinyu
 *
 */
import Promise from 'bluebird';
import { getReturnGoodsList, getReturnGoodsDetail,
    getReturnGoodsOperation, getReturnGoodsDetailSave as returnGoodsDetailSaveService,
    insertRefund as insertRefundService,
    returnDescriptionSave as returnDescriptionSaveService
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
const returnGoodsDetailSaveAtion = (data) => ({
    type: ActionType.RETURN_GOODS_DETAIL_SAVE,
    payload: data,
})

export const returnGoodsDetailSave = (params) => dispatch => (
    new Promise((resolve, reject) => {
        returnGoodsDetailSaveService(params)
            .then(res => {
                dispatch(
                    returnGoodsDetailSaveAtion(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

// 退货-退款
const insertRefundAction = (data) => ({
    type: ActionType.RETURN_GOODS_DETAIL_SAVE,
    payload: data,
})

export const insertRefund = (params) => dispatch => (
    new Promise((resolve, reject) => {
        insertRefundService(params)
            .then(res => {
                dispatch(
                    insertRefundAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

// 换货-详情页保存
const returnDescriptionSaveAction = (data) => ({
    type: ActionType.RETURN_DESCRIPTION_SAVE,
    payload: data,
})

export const returnDescriptionSave = (params) => dispatch => (
    new Promise((resolve, reject) => {
        returnDescriptionSaveService(params)
            .then(res => {
                dispatch(
                    returnDescriptionSaveAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
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

