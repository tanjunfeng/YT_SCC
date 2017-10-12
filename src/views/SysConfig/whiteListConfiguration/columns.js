/*
 * @Author: tanjf
 * @Description: 优惠券列表
 * @CreateDate: 2017-09-20 14:06:42
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-10-12 15:12:51
 */
/**
 * @file columns.js
 * @author taoqiyu
 *
 * 促销活动列表
 */
import React from 'react';
import { promotionStatus } from './constants';
import Util from '../../../util/util';

// 优惠券列表
const couponList = [{
    title: '所属子公司',
    dataIndex: 'company',
    key: 'company'
}, {
    title: '加盟商编号',
    dataIndex: 'id',
    key: 'id'
}, {
    title: '加盟商名称',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '门店编号',
    dataIndex: 'storeId',
    key: 'storeId'
},
{
    title: '门店名称',
    dataIndex: 'storeName',
    key: 'storeName'
}, {
    title: '省',
    dataIndex: 'sheng',
    key: 'sheng',
}, {
    title: '市',
    dataIndex: 'shi',
    key: 'shi',
}, {
    title: '区',
    dataIndex: 'qu',
    key: 'qu',
}, {
    title: '详细地址',
    dataIndex: 'adress',
    key: 'adress',
}, {
    title: '联系人',
    dataIndex: 'call',
    key: 'call',
}, {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone'
}, {
    title: '上线状态',
    dataIndex: 'upLoad',
    key: 'upLoad'
}, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: upLoad => (upLoad === '已上线' ? '下线' : '上线')
}];

export { couponList };
