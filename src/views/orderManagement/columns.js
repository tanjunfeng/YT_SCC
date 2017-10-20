/**
 * @file columns.js
 * @author taoqiyu
 *
 * 促销活动列表
 */
import React from 'react';

// 订单详情商品列表
const goodsColumns = [{
    title: '商品图片',
    dataIndex: 'productImg',
    key: 'productImg',
    render: (text) => (
        <img
            src={text}
            alt="未上传"
            style={{width: 50, height: 50 }}
        />
    )
}, {
    title: '商品编码',
    dataIndex: 'productCode',
    key: 'productCode',
}, {
    title: '商品条码',
    dataIndex: 'internationalCodes',
    key: 'internationalCodes',
    render: (item) => {
        if (item instanceof Array && item.length) {
            return item[0].internationalCode;
        }
        return null;
    }
}, {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName',
}, {
    title: '商品分类',
    dataIndex: 'commodifyClassify',
    key: 'commodifyClassify',
    render: (text, record) => (
        <span>{record.secondLevelCategoryName}&gt;{record.thirdLevelCategoryName}</span>
    )
}, {
    title: '数量',
    dataIndex: 'quantity',
    key: 'quantity',
}, {
}, {
    title: '状态',
    dataIndex: 'stateDetail',
    key: 'stateDetail',
}, {
    title: '单价',
    dataIndex: 'price',
    key: 'price',
    render: (text, record) => (
        <span>￥{record.itemPrice.salePrice}</span>
    )
}, {
    title: '金额',
    dataIndex: 'money',
    key: 'money',
    render: (text, record) => (
        <span>￥{record.itemPrice.amount}</span>
    )
}];

export { goodsColumns };
