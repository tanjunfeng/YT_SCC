/**
 * @file formColumns.js
 * @author shijh
 *
 * 定义列表数据
 */
import React from 'react';
import { locType, poStatus } from '../../constant/procurement';

// 供应商列表
export const poMngListColumns = [
    {
        title: '采购单号',
        dataIndex: 'purchaseOrderNo',
        key: 'purchaseOrderNo',
    },
    {
        title: '采购单类型',
        dataIndex: 'poTypeName',
        key: 'poTypeName',
    },
    {
        title: '供应商编号',
        dataIndex: 'spNo',
        key: 'spNo',
    },
    {
        title: '供应商名称',
        dataIndex: 'spName',
        key: 'spName',
    },
    {
        title: '供应商地点编号',
        dataIndex: 'spAdrNo',
        key: 'spAdrNo',
    }, {
        title: '供应商地点名称',
        dataIndex: 'spAdrName',
        key: 'spAdrName',
    },
    {
        title: '预计送货日期',
        dataIndex: 'estimatedDeliveryDate',
        key: 'estimatedDeliveryDate'
    },
    {
        title: '地点类型',
        dataIndex: 'adrType',
        key: 'adrType',
        render: (text) => (locType.data[text + 1].value)
    },
    {
        title: '地点',
        dataIndex: 'adrTypeName',
        key: 'adrTypeName'
    },
    {
        title: '大类编号',
        dataIndex: 'secondCategoryId',
        key: 'secondCategoryId'

    },
    {
        title: '大类名称',
        dataIndex: 'secondCategoryName',
        key: 'secondCategoryName'
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => (poStatus.data[text + 1].value)
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation'
    }
]

