/**
 * 渲染付款方式
 * @param {*} key
 */
export const renderPayType = (key) => {
    switch (key) {
        case 0:
            return '网银';
        case 1:
            return '银行转账';
        case 2:
            return '现金';
        case 3:
            return '支票';
        default:
            return '';
    }
}

/**
 * 渲染付款条件
 * @param {*} key
 */
export const renderPayCondition = (key) => {
    switch (key) {
        case 1:
            return '票到七天';
        case 2:
            return '票到十五天';
        case 3:
            return '票到三十天';
        case 4:
            return '票到付款';
        default:
            return '';
    }
}

/**
 * 供应商接单状态
 * @param {*} key
 */
export const supplierOrderStatus = (key) => {
    switch (key) {
        case 0:
            return '未接单';
        case 1:
            return '已接单';
        default:
            return '未接单';
    }
}

/**
 * 渲染账期
 * @param {*} key
 */
export const renderPeriod = (key) => {
    switch (key) {
        case 0:
            return '周结';
        case 1:
            return '半月结';
        case 2:
            return '月结';
        case 3:
            return '票到付款';
        default:
            return '';
    }
}

export const purchaseOrderType = (key) => {
    switch (key) {
        case 0:
            return '普通采购单';
        case 1:
            return '赠品采购单';
        case 2:
            return '促销采购单';
        default:
            return '';
    }
}
export const businessMode = (key) => {
    switch (key) {
        case 0:
            return '经销';
        case 1:
            return '代销';
        case 2:
            return '寄售';
        default:
            return '';
    }
}
export const purchaseOrderState = (key) => {
    switch (key) {
        case 0:
            return '制单';
        case 1:
            return '已提交';
        case 2:
            return '已审核';
        case 3:
            return '已拒绝';
        case 4:
            return '已关闭';
        default:
            return '';
    }
}
export const purchaseOrderAdrType = (key) => {
    switch (key) {
        case 0:
            return '仓库';
        case 1:
            return '门店';
        default:
            return '';
    }
}
