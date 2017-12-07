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
import { Category } from '../../../container/cascader';

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
        categoryPC: null, // 购买条件品类, PC = PURCHASECONDITION
    }

    // 根据整数计算百分数
    getPercent = (num) => (Number(num / 100.0).toFixed(2));

    // 不限制条件对象拼接
    getNoConditionData = (values) => {
        const { noConditionRule, noConditionRulePercent, ruleNoConditionAmount } = values;
        const promotionRule = {
            useConditionRule: false,
            orderRule: {
                preferentialWay: noConditionRule
            }
        };
        switch (noConditionRule) {
            case 'PERCENTAGE':
                Object.assign(promotionRule.orderRule, {
                    preferentialValue: this.getPercent(noConditionRulePercent)
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

    // 优惠种类: 购买条件
    getPurchaseConditionsRule = (values) => {
        const {
            category, purchaseCondition, purchaseConditionType,
            purchaseConditionTypeAmount, purchaseConditionTypeQuantity,
            purchaseConditionRule, purchaseConditionRulePercent,
            purchaseConditionRuleAmount
        } = values;
        const {
            categoryPC
        } = this.state;
        let conditionValue = '';
        if (purchaseConditionType === 'AMOUNT') {
            conditionValue = purchaseConditionTypeAmount;
        } else if (purchaseConditionType === 'QUANTITY') {
            conditionValue = purchaseConditionTypeQuantity;
        }
        let preferentialValue = '';
        if (purchaseConditionRule === 'PERCENTAGE') {
            preferentialValue = this.getPercent(purchaseConditionRulePercent);
        } else if (purchaseConditionType === 'DISCOUNTAMOUNT') {
            preferentialValue = purchaseConditionRuleAmount;
        }
        const promoCategories = categoryPC.categoryId === undefined ? '' : categoryPC;
        const promotionRule = {
            useConditionRule: true,
            ruleName: category,
            purchaseConditionsRule: {
                condition: {
                    purchaseType: purchaseCondition,
                    promoCategories,
                    conditionType: purchaseConditionType,
                    conditionValue
                },
                rule: {
                    preferentialWay: purchaseConditionRule,
                    preferentialValue
                }
            }
        };
        return Util.removeInvalid(promotionRule);
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
            const { condition, category, purchaseCondition } = values;
            const { categoryPC } = this.state;
            if (err) {
                // 指定条件——购买条件——购买类型：按品类——校验是否选择了品类
                if (condition === 1
                    && category === 'PURCHASECONDITION'
                    && purchaseCondition === 'CATEGORY'
                    && (!categoryPC || categoryPC.categoryId === undefined)
                ) {
                    this.props.form.setFields({
                        purchaseCondition: {
                            errors: [new Error('请选择品类')]
                        }
                    });
                }
                return;
            }
            // 使用条件 0: 不限制，1: 指定条件
            const dist = this.getBasicData(values);
            // 无限制条件
            if (condition === 0) {
                Object.assign(dist, {
                    promotionRule: this.getNoConditionData(values)
                });
            } else if (condition === 1 && category === 'PURCHASECONDITION' && purchaseCondition === 'CATEGORY') {
                // 指定条件——优惠种类——购买条件
                Object.assign(dist, {
                    promotionRule: this.getPurchaseConditionsRule(values)
                });
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
     * 购买条件品类选择器
     *
     * PC: PURCHASECONDITION
     */
    handlePCCategorySelect = (categoryPC) => {
        if (categoryPC.categoryId) {
            this.props.form.setFields({
                purchaseCondition: {}
            });
        }
        this.setState({ categoryPC });
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
                        // condition === 1
                        <FormItem label="优惠种类">
                            {getFieldDecorator('category', {
                                initialValue: 'PURCHASECONDITION'
                            })(<Select size="default" className="wd-110">
                                <Option key={'PURCHASECONDITION'} value="PURCHASECONDITION">购买条件</Option>
                                <Option key={'REWARDLIST'} value="REWARDLIST">奖励列表</Option>
                                <Option key={'TOTALPUCHASELIST'} value="TOTALPUCHASELIST">整个购买列表</Option>
                            </Select>)}
                        </FormItem>
                    }
                </Row>
                {getFieldValue('condition') === 1 && getFieldValue('category') === 'PURCHASECONDITION' ?
                    <Row>
                        {buyType(getFieldDecorator, getFieldValue, 'purchaseCondition')}
                        {getFieldValue('purchaseCondition') === 'CATEGORY' ?
                            <FormItem>
                                <Category
                                    onChange={this.handlePCCategorySelect}
                                />
                            </FormItem> : null}
                        {conditionType(getFieldDecorator, getFieldValue, 'purchaseCondition')}
                        {getRulesColumn(getFieldDecorator, getFieldValue, 'PurchaseCondition')}
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
                        <FormItem className="store">
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
                        <span className="store">请按照数据模板的格式准备导入数据如：A000999, A000900, A000991</span>
                        : null
                    }
                </Row>
                <Row>
                    <FormItem label="活动优先级">
                        {getFieldDecorator('priority', {
                            initialValue: 1,
                            rules: [
                                { validator: Util.validatePositiveInteger },
                                { required: true, message: '请输入活动优先级' }
                            ]
                        })(<InputNumber min={1} step={1} max={9999} className="wd-90" />)}
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
