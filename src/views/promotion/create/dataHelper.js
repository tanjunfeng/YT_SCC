/**
 * 表单数据组装工具类
 */
import Util from '../../../util/util';


// 根据整数计算百分数
const getPercent = (num) => (Number(num / 100.0).toFixed(2));

/**
 * 优惠种类: 购买条件
 *
 * @param {*} state
 * @param {*} values
 */
const getPurchaseConditionsRule = (state, values) => {
    const {
        category, purchaseCondition, purchaseConditionType,
        purchaseConditionTypeAmount, purchaseConditionTypeQuantity,
        purchaseConditionRule, purchaseConditionRulePercent,
        purchaseConditionRulePrice, purchaseConditionRuleGive,
        purchaseConditionRuleAmount, purchaseConditionProduct
    } = values;
    const { categoryPC } = state;
    let conditionValue = '';
    if (purchaseConditionType === 'AMOUNT') {
        // 条件类型为累计商品金额
        conditionValue = purchaseConditionTypeAmount;
    } else if (purchaseConditionType === 'QUANTITY') {
        // 条件类型为累计商品数量
        conditionValue = purchaseConditionTypeQuantity;
    }
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
    const promotionRule = {
        useConditionRule: true,
        ruleName: category,
        purchaseConditionsRule: {
            condition: {
                purchaseType: purchaseCondition,
                conditionType: purchaseConditionType,
                conditionValue
            },
            rule: {
                preferentialWay: purchaseConditionRule,
                preferentialValue
            }
        }
    };
    // 按品类
    if (purchaseCondition === 'CATEGORY') {
        Object.assign(promotionRule.purchaseConditionsRule.condition, {
            promoCategories: categoryPC
        });
    }
    // 按商品
    if (purchaseCondition === 'PRODUCT') {
        const { productId, productName } = purchaseConditionProduct.record;
        Object.assign(promotionRule.purchaseConditionsRule.condition, {
            promoProduct: { productId, productName }
        });
    }
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

/**
 * 获取表单数据
 *
 * @param {*object} { state: this.state, form: this.props.form }
 * @param {*function} callback 校验成功之后的回调
 */
export const getFormData = ({ state, form }, callback) => {
    const { validateFields, setFields } = form;
    validateFields((err, values) => {
        const { condition, category, purchaseCondition, purchaseConditionProduct } = values;
        const { categoryPC } = state;
        if (err) {
            // 指定条件——购买条件——购买类型：按品类——校验是否选择了品类
            if (condition === 1
                && category === 'PURCHASECONDITION'
                && purchaseCondition === 'CATEGORY'
                && (!categoryPC || categoryPC.categoryId === undefined)
            ) {
                setFields({
                    purchaseCondition: {
                        value: 'CATEGORY',
                        errors: [new Error('请选择品类')]
                    }
                });
            }
            // 指定条件——购买条件——购买类型：按品类——校验是否选择了商品
            if (condition === 1
                && category === 'PURCHASECONDITION'
                && purchaseCondition === 'PRODUCT'
                && (!purchaseConditionProduct
                    || purchaseConditionProduct.productId === ''
                    || purchaseConditionProduct.record.productId === ''
                )
            ) {
                setFields({
                    purchaseCondition: {
                        value: 'PRODUCT',
                        errors: [new Error('请选择商品')]
                    }
                });
            }
            return;
        }
        // 使用条件 0: 不限制，1: 指定条件
        const dist = getBasicData(state, values);
        // 无限制条件
        if (condition === 0) {
            Object.assign(dist, {
                promotionRule: getNoConditionDataRule(values)
            });
        } else if (condition === 1 && category === 'PURCHASECONDITION' && purchaseCondition === 'CATEGORY') {
            // 指定条件——优惠种类——购买条件
            Object.assign(dist, {
                promotionRule: getPurchaseConditionsRule(state, values)
            });
        } else if (condition === 1 && category === 'PURCHASECONDITION' && purchaseCondition === 'PRODUCT') {
            Object.assign(dist, {
                promotionRule: getPurchaseConditionsRule(state, values)
            });
        }
        if (typeof callback === 'function') {
            callback(Util.removeInvalid(dist));
        }
    });
}
