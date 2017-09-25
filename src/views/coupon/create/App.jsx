/*
 * @Author: tanjf
 * @Description: 促销管理-新建
 * @CreateDate: 2017-09-20 18:34:13
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-09-25 10:04:47
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
    Form, Row, Col, Input, InputNumber,
    Button, DatePicker, Radio, message, Checkbox
} from 'antd';
import Utils from '../../../util/util';
import { createCoupons } from '../../../actions/promotion';
import { DATE_FORMAT, MINUTE_FORMAT } from '../../../constant';
import { AreaSelector } from '../../../container/tree';
import Category from '../../../container/cascader';
import HotLableItem from './hotLableItem';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['会员等级'];

@connect(() => ({
}), dispatch => bindActionCreators({
    createCoupons
}, dispatch))

class CouponCreate extends PureComponent {
    constructor(props) {
        super(props);
        this.param = {
            condition: 0,
            area: 0,
            category: 0,
            store: 0,
            isSuperposeUserDiscount: 0,
            grantChannel: 0,
        };
        this.state = {
            areaSelectorVisible: false,
            categorySelectorVisible: false,
            formSelectorVisible: false,
            storeSelectorVisible: true,
            companies: [],  // 所选区域子公司
            categoryObj: {}, // 所选品类对象
            checkedList: []
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
        this.handleFormChange = this.handleFormChange.bind(this);
    }

    getFormData(callback) {
        this.props.form.validateFields((err, values) => {
            if (err) {
                message.error('请检查请求参数');
                return callback(false);
            }
            const {
                promotionName,
                discount,
                promotionDateRange,
                quanifyAmount,
                condition,
                totalQuantity,
                grantChannel,
                personQty,
                note,
                area,
                store,
                category,
                storeIds,
        } = values;
            const startDate = promotionDateRange ? promotionDateRange[0].valueOf() : '';
            const endDate = promotionDateRange ? promotionDateRange[1].valueOf() : '';
            const stores = {};
            Object.assign(stores, {
                storeId: storeIds
            });
            const promoCategoriesPo = this.state.categoryObj;
            const companiesPoList = this.state.companies;
            const checkedBoxList = this.state.checkedList;
            const dist = {
                promotionName,
                discount,
                startDate,
                endDate,
                note,
                totalQuantity,
                grantChannel: grantChannel === 1 ? 'personal' : 'platform',
                // isPayState: (checkedBoxList.length === 1 &&
                //     checkedBoxList[0] === '下单打折') || checkedBoxList.length === 2 ? 1 : 0,
                isSuperposeUserDiscount: (checkedBoxList.length === 1 &&
                    checkedBoxList[0] === '会员等级') || checkedBoxList.length === 2 ? 1 : 0,
                personQty,
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
        this.param.store = e.target.value;
        if (nextStore === 0) {
            this.setState({
                storeSelectorVisible: true
            });
        } else {
            this.setState({
                storeSelectorVisible: false
            });
        }
    }

    handleFormChange = (checkedList) => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
            checkAll: checkedList.length === plainOptions.length,
        });
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
            this.props.createCoupons(response).then((res) => {
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
        this.props.history.goBack();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const subCompanies = [];
        this.state.companies.forEach((company) => {
            subCompanies.push(company.companyName);
        });
        const tooltipTitle = '请输入整数';
        return (
            <div className="coupon">
                <Form layout="inline">
                    <div className="coupon-add-item">
                        <div className="add-message coupon-add-license">
                            <div className="add-message-body">
                                <Row>
                                    <Col span={16}>
                                        <FormItem label="优惠券名称" >
                                            {getFieldDecorator('promotionName', {
                                                rules: [
                                                    { required: true, message: '请输入优惠券名称!' },
                                                    { max: 15, message: '活动名称最长15位' }
                                                ]
                                            })(<Input size="default" />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <FormItem label="面额" >
                                            {getFieldDecorator('discount', {
                                                rules: [
                                                    { required: true, message: '请输入面额!' }
                                                ]
                                            })(
                                                <InputNumber
                                                    size="default"
                                                    min={1}
                                                    max={999}
                                                    maxlength={99999}
                                                    formatter={value => `${value}`}
                                                />)}
                                            <span>元</span>
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
                                                    showTime={{ format: MINUTE_FORMAT }}
                                                    format={`${DATE_FORMAT} ${MINUTE_FORMAT}`}
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
                                            {
                                                this.param.condition > 0 ?
                                                getFieldDecorator('quanifyAmount', {
                                                    initialValue: '',
                                                    rules: [{ required: true, message: '请输入面额' }]
                                                })(
                                                    <InputNumber
                                                        min={1}
                                                        max={99999}
                                                        maxlength={99999}
                                                        parser={value => Math.ceil(value)}
                                                        onChange={this.handleQuanifyAmountChange}
                                                    />
                                                )
                                                : null
                                            }
                                            {
                                                this.param.condition > 0 ? ' 元可用 ' : null
                                            }
                                            {
                                                this.param.condition > 0 &&
                                                <HotLableItem
                                                    tooltipTitle={tooltipTitle}
                                                />
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <FormItem label="使用区域">
                                            {getFieldDecorator('companiesPoList', {
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
                                        <FormItem className="category" label="使用品类">
                                            {getFieldDecorator('promoCategoriesPo', {
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
                                        <FormItem label="发放数量" >
                                            {getFieldDecorator('totalQuantity', {
                                                rules: [
                                                    { required: true, message: '请输入发放数量!' }
                                                ]
                                            })(
                                                <InputNumber
                                                    size="default"
                                                    min={1}
                                                    max={999999}
                                                    formatter={value => `${value}`}
                                                />)}
                                            <span>张</span>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <FormItem label="发放形式">
                                            {getFieldDecorator('grantChannel', {
                                                initialValue: this.param.store
                                            })(
                                                <RadioGroup onChange={this.handleStoreChange}>
                                                    <Radio className="default" value={0}>
                                                        用户领取
                                                    </Radio>
                                                    <Radio value={1}>平台发放</Radio>
                                                </RadioGroup>
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    {this.state.storeSelectorVisible ?
                                        <Row className="store">
                                            <Col className="mrkl">
                                                <FormItem label="每人可领" >
                                                    {getFieldDecorator('personQty', {
                                                        rules: [
                                                            { required: true,
                                                                message: '请输入每人可领数量!'
                                                            }
                                                        ]
                                                    })(
                                                        <InputNumber
                                                            style={{width: 150}}
                                                            size="default"
                                                            min={1}
                                                            max={99}
                                                            formatter={value => `${value}`}
                                                        />
                                                    )}
                                                    <span>张</span>
                                                </FormItem>
                                            </Col>
                                        </Row>
                                        : null
                                    }
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <FormItem label="活动叠加">
                                            <CheckboxGroup
                                                onChange={this.handleFormChange}
                                                value={this.state.checkedList}
                                                options={plainOptions}
                                            />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <FormItem label="备注">
                                            {getFieldDecorator('note', {
                                                initialValue: this.param.note
                                            })(
                                                <TextArea
                                                    placeholder="可填写备注"
                                                    autosize={{
                                                        minRows: 4,
                                                        maxRows: 6
                                                    }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={40} type="flex">
                                    <Col>
                                        <FormItem>
                                            <Button type="primary" size="default" onClick={this.handleSubmit}>
                                                保存
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

CouponCreate.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    createCoupons: PropTypes.func,
    history: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(CouponCreate));
