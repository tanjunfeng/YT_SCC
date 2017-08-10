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

export const locTypeCodes = {
    warehouse: '0001',
    shop: '0002'
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
