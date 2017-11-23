//退货单类型
export const returnGoodsType = {
    defaultValue: '',
    data: [{
        key: '',
        value: '请选择'
    }, {
        key: '0',
        value: '正常退货'
    }, {
        key: '1',
        value: '拒收退货'
    }]
}

// 退货单状态
export const returnGoodsStatus = {
    defaultValue: '1',
    data: [{
        key: '1',
        value: '待确认'
    }, {
        key: '2',
        value: '已确认'
    }, {
        key: '3',
        value: '已完成'
    }, {
        key: '4',
        value: '已取消'
    }]
}

// 退货单状态
export const returnType = {
    defaultValue: '1',
    data: [{
        key: 'ZCTH',
        value: '正常退货'
    }, {
        key: 'JSTH',
        value: '拒收退货'
    }]
}


// 收货状态
export const goodsReceiptStatus = {
    defaultValue: '',
    data: [{
        key: '',
        value: '请选择'
    }, {
        key: '1',
        value: '部分收货'
    }, {
        key: '2',
        value: '全部收货'
    }, {
        key: '3',
        value: '待收货'
    }]
}

// 商品状态
export const productStateOption = {
    defaultValue: '',
    data: [{
        key: '',
        value: '请选择'
    }, {
        key: '1',
        value: '待取货'
    }, {
        key: '2',
        value: '已取货'
    }, {
        key: '3',
        value: '已发货'
    }]
}


// 退货详情页 退货原因

export const reason = {
    defaultValue: '',
    data: [{
        key: '',
        value: '请选择'
    }, {
        key: '1',
        value: '包装破损'
    }, {
        key: '2',
        value: '商品破损'
    }, {
        key: '3',
        value: '保质期临期或过期'
    }, {
        key: '4',
        value: '商品错发或漏发'
    }, {
        key: '5',
        value: '订错货'
    }, {
        key: '6',
        value: '商品质量问题'
    }, {
        key: '7',
        value: '其他'
    }]
}
