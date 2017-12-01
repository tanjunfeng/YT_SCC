/**
 * 促销管理 - 下单打折
 *
 * 抽取公共表单 Component *
 * @author taoqiyu
 */
import React from 'react';
import {
    Form, Row, Col,
    InputNumber, Select
} from 'antd';

import Util from '../../../util/util';

const Option = Select.Option;
const FormItem = Form.Item;

export const getChooseButton = (companies) => (
    <span className="sub-companies">
        <a href="#" onClick={this.handleSubCompaniesRechoose}>{companies.length > 0 ? '重新选择' : '选择'}</a>
    </span>
)

/**
 * 获取优惠方式
 */
export const getRuls = (getFieldDecorator, getFieldValue) => (<Row>
    <Col span={16}>
        <FormItem label="优惠方式">
            {getFieldDecorator('rule', {
                initialValue: '',
                rules: [{ required: true, message: '请选择优惠方式' }]
            })(<Select size="default" className="wd-90">
                <Option key={-1} value="">- 请选择 -</Option>
                <Option key={0} value="0">折扣百分比</Option>
                <Option key={1} value="1">折扣金额</Option>
            </Select>)}
        </FormItem>
        {/* 优惠百分比 */}
        {getFieldValue('rule') === '0' ?
            <FormItem>
                {getFieldDecorator('percent', {
                    initialValue: 95,
                    rules: [{ required: true, message: '请输入折扣百分比' }]
                })(<InputNumber min={0} max={100} step={5} className="wd-50" />)} %
            </FormItem>
            : null}
        {/* 折扣金额 */}
        {getFieldValue('rule') === '1' ?
            <FormItem>
                ￥{getFieldDecorator('amout', {
                    initialValue: 0,
                    rules: [
                        { required: true, message: '请输入折扣金额' },
                        { validator: Util.limitTwoDecimalPlaces }
                    ]
                })(<InputNumber className="wd-60" />)} 元
            </FormItem>
            : null}
    </Col>
</Row>)
