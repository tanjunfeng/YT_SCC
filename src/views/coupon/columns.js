/*
 * @Author: tanjf
 * @Description: 优惠券列表
 * @CreateDate: 2017-09-20 14:06:42
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-09-25 16:59:46
 */
/**
 * @file columns.js
 * @author taoqiyu
 *
 * 促销活动列表
 */
import React from 'react';
import { promotionStatus } from './constants';
import Util from '../../util/util';

// 优惠券列表
const couponList = [{
    title: '券ID',
    dataIndex: 'id',
    key: 'id'
}, {
    title: '券名称',
    dataIndex: 'promotionName',
    key: 'promotionName'
}, {
    title: '面额',
    dataIndex: 'discount',
    key: 'discount'
}, {
    title: '品类',
    dataIndex: 'promoCategoriesPo',
    key: 'promoCategoriesPo',
    render: category => {
        if (!category) {
            return '全部品类';
        }
        return category.categoryName
    }
},
{
    title: '范围',
    dataIndex: 'companiesPoList',
    key: 'companiesPoList',
    render: list => {
        if (!list || list.length === 0) {
            return '全部区域';
        }
        const areas = list.map(company => company.companyName);
        return (
            <span title={areas} alt={areas}>所选区域</span>
        );
    }
}, {
    title: '使用条件',
    dataIndex: 'quanifyAmount',
    key: 'quanifyAmount',
    render: amount => (amount ? `满 ${amount} 元可用` : '不限制')
}, {
    title: '有效时间',
    children: [{
        title: '开始时间',
        dataIndex: 'startDate',
        key: 'startDate',
        render: timestamp => Util.getTime(timestamp)
    }, {
        title: '结束时间',
        dataIndex: 'endDate',
        key: 'endDate',
        render: timestamp => Util.getTime(timestamp)
    }],
}, {
    title: '发放数量',
    dataIndex: 'totalQuantity',
    key: 'totalQuantity',
    render: note => note || 0
}, {
    title: '已领取',
    dataIndex: 'grantQty',
    key: 'grantQty',
    render: note => note || 0
}, {
    title: '已使用',
    dataIndex: 'usedQty',
    key: 'usedQty',
    render: note => note || 0
}, {
    title: '备注',
    dataIndex: 'note',
    key: 'note',
    render: note => note || '无'
}, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: statusCode => promotionStatus[statusCode]
}, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation'
}];

const couponsDetail = [{
    title: '券ID',
    dataIndex: 'id',
    key: 'id'
}, {
    title: '券名称',
    dataIndex: 'promotionName',
    key: 'promotionName'
}, {
    title: '面额',
    dataIndex: 'discount',
    key: 'discount'
}, {
    title: '品类',
    dataIndex: 'promoCategoriesPo',
    key: 'promoCategoriesPo',
    render: category => {
        if (!category) {
            return '全部品类';
        }
        return category.categoryName
    }
},
{
    title: '范围',
    dataIndex: 'companiesPoList',
    key: 'companiesPoList',
    render: list => {
        if (!list || list.length === 0) {
            return '全部区域';
        }
        const areas = list.map(company => company.companyName);
        return (
            <span title={areas} alt={areas}>所选区域</span>
        );
    }
}, {
    title: '使用条件',
    dataIndex: 'quanifyAmount',
    key: 'quanifyAmount',
    render: amount => (amount ? `满 ${amount} 元可用` : '不限制')
}, {
    title: '生效时间',
    dataIndex: 'startDate',
    key: 'startDate',
    render: timestamp => Util.getTime(timestamp)
}, {
    title: '过期时间',
    dataIndex: 'endDate',
    key: 'endDate',
    render: timestamp => Util.getTime(timestamp)
}, {
    title: '发放数量',
    dataIndex: 'totalQuantity',
    key: 'totalQuantity',
    render: note => note || 0
}, {
    title: '已领取',
    dataIndex: 'grantQty',
    key: 'grantQty',
    render: note => note || 0
}, {
    title: '已使用',
    dataIndex: 'usedQty',
    key: 'usedQty',
    render: note => note || 0
}, {
    title: '备注',
    dataIndex: 'note',
    key: 'note',
    render: note => note || '无'
}, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: statusCode => promotionStatus[statusCode]
}];

const participateList = [{
    title: '所属子公司',
    dataIndex: 'branchCompanyName',
    key: 'branchCompanyName'
}, {
    title: '加盟商编号',
    dataIndex: 'franchiseeId',
    key: 'franchiseeId'
}, {
    title: '加盟商名称',
    dataIndex: 'franchinessController',
    key: 'franchinessController'
}, {
    title: '门店编号',
    dataIndex: 'storeId',
    key: 'storeId'
}, {
    title: '门店名称',
    dataIndex: 'storeName',
    key: 'storeName'
}, {
    title: '券ID',
    dataIndex: 'promoId',
    key: 'promoId'
}, {
    title: '订单号',
    dataIndex: 'orderId',
    key: 'orderId'
}, {
    title: '使用时间',
    dataIndex: 'recordTime',
    key: 'recordTime',
    render: timestamp => Util.getTime(timestamp)
}, {
    title: '订单状态',
    dataIndex: 'orderState',
    key: 'orderState'
}, {
    title: '支付状态',
    dataIndex: 'paymentState',
    key: 'paymentState'
}, {
    title: '物流状态',
    dataIndex: 'shippingState',
    key: 'shippingState'
}, {
    title: '订单金额',
    dataIndex: 'orderPrice',
    key: 'orderPrice'
}];

const participateListTab2 = [{
    title: '所属子公司',
    dataIndex: 'branchCompanyName',
    key: 'branchCompanyName'
}, {
    title: '加盟商编号',
    dataIndex: 'franchiseeId',
    key: 'franchiseeId'
}, {
    title: '加盟商名称',
    dataIndex: 'franchinessController',
    key: 'franchinessController'
}, {
    title: '门店编号',
    dataIndex: 'storeId',
    key: 'storeId'
}, {
    title: '门店名称',
    dataIndex: 'storeName',
    key: 'storeName'
}, {
    title: '券ID',
    dataIndex: 'promoId',
    key: 'promoId'
}, {
    title: '领取时间',
    dataIndex: 'activityDate',
    key: 'activityDate',
    render: timestamp => Util.getTime(timestamp)
}];

export { couponList, couponsDetail, participateList, participateListTab2 };
