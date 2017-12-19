/**
 * @file columns.js
 * @author taoqiyu
 *
 * 促销活动列表
 */
import React from 'react';
import {
    promotionStatus, promotionRuleStatus
} from './constants';
import Util from '../../util/util';

// 供应商列表
export const managementList = [{
    title: '活动ID',
    dataIndex: 'id'
}, {
    title: '活动名称',
    dataIndex: 'promotionName'
}, {
    title: '指定条件',
    dataIndex: 'promotionRule.useConditionRule',
    render: rule => (rule ? '指定条件' : '不限制')
}, {
    title: '优惠方式',
    dataIndex: 'promotionRule.ruleName',
    render: ruleName => promotionRuleStatus[ruleName] || '-'
}, {
    title: '使用区域',
    dataIndex: 'companiesPoList',
    render: (text, record) => {
        const { stores = null, companiesPoList = [] } = record;
        if (stores === null && companiesPoList.length === 0) {
            return '全部区域';
        }
        if (companiesPoList.length > 0) {
            const hover = companiesPoList.map(c => c.companyName).join(', ');
            return (<span title={hover} alt={hover}>指定区域</span>);
        }
        if (stores && stores.storeId) {
            return (<span title={stores.storeId} alt={stores.storeId}>指定门店</span>);
        }
        return null;
    }
}, {
    title: '开始时间',
    dataIndex: 'startDate',
    render: timestamp => Util.getTime(timestamp)
}, {
    title: '结束时间',
    dataIndex: 'endDate',
    render: timestamp => Util.getTime(timestamp)
}, {
    title: '参与数据',
    dataIndex: 'recordsPoList',
    render: list => list.length
}, {
    title: '简易描述',
    dataIndex: 'simpleDescription',
    render: note => note || '无'
}, {
    title: '状态',
    dataIndex: 'status',
    render: statusCode => promotionStatus[statusCode]
}, {
    title: '操作',
    dataIndex: 'operation'
}];

export const participateList = [{
    title: '订单号',
    dataIndex: 'orderId'
}, {
    title: '订单时间',
    dataIndex: 'submitTime'
}, {
    title: '订单状态',
    dataIndex: 'orderStateDesc'
}, {
    title: '支付状态',
    dataIndex: 'paymentStateDesc'
}, {
    title: '物流状态',
    dataIndex: 'shippingStateDesc'
}, {
    title: '订单金额',
    dataIndex: 'total'
}, {
    title: '优惠金额',
    dataIndex: 'discount'
}, {
    title: '门店编号',
    dataIndex: 'franchiseeStoreId'
}, {
    title: '门店名称',
    dataIndex: 'franchiseeStoreName'
}, {
    title: '所属子公司',
    dataIndex: 'branchCompanyName'
}];

/**
 * 下单打折详情基础字段 前部分
 */
export const basicDetailBefore = [{
    title: '活动ID',
    dataIndex: 'id'
}, {
    title: '活动名称',
    dataIndex: 'promotionName'
}, {
    title: '活动状态',
    dataIndex: 'status',
    render: statusCode => promotionStatus[statusCode]
}, {
    title: '生效时间',
    dataIndex: 'startDate',
    render: timestamp => Util.getTime(timestamp)
}, {
    title: '过期时间',
    dataIndex: 'endDate',
    render: timestamp => Util.getTime(timestamp)
}, {
    title: '使用条件',
    dataIndex: 'promotionRule',
    render: rule => (rule && rule.useConditionRule ? '指定条件' : '不限制')
}];

/**
 * 下单打折详情基础字段 后部分
 */
export const basicDetailAfter = [{
    title: '活动叠加',
    dataIndex: 'overlay',
    render: (text, record) => {
        if (record.id) {
            const arr = [];
            if (record.isSuperposeUserDiscount === 1) {
                arr.push('会员等级');
            }
            if (record.isSuperposeProOrCouDiscount === 1) {
                arr.push('优惠券');
            }
            if (arr.length === 0) {
                return '无叠加';
            }
            return arr.join(', ');
        }
        return null;
    }
}, {
    title: '活动优先级',
    dataIndex: 'priority'
}, {
    title: '简易描述',
    dataIndex: 'simpleDescription',
    render: text => text || '无'
}, {
    title: '详细描述',
    dataIndex: 'detailDescription',
    render: text => text || '无'
}, {
    title: '备注',
    dataIndex: 'note',
    render: note => note || '无'
}];
