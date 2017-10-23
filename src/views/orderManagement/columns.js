/**
 * @file columns.js
 * @author taoqiyu
 *
 * 促销活动列表
 */
import React from 'react';
import moment from 'moment';
import { TIME_FORMAT } from '../../constant/index';

// 订单详情商品列表
const goodsColumns = [{
    title: '商品图片',
    dataIndex: 'productImg',
    key: 'productImg',
    render: (text) => (
        <img
            src={text}
            alt="未上传"
            style={{ width: 50, height: 50 }}
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

const orderListColumns = [{
    title: '序号',
    dataIndex: 'sort',
    key: 'sort',
    render: (text, record, index) => index + 1
}, {
    title: '订单编号',
    dataIndex: 'id',
    key: 'id',
}, {
    title: '父订单编号',
    dataIndex: 'createdByOrderId',
    key: 'createdByOrderId',
}, {
    title: '订单日期',
    dataIndex: 'submitTime',
    key: 'submitTime',
    render: (text) => (
        <span>
            {moment(parseInt(text, 10)).format(TIME_FORMAT)}
        </span>
    )
}, {
    title: '订单类型',
    dataIndex: 'orderTypeDesc',
    key: 'orderTypeDesc',
}, {
    title: '订单金额',
    dataIndex: 'total',
    key: 'total',
}, {
    title: '订单状态',
    dataIndex: 'orderStateDesc',
    key: 'orderStateDesc',
}, {
    title: '支付状态',
    dataIndex: 'paymentStateDesc',
    key: 'paymentStateDesc',
}, {
    title: '物流状态',
    dataIndex: 'shippingStateDesc',
    key: 'shippingStateDesc',
}, {
    title: '子公司',
    dataIndex: 'branchCompanyName',
    key: 'branchCompanyName',
}, {
    title: '加盟商编号',
    dataIndex: 'franchiseeId',
    key: 'franchiseeId',
}, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
}];

export { goodsColumns, orderListColumns };
