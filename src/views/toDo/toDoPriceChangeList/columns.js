import React from 'react';
const columns = [
    {
        title: '变价类型',
        dataIndex: 'changeType',
        key: 'changeType'
    },
    {
        title: '供应商',
        dataIndex: 'spCodeAndName',
        key: 'spCodeAndName',
    },
    {
        title: '供应商地点',
        dataIndex: 'spAdrCodeAndName',
        key: 'spAdrCodeAndName',
    },
    {
        title: '子公司',
        dataIndex: 'branchCompanyCodeAndName',
        key: 'branchCompanyCodeAndName',
    },
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
        title: '商品信息',
        dataIndex: 'productCodeAndDesc',
        key: 'productCodeAndDesc',
    },
    {
        title: '操作人',
        dataIndex: 'createUserName',
        key: 'createUserName',
    },
    {
        title: '操作时间',
        dataIndex: 'createTime',
        key: 'createTime',
    },
    {
        title: '当前价格',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: '提交价格',
        dataIndex: 'newestPrice',
        key: 'newestPrice',
    },
    {
        title: '商品毛利率',
        dataIndex: 'grossProfitMargin',
        key: 'grossProfitMargin',
        render: text => (
            <span className={parseFloat(text) < 0 ? 'decrease' : ''}>{text}</span>
        )
    },
    {
        title: '调价百分比',
        dataIndex: 'percentage',
        key: 'percentage',
        render: text => (
            <span className={parseFloat(text) < 0 ? 'decrease' : ''}>{text}</span>
        )
    }
];

export default columns;