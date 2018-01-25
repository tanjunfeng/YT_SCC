/**
 * @file columns.js
 * @author taoqiyu
 *
 * 促销活动列表
 */
import React from 'react';
import moment from 'moment';
import Util from '../../util/util';
import { TIME_FORMAT } from '../../constant/index';

// 订单详情商品列表
let message;
let className;
const goodsColumns = [{
    title: '商品图片',
    dataIndex: 'productImg',
    key: 'productImg',
    render: (text, record) => {
        if (record.abnormalGoods) {
            message = <span>{record.abnormalResonse}</span>;
            className = 'abnormalResonse';
        } else {
            message = null
            className = '';
        }
        return (
            <div>
                <img
                    src={text}
                    alt="未上传"
                    style={{ width: 50, height: 50, verticalAlign: 'middle' }}
                />
                <div className={className}>{message}</div>
            </div>
        )
    }
}, {
    title: '商品编码',
    dataIndex: 'productCode',
    key: 'productCode',
    render: (text, record) => {
        if (record.abnormalGoods) {
            className = 'abnormalResonse-color';
        } else {
            className = '';
        }
        return (
            <div>
                <span className={className}>{text}</span>
            </div>
        )
    }
}, {
    title: '商品条码',
    dataIndex: 'internationalCodes',
    key: 'internationalCodes',
    render: (item, record) => {
        if (record.abnormalGoods) {
            className = 'abnormalResonse-color';
        } else {
            className = '';
        }
        if (item instanceof Array && item.length) {
            return (
                <div>
                    <span className={className}>{item[0].internationalCode}</span>
                </div>
            )
        }
    }
}, {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName',
    render: (text, record) => {
        if (record.abnormalGoods) {
            className = 'abnormalResonse-color';
        } else {
            className = '';
        }
        return <span className={className}>{text}</span>;
    }
}, {
    title: '商品分类',
    dataIndex: 'commodifyClassify',
    key: 'commodifyClassify',
    render: (text, record) => {
        let after = '';
        if (record.thirdLevelCategoryName !== null) {
            after = ` > ${record.thirdLevelCategoryName}`;
        }
        if (record.abnormalGoods) {
            className = 'abnormalResonse-color';
        } else {
            className = '';
        }
        return <span className={className}>{record.secondLevelCategoryName}{after}</span>;
    }
}, {
    title: '数量',
    dataIndex: 'quantity',
    key: 'quantity',
    render: (text, record) => {
        if (record.abnormalGoods) {
            className = 'abnormalResonse-color';
        } else {
            className = '';
        }
        return <span className={className}>{text}</span>;
    }
}, {
    title: '可用库存',
    dataIndex: 'availableStock',
    key: 'availableStock',
    render: (text, record) => {
        if (record.abnormalGoods) {
            className = 'abnormalResonse-color';
        } else {
            className = '';
        }
        return <span className={className}>{text}</span>;
    }
}, {
    title: '单价',
    dataIndex: 'price',
    key: 'price',
    render: (text, record) => {
        if (record.abnormalGoods) {
            className = 'abnormalResonse-color';
        } else {
            className = '';
        }
        return <span className={className}>￥{Number(record.itemPrice.salePrice).toFixed(2)}</span>
    }
}, {
    title: '金额',
    dataIndex: 'money',
    key: 'money',
    render: (text, record) => (
        <span className={className}>￥{Number(record.itemPrice.amount).toFixed(2)}</span>
    )
}];

// 后台退货商品列表
const goodsReturnsColumns = [{
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
    render: (text, record) => {
        let after = '';
        if (record.thirdLevelCategoryName !== null) {
            after = ` > ${record.thirdLevelCategoryName}`;
        }
        return <span>{record.secondLevelCategoryName}{after}</span>;
    }
}, {
    title: '订单数量',
    dataIndex: 'quantity',
    key: 'quantity',
}, {
    title: '退货数量',
    dataIndex: 'returnQuantity',
    key: 'returnQuantity',
}, {
    title: '单价',
    dataIndex: 'price',
    key: 'price',
    render: (text, record) => (
        <span>￥{Number(record.itemPrice.salePrice).toFixed(2)}</span>
    )
}, {
    title: '金额',
    dataIndex: 'money',
    key: 'money',
    render: (text, record) => (
        <span>￥{Number(record.itemPrice.amount).toFixed(2)}</span>
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
    title: '商品总金额',
    dataIndex: 'rawSubtotal',
    key: 'rawSubtotal',
}, {
    title: '实付金额',
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
    title: '门店编号',
    dataIndex: 'franchiseeStoreId',
    key: 'franchiseeStoreId',
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
    title: '退货单状态',
    dataIndex: 'stateDetail',
    key: 'stateDetail'
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
    dataIndex: 'stateDetail',
    key: 'stateDetail'
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

// 换货单详情列表
const exchangeGoodsDetailColumns = [{
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
    dataIndex: 'internationalCodes[0].internationalCode',
    key: 'internationalCodes[0].internationalCode',
    render: (text, record) => (
        record.internationalCodes[0].internationalCode
    )
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
            {record.secondLevelCategoryName} - {record.thirdLevelCategoryName}
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
    dataIndex: 'salePrice',
    key: 'salePrice'
},
{
    title: '换货金额',
    dataIndex: 'rawTotalPrice',
    key: 'rawTotalPrice'
},
{
    title: '实收数量',
    dataIndex: 'actualReturnQuantity',
    key: 'actualReturnQuantity'
}
]

const returnGoodsTableColums = [{
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
    dataIndex: 'internationalCodes[0].internationalCode',
    key: 'internationalCodes[0].internationalCode',
    render: (text, record) => (
        record.internationalCodes[0].internationalCode || '-'
    )
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
            {record.secondLevelCategoryName} - {record.thirdLevelCategoryName}
        </span>
    )
},
{
    title: '退货/拒收数量',
    dataIndex: 'quantity',
    key: 'quantity'
},
{
    title: '单价',
    dataIndex: 'salePrice',
    key: 'salePrice'
},
{
    title: '退货金额',
    dataIndex: 'rawTotalPrice',
    key: 'rawTotalPrice'
},
{
    title: '实收数量',
    dataIndex: 'actualReturnQuantity',
    key: 'actualReturnQuantity'
}]

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
    width: 130
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

const distributionInformationColumns = [{
    title: '序号',
    dataIndex: 'index',
    render: (text, record, index) => index + 1
}, {
    title: '商品编码',
    dataIndex: 'skuId',
    key: 'skuId',
}, {
    title: '商品条码',
    dataIndex: 'internationalCode',
    key: 'internationalCode',
}, {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName',
}, {
    title: '订单数量',
    dataIndex: 'quantity',
    key: 'quantity',
    render: (text, record) => (
        <span>
            <span>{text}</span>
            <span>{record.unit}</span>
        </span>
    )
}, {
    title: '配送数量',
    dataIndex: 'shippedQuantity',
    key: 'shippedQuantity',
    render: (text) => (
        <span>
            <span>{text}</span>
        </span>
    )
}, {
    title: '单价',
    dataIndex: 'salePrice',
    key: 'salePrice',
    render: (amount) => (
        <span>￥{Number(amount).toFixed(2)}</span>
    )
}, {
    title: '签收数量',
    dataIndex: 'completedQuantity',
    key: 'completedQuantity',
    render: (text, record) => (
        <span>
            <span>{text}</span>
            <span>{record.unit}</span>
        </span>
    )
}, {
    title: '签收差数',
    dataIndex: 'completedNum',
    key: 'completedNum',
    render: (text) => (
        <span>
            <span>{text}</span>
        </span>
    )
}, {
    title: '签收差额',
    dataIndex: 'completedMulAmount',
    key: 'completedMulAmount',
    render: (amount) => (
        <span>{Number(amount).toFixed(2)}元</span>
    )
}];

export const wishAreaColumns = [{
    title: '商品编码',
    dataIndex: 'productCode',
    key: 'productCode',
    render: text => {
        if (!text) {
            return <span><i className="wishList-red" />供应链无此商品</span>;
        }
        return (
            <span>{text}</span>
        );
    }
}, {
    title: '商品条码',
    dataIndex: 'gbCode',
    key: 'gbCode'
}, {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName',
    render: text => {
        return !text ? <span><i className="wishList-red" />暂无商品信息</span> : <span>{text}</span>
    }
}, {
    title: '需求数量',
    dataIndex: 'totalQuantity',
    key: 'totalQuantity'
}, {
    title: '第一次提交时间',
    dataIndex: 'createTime',
    key: 'createTime',
    render: timestamp => ({
        children: Util.getTime(timestamp)
    })
}, {
    title: '所属子公司',
    dataIndex: 'branchCompanyId',
    key: 'branchCompanyId',
    render: (text, record) => (
        <span>{record.branchCompanyId}-{record.branchCompanyName}</span>
    )
}, {
    title: '处理状态',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
        switch (status) {
            case 'init':
                return <span><i className="wishList-gray" />未开始</span>;
            case 'complete':
                return <span><i className="wishList-green" />到货处理</span>;
            case 'close':
                return <span><i className="wishList-blue" />无货处理</span>;
            default:
                return '-';
        }
    }
}, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: this.renderOperation
}];

export const wishAreaDetailsColumns = [{
    title: '商品条码',
    dataIndex: 'gbCode',
    key: 'gbCode'
}, {
    title: '门店编号',
    dataIndex: 'storeId',
    key: 'storeId'
}, {
    title: '门店名称',
    dataIndex: 'storeName',
    key: 'storeName'
}, {
    title: '需求数量',
    dataIndex: 'quantity',
    key: 'quantity'
}, {
    title: '提交时间',
    dataIndex: 'createTime',
    key: 'createTime',
    render: timestamp => {
        if (!timestamp) {
            return '-';
        }
        return <span>{Util.getTime(timestamp)}</span>
    }
}];

export {
    goodsColumns, orderListColumns, returnGoodsListColumns,
    exchangeGoodsDetailColumns, directSalesgoodsColumns, exchangeGoodsListColumns,
    distributionInformationColumns, returnGoodsTableColums, goodsReturnsColumns
};
