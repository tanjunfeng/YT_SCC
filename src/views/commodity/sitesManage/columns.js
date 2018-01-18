import React from 'react';
import { logisticsModelStr } from './constant';

export const sitesManageColumns = [
    {
        title: '部类',
        dataIndex: 'firstLevelCategoryName',
        key: 'firstLevelCategoryName',
    },
    {
        title: '大类',
        dataIndex: 'secondLevelCategoryName',
        key: 'secondLevelCategoryName',
    },
    {
        title: '中类',
        dataIndex: 'thirdLevelCategoryName',
        key: 'thirdLevelCategoryName',
    },
    {
        title: '小类',
        dataIndex: 'fourthLevelCategoryName',
        key: 'fourthLevelCategoryName',
    },
    {
        title: '品牌',
        dataIndex: 'brandName',
        key: 'brandName',
    },
    {
        title: '商品',
        dataIndex: 'productName',
        key: 'productName',
    },
    {
        title: '所属子公司编码',
        dataIndex: 'branchCompanyId',
        key: 'branchCompanyId',
    },
    {
        title: '所属子公司',
        dataIndex: 'branchCompanyName',
        key: 'branchCompanyName',
    },
    {
        title: '门店名称',
        dataIndex: 'storeName',
        key: 'storeName',
    },
    {
        title: '供应商',
        dataIndex: 'supplierName',
        key: 'supplierName',
    },
    {
        title: '供应商地点',
        dataIndex: 'adrSupName',
        key: 'adrSupName',
    },
    {
        title: '物流模式',
        dataIndex: 'logisticsModel',
        key: 'logisticsModel',
        render: text => (
            <span>{logisticsModelStr[text]}</span>
        )
    }
];
