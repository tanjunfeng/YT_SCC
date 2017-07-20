// 采购单状态值清单
export const poStatus = {
    defaultValue: '',
    data: [{
        key: '',
        value: '请选择'
    }, {
        key: '0001',
        value: '草稿'
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

export const poCodes = {
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
        key: '0001',
        value: '仓库'
    }, {
        key: '0002',
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
        key: '0001',
        value: '普通采购'
    }]
}
