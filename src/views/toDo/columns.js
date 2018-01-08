/**
 * @file formColumns.js
 * @author shijh,liujinyu,zhoucl
 *
 * 定义列表数据
 */
import React from 'react';
import moment from 'moment';
import Util from '../../util/util';
import { locType, poStatus } from '../../constant/procurement';

const purchase = ['普通采购单'];
// 供应商列表
export const poMngListColumns = [
    {
        title: '采购单号',
        dataIndex: 'purchaseOrderNo',
        key: 'purchaseOrderNo',
    },
    {
        title: '采购单类型',
        dataIndex: 'purchaseOrderType',
        key: 'purchaseOrderType',
        render: text => (purchase[text])
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
                { Util.getTime(text) }
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

export const goodsColumns = [{
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
    width: 70
}, {
    title: '金额',
    dataIndex: '',
    width: 100
}, {
    title: '操作',
    dataIndex: 'operation',
    width: 50
}];

export const priceChangeColumns = [
    {
        title: '变价类型',
        dataIndex: 'changeType',
        key: 'changeType',
        render: text => (text === 0 ? '采购进价变更' : '售价变更')
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
        render: (text) => (
            <span>
                { text ? moment(parseInt(text, 10)).format('YYYY-MM-DD') : '-'}
            </span>
        )
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

// 进价审核列表
export const purchaseListColumns = [
    {
        title: '变价类型',
        dataIndex: 'processType',
        key: 'processType',
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
        title: '商品编号',
        dataIndex: 'productNo',
        key: 'productNo',
    },
    {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
    },
    {
        title: '变更日期',
        dataIndex: 'modifyTime',
        key: 'modifyTime',
        render: (text) => {
            return text ?
                <span>
                    {moment(parseInt(text, 10)).format('YYYY-MM-DD')}
                </span>
                : null
        }
    },
    {
        title: '当前节点',
        dataIndex: 'currentNode',
        key: 'currentNode'
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation'
    }
]

// 售价审核列表
export const priceListColumns = [
    {
        title: '变价类型',
        dataIndex: 'processType',
        key: 'processType',
    },
    {
        title: '子公司编号',
        dataIndex: 'companyId',
        key: 'companyId',
    },
    {
        title: '子公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
    },
    {
        title: '商品编号',
        dataIndex: 'productNo',
        key: 'productNo',
    },
    {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
    },
    {
        title: '变更日期',
        dataIndex: 'modifyTime',
        key: 'modifyTime',
        render: (text) => (
            <span>
                {moment(parseInt(text, 10)).format('YYYY-MM-DD')}
            </span>
        )
    },
    {
        title: '当前节点',
        dataIndex: 'currentNode',
        key: 'currentNode'

    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation'
    }
]

// 查看审核意见弹窗表格
export const seeModalColumns = [
    {
        title: '审批人',
        dataIndex: 'handler',
        key: 'handler',
    },
    {
        title: '审批时间',
        dataIndex: 'handlerDate',
        key: 'handlerDate',
        render: (text) => (
            <span>
                {moment(parseInt(text, 10)).format('YYYY-MM-DD HH:mm:ss')}
            </span>
        )
    },
    {
        title: '审批结果',
        dataIndex: 'pass',
        key: 'pass',
        render: text => (
            text ? '通过' : '拒绝'
        )
    },
    {
        title: '审批意见',
        dataIndex: 'content',
        key: 'content'
    }
]

