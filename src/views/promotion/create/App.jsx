/**
 * @author taoqiyu
 *
 * 促销管理 - 促销管理列表
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
    Form, Row, Input, Radio,
    Button, DatePicker, Checkbox,
    InputNumber, Select, message
} from 'antd';

import Util from '../../../util/util';
import { AreaSelector } from '../../../container/tree';
import { createPromotion } from '../../../actions/promotion';
import { DATE_FORMAT, MINUTE_FORMAT } from '../../../constant';
import { overlayOptions } from '../constants';
import { getChooseButton, getRules, getRulesColumn, buyType, conditionType } from './DomHelper';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

@connect(() => ({
}), dispatch => bindActionCreators({
    createPromotion
}, dispatch))

class PromotionCreate extends PureComponent {
    state = {
        areaSelectorVisible: false,
        storeSelectorVisible: false,
        companies: [], // 所选区域子公司
        checkedList: []
    }

    // 不限制条件对象拼接
    getNoConditionData = (values) => {
        const { ruleNoCondition, ruleNoConditionPercent, ruleNoConditionAmount } = values;
        const promotionRule = {
            useConditionRule: false,
            orderRule: {
                preferentialWay: ruleNoCondition
            }
        };
        switch (ruleNoCondition) {
            case 'PERCENTAGE':
                Object.assign(promotionRule.orderRule, {
                    preferentialValue: ruleNoConditionPercent
                });
                break;
            case 'DISCOUNTAMOUNT':
                Object.assign(promotionRule.orderRule, {
                    preferentialValue: ruleNoConditionAmount
                });
                break;
            default: break;
        }
        return promotionRule;
    }

    // 获取基础数据，无分支条件的数据
    getBasicData = (values) => {
        const {
            promotionName,
            dateRange,
            store,
            category,
            quanifyAmount,
            note,
            storeId,
            overlay,
            priority
        } = values;
        const startDate = dateRange ? dateRange[0].valueOf() : '';
        const endDate = dateRange ? dateRange[1].valueOf() : '';
        const companies = this.state.companies;
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
            category,
            quanifyAmount,
            note,
            companiesPoList: companies.length === 0 ? '' : companies,
            storeId,
            priority,
            isSuperposeProOrCouDiscount: overLayNum % 2 === 1 ? 1 : 0,
            isSuperposeUserDiscount: overLayNum >= 2 ? 1 : 0
        }
    }

    getFormData = (callback) => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            // 使用条件 0: 不限制，1: 指定条件
            const { condition } = values;
            const dist = this.getBasicData(values);
            // 无限制条件
            if (condition === 0) {
                Object.assign(dist, { promotionRule: this.getNoConditionData(values) })
            }
            if (typeof callback === 'function') {
                callback(Util.removeInvalid(dist));
            }
        });
    }

    handleSelectorOk = (companies) => {
        this.setState({
            areaSelectorVisible: false,
            companies
        });
        this.props.form.setFieldsValue({
            companies: companies.map(c => c.companyName)
        });
    }

    handleSelectorCancel = () => {
        this.setState({
            areaSelectorVisible: false
        });
    }

    /**
     * 所选区域选项
     * @param {*object} e
     */
    handleAreaChange = (e) => {
        const nextArea = e.target.value;
        switch (nextArea) {
            case 0:
                this.setState({
                    areaSelectorVisible: false,
                    storeSelectorVisible: false,
                    companies: []
                });
                break;
            case 1:
                this.setState({
                    areaSelectorVisible: true,
                    storeSelectorVisible: false
                });
                break;
            case 2:
                this.setState({
                    areaSelectorVisible: false,
                    storeSelectorVisible: true,
                    companies: []
                });
                break;
            default: break;
        }
    }

    /**
     * 重新选择子公司列表
     */
    handleSubCompaniesRechoose = () => {
        this.setState({
            areaSelectorVisible: true
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.getFormData(data => {
            this.props.createPromotion(data).then(res => {
                if (res.code === 200) {
                    message.success(res.message);
                }
            });
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { companies, areaSelectorVisible, storeSelectorVisible } = this.state;
        return (
            <Form className="promotion-create" layout="inline" onSubmit={this.handleSubmit}>
                <Row>
                    <FormItem label="活动名称" >
                        {getFieldDecorator('promotionName', {
                            rules: [
                                { required: true, message: '请输入促销活动名称!' },
                                { max: 30, message: '活动名称最长30位' }
                            ]
                        })(<Input size="default" />)}
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="活动时间" className="promotion-date-range">
                        {getFieldDecorator('dateRange', {
                            initialValue: '',
                            rules: [{ required: true, message: '请选择活动日期' }]
                        })(<RangePicker
                            className="manage-form-enterTime"
                            showTime={{ format: MINUTE_FORMAT }}
                            format={`${DATE_FORMAT} ${MINUTE_FORMAT}`}
                            placeholder={['开始时间', '结束时间']}
                        />)}
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="使用条件">
                        {getFieldDecorator('condition', {
                            initialValue: 1,
                            rules: [{ required: true, message: '请选择使用条件' }]
                        })(<RadioGroup>
                            <Radio className="default" value={0}>不限制</Radio>
                            <Radio value={1}>指定条件</Radio>
                        </RadioGroup>)}
                    </FormItem>
                </Row>
                {/* 优惠方式 */}
                <Row>
                    {getFieldValue('condition') === 0 ?
                        getRules(getFieldDecorator, getFieldValue, 'NoCondition')
                        :
                        <FormItem label="优惠种类">
                            {getFieldDecorator('category', {
                                initialValue: '0'
                            })(<Select size="default" className="wd-110">
                                <Option key={0} value="0">购买条件</Option>
                                <Option key={1} value="1">奖励列表</Option>
                                <Option key={2} value="2">整个购买列表</Option>
                            </Select>)}
                        </FormItem>
                    }
                </Row>
                {getFieldValue('category') === '0' ?
                    <Row>
                        {buyType(getFieldDecorator, getFieldValue, 'Category0')}
                        {conditionType(getFieldDecorator, getFieldValue, 'Category0')}
                        {getRulesColumn(getFieldDecorator, getFieldValue, 'Category0')}
                    </Row> : null
                }
                <Row>
                    <FormItem label="使用区域">
                        {getFieldDecorator('area', {
                            initialValue: 0
                        })(<RadioGroup onChange={this.handleAreaChange}>
                            <Radio className="default" value={0}>全部区域</Radio>
                            <Radio value={1}>指定区域</Radio>
                            <Radio value={2}>指定门店</Radio>
                        </RadioGroup>)}
                    </FormItem>
                </Row>
                <Row>
                    {getFieldValue('area') === 1 ?
                        <FormItem label="指定区域">
                            {getFieldDecorator('companies', {
                                initialValue: companies.map(company => company.companyName),
                                rules: [{ required: true, message: '请选择子公司' }]
                            })(<Input disabled />)}
                            {getChooseButton(companies, this.handleSubCompaniesRechoose)}
                            <AreaSelector
                                reset={getFieldValue('area') === 1}
                                isSelectorVisible={areaSelectorVisible}
                                onSelectorOk={this.handleSelectorOk}
                                onSelectorCancel={this.handleSelectorCancel}
                            />
                        </FormItem> : null
                    }
                </Row>
                <Row>
                    {storeSelectorVisible ?
                        <FormItem>
                            {getFieldDecorator('storeId', {
                                initialValue: '',
                                rules: [{ required: true, message: '请输入指定门店' }]
                            })(<TextArea
                                placeholder="请输入指定门店"
                                autosize={{ minRows: 4, maxRows: 6 }}
                            />)}
                        </FormItem>
                        : null
                    }
                </Row>
                <Row>
                    {storeSelectorVisible ?
                        <span>请按照数据模板的格式准备导入数据如：A000999, A000900, A000991</span>
                        : null
                    }
                </Row>
                <Row>
                    <FormItem label="活动优先级">
                        {getFieldDecorator('priority', {
                            initialValue: 1,
                            rules: [
                                { validator: Util.validatePositiveInteger }
                            ]
                        })(<InputNumber max={9999} className="wd-90" />)}
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="活动叠加">
                        {getFieldDecorator('overlay', {
                            initialValue: []
                        })(<CheckboxGroup
                            options={overlayOptions}
                        />)}
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="简易描述">
                        {getFieldDecorator('simpleDescription', {
                            initialValue: '',
                            rules: [{ max: 20, message: '限填20字' }]
                        })(<TextArea placeholder="可填写简易描述，限填20字" autosize={{ minRows: 2, maxRows: 4 }} />)}
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="详细描述">
                        {getFieldDecorator('detailDescription', {
                            initialValue: '',
                            rules: [{ max: 200, message: '限填200字' }]
                        })(<TextArea placeholder="可填写详细描述，限填200字" autosize={{ minRows: 4, maxRows: 6 }} />)}
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="备注">
                        {getFieldDecorator('note', {
                            initialValue: '',
                            rules: [{ max: 200, message: '限填200字' }]
                        })(<TextArea placeholder="可填写备注，限填200字" autosize={{ minRows: 4, maxRows: 6 }} />)}
                    </FormItem>
                </Row>
                <Row className="center" >
                    <Button type="primary" size="default" htmlType="submit">保存</Button>
                </Row>
            </Form>
        );
    }
}

PromotionCreate.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    createPromotion: PropTypes.func
}

export default withRouter(Form.create()(PromotionCreate));
