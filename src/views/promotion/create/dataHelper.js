/**
 * 表单数据组装工具类
 */
import { message } from 'antd';
import Util from '../../../util/util';

// 根据整数计算百分数
const getPercent = (num) => (Number(num / 100.0).toFixed(2));

const getPreferentialValueOfPC = (values) => {
    const {
        purchaseConditionRule, purchaseConditionRulePercent,
        purchaseConditionRulePrice, purchaseConditionRuleGive,
        purchaseConditionRuleAmount
    } = values;
    let preferentialValue = '';
    switch (purchaseConditionRule) {
        case 'PERCENTAGE': // 折扣百分比
            preferentialValue = getPercent(purchaseConditionRulePercent);
            break;
        case 'DISCOUNTAMOUNT': // 折扣金额
            preferentialValue = purchaseConditionRuleAmount;
            break;
        case 'FIXEDPRICE': // 固定单价
            preferentialValue = purchaseConditionRulePrice;
            break;
        case 'GIVESAMEPRODUCT': // 赠送相同商品
            preferentialValue = purchaseConditionRuleGive;
            break;
        default: break;
    }
    return preferentialValue;
}

const getConditionValueOfPC = (values) => {
    const {
        purchaseConditionType, purchaseConditionTypeAmount, purchaseConditionTypeQuantity
    } = values;
    let conditionValue = '';
    if (purchaseConditionType === 'AMOUNT') {
        // 条件类型为累计商品金额
        conditionValue = purchaseConditionTypeAmount;
    } else if (purchaseConditionType === 'QUANTITY') {
        // 条件类型为累计商品数量
        conditionValue = purchaseConditionTypeQuantity;
    }
    return conditionValue;
}

const getConditionOfPC = (promotionRule, state, values) => {
    const {
        purchaseCondition,
        purchaseConditionProduct
    } = values;
    const { categoryPC } = state;
    switch (purchaseCondition) {
        case 'ALL': // 全部
            break;
        case 'CATEGORY': // 按品类
            Object.assign(promotionRule.purchaseConditionsRule.condition, {
                promoCategories: categoryPC
            });
            break;
        case 'PRODUCT': // 按商品
            Object.assign(promotionRule.purchaseConditionsRule.condition, {
                promoProduct: {
                    productId: purchaseConditionProduct.record.productId,
                    productName: purchaseConditionProduct.record.productName
                }
            });
            break;
        default: break;
    }
}

export const isCategoryExist = (category) => (category && category.categoryId !== undefined);

/**
 * 优惠种类: 购买条件
 *
 * @param {*} state
 * @param {*} values
 */
const getPurchaseConditionsRule = (state, values) => {
    const {
        category, purchaseCondition, purchaseConditionType,
        purchaseConditionRule
    } = values;
    const promotionRule = {
        useConditionRule: true,
        ruleName: category,
        purchaseConditionsRule: {
            condition: {
                purchaseType: purchaseCondition,
                conditionType: purchaseConditionType,
                conditionValue: getConditionValueOfPC(values)
            },
            rule: {
                preferentialWay: purchaseConditionRule,
                preferentialValue: getPreferentialValueOfPC(values)
            }
        }
    };
    // 按全部、品类和商品拼接 condition 对象
    getConditionOfPC(promotionRule, state, values);
    return Util.removeInvalid(promotionRule);
}

// 不限制条件对象拼接
const getNoConditionDataRule = (values) => {
    const { noConditionRule, noConditionRulePercent, noConditionRuleAmount } = values;
    const promotionRule = {
        useConditionRule: false,
        orderRule: {
            preferentialWay: noConditionRule
        }
    };
    switch (noConditionRule) {
        case 'PERCENTAGE':
            Object.assign(promotionRule.orderRule, {
                preferentialValue: getPercent(noConditionRulePercent)
            });
            break;
        case 'DISCOUNTAMOUNT':
            Object.assign(promotionRule.orderRule, {
                preferentialValue: noConditionRuleAmount
            });
            break;
        default: break;
    }
    return promotionRule;
}

// 获取基础数据，无分支条件的数据
const getBasicData = (state, values) => {
    const {
        promotionName,
        dateRange,
        store,
        quanifyAmount,
        note,
        storeId,
        overlay,
        priority,
        simpleDescription,
        detailDescription
    } = values;
    const startDate = dateRange ? dateRange[0].valueOf() : '';
    const endDate = dateRange ? dateRange[1].valueOf() : '';
    const { companies } = state;
    // 计算打折活动叠加方式
    let overLayNum = 0;
    overlay.forEach(v => {
        overLayNum += v;
    });
    return {
        promotionName,
        startDate,
        endDate,
        store,
        quanifyAmount,
        note,
        companiesPoList: companies.length === 0 ? '' : companies,
        stores: storeId === undefined ? '' : { storeId },
        priority,
        isSuperposeProOrCouDiscount: overLayNum % 2 === 1 ? 1 : 0,
        isSuperposeUserDiscount: overLayNum >= 2 ? 1 : 0,
        simpleDescription,
        detailDescription
    }
}

// 根据优惠方式组装优惠规则
const getPurchageWay = (formData, values, state) => {
    switch (values.category) {
        case 'PURCHASECONDITION': // 购买条件
            Object.assign(formData, {
                promotionRule: getPurchaseConditionsRule(state, values)
            });
            break;
        case 'REWARDLIST': // 奖励列表
            Object.assign(formData, {
                rewardListRule: getPurchaseConditionsRule(state, values)
            });
            break;
        default: break;
    }
}

/**
 * 获取表单数据
 *
 * @param {*object} { state: this.state, form: this.props.form }
 * @param {*function} callback 校验成功之后的回调
 */
export const getFormData = ({ state, form }, callback) => {
    const { validateFields } = form;
    validateFields((err, values) => {
        const { condition, category, purchaseCondition, buyCondition } = values;
        if (err) {
            return;
        }
        if (condition === 1
            && category === 'PURCHASECONDITION'
            && purchaseCondition === 'CATEGORY'
            && !isCategoryExist(state.categoryPC)
        ) {
            message.error('请选择品类');
            return;
        }
        if (condition === 1
            && category === 'REWARDLIST'
            && buyCondition === 'CATEGORY'
            && !isCategoryExist(state.categoryRL)
        ) {
            message.error('请选择品类');
            return;
        }
        if (condition === 1
            && category === 'REWARDLIST'
            && state.conditions.length === 0
        ) {
            message.error('请添加购买条件');
            return;
        }
        const formData = getBasicData(state, values);
        if (condition === 0) {
            // 使用条件——不限制
            Object.assign(formData, {
                promotionRule: getNoConditionDataRule(values)
            });
        } else if (condition === 1) {
            // 使用条件——指定条件——优惠方式
            getPurchageWay(formData, values, state);
        }
        if (typeof callback === 'function') {
            callback(Util.removeInvalid(formData));
        }
    });
}
