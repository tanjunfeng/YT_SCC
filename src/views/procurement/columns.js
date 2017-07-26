/**
 * @file formColumns.js
 * @author shijh
 *
 * 定义列表数据
 */
import React from 'react';
import moment from 'moment';


// 供应商列表
export const poMngListColumns = [
    {
        title: '采购单号',
        dataIndex: 'poNo',
        key: 'poNo',
    },
    {
        title: '采购单类型',
        dataIndex: 'poTypeName',
        key: 'poTypeName',
    },
    {
        title: '供应商编号',
        dataIndex: 'supplierCd',
        key: 'supplierCd',
    },
    {
        title: '供应商名称',
        dataIndex: 'supplierName',
        key: 'supplierName',
    },
    {
        title: '供应商地点编号',
        dataIndex: 'supplierLocCd',
        key: 'supplierLocCd',
    }, {
        title: '供应商地点名称',
        dataIndex: 'supplierLocName',
        key: 'supplierLocName',
    },
    {
        title: '预计送货日期',
        dataIndex: 'estDeliveryDate',
        key: 'estDeliveryDate'
    },
    {
        title: '地点类型',
        dataIndex: 'locTypeName',
        key: 'locTypeName'
    },
    {
        title: '地点',
        dataIndex: 'address',
        key: 'address'
    },
    {
        title: '大类编号',
        dataIndex: 'bigCLassCd',
        key: 'bigCLassCd'

    },
    {
        title: '大类名称',
        dataIndex: 'bigCLassName',
        key: 'bigCLassName'
    }
    ,
    {
        title: '状态',
        dataIndex: 'statusName',
        key: 'statusName',
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
    }
]

