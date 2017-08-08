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
    draft: '0001',
    submited: '0002',
    approved: '0003',
    rejected: '0004',
    closed: '0005'
}

// 收货单状态清单
export const receivedCode = {
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
        key: '1',
        value: '普通采购'
    }]
}

export const poTypeCodes = {
    normal: '0001'
}

//审核值清单
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
