import { preferentialWayStatus, purchageTypeStatus, conditionTypeStatus } from '../constants';

export const getPreferentialBuyRule = (rule) => {
    const { preferentialWay, preferentialValue } = rule;
    let value = preferentialValue;
    if (preferentialWay === 'DISCOUNTAMOUNT' || preferentialWay === 'FIXEDPRICE') {
        value = `￥${preferentialValue}元`;
    }
    return `${preferentialWayStatus[preferentialWay]} ${value}`;
}

/**
 * 获取购买类型
 *
 * @param {*object} condition
 */
export const getPurchaseType = (condition) => {
    const { purchaseType, promoCategories, promoProduct } = condition;
    let info = `${purchageTypeStatus[purchaseType]} `;
    // 购买类型
    switch (purchaseType) {
        case 'CATEGORY':
            info += `${promoCategories.categoryName}`;
            break;
        case 'PRODUCT':
            info += `${promoProduct.productName}`;
            break;
        default: break;
    }
    return info;
}

/**
 * 获取条件类型
 *
 * @param {*object} condition
 */
export const getConditionType = (condition) => {
    const { conditionType, conditionValue } = condition;
    let info = `${conditionTypeStatus[conditionType]} `;
    // 条件类型
    switch (conditionType) {
        case 'QUANTITY':
            info += `${conditionValue}`;
            break;
        case 'AMOUNT':
            info += `${conditionValue}元`;
            break;
        default: break;
    }
    return info;
}
