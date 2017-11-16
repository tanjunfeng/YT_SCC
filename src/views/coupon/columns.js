/*
 * @Author: tanjf
 * @Description: 优惠券列表
 * @CreateDate: 2017-09-20 14:06:42
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-11-11 23:17:17
 */
/**
 * @file columns.js
 * @author taoqiyu
 *
 * 促销活动列表
 */
import React from 'react';
import { promotionStatus, couponTypeStatus } from './constants';
import Util from '../../util/util';

// 优惠券列表
const couponList = [{
    title: '券ID',
    dataIndex: 'id',
    key: 'id'
}, {
    title: '类型',
    dataIndex: 'couponType',
    key: 'couponType',
    render: couponTypeCode => (couponTypeStatus[couponTypeCode])
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
    title: '使用区域',
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
    title: '有效日期',
    colSpan: 2,
    dataIndex: 'startDate',
    render: timestamp => ({
        children: Util.getTime(timestamp)
    })
}, {
    title: '结束时间',
    colSpan: 0,
    dataIndex: 'endDate',
    render: (timestamp, row) => ({
        children: Util.getTime(row.endDate)
    })
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
    title: '优惠券类型',
    dataIndex: 'couponType',
    key: 'couponType',
    render: couponTypeCode => couponTypeStatus[couponTypeCode]
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
    title: '发放方式',
    dataIndex: 'grantChannel',
    key: 'grantChannel',
    render: note => (note === 'platform' ? '平台发放' : '用户领取')
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
    title: '与促销活动叠加',
    dataIndex: 'isSuperposeProOrCouDiscount',
    key: 'isSuperposeProOrCouDiscount',
    render: note => (note === 1 ? '是' : '否')
}, {
    title: '与会员等级叠加',
    dataIndex: 'isSuperposeUserDiscount',
    key: 'isSuperposeUserDiscount',
    render: note => (note === 1 ? '是' : '否')
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

const usedParticipateColumns = [{
    title: '所属子公司',
    dataIndex: 'branchCompanyName',
    key: 'branchCompanyName',
    render: note => note || '全部'
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
    key: 'orderState',
    render: (text) => {
        switch (text) {
            case 'W':
                return '待审核';
            case 'M':
                return '待人工审核';
            case 'A':
                return '已审核';
            case 'Q':
                return '已取消';
            case 'C':
                return '已完成';
            case 'SP':
                return '已拆单';
            default:
                return text;
        }
    }
}, {
    title: '支付状态',
    dataIndex: 'paymentState',
    key: 'paymentState',
    render: (text) => {
        switch (text) {
            case 'WZF':
                return '未支付';
            case 'YZF':
                return '已支付';
            case 'TKD':
                return '退款待审核';
            case 'TKQ':
                return '退款待确认 ';
            case 'YTK':
                return '已退款';
            case 'QXFK':
                return '取消付款';
            case 'GSN':
                return '公司内';
            default:
                return text;
        }
    }
}, {
    title: '物流状态',
    dataIndex: 'shippingState',
    key: 'shippingState',
    render: (text) => {
        switch (text) {
            case 'DCL':
                return '待处理';
            case 'WCS':
                return '未传送';
            case 'DCK':
                return '待出库';
            case 'WJS':
                return '仓库拒收 ';
            case 'DSH':
                return '待收货';
            case 'YQS':
                return '已签收';
            case 'WSD':
                return '未送达';
            case 'QXZ':
                return '取消中';
            case 'QX':
                return '取消送货';
            case 'CGWDH':
                return '库存不足';
            default:
                return text;
        }
    }
}, {
    title: '订单金额',
    dataIndex: 'orderPrice',
    key: 'orderPrice'
}];

const unUsedParticipateColumns = [{
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

const garbageParticipateColumns = [{
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
}, {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    render: (text) => {
        switch (text) {
            case 'active':
                return '已领取';
            case 'used':
                return '已使用';
            case 'canceled':
                return '已作废';
            default:
                return text;
        }
    }
}, {
    title: '作废时间',
    dataIndex: 'modifyTime',
    key: 'modifyTime',
    render: timestamp => Util.getTime(timestamp)
}];

export {
    couponList, couponsDetail, usedParticipateColumns,
    unUsedParticipateColumns, garbageParticipateColumns
};
