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
    defaultValue: '1',
    data: [{
        key: '1',
        value: '供应商'
    }, {
        key: '2',
        value: '供应商地点'
    }]
}

// 入驻-供应商状态
export const firstSupplierStatusOptions = {
    defaultValue: '0',
    data: [{
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

// 供应商类型
export const supplierLevelOptions = {
    defaultValue: '1',
    data: [{
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
    defaultValue: '1',
    data: [{
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
        value: '启用'
    }, {
        key: '1',
        value: '未启用'
    }]
}

// 商品状态
export const commodityStatusOptions = {
    defaultValue: '-1',
    data: [{
        key: '-1',
        value: '全部'
    }, {
        key: '1',
        value: '制单'
    }, {
        key: '2',
        value: '生效'
    }, {
        key: '3',
        value: '暂停使用'
    }, {
        key: '4',
        value: '停止使用'
    }]
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
    defaultValue: '-1',
    data: [{
        key: '-1',
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
    defaultValue: '-1',
    data: [{
        key: '-1',
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

// 订单管理-订单类型
export const orderTypeOptions = {
    defaultValue: '-1',
    data: [{
        key: '-1',
        value: '全部'
    }, {
        key: '0',
        value: '正常销售 '
    }, {
        key: '1',
        value: '直营店要货'
    }]
}

// 订单管理-订单状态
export const orderStatusOptions = {
    defaultValue: '0',
    data: [{
        key: '-1',
        value: '全部'
    }, {
        key: '0',
        value: '待审核'
    }, {
        key: '1',
        value: '待人工审核'
    }, {
        key: '2',
        value: '已审核'
    }, {
        key: '3',
        value: '已取消'
    }, {
        key: '4',
        value: '已完成'
    }]
}

// 订单管理-支付状态
export const payStatusOptions = {
    defaultValue: '-1',
    data: [{
        key: '-1',
        value: '全部'
    }, {
        key: '0',
        value: '未支付'
    }, {
        key: '1',
        value: '已支付'
    }, {
        key: '2',
        value: '取消支付'
    }, {
        key: '3',
        value: '退款待审核'
    }, {
        key: '4',
        value: '退款待确认'
    }, {
        key: '5',
        value: '已退款'
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
    defaultValue: '-1',
    data: [{
        key: '-1',
        value: '全部'
    }, {
        key: '0',
        value: '待处理'
    }, {
        key: '1',
        value: '未传送'
    }, {
        key: '2',
        value: '待出库'
    }, {
        key: '3',
        value: '待收货'
    }, {
        key: '4',
        value: '已签收'
    }, {
        key: '5',
        value: '未送达'
    }, {
        key: '6',
        value: '取消送货'
    }, {
        key: '7',
        value: '采购未到货'
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
