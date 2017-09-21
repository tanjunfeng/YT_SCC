/*
 * @Author: tanjf
 * @Description: 优惠券列表
 * @CreateDate: 2017-09-20 14:06:42
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-09-21 16:54:59
 */
/**
 * @file columns.js
 * @author taoqiyu
 *
 * 促销活动列表
 */
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
        return '所选区域';
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
    dataIndex: 'recordsPoList',
    key: 'recordsPoList',
    render: list => (list ? list.length : 0)
}, {
    title: '已领取',
    dataIndex: 'hasLq',
    key: 'hasLq',
    render: note => note || '无'
}, {
    title: '已使用',
    dataIndex: 'jasUsed',
    key: 'jasUsed',
    render: note => note || '无'
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

export { couponList };
