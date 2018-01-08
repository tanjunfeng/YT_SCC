/**
 * @file columns.js
 * @author liujinyu
 *
 * 定义列表数据
 */
import React from 'react';
import moment from 'moment';
import { priceResult } from './constants';

// 售价审核列表
export const priceListColumns = [
    {
        title: '上传ID',
        dataIndex: 'importsId',
        key: 'importsId',
    },
    {
        title: '行号',
        dataIndex: 'lineNumber',
        key: 'lineNumber'
    },
    {
        title: '变价类型',
        dataIndex: '',
        key: '',
        render: () => (
            '销售变价'
        )
    },
    {
        title: '处理结果',
        dataIndex: 'handleResult',
        key: 'handleResult',
        render: text => {
            const item = priceResult.data.find(val => (
                val.key === text.toString()
            ))
            return <div className="price-import-result"><span className={item.key === '0' ? 'error' : 'success'} />{item.value}</div>
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
        title: '商品编码',
        dataIndex: 'productCode',
        key: 'productCode'
    },
    {
        title: '商品信息',
        dataIndex: 'productInformation',
        key: 'productInformation'

    },
    {
        title: '销售数量区间',
        dataIndex: 'number',
        key: 'number',
        render: (text, record) => (
            `${record.startNumber}-${record.endNumber}`
        )
    },
    {
        title: '最新售价',
        dataIndex: 'newestPrice',
        key: 'newestPrice'

    },
    {
        title: '子公司',
        dataIndex: 'branchCompanyName',
        key: 'branchCompanyName'
    }
]
