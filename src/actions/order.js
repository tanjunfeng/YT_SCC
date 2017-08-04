/**
 * @file wap.js
 * @author caoyanxuan
 *
 * 订单管理相关action
 */

import {
    queryOrder,
    batchApproval,
    batchCancel,
    resendOrder,
    cancelOrder,
    queryOrderDetailInfo,
    queryPaymentDetailInfo,
    queryShippingDetailInfo,
    orderDescription,
    approvalOrder,
    auditRefund,
    confirmRefund,
} from '../service';
import ActionType from './ActionType';

// 查询订单列表
const receiveOrderList = (data) => ({
    type: ActionType.FETCH_ORDER_LIST,
    payload: data,
})
export const fetchOrderList = (data) => dispatch => (
    queryOrder(data)
        .then(res => {
            dispatch(
                receiveOrderList(res.data)
            );
        })
        .catch(err => Promise.reject(err))
)

// 批量审核
export const modifyBatchApproval = (data) => (
    new Promise((resolve, reject) => {
        batchApproval(data)
            .then(res => {
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

// 批量审核
export const modifyBatchCancel = (data) => (
    new Promise((resolve, reject) => {
        batchCancel(data)
            .then(res => {
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

// 重新传送
export const modifyResendOrder = (data) => (
    new Promise((resolve, reject) => {
        resendOrder(data)
            .then(res => {
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

// 单个审核
export const modifyApprovalOrder = (data) => (
    new Promise((resolve, reject) => {
        approvalOrder(data)
            .then(res => {
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

// 单个取消
export const modifyCancelOrder = (data) => (
    new Promise((resolve, reject) => {
        cancelOrder(data)
            .then(res => {
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

// 查询订单详情
const receiveOrderDetailInfo = (data) => ({
    type: ActionType.FETCH_ORDER_DETAIL,
    payload: data,
})
export const fetchOrderDetailInfo = (data) => dispatch => (
    queryOrderDetailInfo(data)
        .then(res => {
            dispatch(
                receiveOrderDetailInfo(res.data)
            );
        })
        .catch(err => Promise.reject(err))
)

// 查询支付详情
const receivePaymentDetailInfo = (data) => ({
    type: ActionType.FETCH_PAYMENT_DETAIL,
    payload: data,
})
export const fetchPaymentDetailInfo = (data) => dispatch => (
    queryPaymentDetailInfo(data)
        .then(res => {
            dispatch(
                receivePaymentDetailInfo(res.data)
            );
        })
        .catch(err => Promise.reject(err))
)

// 查询配送详情
const receiveShippingDetailInfo = (data) => ({
    type: ActionType.FETCH_SHIPPING_DETAIL,
    payload: data,
})
export const fetchShippingDetailInfo = (data) => dispatch => (
    queryShippingDetailInfo(data)
        .then(res => {
            dispatch(
                receiveShippingDetailInfo(res.data)
            );
        })
        .catch(err => Promise.reject(err))
)

// 保存订单详情备注信息
export const savaOrderDescription = (data) => (
    new Promise((resolve, reject) => {
        orderDescription(data)
            .then(res => {
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

// 审核退款
export const modifyAuditRefund = (data) => (
    new Promise((resolve, reject) => {
        auditRefund(data)
            .then(res => {
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

// 确认退款
export const modifyConfirmRefund = (data) => (
    new Promise((resolve, reject) => {
        confirmRefund(data)
            .then(res => {
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

