/**
 * @file searchParams.js
 * @author shijh
 *
 * get查询参数定义
 */


// 供应商管理列表
export const supplierManage = {
    // 请求第几页
    pageNum: null,

    // 每页请求多少条
    pageSize: null,

    // 公司名
    companyName: null,

    // 注册号
    spRegNo: null,

    // 联系人
    name: null,

    // 联系人手机
    phone: null,

    // 供应商编号
    spNo: null,

    // 入驻时间最小值
    minSettledDate: null,

    // 入驻时间最大值
    maxSettledDate: null,

    // 供应商状态（2:正常供应,3:已冻结,4:终止合作）
    status: null,

    // 账期最小值
    minSettlementPeriod: null,

    // 账期最大值
    maxSettlementPeriod: null,

    // 结算账户类型
    settlementAccountType: null,

    // 返利最小值
    minRebateRate: null,

    // 返利最大值
    maxRebateRate: null
};

// 供应商管理列表下拉数据
export const spplierSelectType = {
    defaultValue: 'spNo',
    data: [{
        key: 'spRegNo',
        value: '注册号'
    }, {
        key: 'name',
        value: '联系人'
    }, {
        key: 'phone',
        value: '联系人手机'
    }, {
        key: 'spNo',
        value: '供应商编号'
    }]
}

// 供应商申请管理列表下拉数据
export const spplierModifySelectType = {
    defaultValue: 'spRegNo',
    data: [{
        key: 'spRegNo',
        value: '注册号'
    }, {
        key: 'name',
        value: '联系人'
    }, {
        key: 'phone',
        value: '联系人手机'
    }]
}

// 供应商状态
export const supplierStatus = {
    defaultValue: '-1',
    data: [{
        key: '-1',
        value: '全部'
    }, {
        key: '2',
        value: '正常'
    }, {
        key: '3',
        value: '冻结'
    }, {
        key: '4',
        value: '终止合作'
    }]
}

// 入驻申请状态
export const suplierStatusSelect = {
    defaultValue: '-1',
    data: [{
        key: '-1',
        value: '全部'
    }, {
        key: '0',
        value: '待审批'
    }, {
        key: '1',
        value: '审核不通过'
    }]
}

// 账户下拉数据
export const settlementAccount = {
    defaultValue: '-1',
    data: [{
        key: '-1',
        value: '全部'
    }, {
        key: '0',
        value: '商户雅堂金融账户'
    }, {
        key: '1',
        value: '商户公司银行账户'
    }]
}

// 供应商类型
export const supplierTypeOptions = {
    defaultValue: '0',
    data: [{
        key: '0',
        value: '全部'
    }, {
        key: '1',
        value: '供应商'
    }, {
        key: '2',
        value: '供应商地点'
    }]
}

// 入驻-供应商状态
export const firstSupplierStatusOptions = {
    defaultValue: '-1',
    data: [{
        key: '-1',
        value: '全部'
    }, {
        key: '0',
        value: '制单'
    }, {
        key: '1',
        value: '已提交'
    }, {
        key: '2',
        value: '已审核'
    }, {
        key: '3',
        value: '已拒绝'
    }, {
        key: '4',
        value: '修改中'
    }]
}

// 供应商管理-供应商状态
export const secondSupplierStatusOptions = {
    defaultValue: '0',
    data: [{
        key: '0',
        value: '全部'
    }, {
        key: '1',
        value: '已提交'
    }, {
        key: '2',
        value: '已审核'
    }, {
        key: '3',
        value: '已拒绝'
    }]
}

// 供应商类型
export const supplierLevelOptions = {
    defaultValue: '0',
    data: [{
        key: '0',
        value: '全部'
    }, {
        key: '1',
        value: '战略供应商'
    }, {
        key: '2',
        value: '核心供应商'
    }, {
        key: '3',
        value: '可替代供应商'
    }]
}

// 供应商地点等级
export const supplierPlaceLevelOptions = {
    defaultValue: '0',
    data: [{
        key: '0',
        value: '全部'
    }, {
        key: '1',
        value: '生产厂家'
    }, {
        key: '2',
        value: '批发商'
    }, {
        key: '3',
        value: '经销商'
    }, {
        key: '4',
        value: '代销商'
    }, {
        key: '5',
        value: '其他'
    }]
}

// 启用状态
export const initiateModeOptions = {
    defaultValue: '-1',
    data: [{
        key: '-1',
        value: '全部'
    }, {
        key: '0',
        value: '失效'
    }, {
        key: '1',
        value: '启用'
    }]
}

// 商品状态
export const commodityStatusOptions = {
    defaultValue: '-1',
    data: [{
        key: '-1',
        value: '全部'
    },
    // {
    //     key: '1',
    //     value: '制单'
    // },
    {
        key: '2',
        value: '生效'
    }, {
        key: '3',
        value: '暂停使用'
    },
    // {
    //     key: '4',
    //     value: '停止使用'
    // }
    ]

}

// 主供应商
export const mainSupplierOptions = {
    defaultValue: '-1',
    data: [{
        key: '-1',
        value: '全部'
    }, {
        key: '0',
        value: '否'
    }, {
        key: '1',
        value: '是'
    }]
}

// 供货状态
export const deliveryStatusOptions = {
    defaultValue: '',
    data: [{
        key: '',
        value: '全部'
    }, {
        key: '0',
        value: '失效'
    }, {
        key: '1',
        value: '生效'
    }]
}

// 子公司状态
export const subCompanyStatusOptions = {
    defaultValue: '',
    data: [{
        key: '',
        value: '全部'
    }, {
        key: '0',
        value: '失效'
    }, {
        key: '1',
        value: '生效'
    }]
}

// 商品管理列表页-排序
export const commoditySortOptions = {
    defaultValue: '-1',
    data: [{
        key: '-1',
        value: '全部'
    }, {
        key: '0',
        value: '按所属分类排序'
    }, {
        key: '1',
        value: '按所属品牌排序'
    }, {
        key: '2',
        value: '按商品编号升序排列'
    }, {
        key: '3',
        value: '按商品编号降序排列'
    }]
}

// 商品管理列表
export const commodityListOptions = [{
    title: '商品信息',
    dataIndex: 'name',
    key: 'name',
    width: 400,
}, {
    title: '部门',
    dataIndex: 'firstLevelCategoryName',
    key: 'firstLevelCategoryName',
}, {
    title: '大类',
    dataIndex: 'secondLevelCategoryName',
    key: 'secondLevelCategoryName',
}, {
    title: '中类',
    dataIndex: 'thirdLevelCategoryName',
    key: 'thirdLevelCategoryName',
}, {
    title: '小类',
    dataIndex: 'fourthLevelCategoryName',
    key: 'fourthLevelCategoryName',
}, {
    title: '品牌',
    dataIndex: 'brand',
    key: 'brand',
}, {
    title: '状态',
    dataIndex: 'supplyChainStatus',
    key: 'supplyChainStatus',
    render: (text) => {
        switch (text) {
            // case '1':
            //     return '草稿';
            case '2':
                return '生效';
            case '3':
                return '暂停使用';
            // case '4':
            //     return '停止使用';
            default:
                return text;
        }
    }
}, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
}];

// 订单管理-订单类型
export const orderTypeOptions = {
    defaultValue: 'ALL',
    data: [{
        key: 'ALL',
        value: '全部'
    }, {
        key: 'ZCXS',
        value: '正常销售 '
    }, {
        key: 'ZYYH',
        value: '直营店要货'
    }]
}

// 订单管理-订单状态
export const orderStatusOptions = {
    defaultValue: 'W',
    data: [{
        key: 'ALL',
        value: '全部'
    }, {
        key: 'W',
        value: '待审核'
    }, {
        key: 'M',
        value: '待人工审核'
    }, {
        key: 'A',
        value: '已审核'
    }, {
        key: 'Q',
        value: '已取消'
    }, {
        key: 'C',
        value: '已完成'
    }]
}

// 订单管理-支付状态
export const payStatusOptions = {
    defaultValue: 'ALL',
    data: [{
        key: 'ALL',
        value: '全部'
    }, {
        key: 'WZF',
        value: '未支付'
    }, {
        key: 'YZF',
        value: '已支付'
    }, {
        key: 'QXFK',
        value: '取消支付'
    }, {
        key: 'TKD',
        value: '退款待审核'
    }, {
        key: 'TKQ',
        value: '退款待确认'
    }, {
        key: 'YTK',
        value: '已退款'
    }, {
        key: 'GSN',
        value: '公司内'
    }]
}

// 状态
export const supplierStore = {
    defaultValue: '-1',
    data: [{
        key: '-1',
        value: '全部'
    }, {
        key: '0',
        value: '制单'
    }, {
        key: '1',
        value: '生效'
    }]
}

// 订单管理-物流状态
export const logisticsStatusOptions = {
    defaultValue: 'ALL',
    data: [{
        key: 'ALL',
        value: '全部'
    }, {
        key: 'DCL',
        value: '待处理'
    }, {
        key: 'WCS',
        value: '未传送'
    }, {
        key: 'DCK',
        value: '待出库'
    }, {
        key: 'DSH',
        value: '待收货'
    }, {
        key: 'YQS',
        value: '已签收'
    }, {
        key: 'WCS',
        value: '未传送'
    }, {
        key: 'QX',
        value: '取消送货'
    }, {
        key: 'CGWDH',
        value: '采购未到货'
    }, {
        key: 'WJS',
        value: '仓库拒收'
    }]
}

// 调整类型
export const adjustmentType = {
    defaultValue: '-1',
    data: [
        {
            key: '-1',
            value: '全部'
        },
        {
            key: '0',
            value: '物流丢失'
        },
        {
            key: '1',
            value: '库存报损报溢'
        },
        {
            key: '2',
            value: '业务发起库存调整'
        },
        {
            key: '3',
            value: '仓库库存同步'
        }
    ]
}
