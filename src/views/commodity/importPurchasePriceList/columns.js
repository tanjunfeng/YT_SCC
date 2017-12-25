import React from 'react';
import moment from 'moment';
import {processResult} from '../../../constant/procurement';
// 供应商列表
export const poMngListColumns = [
    {
        title: '上传ID',
        dataIndex: 'importsId',
        key: 'importsId',
    },
    {
        title: '行号',
        dataIndex: 'lineNumber',
        key: 'lineNumber',
    },
    {
        title: '行号',
        dataIndex: 'priceType',
        key: 'priceType',
        render: () => (
            '采购进价变更'
        )
    },
    {
        title: '处理结果',
        dataIndex: 'handleResult',
        key: 'handleResult',
        render: (text) => {
            if (text === null || typeof text === 'undefined') {
                return null;
            }
            return (processResult.data[text + 1].value);
        }
    },
    {
        title: '处理信息',
        dataIndex: 'handleInformation',
        key: 'handleInformation',
    },
    {
        title: '上传日期',
        dataIndex: 'uploadDate',
        key: 'uploadDate',
        render: (text) => (
            <span>
                {moment(parseInt(text, 10)).format('YYYY-MM-DD')}
            </span>
        )
    },
    {
        title: '商品编号',
        dataIndex: 'productCode',
        key: 'productCode',
    },
    {
        title: '商品信息',
        dataIndex: 'productInformation',
        key: 'productInformation',
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
        title: '地点类型',
        dataIndex: 'adrType',
        key: 'adrType',
        render: (text) => {
            if (text === null) {
                return null;
            }
            return (locType.data[text + 1].value);
        }
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
        render: (text) => {
            if (text === null) {
                return null;
            }
            return (poStatus.data[text + 1].value);
        }
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation'
    }
]