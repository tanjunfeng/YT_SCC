import { preferentialWayStatus, purchageTypeStatus, conditionTypeStatus } from '../constants';

export const getPreferentialBuyRule = (rule) => {
    const { preferentialWay, preferentialValue } = rule;
    return `优惠方式：${preferentialWayStatus[preferentialWay]}，${preferentialValue}；`;
}

export const getTextByCondition = (condition) => {
    let info = `购买类型：${purchageTypeStatus[condition.purchaseType]}，`;
    // 购买类型
    switch (condition.purchaseType) {
        case 'CATEGORY':
            info += `${condition.promoCategories.categoryName}；`;
            break;
        case 'PRODUCT':
            info += `${condition.promoProduct.productName}；`;
            break;
        default: break;
    }
    info += `条件类型：${conditionTypeStatus[condition.conditionType]}，`;
    // 条件类型
    switch (condition.conditionType) {
        case 'QUANTITY':
            info += `${condition.conditionValue}；`;
            break;
        case 'AMOUNT':
            info += `${condition.conditionValue}元；`;
            break;
        default: break;
    }
    return info;
}
