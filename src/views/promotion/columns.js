/**
 * @file columns.js
 * @author taoqiyu
 *
 * 促销活动列表
 */
import { promotionStatus } from './constants';
import Util from '../../util/util';

// 供应商列表
export const promotionMngList = [{
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
    dataIndex: 'categoryName',
    key: 'categoryName'
},
{
    title: '范围',
    dataIndex: 'scope',
    key: 'scope'
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
    dataIndex: 'records',
    key: 'records'
}, {
    title: '备注',
    dataIndex: 'note',
    key: 'note'
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
