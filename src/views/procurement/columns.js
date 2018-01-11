/**
 * @file formColumns.js
 * @author shijh
 *
 * 定义列表数据
 */
import React from 'react';
import moment from 'moment';
import { locType, poStatus, businessModeType, poType } from '../../constant/procurement';
import Util from '../../util/util';

// 供应商列表
export const poMngListColumns = [
    {
        title: '采购单号',
        dataIndex: 'purchaseOrderNo',
        key: 'purchaseOrderNo',
    },
    {
        title: '经营模式',
        dataIndex: 'businessMode',
        key: 'businessMode',
        render: (text) => {
            if (text === null || typeof text === 'undefined') {
                return null;
            }
            return (businessModeType.data[text + 1].value);
        }
    },
    {
        title: '采购单类型',
        dataIndex: 'purchaseOrderType',
        key: 'purchaseOrderType',
        render: text => {
            if (text === null) {
                return null;
            }
            return (poType.data[text + 1].value);
        }
    },
    {
        title: '供应商编号',
        dataIndex: 'spNo',
        key: 'spNo',
    },
    {
        title: '供应商名称',
        dataIndex: 'spName',
        key: 'spName',
    },
    {
        title: '供应商地点编号',
        dataIndex: 'spAdrNo',
        key: 'spAdrNo',
    }, {
        title: '供应商地点名称',
        dataIndex: 'spAdrName',
        key: 'spAdrName',
    },
    {
        title: '预计送货日期',
        dataIndex: 'estimatedDeliveryDate',
        key: 'estimatedDeliveryDate',
        render: (text) => (
            <span>
                {moment(parseInt(text, 10)).format('YYYY-MM-DD')}
            </span>
        )
    },
    {
        title: '地点类型',
        dataIndex: 'adrType',
        key: 'adrType',
        render: (text) => {
            if (text === null) {
                return null;
            }
            return (locType.data[text + 1].value);
        }
    },
    {
        title: '地点',
        dataIndex: 'adrTypeName',
        key: 'adrTypeName'
    },
    {
        title: '大类编号',
        dataIndex: 'secondCategoryId',
        key: 'secondCategoryId'

    },
    {
        title: '大类名称',
        dataIndex: 'secondCategoryName',
        key: 'secondCategoryName'
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
            if (text === null) {
                return null;
            }
            return (poStatus.data[text + 1].value);
        }
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation'
    }
]

export const printColumns = [{
    title: '行号',
    dataIndex: 'rowNo',
    key: 'rowNo',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 60
}, {
    title: '商品编码',
    dataIndex: 'productCode',
    key: 'productCode',
    width: 70
}, {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName',
    className: 'left',
    width: 200
}, {
    title: '商品条码',
    dataIndex: 'internationalCode',
    key: 'internationalCode',
    width: 110
}, {
    title: '规格',
    dataIndex: 'packingSpecifications',
    key: 'packingSpecifications',
    width: 70
}, {
    title: '产地',
    dataIndex: 'producePlace',
    key: 'producePlace',
    width: 80
}, {
    title: '采购内装数',
    dataIndex: 'purchaseInsideNumber',
    key: 'purchaseInsideNumber',
    width: 80
}, {
    title: '单位',
    dataIndex: 'unitExplanation',
    key: 'unitExplanation',
    width: 50
}, {
    title: '订货数量',
    dataIndex: 'purchaseNumber',
    key: 'purchaseNumber',
    width: 70
}, {
    title: '订货价格',
    dataIndex: 'purchasePrice',
    key: 'purchasePrice',
    width: 70,
}, {
    title: '订货金额',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    width: 100
}];

export const wishAreaColumns = [{
    title: '商品编码',
    dataIndex: 'productCode',
    key: 'productCode',
    render: text => {
        if (!text) {
            return <span className="'wishList-red'">供应链无此商品</span>;
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
        if (!text) {
            return '暂无商品信息';
        }
        return (
            <span className={!text ? 'wishList-red' : ''}>{text}</span>
        );
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
    title: '处理状态',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
        switch (status) {
            case 'init':
                return <span className="wishList-gray">未开始</span>;
            case 'complete':
                return <span className="wishList-green">到货处理</span>;
            case 'close':
                return <span className="wishList-blue">无货处理</span>;
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
