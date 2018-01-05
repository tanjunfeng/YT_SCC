/**
 * 表单数据组装工具类
 */
import { message } from 'antd';
import Util from '../../../util/util';

const getPreferentialValueOfPC = (values) => {
    const {
        purchaseConditionRule,
        purchaseConditionRulePercent,
        purchaseConditionRuleGive,
        purchaseConditionRuleAmount,
        purchaseConditionRulePrice
    } = values;
    let preferentialValue = '';
    switch (purchaseConditionRule) {
        case 'PERCENTAGE': // 折扣百分比
            preferentialValue = purchaseConditionRulePercent;
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

export const isCategoryExist = (category) => (
    category && category !== null && category.categoryId !== undefined
);

/**
 * 指定条件——优惠种类——购买条件
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

const getRewardListPreferentialValue = (values) => {
    const {
        rewardListRule, rewardListRulePercent,
        rewardListRuleAmount, rewardListRulePrice,
        rewardListRuleGive
    } = values;
    let preferentialValue = '';
    switch (rewardListRule) {
        case 'PERCENTAGE':
            preferentialValue = rewardListRulePercent;
            break;
        case 'DISCOUNTAMOUNT':
            preferentialValue = rewardListRuleAmount;
            break;
        case 'FIXEDPRICE':
            preferentialValue = rewardListRulePrice;
            break;
        case 'GIVESAMEPRODUCT':
            preferentialValue = rewardListRuleGive;
            break;
        default: break;
    }
    return preferentialValue;
}

const getCategoryOrProductOfRL = (condition, values, state) => {
    const { rewardList, rewardListProduct } = values;
    switch (rewardList) {
        case 'CATEGORY':
            Object.assign(condition, { promoCategories: state.categoryRL });
            break;
        case 'PRODUCT':
            Object.assign(condition, {
                promoProduct: {
                    productId: rewardListProduct.record.productId,
                    productName: rewardListProduct.record.productName
                }
            });
            break;
        case 'ALL':
        default: break;
    }
}

const getEachGiveOncePreferentialValue = values => {
    const {
        eachConditionGivenOneRule, eachConditionGivenOneRulePercent,
        eachConditionGivenOneRuleAmount, eachConditionGivenOneRulePrice,
        eachConditionGivenOneRuleGive
    } = values;
    let preferentialValue = '';
    switch (eachConditionGivenOneRule) {
        case 'PERCENTAGE':
            preferentialValue = eachConditionGivenOneRulePercent;
            break;
        case 'DISCOUNTAMOUNT':
            preferentialValue = eachConditionGivenOneRuleAmount;
            break;
        case 'FIXEDPRICE':
            preferentialValue = eachConditionGivenOneRulePrice;
            break;
        case 'GIVESAMEPRODUCT':
            preferentialValue = eachConditionGivenOneRuleGive;
            break;
        default: break;
    }
    return preferentialValue;
}

const getProductOfECGO = (condition, values) => {
    const { eachConditionGivenOne, eachConditionGivenOneProduct } = values;
    switch (eachConditionGivenOne) {
        case 'PRODUCT':
            Object.assign(condition, {
                promoProduct: {
                    productId: eachConditionGivenOneProduct.record.productId,
                    productName: eachConditionGivenOneProduct.record.productName
                }
            });
            break;
        case 'ALL':
        default: break;
    }
}

/**
 * 指定条件——优惠种类——奖励列表
 *
 * @param {*} state
 * @param {*} values
 */
const getRewardListRule = (state, values) => {
    const { category, rewardList, rewardListRule } = values;
    const { conditions } = state;
    const promotionRule = {
        useConditionRule: true,
        ruleName: category,
        rewardListRule: {
            conditions,
            purchaseConditionsRule: {
                condition: {
                    purchaseType: rewardList
                },
                rule: {
                    preferentialWay: rewardListRule,
                    preferentialValue: getRewardListPreferentialValue(values)
                }
            }
        }
    };
    // 按全部、品类和商品拼接 condition 对象
    getCategoryOrProductOfRL(
        promotionRule.rewardListRule.purchaseConditionsRule.condition,
        values, state
    );
    return Util.removeInvalid(promotionRule);
}

/**
 * 指定条件——优惠种类——每满
 *
 * @param {*} state
 * @param {*} values
 */
const getEacheachConditionGiveOnce = (state, values) => {
    const { category,
        eachConditionGivenOne,
        eachConditionGivenOneRule
    } = values;

    const { conditions } = state;
    const promotionRule = {
        useConditionRule: true,
        ruleName: category,
        eachConditionGiveOnce: {
            conditions,
            giveRuleCondition: {
                purchaseType: eachConditionGivenOne,
                rule: {
                    preferentialWay: eachConditionGivenOneRule,
                    preferentialValue: getEachGiveOncePreferentialValue(values)
                }
            }
        }
    };

    const giveRuleCondition = promotionRule.eachConditionGiveOnce.giveRuleCondition;
    // 按全部、品类和商品拼接 condition 对象
    getProductOfECGO(
        giveRuleCondition,
        values
    );
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
                preferentialValue: noConditionRulePercent
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

const getTotalPurchaseListPreferentialValue = (values) => {
    const {
        totalPurchaseListRule,
        totalPurchaseListRulePercent,
        totalPurchaseListRuleAmount
    } = values;
    let preferentialValue = '';
    switch (totalPurchaseListRule) {
        case 'PERCENTAGE':
            preferentialValue = totalPurchaseListRulePercent;
            break;
        case 'DISCOUNTAMOUNT':
            preferentialValue = totalPurchaseListRuleAmount;
            break;
        default: break;
    }
    return preferentialValue;
}

const getTotalPurchaseListRule = (state, values) => {
    const { category, totalPurchaseListRule } = values;
    const { conditions } = state;
    const promotionRule = {
        useConditionRule: true,
        ruleName: category,
        totalPurchaseListRule: {
            conditions,
            rule: {
                preferentialWay: totalPurchaseListRule,
                preferentialValue: getTotalPurchaseListPreferentialValue(values)
            }
        }
    };
    return Util.removeInvalid(promotionRule);
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
                promotionRule: getRewardListRule(state, values)
            });
            break;
        case 'EACHCONDITIONGIVEONCE': // 每满
            Object.assign(formData, {
                promotionRule: getEacheachConditionGiveOnce(state, values)
            });
            break;
        case 'TOTALPUCHASELIST': // 整个购买列表
            Object.assign(formData, {
                promotionRule: getTotalPurchaseListRule(state, values)
            });
            break;
        default: break;
    }
}

/**
 * 是否禁止提交表单
 *
 * @param {*} state
 * @param {*} values
 */
const forbidden = (state, values) => {
    const {
        condition,
        category,
        purchaseCondition,
        rewardList,
        eachConditionGivenOne,
        purchaseConditionProduct,
        rewardListProduct,
        eachConditionGivenOneProduct } = values;
    if (condition === 1) {
        if (category === 'PURCHASECONDITION'
            && purchaseCondition === 'CATEGORY'
            && !isCategoryExist(state.categoryPC)
        ) {
            message.error('请选择品类');
            return true;
        }
        if (category === 'REWARDLIST'
            && rewardList === 'CATEGORY'
            && !isCategoryExist(state.categoryRL)
        ) {
            message.error('请选择品类');
            return true;
        }
        if (category !== 'PURCHASECONDITION'
            && state.conditions.length === 0
        ) {
            message.error('请添加购买条件');
            return true;
        }
        if (category === 'EACHCONDITIONGIVEONCE'
            && eachConditionGivenOne === 'PRODUCT'
            && !eachConditionGivenOneProduct.record) {
            message.error('请选择商品');
            return true;
        }
        if (category === 'REWARDLIST'
            && rewardList === 'PRODUCT'
            && !rewardListProduct.record) {
            message.error('请选择商品');
            return true;
        }
        if (category === 'PURCHASECONDITION'
            && purchaseCondition === 'PRODUCT'
            && !purchaseConditionProduct.record) {
            message.error('请选择商品');
            return true;
        }
    }
    return false;
}

/**
 * 获取表单数据
 *
 * @param {*object} { state: this.state, form: this.props.form }
 * @param {*function} callback 校验成功之后的回调
 */
export const getFormData = ({ state, form }, callback, reject) => {
    const { validateFields } = form;
    validateFields((err, values) => {
        const { condition } = values;
        if (err || forbidden(state, values)) {
            if (typeof callback === 'function') {
                reject();
            }
        } else {
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
        }
    });
}
