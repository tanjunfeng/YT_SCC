/**
 * @file columns.js
 * @author taoqiyu
 *
 * 促销活动列表
 */
import { promotionStatus } from './constants';
import Util from '../../util/util';

// 供应商列表
const managementList = [{
    title: '活动ID',
    dataIndex: 'id',
    key: 'id'
}, {
    title: '名称',
    dataIndex: 'promotionName',
    key: 'promotionName'
}, {
    title: '折扣比例',
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
        return '指定区域';
    }
}, {
    title: '活动时间',
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
    title: '参与数据',
    dataIndex: 'recordsPoList',
    key: 'recordsPoList',
    render: list => (list ? list.length : 0)
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

const detail = [{
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

export { managementList, detail };
