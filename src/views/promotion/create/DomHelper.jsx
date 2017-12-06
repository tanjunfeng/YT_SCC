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

const Option = Select.Option;
const FormItem = Form.Item;

export const getChooseButton = (companies, handleClick) => (
    <span className="sub-companies">
        <a href="#" onClick={handleClick}>{companies.length > 0 ? '重新选择' : '选择'}</a>
    </span>
)

/**
 * 获取优惠方式
 */
export const getRulesColumn = (getFieldDecorator, getFieldValue, licence) => (<span>
    <FormItem label="优惠方式">
        {/* ruleNoCondition */}
        {getFieldDecorator(`rule${licence}`, {
            initialValue: '',
            rules: [{ required: true, message: '请选择优惠方式' }]
        })(<Select size="default" className="wd-90">
            <Option key={-1} value="">- 请选择 -</Option>
            <Option key={0} value="PERCENTAGE">折扣百分比</Option>
            <Option key={1} value="DISCOUNTAMOUNT">折扣金额</Option>
        </Select>)}
    </FormItem>
    {/* 优惠百分比 */}
    {getFieldValue(`rule${licence}`) === 'PERCENTAGE' ?
        <FormItem>
            {/* ruleNoConditionPercent */}
            {getFieldDecorator(`rule${licence}Percent`, {
                initialValue: 95,
                rules: [{ required: true, message: '请输入折扣百分比' }]
            })(<InputNumber className="wd-50" min={0} max={100} step={5} />)} %
            </FormItem>
        : null}
    {/* 折扣金额 */}
    {getFieldValue(`rule${licence}`) === 'DISCOUNTAMOUNT' ?
        <FormItem>
            {/* ruleNoConditionAmount */}
            ￥{getFieldDecorator(`rule${licence}Amount`, {
                initialValue: 0,
                rules: [
                    { required: true, message: '请输入折扣金额' },
                    { validator: Util.limitTwoDecimalPlaces }
                ]
            })(<InputNumber className="wd-60" min={0} max={MAX_AMOUNT_OF_ORDER} step={1} />)} 元
            </FormItem>
        : null}
</span>)

export const getRules = (getFieldDecorator, getFieldValue, licence) => (<Row>
    {getRulesColumn(getFieldDecorator, getFieldValue, licence)}
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
