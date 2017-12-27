import React from 'react';
import moment from 'moment';
import {processResult} from '../../../constant/procurement';
// 供应商列表
export const purchasePriceColumns = [
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
            return (
                <div>
                    <span className={text === 0 ? 'errorResult' : 'sucResult'} />
                    {processResult.data[text + 1].value}
                </div>
            );
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
        title: '最新进价',
        dataIndex: 'newestPrice',
        key: 'newestPrice',
    },
    {
        title: '供应商编号',
        dataIndex: 'spNo',
        key: 'spNo',
    }, {
        title: '供应商名称',
        dataIndex: 'spName',
        key: 'spName',
    },
    {
        title: '供应商地点编号',
        dataIndex: 'spAdrNo',
        key: 'spAdrNo',
    }, {
        title: '供应商地点',
        dataIndex: 'spAdrName',
        key: 'spAdrName',
    }
]
