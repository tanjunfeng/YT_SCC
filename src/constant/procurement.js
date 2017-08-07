// 采购单状态值清单
export const poStatus = {
    defaultValue: '',
    data: [{
        key: '',
        value: '请选择'
    }, {
        key: '0001',
        value: '制单'
    }, {
        key: '0002',
        value: '已提交'
    }, {
        key: '0003',
        value: '已审核'
    }, {
        key: '0004',
        value: '已拒绝'
    }, {
        key: '0005',
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
    warehouse: '0',
    shop: '1'
}

// 采购单类型值清单
export const poType = {
    defaultValue: '',
    data: [{
        key: '',
        value: '请选择'
    }, {
        key: '0001',
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
