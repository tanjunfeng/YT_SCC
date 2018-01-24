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
        dataIndex: 'brand',
        key: 'brand',
    },
    {
        title: '商品',
        dataIndex: 'productName',
        key: 'productName',
        render: (text, record) => (<span>{record.productCode}-{text}</span>)
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
        render: (text, record) => (<span>{record.supplierCode}-{text}</span>)
    },
    {
        title: '供应商地点',
        dataIndex: 'adrSupName',
        key: 'adrSupName',
        render: (text, record) => (<span>{record.adrSupCode}-{text}</span>)
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

export const exportColumn = [
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
        dataIndex: 'brand',
        key: 'brand',
    },
    {
        title: '商品',
        dataIndex: 'productName',
        key: 'productName',
        render: (text, record) => (<span>{record.productCode}-{text}</span>)
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
        title: '门店编码',
        dataIndex: 'storeCode',
        key: 'storeCode',
    },
    {
        title: '门店名称',
        dataIndex: 'storeName',
        key: 'storeName',
    },
    {
        title: '供应商地点',
        dataIndex: 'adrSupName',
        key: 'adrSupName',
        render: (text, record) => (<span>{record.adrSupCode}-{text}</span>)
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
