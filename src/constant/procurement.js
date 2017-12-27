// 采购单状态值清单
export const poStatus = {
    defaultValue: '',
    data: [{
        key: '',
        value: '请选择'
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
        value: '已关闭'
    }]
}

export const poStatusCodes = {
    draft: 0,
    submited: 1,
    approved: 2,
    rejected: 3,
    closed: 4
}

// 退货单状态清单
export const returnStatus = {
    defaultValue: '',
    data: [{
        key: '',
        value: '请选择'
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
        value: '待退货'
    }, {
        key: '5',
        value: '已退货'
    }, {
        key: '6',
        value: '已取消'
    }, {
        key: '7',
        value: '取消异常'
    }, {
        key: '8',
        value: '异常'
    }]
}
// 退货单流程状态
export const auditStatusOption = {
    defaultValue: '',
    data: [{
        key: '',
        value: '请选择'
    }, {
        key: '0',
        value: '进行中'
    }, {
        key: '1',
        value: '已结束'
    }]
}
// 退货单审批状态
export const optionStatus = {
    defaultValue: '',
    data: [{
        key: '',
        value: '请选择'
    }, {
        key: '0',
        value: '拒绝'
    }, {
        key: '1',
        value: '通过'
    }]
}

// 收货单状态清单
export const receivedStatus = {
    defaultValue: '',
    data: [{
        key: '',
        value: '请选择'
    }, {
        key: '0',
        value: '待下发'
    }, {
        key: '1',
        value: '已下发'
    }, {
        key: '2',
        value: '已收货'
    }, {
        key: '3',
        value: '已取消'
    }, {
        key: '4',
        value: '异常'
    }]
}

// 地点类型值清单
export const locType = {
    defaultValue: '',
    data: [{
        key: '',
        value: '请选择'
    }, {
        key: '0',
        value: '仓库'
    }, {
        key: '1',
        value: '门店'
    }]
}

// 经营模式值清单
export const businessModeType = {
    defaultValue: '',
    data: [{
        key: '',
        value: '请选择'
    }, {
        key: '0',
        value: '经销'
    }, {
        key: '1',
        value: '代销'
    }]
}

export const locTypeCodes = {
    warehouse: '0000',
    shop: '0001'
}

// 采购单类型值清单
export const poType = {
    defaultValue: '',
    data: [{
        key: '',
        value: '请选择'
    }, {
        key: '0',
        value: '普通采购'
    }, {
        key: '1',
        value: '赠品采购'
    }, {
        key: '2',
        value: '促销采购'
    }]
}

// 货币类型
export const poNo = {
    defaultValue: 'CNY',
    data: [{
        key: 'CNY',
        value: 'CNY'
    }]
}

export const poTypeCodes = {
    normal: '0001'
}

// 审核值清单
export const auditType = {
    defaultValue: '',
    data: [{
        key: '',
        value: '请选择'
    }, {
        key: '1',
        value: '通过'
    }, {
        key: '2',
        value: '拒绝'
    }]
}

export const auditTypeCodes = {
    approve: '1',
    reject: '2'
}

// 采购进价批量导入-处理结果
export const processResult = {
    defaultValue: '',
    data: [{
        key: '',
        value: '全部'
    }, {
        key: '1',
        value: '已提交'
    }, {
        key: '2',
        value: '已验证'
    }, {
        key: '3',
        value: '错误'
    }]
}
