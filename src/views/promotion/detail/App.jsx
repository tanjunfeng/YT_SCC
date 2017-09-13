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
    Button, DatePicker, Radio, message
} from 'antd';
import Utils from '../../../util/util';
import { createPromotion } from '../../../actions/promotion';
import { DATE_FORMAT } from '../../../constant';
import Category from '../../../container/cascader';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

@connect(() => ({
}), dispatch => bindActionCreators({
    createPromotion
}, dispatch))

class PromotionCreate extends PureComponent {
    constructor(props) {
        super(props);
        this.param = {
            condition: 0,
            area: 0,
            category: 0,
            store: 0
        };
        this.state = {
            areaSelectorVisible: false,
            categorySelectorVisible: false,
            storeSelectorVisible: false,
            companies: [],  // 所选区域子公司
            categoryObj: {} // 所选品类对象
        }
        this.getFormData = this.getFormData.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleConditionChange = this.handleConditionChange.bind(this);
        this.handleQuanifyAmountChange = this.handleQuanifyAmountChange.bind(this);
        this.handleAreaChange = this.handleAreaChange.bind(this);
        this.handleSelectorOk = this.handleSelectorOk.bind(this);
        this.handleSelectorCancel = this.handleSelectorCancel.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleCategorySelect = this.handleCategorySelect.bind(this);
        this.handleStoreChange = this.handleStoreChange.bind(this);
    }

    getFormData(callback) {
        this.props.form.validateFields((err, values) => {
            if (err) {
                message.error('请检查请求参数');
                return callback(false);
            }
            const { promotionName,
                discount,
                promotionDateRange,
                condition,
                area,
                store,
                category,
                quanifyAmount,
                note,
                storeIds
        } = values;
            const startDate = promotionDateRange ? promotionDateRange[0].valueOf() : '';
            const endDate = promotionDateRange ? promotionDateRange[1].valueOf() : '';
            const stores = {};
            Object.assign(stores, {
                storeId: storeIds
            });
            const promoCategoriesPo = this.state.categoryObj;
            const companiesPoList = this.state.companies;
            const dist = {
                promotionName,
                discount,
                startDate,
                endDate,
                note
            };
            if (condition === 1) {
                if (!quanifyAmount) {
                    message.error('请填写活动金额');
                    return callback(false);
                }
                Object.assign(dist, {
                    quanifyAmount
                });
            }
            if (area === 1) {
                if (companiesPoList.length === 0) {
                    message.error('请选择区域');
                    return callback(false);
                }
                Object.assign(dist, {
                    companiesPoList
                });
            }
            if (store === 1) {
                if (stores.storeId === undefined) {
                    message.error('请填写门店列表');
                    return callback(false);
                }
                Object.assign(dist, {
                    stores
                });
            }
            if (category === 1) {
                if (promoCategoriesPo.categoryId === undefined) {
                    message.error('请选择品类');
                    return callback(false);
                }
                Object.assign(dist, {
                    promoCategoriesPo
                });
            }
            return callback(Utils.removeInvalid(dist));
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
    handleQuanifyAmountChange(number) {
        this.props.form.setFieldsValue({
            quanifyAmount: number
        });
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
                categoryObj: {}
            });
        } else {
            this.setState({
                categorySelectorVisible: true
            });
        }
    }

    handleCategorySelect(categoryObj) {
        this.setState({ categoryObj });
    }

    handleStoreChange(e) {
        const nextStore = e.target.value;
        this.props.form.setFieldsValue({
            store: nextStore
        });
        if (nextStore === 0) {
            this.setState({
                storeSelectorVisible: false
            });
        } else {
            this.setState({
                storeSelectorVisible: true
            });
        }
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
        this.getFormData((response) => {
            if (!response) return;
            this.props.createPromotion(response).then((res) => {
                if (res.code === 200 && res.message === '请求成功') {
                    message.info('新增促销活动成功，请到列表页发布');
                    this.props.history.goBack();
                } else {
                    message.error(res.message);
                }
            });
        });
    }

    handleBack() {
        // const dist = Utils.removeInvalid(this.props.form.getFieldsValue());
        this.props.history.goBack();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const subCompanies = [];
        this.state.companies.forEach((company) => {
            subCompanies.push(company.companyName);
        });
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
                                                <InputNumber
                                                    size="default"
                                                    min={1}
                                                    max={100}
                                                    formatter={value => `${value}%`}
                                                />)}
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
                                        <FormItem className="condition" label="使用条件">
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
                                                    initialValue: 0,
                                                    rules: [{ required: true, message: '请填写条件金额' }]
                                                })(
                                                    <InputNumber
                                                        min={0}
                                                        max={65535}
                                                        formatter={value => `${value} 元可用`}
                                                        onChange={this.handleQuanifyAmountChange}
                                                    />)
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
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <FormItem className="category" label="使用品类">
                                            {getFieldDecorator('category', {
                                                initialValue: this.param.category,
                                                rules: [{ required: true, message: '请选择使用品类' }]
                                            })(
                                                <RadioGroup onChange={this.handleCategoryChange}>
                                                    <Radio className="default" value={0}>全部品类</Radio>
                                                    <Radio value={1}>指定品类</Radio>
                                                </RadioGroup>
                                                )}
                                            {this.state.categorySelectorVisible
                                                ? <Category
                                                    onCategorySelect={this.handleCategorySelect}
                                                /> : null}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <FormItem label="指定门店">
                                            {getFieldDecorator('store', {
                                                initialValue: this.param.store,
                                                rules: [{ required: true, message: '请指定门店' }]
                                            })(
                                                <RadioGroup onChange={this.handleStoreChange}>
                                                    <Radio className="default" value={0}>不指定</Radio>
                                                    <Radio value={1}>指定门店</Radio>
                                                </RadioGroup>
                                                )}
                                            {this.state.storeSelectorVisible ?
                                                getFieldDecorator('storeIds', {
                                                    initialValue: '',
                                                    rules: [{ required: true, message: '请输入指定门店' }]
                                                })(
                                                    <TextArea placeholder="请输入指定门店" autosize={{ minRows: 1, maxRows: 6 }} />
                                                    )
                                                : null
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <FormItem label="备注">
                                            {getFieldDecorator('note', {
                                                initialValue: this.param.note
                                            })(
                                                <TextArea placeholder="可填写备注" autosize={{ minRows: 1, maxRows: 6 }} />
                                                )}
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
                                    <Col>
                                        <FormItem>
                                            <Button size="default" onClick={this.handleBack}>
                                                返回
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
    createPromotion: PropTypes.func,
    history: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(PromotionCreate));
