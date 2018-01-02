/**
 * @author taoqiyu
 *
 * 促销管理 - 下单打折
 * 抽取公共表单 Component
 */
import React from 'react';
import { Form, Row, InputNumber, Select } from 'antd';

import Util from '../../../util/util';
import { MAX_AMOUNT_OF_ORDER } from '../../../constant';
import { Category } from '../../../container/cascader';
import { AddingGoodsByTerm } from '../../../container/search';
import BuyConditionList from './buyConditionList';

const Option = Select.Option;
const FormItem = Form.Item;

export const getChooseButton = (companies, handleClick) => (
    <span className="sub-companies">
        <a href="#" onClick={handleClick}>{companies.length > 0 ? '重新选择' : '选择'}</a>
    </span>
)

/**
 * 获取优惠方式
 *
 * @param {*object} form { getFieldDecorator, getFieldValue }
 * @param {*string} licence
 * @param {string} type 品类或商品 PRODUCT : CATEGORY
 */
export const getRulesColumn = (form, licence, type = '') => {
    const { getFieldDecorator, getFieldValue } = form;
    return (<span>
        <FormItem label="优惠方式">
            {/* noConditionRule,
            purchaseConditionRule,
            rewardListRule,
            totalPurchaseListRule,
            eachConditionGivenOneRule */}
            {getFieldDecorator(`${licence}Rule`, {
                initialValue: '',
                rules: [{ required: true, message: '请选择优惠方式' }]
            })(<Select size="default" className="wd-90">
                <Option key={-1} value="">- 请选择 -</Option>
                <Option key={0} value="PERCENTAGE">折扣百分比</Option>
                <Option key={1} value="DISCOUNTAMOUNT">折扣金额</Option>
                {type === 'PRODUCT' ?
                    <Option key={'FIXEDPRICE'} value="FIXEDPRICE">
                        固定单价
                    </Option> : null}
                {type === 'PRODUCT' ?
                    <Option key={'GIVESAMEPRODUCT'} value="GIVESAMEPRODUCT">
                        赠送相同商品
                    </Option> : null}
            </Select>)}
        </FormItem>
        {/* 优惠百分比 */}
        {getFieldValue(`${licence}Rule`) === 'PERCENTAGE' ?
            <FormItem>
                {/* noConditionRulePercent,
                purchaseConditionRulePercent,
                rewardListRulePercent,
                totalPurchaseListRulePercent,
                eachConditionGivenOneRulePercent */}
                {getFieldDecorator(`${licence}RulePercent`, {
                    rules: [{ required: true, message: '请输入折扣百分比' }]
                })(<InputNumber className="wd-50" min={0} max={100} step={1} />) } %
            </FormItem>
            : null}
        {/* 折扣金额 */}
        {getFieldValue(`${licence}Rule`) === 'DISCOUNTAMOUNT' ?
            <FormItem>
                {/* noConditionRuleAmount,
                purchaseConditionRuleAmount,
                rewardListRuleAmount,
                totalPurchaseListRuleAmount,
                eachConditionGivenOneRuleAmount */}
                {getFieldDecorator(`${licence}RuleAmount`, {
                    initialValue: 0,
                    rules: [
                        { required: true, message: '请输入折扣金额' },
                        { validator: Util.limitTwoDecimalPlacesAndNotZero }
                    ]
                })(<InputNumber className="wd-60 wd-61" min={0} max={MAX_AMOUNT_OF_ORDER} step={1} />)} 元
            </FormItem>
            : null}
        {/* 固定单价 */}
        {getFieldValue(`${licence}Rule`) === 'FIXEDPRICE' ?
            <FormItem>
                {/* purchaseConditionRulePrice,
                rewardListRulePrice,
                eachConditionGivenOneRulePrice */}
                {getFieldDecorator(`${licence}RulePrice`, {
                    initialValue: 0,
                    rules: [
                        { required: true, message: '请输入固定单价' },
                        { validator: Util.limitTwoDecimalPlaces }
                    ]
                })(<InputNumber formatter={val => `￥${val}`} className="wd-60" min={0} max={MAX_AMOUNT_OF_ORDER} step={1} />)} 元
            </FormItem>
            : null}
        {/* 赠送相同商品 */}
        {getFieldValue(`${licence}Rule`) === 'GIVESAMEPRODUCT' ?
            <FormItem>
                {/* purchaseConditionRuleGive,
                rewardListRuleGive,
                eachConditionGivenOneRuleGive  */}
                {getFieldDecorator(`${licence}RuleGive`, {
                    initialValue: 0,
                    rules: [
                        { required: true, message: '请输入赠送数量' },
                        { validator: Util.validatePositiveInteger }
                    ]
                })(<InputNumber className="wd-60" min={1} max={MAX_AMOUNT_OF_ORDER} step={1} />)}
            </FormItem>
            : null}
    </span>)
}

export const getRules = (form, licence) => <Row>{getRulesColumn(form, licence)}</Row>

/**
 * 购买类型
 *
 * @param {*object} form { getFieldDecorator, getFieldValue }
 * @param {*string} licence
 */
export const buyType = (form, licence) => {
    const { getFieldDecorator } = form;
    return (
        <span>
            <FormItem label="购买类型">
                {/* purchaseCondition, buyCondition */}
                {getFieldDecorator(licence, {
                    initialValue: 'ALL'
                })(<Select size="default" className="wd-90">
                    <Option key={'ALL'} value="ALL">全部</Option>
                    {/* 每满类型不能按品类添加 */}
                    {
                        licence !== 'eachConditionGivenOne' &&
                        <Option key={'CATEGORY'} value="CATEGORY">按品类</Option>
                    }
                    <Option key={'PRODUCT'} value="PRODUCT">按商品</Option>
                </Select>)}
            </FormItem>
        </span>
    )
}

/**
 * 条件类型
 *
 * @param {*object} form { getFieldDecorator, getFieldValue }
 * @param {*string} licence
 */
export const getConditionType = (form, licence) => {
    const { getFieldDecorator, getFieldValue } = form;
    return (
        <span>
            <FormItem label="条件类型">
                {/* purchaseConditionType, rewardListType */}
                {getFieldDecorator(`${licence}Type`, {
                    initialValue: '',
                    rules: [{ required: true, message: '请选择条件类型' }]
                })(<Select size="default" className="wd-110">
                    <Option key={''} value="">- 请选择 -</Option>
                    <Option key={'AMOUNT'} value="AMOUNT">累计商品金额</Option>
                    <Option key={'QUANTITY'} value="QUANTITY">累计商品数量</Option>
                </Select>)}
            </FormItem>
            {getFieldValue(`${licence}Type`) === 'AMOUNT' ?
                <FormItem>
                    {/* rewardListTypeAmount */}
                    {getFieldDecorator(`${licence}TypeAmount`, {
                        initialValue: 0,
                        rules: [
                            { required: true, message: '请输入累计商品金额' },
                            { validator: Util.limitTwoDecimalPlaces }
                        ]
                    })(<InputNumber className="wd-60" min={0} max={MAX_AMOUNT_OF_ORDER} step={1} />)} 元
                </FormItem> : null
            }
            {getFieldValue(`${licence}Type`) === 'QUANTITY' ?
                <FormItem>
                    {/* rewardListTypeQuantity */}
                    {getFieldDecorator(`${licence}TypeQuantity`, {
                        initialValue: 0,
                        rules: [
                            { required: true, message: '请输入累计商品数量' },
                            { validator: Util.validatePositiveInteger }
                        ]
                    })(<InputNumber className="wd-60" min={0} max={MAX_AMOUNT_OF_ORDER} step={1} />)}
                </FormItem>
                : null
            }
        </span>
    )
}

/**
 * 抽取奖励列表内核
 *
 * @param {*object} form { getFieldDecorator, getFieldValue }
 * @param {*} licence
 * @param {*} handleCategorySelect 品类选择器回调函数
 */
export const getPromotion = (form, licence, handleCategorySelect) => {
    const { getFieldDecorator, getFieldValue } = form;
    return (
        <Row>
            <div className="wd-396">
                {buyType(form, licence)}
                {/* purchaseCondition, rewardList */}
                {getFieldValue(licence) === 'CATEGORY' ?
                    <FormItem>
                        <Category onChange={handleCategorySelect} />
                    </FormItem> : null}
                {getFieldValue(licence) === 'PRODUCT' ?
                    <FormItem className="product">
                        {/*
                            purchaseConditionProduct,
                            rewardListProduct,
                            eachConditionGivenOneProduct */}
                        {getFieldDecorator(`${licence}Product`, {
                            initialValue: {
                                productId: '',
                                productCode: '',
                                productName: ''
                            },
                            rules: [{ required: true, message: '请选择商品' }]
                        })(<AddingGoodsByTerm />)}
                    </FormItem> : null}
            </div>
            {licence === 'purchaseCondition' &&
                <div className="wd-317"> {getConditionType(form, licence)}</div>
            }
            <div className="wd-297">
                {getRulesColumn(form, licence, getFieldValue(licence))}
            </div>
        </Row>
    )
}

/**
 * 获取奖励列表 dom
 *
 * @param {*} form
 * @param {*} licence rewardList
 * @param {*} handleCategorySelect
 */
export const getRewardList = (params) => {
    const { form, licence, handleCategorySelect, conditions, handleBuyConditionsChange } = params;
    return (
        <div>
            <BuyConditionList
                value={{ conditions }}
                onChange={handleBuyConditionsChange}
            />
            <ul className="list-panel">
                <li><h2>奖励列表</h2></li>
                <li>
                    {getPromotion(form, licence, handleCategorySelect)}
                </li>
            </ul>
        </div>
    )
}

/**
 * 获取每满 dom
 *
 * @param {*} form
 * @param {*} licence eachConditionGivenOne
 * @param {*} handleCategorySelect
 */
export const getEachConditionGivenOne = (params) => {
    const { form, licence, conditions, handleBuyConditionsChange } = params;
    return (
        <div>
            <BuyConditionList
                value={{ conditions }}
                onChange={handleBuyConditionsChange}
            />
            <ul className="list-panel">
                <li><h2>奖励列表</h2></li>
                <li>
                    {getPromotion(form, licence)}
                </li>
            </ul>
        </div>
    )
}

/**
 * 获取整个购买列表 dom
 *
 * @param {*} form
 * @param {*} licence totalPurchaseList
 * @param {*} handleCategorySelect
 */
export const getTotalPurchaseList = (params) => {
    const { conditions, handleBuyConditionsChange } = params;
    return (
        <div>
            <BuyConditionList
                value={{ conditions }}
                onChange={handleBuyConditionsChange}
            />
        </div>
    )
}
