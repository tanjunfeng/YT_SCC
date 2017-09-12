/**
 * @file App.jsx
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
    Form, Row, Col, Input, InputNumber,
    Button, DatePicker, Radio
} from 'antd';
import Utils from '../../../util/util';
import { createPromotion } from '../../../actions/promotion';
import { DATE_FORMAT } from '../../../constant';
import AreaSelector from './AreaSelector';
import Category from '../../../container/cascader';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;

@connect(() => ({
}), dispatch => bindActionCreators({
    createPromotion
}, dispatch))

class PromotionCreate extends PureComponent {
    constructor(props) {
        super(props);
        this.param = {
            condition: 0,
            quanifyAmount: '',
            area: 0,
            category: 0
        };
        this.state = {
            areaSelectorVisible: false,
            categorySelectorVisible: false,
            companies: [],
            categories: []
        }
        this.getFormData = this.getFormData.bind(this);
        this.handleConditionChange = this.handleConditionChange.bind(this);
        this.handleQuanifyAmountChange = this.handleQuanifyAmountChange.bind(this);
        this.handleAreaChange = this.handleAreaChange.bind(this);
        this.handleSelectorOk = this.handleSelectorOk.bind(this);
        this.handleSelectorCancel = this.handleSelectorCancel.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleCategorySelect = this.handleCategorySelect.bind(this);
    }

    getFormData() {
        const {
            id,
            promotionName,
        } = this.props.form.getFieldsValue();
        return Utils.removeInvalid({
            id,
            promotionName,
            status,
            branchCompanyId: this.state.branchCompanyId
        });
    }

    /**
     * 条件金额选项
     * @param {*event} e
     */
    handleConditionChange(e) {
        this.props.form.setFieldsValue({
            condition: e.target.value
        });
        this.param.condition = e.target.value;
    }

    /**
     * 使用条件金额
     */
    handleQuanifyAmountChange(e) {
        this.props.form.setFieldsValue({
            quanifyAmount: e.target.value
        });
        this.param.quanifyAmount = e.target.value;
    }

    /**
     * 所选区域选项
     * @param {*object} e
     */
    handleAreaChange(e) {
        const nextArea = e.target.value;
        this.props.form.setFieldsValue({
            area: nextArea
        });
        if (nextArea === 0) {
            this.setState({
                areaSelectorVisible: false,
                companies: []
            });
        } else {
            this.setState({
                areaSelectorVisible: true
            });
        }
    }

    /**
     * 使用品类选项
     * @param {*object} e
     */
    handleCategoryChange(e) {
        const nextCategory = e.target.value;
        this.props.form.setFieldsValue({
            category: nextCategory
        });
        if (nextCategory === 0) {
            this.setState({
                categorySelectorVisible: false,
                categories: []
            });
        } else {
            this.setState({
                categorySelectorVisible: true
            });
        }
    }

    handleCategorySelect(value, labels) {
        console.log(value);
        console.log(labels);
    }

    handleSelectorOk(companies) {
        this.setState({
            areaSelectorVisible: false,
            companies
        });
    }

    handleSelectorClear() {
        this.setState({
            companies: []
        });
    }

    handleSelectorCancel() {
        this.setState({
            areaSelectorVisible: false
        });
    }

    handleSubmit() {
        this.props.createPromotion(this.param);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const subCompanies = [];
        this.state.companies.forEach((company) => {
            subCompanies.push(company.companyName);
        });
        const subCategories = [];
        return (
            <div className="promotion">
                <Form layout="inline">
                    <div className="promotion-add-item">
                        <div className="add-message promotion-add-license">
                            <div className="add-message-body">
                                <Row>
                                    <Col span={16}>
                                        <FormItem label="活动名称" >
                                            {getFieldDecorator('promotionName', {
                                                rules: [
                                                    { required: true, message: '请输入促销活动名称!' },
                                                    { max: 30, message: '活动名称最长30位' }
                                                ]
                                            })(<Input size="default" />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <FormItem label="折扣比例" >
                                            {getFieldDecorator('discount', {
                                                rules: [
                                                    { required: true, message: '请输入折扣比例!' }
                                                ]
                                            })(
                                                <InputNumber size="default" min={1} max={100} />)}
                                            %
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="活动时间">
                                            {getFieldDecorator('promotionDateRange', {
                                                initialValue: '',
                                                rules: [{ required: true, message: '请选择活动日期' }]
                                            })(
                                                <RangePicker
                                                    style={{ width: '240px' }}
                                                    className="manage-form-enterTime"
                                                    format={DATE_FORMAT}
                                                    placeholder={['开始时间', '结束时间']}
                                                />
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <FormItem label="使用条件">
                                            {getFieldDecorator('condition', {
                                                initialValue: this.param.condition,
                                                rules: [{ required: true, message: '请选择使用条件' }]
                                            })(
                                                <RadioGroup
                                                    onChange={this.handleConditionChange}
                                                >
                                                    <Radio className="default" value={0}>不限制</Radio>
                                                    <Radio value={1}>满</Radio>
                                                </RadioGroup>
                                                )}
                                            {this.param.condition > 0 ?
                                                getFieldDecorator('quanifyAmount', {
                                                    initialValue: this.param.quanifyAmount,
                                                    rules: [{ required: true, message: '请填写条件金额' }]
                                                })(
                                                    <span>
                                                        <InputNumber onChange={
                                                            this.handleQuanifyAmountChange
                                                        }
                                                        />
                                                        元可使用
                                                    </span>)
                                                : null}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <FormItem label="使用区域">
                                            {getFieldDecorator('area', {
                                                initialValue: this.param.area,
                                                rules: [{ required: true, message: '请选择使用区域' }]
                                            })(
                                                <RadioGroup onChange={this.handleAreaChange}>
                                                    <Radio className="default" value={0}>全部区域</Radio>
                                                    <Radio value={1}>指定区域</Radio>
                                                    {subCompanies.length > 0 ?
                                                        subCompanies.join(',')
                                                        : null}
                                                </RadioGroup>
                                                )}
                                            <AreaSelector
                                                isSelectorVisible={this.state.areaSelectorVisible}
                                                onSelectorOk={this.handleSelectorOk}
                                                onSelectorCancel={this.handleSelectorCancel}
                                            />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <FormItem className="area" label="使用品类">
                                            {getFieldDecorator('category', {
                                                initialValue: this.param.category,
                                                rules: [{ required: true, message: '请选择使用品类' }]
                                            })(
                                                <RadioGroup onChange={this.handleCategoryChange}>
                                                    <Radio className="default" value={0}>全部品类</Radio>
                                                    <Radio value={1}>指定品类</Radio>
                                                    {subCategories.length > 0 ?
                                                        subCategories.join(',')
                                                        : null}
                                                </RadioGroup>
                                                )}
                                            {this.state.categorySelectorVisible
                                                ? <Category
                                                    onCategorySelect={this.handleCategorySelect}
                                                /> : null}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={40} type="flex">
                                    <Col>
                                        <FormItem>
                                            <Button type="primary" size="default" onClick={this.handleSubmit}>
                                                提交
                                            </Button>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
}

PromotionCreate.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    createPromotion: PropTypes.func
}

export default withRouter(Form.create()(PromotionCreate));
