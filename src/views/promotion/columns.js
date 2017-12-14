/**
 * @file columns.js
 * @author taoqiyu
 *
 * 促销活动列表
 */
import React from 'react';
import { promotionStatus, promotionRuleName, preferentialWayStatus } from './constants';
import Util from '../../util/util';

// 供应商列表
const managementList = [{
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
    key: 'promotionRule.ruleName',
    render: ruleName => promotionRuleName[ruleName]
}, {
    title: '使用区域',
    dataIndex: 'companiesPoList',
    render: list => {
        if (!list || list.length === 0) {
            return '全部区域';
        }
        const areas = list.map(company => company.companyName).join(',');
        return (
            <span title={areas} alt={areas}>所选区域</span>
        );
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

const participateList = [{
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

const detail = [{
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
    dataIndex: 'promotionRule.useConditionRule',
    render: rule => (rule ? '指定条件' : '不限制')
}, {
    title: '优惠方式',
    dataIndex: 'promotionWay',
    render: (text, record) => {
        if (record.id) {
            const { preferentialWay, preferentialValue } = record.promotionRule.orderRule;
            return `${preferentialWayStatus[preferentialWay]} ${preferentialValue}`;
        }
        return null
    }
}, {
    title: '使用区域',
    dataIndex: 'companiesPoList',
    render: list => {
        if (!list || list.length === 0) {
            return '全部区域';
        }
        return list.map(company => company.companyName).join(',');
    }
}, {
    title: '指定门店',
    dataIndex: 'stores',
    render: stores => {
        if (!stores) {
            return '未指定门店';
        }
        return stores.storeId;
    }
}, {
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

export { managementList, participateList, detail };
