/**
 * @file formColumns.js
 * @author liujinyu
 *
 * 定义列表数据
 */
import React from 'react';
import moment from 'moment';

// 退货单列表
export const returnGoodsListColumns = [{
    title: '序号',
    dataIndex: 'idx',
    key: 'idx',
    render: (text, record, index) => index + 1
},
{
    title: '退货单号',
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
    dataIndex: 'total',
    key: 'total',
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
    title: '退货单状态',
    dataIndex: 'stateDetail',
    key: 'stateDetail'
},
{
    title: '收货状态',
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
export const returnGoodsDetailColumns = [{
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

