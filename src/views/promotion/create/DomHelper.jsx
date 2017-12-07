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
 * @param {*} getFieldDecorator
 * @param {*} getFieldValue
 * @param {*string} licence
 * @param {*string} type 品类或商品 PRODUCT : CATEGORY
 */
export const getRulesColumn = (getFieldDecorator, getFieldValue, licence, type) => (<span>
    <FormItem label="优惠方式">
        {/* noConditionRule, purchaseConditionRule */}
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
            {/* noConditionRulePercent, purchaseConditionRulePercent */}
            {getFieldDecorator(`${licence}RulePercent`, {
                initialValue: 95,
                rules: [{ required: true, message: '请输入折扣百分比' }]
            })(<InputNumber className="wd-50" min={0} max={100} step={5} />)} %
            </FormItem>
        : null}
    {/* 折扣金额 */}
    {getFieldValue(`${licence}Rule`) === 'DISCOUNTAMOUNT' ?
        <FormItem>
            {/* ruleNoConditionAmount, purchaseConditionRuleAmount */}
            ￥{getFieldDecorator(`${licence}RuleAmount`, {
                initialValue: 0,
                rules: [
                    { required: true, message: '请输入折扣金额' },
                    { validator: Util.limitTwoDecimalPlaces }
                ]
            })(<InputNumber className="wd-60" min={0} max={MAX_AMOUNT_OF_ORDER} step={1} />)} 元
            </FormItem>
        : null}
    {/* 固定单价 */}
    {getFieldValue(`${licence}Rule`) === 'FIXEDPRICE' ?
        <FormItem>
            {/* purchaseConditionRulePrice */}
            ￥{getFieldDecorator(`${licence}RulePrice`, {
                initialValue: 0,
                rules: [
                    { required: true, message: '请输入固定单价' },
                    { validator: Util.limitTwoDecimalPlaces }
                ]
            })(<InputNumber className="wd-60" min={0} max={MAX_AMOUNT_OF_ORDER} step={1} />)} 元
            </FormItem>
        : null}
    {/* 赠送相同商品 */}
    {getFieldValue(`${licence}Rule`) === 'GIVESAMEPRODUCT' ?
        <FormItem>
            {/* purchaseConditionRuleGive */}
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

export const getRules = (getFieldDecorator, getFieldValue, licence, type = '') => (<Row>
    {getRulesColumn(getFieldDecorator, getFieldValue, licence, type)}
</Row>)

/**
 * 购买类型
 *
 * @param {*} getFieldDecorator
 */
export const buyType = (getFieldDecorator, getFieldValue, licence) => (
    <span>
        <FormItem label="购买类型">
            {/* purchaseCondition */}
            {getFieldDecorator(licence, {
                initialValue: 'CATEGORY'
            })(<Select size="default" className="wd-90">
                <Option key={'ALL'} value="ALL">全部</Option>
                <Option key={'CATEGORY'} value="CATEGORY">按品类</Option>
                <Option key={'PRODUCT'} value="PRODUCT">按商品</Option>
            </Select>)}
        </FormItem>
    </span>
)

/**
 * 条件类型
 *
 * @param {*} getFieldDecorator
 * @param {*} getFieldValue
 * @param {*string} licence
 */
export const conditionType = (getFieldDecorator, getFieldValue, licence) => (
    <span>
        <FormItem label="条件类型">
            {/* purchaseConditionType */}
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
                ￥{getFieldDecorator(`${licence}TypeAmount`, {
                    initialValue: 0,
                    rules: [
                        { required: true, message: '请输入累计商品金额' },
                        { validator: Util.limitTwoDecimalPlaces }
                    ]
                })(<InputNumber className="wd-60" min={0} max={MAX_AMOUNT_OF_ORDER} step={1} />)} 元
            </FormItem>
            : null
        }
        {getFieldValue(`${licence}Type`) === 'QUANTITY' ?
            <FormItem>
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

/**
 * 抽取奖励列表内核
 *
 * @param {*} getFieldDecorator
 * @param {*} getFieldValue
 * @param {*} licence
 * @param {*} handleCategorySelect
 */
export const getRewardList = (getFieldDecorator, getFieldValue, licence, handleCategorySelect) => (
    <Row>
        {buyType(getFieldDecorator, getFieldValue, licence)}
        {getFieldValue(licence) === 'CATEGORY' ?
            <FormItem>
                <Category onChange={handleCategorySelect} />
            </FormItem> : null}
        {getFieldValue(licence) === 'PRODUCT' ?
            <FormItem className="product">
                {/* purchaseConditionProduct */}
                {getFieldDecorator(`${licence}Product`, {
                    initialValue: {
                        productId: '',
                        productCode: '',
                        productName: ''
                    }
                })(<AddingGoodsByTerm />)}
            </FormItem> : null}
        {conditionType(getFieldDecorator, getFieldValue, licence)}
        {getRulesColumn(getFieldDecorator, getFieldValue, licence, getFieldValue(licence))}
    </Row>
)
