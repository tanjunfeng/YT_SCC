import React from 'react';
import { Form, Row, Col } from 'antd';
import {
    promotionRuleStatus, preferentialWayStatus,
    purchageTypeStatus, conditionTypeStatus
} from '../constants';

const FormItem = Form.Item;

const getPreferentialBuyRule = (rule) => {
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
const getPurchaseType = (condition) => {
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
const getConditionType = (condition) => {
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

/**
 * 获得基础数据行
 *
 * @param {*object} promotion 下单打折详情
 * @param {*object} columns 基础数据行数组
 */
export const getRowFromFields = (promotion, columns) => columns.map(column => {
    const item = promotion[column.dataIndex];
    return (
        <Row key={column.dataIndex} type="flex" justify="start">
            <Col span={16}>
                {column.render ?
                    <FormItem
                        label={column.title}
                    >
                        {column.render(item, promotion)}
                    </FormItem>
                    :
                    <FormItem label={column.title}>{item}</FormItem>
                }
            </Col>
        </Row>);
});

/**
 * 不指定条件
 */
export const getNoConditions = (promotionRule) =>
    (<Row type="flex" justify="start">
        <Col span={16}>
            <FormItem label="优惠方式">
                {getPreferentialBuyRule(promotionRule.orderRule)}
            </FormItem>
        </Col>
    </Row>)

/**
 * 购买条件
 */
export const getPurchaseCondition = promotionRule =>
    (<div>
        <Row type="flex" justify="start">
            <Col span={16}>
                <FormItem label="优惠种类">
                    {promotionRuleStatus[promotionRule.ruleName]}
                </FormItem>
            </Col>
        </Row>
        <Row>
            <div className="wd-396">
                <Col span={16}>
                    <FormItem label="购买类型">
                        {getPurchaseType(
                            promotionRule.purchaseConditionsRule.condition
                        )}
                    </FormItem>
                </Col>
            </div>
            <div className="wd-317">
                <Col span={16}>
                    <FormItem label="条件类型">
                        {getConditionType(
                            promotionRule.purchaseConditionsRule.condition
                        )}
                    </FormItem>
                </Col>
            </div>
            <div className="wd-297">
                <Col span={16}>
                    <FormItem label="优惠方式">
                        {getPreferentialBuyRule(
                            promotionRule.purchaseConditionsRule.rule
                        )}
                    </FormItem>
                </Col>
            </div>
        </Row>
    </div>)
