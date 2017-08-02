/**
 * @file formColumns.js
 * @author shijh
 *
 * 定义列表数据
 */
import React from 'react';
import moment from 'moment';

// 供应商列表
export const supplierManageColumns = [
    {
        title: '注册号',
        dataIndex: 'spRegNo',
        key: 'spRegNo',
    },
    {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
    },
    {
        title: '联系人',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '联系人手机',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: '联系人邮箱',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: '返利（%）',
        dataIndex: 'rebateRate',
        key: 'rebateRate',
    }, {
        title: '供应商编号',
        dataIndex: 'spNo',
        key: 'spNo',
    },
    {
        title: '结算账户类型',
        dataIndex: 'settlementAccountType',
        key: 'settlementAccountType',
        render: (text) => {
            switch (text) {
                case 0:
                    return '商家雅堂金融账户'
                case 1:
                    return '商家公司银行账户'
                default:
                    return null;
            }
        }
    },
    {
        title: '结算账期',
        dataIndex: 'settlementPeriod',
        key: 'settlementPeriod',
        render: (text) => (<span>{text}天</span>)
    },
    {
        title: '入驻时间',
        dataIndex: 'settledTime',
        key: 'settledTime',
        render: (text) => (
            <span>
                {moment(parseInt(text, 10)).format('YYYY-MM-DD HH:mm:ss')}
            </span>
        )
    },
    {
        title: '保证金余额',
        dataIndex: 'guaranteeMoney',
        key: 'guaranteeMoney',
        render: (text) => (<span>{text}元</span>)
    },
    {
        title: '供应商状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
            switch (text) {
                case 2:
                    return '正常供应';
                case 3:
                    return '已冻结';
                case 4:
                    return '已终止合作';
                case 6:
                    return '修改审核不通过';
                default:
                    return null;
            }
        }
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
    }
]

// 供应商修改申请列表
export const supplierModifyList = [
    {
        title: '注册号',
        dataIndex: 'spRegNo',
        key: 'spRegNo',
    },
    {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
    },
    {
        title: '联系人',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '联系人手机',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: '联系人邮箱',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: '返利（%）',
        dataIndex: 'rebateRate',
        key: 'rebateRate',
    }, {
        title: '供应商编号',
        dataIndex: 'spNo',
        key: 'spNo',
    },
    {
        title: '结算账户类型',
        dataIndex: 'settlementAccountType',
        key: 'settlementAccountType',
        render: (text) => {
            switch (text) {
                case 0:
                    return '商家雅堂金融账户'
                case 1:
                    return '商家公司银行账户'
                default:
                    return null;
            }
        }
    },
    {
        title: '结算账期',
        dataIndex: 'settlementPeriod',
        key: 'settlementPeriod',
        render: (text) => (<span>{text}天</span>)
    },
    {
        title: '入驻时间',
        dataIndex: 'settledTime',
        key: 'settledTime',
        render: (text) => (
            <span>
                {moment(parseInt(text, 10)).format('YYYY-MM-DD HH:mm:ss')}
            </span>
        )
    },
    {
        title: '审核状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
            switch (parseInt(text, 10)) {
                case 5:
                    return '待审批';
                case 6:
                    return '审核不通过';
                default:
                    return null;
            }
        }
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
    }
]

// 供应商申请入驻列表
export const supplierApplicationList = [
    {
        title: '注册号',
        dataIndex: 'spRegNo',
        key: 'spRegNo',
    },
    {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
    },
    {
        title: '联系人',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '联系人手机',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: '联系人邮箱',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: '供应商编号',
        dataIndex: 'spNo',
        key: 'spNo',
    },
    {
        title: '入驻时间',
        dataIndex: 'settledRequestTime',
        key: 'settledRequestTime',
        render: (text) => (
            <span>
                {moment(parseInt(text, 10)).format('YYYY-MM-DD HH:mm:ss')}
            </span>
        )
    },
    {
        title: '审核状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
            switch (parseInt(text, 10)) {
                case 0:
                    return '待审批';
                case 1:
                    return '审核不通过';
                default:
                    return null;
            }
        }
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
    }
]

// 供应商申请入驻列表(改)
export const suppliersAppList = [
    {
        title: '供应商编码',
        dataIndex: 'providerNo',
        key: 'providerNo',
    },
    {
        title: '供应商名称',
        dataIndex: 'providerName',
        key: 'providerName',
    },
    {
        title: '供应商营业执照号',
        dataIndex: 'registLicenceNumber',
        key: 'registLicenceNumber',
    },
    {
        title: '供应商类型',
        dataIndex: 'providerType',
        key: 'providerType',
        render: (text) => {
            switch (parseInt(text, 10)) {
                case 1:
                    return '供应商'
                case 2:
                    return '供应商地点'
                default:
                    break;
            }
        }
    },
    {
        title: '供应商等级',
        dataIndex: 'grade',
        key: 'grade',
        render: (text, record) => {
            if (record.providerType === 1) {
                switch (parseInt(text, 10)) {
                    case 1:
                        return '战略供应商'
                    case 2:
                        return '核心供应商'
                    case 3:
                        return '可替代供应商'
                    default:
                        break;
                }
            }
            else if (record.providerType === 2) {
                switch (parseInt(text, 10)) {
                    case '1':
                        return '生产厂家'
                    case '2':
                        return '批发商'
                    case '3':
                        return '经销商'
                    case '4':
                        return '代销商'
                    case '5':
                        return '其他'
                    default:
                        break;
                }
            }
        }
    },
    {
        title: '供应商入驻日期',
        dataIndex: 'settledDate',
        key: 'settledDate',
        render: (text) => (
                text !== null ? moment(parseInt(text, 10)).format('YYYY-MM-DD') : ''
        )
    },
    {
        title: '供应商状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
            switch (parseInt(text, 10)) {
                case 1:
                    return '制单';
                case 2:
                    return '已提交';
                case 3:
                    return '已审核';
                case 4:
                    return '已拒绝';
                case 5:
                    return '修改中';
                default:
                    return null;
            }
        }
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
    }
]

// 供应商管理列表
export const supplierInputList = [
    {
        title: '供应商编码',
        dataIndex: 'providerNo',
        key: 'providerNo',
    },
    {
        title: '供应商名称',
        dataIndex: 'providerName',
        key: 'providerName',
    },
    {
        title: '供应商营业执照号',
        dataIndex: 'registLicenceNumber',
        key: 'registLicenceNumber',
    },
    {
        title: '供应商类型',
        dataIndex: 'providerType',
        key: 'providerType',
        render: (text) => {
            switch (parseInt(text, 10)) {
                case 1:
                    return '供应商'
                case 2:
                    return '供应商地点'
                default:
                    break;
            }
        }
    },
    {
        title: '供应商等级',
        dataIndex: 'grade',
        key: 'grade',
        render: (text, record) => {
            if (record.providerType === 1) {
                switch (parseInt(text, 10)) {
                    case 1:
                        return '战略供应商'
                    case 2:
                        return '核心供应商'
                    case 3:
                        return ':可替代供应商'
                    default:
                        break;
                }
            }
            else if (record.providerType === 2) {
                switch (parseInt(text, 10)) {
                    case '1':
                        return '生产厂家'
                    case '2':
                        return '批发商'
                    case '3':
                        return '经销商'
                    case '4':
                        return '代销商'
                    case '5':
                        return '其他'
                    default:
                        break;
                }
            }
        }
    },
    {
        title: '供应商入驻日期',
        dataIndex: 'settledDate',
        key: 'settledDate',
        render: (text) => (
                text !== null ? moment(parseInt(text, 10)).format('YYYY-MM-DD') : ''
        )
    },
    {
        title: '供应商状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
            switch (parseInt(text, 10)) {
                case 0:
                    return '制单';
                case 1:
                    return '已提交';
                case 2:
                    return '已审核';
                case 3:
                    return '已拒绝';
                case 4:
                    return '修改中';
                default:
                    return null;
            }
        }
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
    }
]

// 供应商供应区域列表
export const supplierAreaList = [{
    title: '供应商',
    dataIndex: 'companyName',
    key: 'companyName',
    width: '20%'
}, {
    title: '供应商编号',
    dataIndex: 'spNo',
    key: 'spNo',
    width: '20%'
}, {
    title: '销售地区',
    dataIndex: 'saleRegions',
    key: 'saleRegions',
}, {
    title: '操作',
    dataIndex: 'operation',
    width: '8%',
    key: 'operation',
}]

// 分类列表页商品排序管理列表
export const categoryList = [{
    title: '一级分类',
    dataIndex: 'firstCategoryName',
    key: 'firstCategoryName',
}, {
    title: '二级分类',
    dataIndex: 'secondCategoryName',
    key: 'secondCategoryName',
}, {
    title: '三级分类',
    dataIndex: 'thirdCategoryName',
    key: 'thirdCategoryName'
}, {
    title: '商品编号',
    dataIndex: 'id',
    key: 'id'
}, {
    title: '商品名称',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '排序',
    dataIndex: 'orderNum',
    key: 'orderNum'
}, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
}]

// 静态页管理
export const staticPageHome = [{
    title: '序号',
    dataIndex: 'id',
    key: 'id',
}, {
    title: '静态页名称',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '链接',
    dataIndex: 'linkUrl',
    key: 'linkUrl'
}, {
    title: '描述',
    dataIndex: 'description',
    key: 'description'
}, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (text) => (
        <span>
            {moment(parseInt(text, 10)).format('YYYY-MM-DD HH:mm:ss')}
        </span>
    )
}, {
    title: '创建人',
    dataIndex: 'createUser',
    key: 'createUser'
}, {
    title: '最后修改时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    render: (text) => (
        text !== null ? moment(parseInt(text, 10)).format('YYYY-MM-DD HH:mm:ss') : ''
    )
}, {
    title: '修改人',
    dataIndex: 'updateUser',
    key: 'updateUser'
}, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
}]


export const showChange = [{
    title: '项目',
    dataIndex: 'type',
    key: 'type'
},
{
    title: '修改前',
    dataIndex: 'old',
    key: 'old'
},
{
    title: '修改后',
    dataIndex: 'new',
    key: 'new'
}]

