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
    title: '可用库存',
    dataIndex: 'availableStock',
    key: 'availableStock',
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


// 退货单列表
const returnGoodsListColumns = [{
    title: '序号',
    dataIndex: 'idx',
    key: 'idx',
    render: (text, record, index) => index + 1
},
{
    title: '换货单号',
    dataIndex: 'id',
    key: 'id'
},
{
    title: '申请日期',
    dataIndex: 'creationTime',
    key: 'creationTime',
    render: (text) => (
        <span>
            {moment(parseInt(text, 10)).format('YYYY-MM-DD')}
        </span>
    )
},
{
    title: '原订单号',
    dataIndex: 'orderId',
    key: 'orderId'
},
{
    title: '子公司',
    dataIndex: 'branchCompanyName',
    key: 'branchCompanyName',
}, {
    title: '雅堂小超',
    dataIndex: 'franchiseeName',
    key: 'franchiseeName',
},
{
    title: '总金额',
    dataIndex: 'amount',
    key: 'amount',
    render: (text) => {
        if (text === null) {
            return null
        }
        return (
            <span>￥{text}</span>
        )
    }
},
{
    title: '换货单状态',
    dataIndex: 'stateDetail',
    key: 'stateDetail'
},
{
    title: '商品状态',
    dataIndex: 'shippingStateDetail',
    key: 'shippingStateDetail'
},
{
    title: '操作',
    dataIndex: 'operation',
    key: 'operation'
}
]

// 换货单列表
const exchangeGoodsListColumns = [{
    title: '序号',
    dataIndex: 'idx',
    key: 'idx',
    render: (text, record, index) => index + 1
},
{
    title: '换货单号',
    dataIndex: 'id',
    key: 'id'
},
{
    title: '申请日期',
    dataIndex: 'creationTime',
    key: 'creationTime',
    render: (text) => (
        <span>
            {moment(parseInt(text, 10)).format('YYYY-MM-DD')}
        </span>
    )
},
{
    title: '原订单号',
    dataIndex: 'orderId',
    key: 'orderId',
},
{
    title: '子公司',
    dataIndex: 'branchCompanyName',
    key: 'branchCompanyName',
}, {
    title: '雅堂小超',
    dataIndex: 'franchiseeName',
    key: 'franchiseeName',
},
{
    title: '总金额',
    dataIndex: 'amount',
    key: 'amount',
    render: (text) => {
        if (text === null) {
            return null
        }
        return (
            <span>￥{text}</span>
        )
    }
},
{
    title: '换货单状态',
    dataIndex: 'paymentStateDetail',
    key: 'paymentStateDetail'
},
{
    title: '商品状态',
    dataIndex: 'productStateDetail',
    key: 'productStateDetail'
},
{
    title: '操作',
    dataIndex: 'operation',
    key: 'operation'
}
]

// 退货单详情列表
const returnGoodsDetailColumns = [{
    title: '序号',
    dataIndex: 'idx',
    key: 'idx',
    render: (text, record, index) => index + 1
},
{
    title: '商品图片',
    dataIndex: 'productImg',
    key: 'productImg',
    render: (text) => (
        <img src={text} alt={text} className="item-img" />
    )
},
{
    title: '商品编码',
    dataIndex: 'productCode',
    key: 'productCode'
},
{
    title: '商品条码',
    dataIndex: 'productId',
    key: 'productId',
},
{
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName',
}, {
    title: '商品分类',
    dataIndex: 'category',
    key: 'category',
    render: (text, record) => (
        <span>
            {record.secondLevelCategoryName} &rt; {record.thirdLevelCategoryName}
        </span>
    )
},
{
    title: '换货数量',
    dataIndex: 'quantity',
    key: 'quantity'
},
{
    title: '单价',
    dataIndex: 'itemPrice.listPrice',
    key: 'itemPrice.listPrice'
},
{
    title: '换货金额',
    dataIndex: 'itemPrice.amount',
    key: 'itemPrice.amount'
},
{
    title: '实收数量',
    dataIndex: 'actualReturnQuantity',
    key: 'actualReturnQuantity'
}
]

const directSalesgoodsColumns = [{
    title: '序号',
    dataIndex: 'index',
    width: 30,
    render: (text, record, index) => index + 1
}, {
    title: '商品编码',
    dataIndex: 'productCode',
    width: 50
}, {
    title: '商品条码',
    dataIndex: 'internationalCode',
    width: 80
}, {
    title: '商品名称',
    dataIndex: 'productName',
    width: 120
}, {
    title: '产品规格',
    dataIndex: 'productSpecifications',
    width: 50
}, {
    title: '箱装规格',
    dataIndex: 'packingSpecifications',
    width: 80
}, {
    title: '起定量',
    dataIndex: 'minNumberSpecifications',
    width: 50
}, {
    title: '数量',
    dataIndex: 'quantity',
    width: 120
}, {
    title: '单价',
    dataIndex: 'salePrice',
    width: 70,
    render: text => (text === null ? '-' : text)
}, {
    title: '金额',
    dataIndex: 'subTotal',
    width: 100
}, {
    title: '操作',
    dataIndex: 'operation',
    width: 50
}];

export {
    goodsColumns, orderListColumns, returnGoodsListColumns,
    returnGoodsDetailColumns, directSalesgoodsColumns, exchangeGoodsListColumns
};
