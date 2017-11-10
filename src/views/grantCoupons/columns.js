/*
 * @Author: tanjf
 * @Description: 优惠券列表
 * @CreateDate: 2017-09-20 14:06:42
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-09-21 18:21:15
 */
import React from 'react';
import Util from '../../util/util';
import { promotionStatus } from './constants';

// 发放优惠券列表
const grantCouponsColumns = [{
    title: '加盟商编号',
    dataIndex: 'franchiseeId',
    key: 'franchiseeId',
    render: note => note || '无'
}, {
    title: '加盟商名称',
    dataIndex: 'franchinessController',
    key: 'franchinessController',
    render: note => note || '无'
}, {
    title: '门店编号',
    dataIndex: 'storeId',
    key: 'storeId',
    render: note => note || '无'
}, {
    title: '门店名称',
    dataIndex: 'storeName',
    key: 'storeName',
    render: note => note || '无'
}, {
    title: '加盟商姓名',
    dataIndex: 'proName',
    key: 'proName',
    render: note => note || '无'
}, {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone',
    render: note => note || '无'
}, {
    title: '所属子公司',
    dataIndex: 'branchCompanyName',
    key: 'branchCompanyName',
    render: name => name || '无'
}];

// 选择优惠券类型列表页字段
const releaseCouponsColumns = [{
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
}, {
    title: '范围',
    dataIndex: 'companiesPoList',
    key: 'companiesPoList',
    render: list => {
        if (!list || list.length === 0) {
            return '全国';
        }
        const areas = list.map(company => company.companyName).join(',');
        return (
            <span title={areas} alt={areas}>所选区域</span>
        );
    }
}, {
    title: '使用条件',
    dataIndex: 'quanifyAmount',
    key: 'quanifyAmount',
    render: amount => (amount ? `满${amount}可用` : '不限制')
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
    key: 'totalQuantity'
}, {
    title: '已领取',
    dataIndex: 'grantQty',
    key: 'grantQty'
}, {
    title: '已使用',
    dataIndex: 'usedQty',
    key: 'usedQty'
}, {
    title: '备注',
    dataIndex: 'note',
    key: 'note'
}];

const grantCouponsDetail = [{
    title: '活动ID',
    dataIndex: 'id',
    key: 'id'
}, {
    title: '活动名称',
    dataIndex: 'promotionName',
    key: 'promotionName'
}, {
    title: '活动状态',
    dataIndex: 'status',
    key: 'status',
    render: statusCode => promotionStatus[statusCode]
}, {
    title: '折扣比例',
    dataIndex: 'discount',
    key: 'discount',
    render: discount => `${discount}%`
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
    title: '使用条件',
    dataIndex: 'quanifyAmount',
    key: 'quanifyAmount',
    render: amount => (amount ? `满 ${amount} 元可用` : '不限制')
}, {
    title: '使用区域',
    dataIndex: 'companiesPoList',
    key: 'companiesPoList',
    render: list => {
        if (!list || list.length === 0) {
            return '全部区域';
        }
        return list.map(company => company.companyName).join(',');
    }
}, {
    title: '使用品类',
    dataIndex: 'promoCategoriesPo',
    key: 'promoCategoriesPo',
    render: category => {
        if (!category) {
            return '全部品类';
        }
        return category.categoryName
    }
}, {
    title: '指定门店',
    dataIndex: 'stores',
    key: 'stores',
    render: stores => {
        if (!stores) {
            return '未指定';
        }
        return stores.storeId;
    }
}, {
    title: '备注',
    dataIndex: 'note',
    key: 'note',
    render: note => note || '无'
}];

export { grantCouponsColumns, releaseCouponsColumns, grantCouponsDetail };
