/*
 * @Author: tanjf
 * @Description: 促销管理-新建
 * @CreateDate: 2017-09-20 18:34:13
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-11-03 15:56:50
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
import Util from '../../../util/util';
import { createCoupons } from '../../../actions/promotion';
import { DATE_FORMAT, MINUTE_FORMAT } from '../../../constant';
import { AreaSelector } from '../../../container/tree';
import { Category } from '../../../container/cascader';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['下单打折', '会员等级'];

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
            couponType: 'default',
            isSuperposeUserDiscount: 0,
            isSuperposeProOrCouDiscount: 0,
            grantChannel: 1
        };
        this.state = {
            areaSelectorVisible: false,
            categorySelectorVisible: false,
            formSelectorVisible: false,
            storeSelectorVisible: true,
            companies: [],  // 所选区域子公司
            categoryObj: {}, // 所选品类对象
            checkedList: [],
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
        this.handleCouponTypeChange = this.handleCouponTypeChange.bind(this);
        this.handleCategorySelect = this.handleCategorySelect.bind(this);
        this.handleGrantChannel = this.handleGrantChannel.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
    }

    getFormData() {
        return new Promise((resolve, reject) => {
            this.props.form.validateFields((err, values) => {
                if (err) {
                    reject(err);
                }
                const {
                    promotionName,
                    discount,
                    promotionDateRange,
                    quanifyAmount,
                    couponType,
                    condition,
                    totalQuantity,
                    grantChannel,
                    personQty,
                    note,
                    area,
                    category,
                    storeId
                } = values;
                const startDate = promotionDateRange ? promotionDateRange[0].valueOf() : '';
                const endDate = promotionDateRange ? promotionDateRange[1].valueOf() : '';
                const stores = {};
                Object.assign(stores, {
                    storeId
                });
                const promoCategoriesPo = this.state.categoryObj;
                const companiesPoList = this.state.companies;
                const checkedBoxList = this.state.checkedList;
                const dist = {
                    promotionName,
                    discount,
                    startDate,
                    endDate,
                    couponType,
                    note,
                    personQty,
                    grantChannel: grantChannel === 1 ? 'personal' : 'platform',
                    isSuperposeUserDiscount: (checkedBoxList.length === 1 &&
                        checkedBoxList[0] === '会员等级') || checkedBoxList.length === 2 ? 1 : 0,
                    isSuperposeProOrCouDiscount: (checkedBoxList.length === 1 &&
                        checkedBoxList[0] === '下单打折') || checkedBoxList.length === 2 ? 1 : 0,
                };
                if (condition === 0) {
                    if (!quanifyAmount) {
                        this.props.form.setFields({
                            condition: {
                                value: condition,
                                errors: [new Error('请填写活动金额!')]
                            }
                        });
                        reject();
                    } else {
                        Object.assign(dist, {
                            quanifyAmount
                        });
                    }
                }
                if (area === 1) {
                    if (companiesPoList.length === 0) {
                        this.props.form.setFields({
                            area: {
                                value: values.area,
                                errors: [new Error('未选择指定区域')],
                            },
                        });
                        reject();
                    } else {
                        Object.assign(dist, {
                            companiesPoList
                        });
                    }
                }
                if (category === 1) {
                    if (promoCategoriesPo.categoryId === undefined) {
                        this.props.form.setFields({
                            category: {
                                value: category,
                                errors: [new Error('请选择品类!')]
                            }
                        });
                        reject();
                    } else {
                        Object.assign(dist, {
                            promoCategoriesPo
                        });
                    }
                }
                if (personQty && totalQuantity) {
                    if (personQty > totalQuantity) {
                        this.props.form.setFields({
                            personQty: {
                                value: personQty,
                                errors: [new Error('请输入正确领取数量!')]
                            }
                        });
                        reject();
                    } else {
                        Object.assign(dist, {
                            personQty
                        });
                    }
                }
                if (totalQuantity) {
                    if (!totalQuantity) {
                        this.props.form.setFields({
                            totalQuantity: {
                                value: totalQuantity,
                                errors: [new Error('请输入发放数量!')]
                            }
                        });
                        reject();
                    } else {
                        Object.assign(dist, {
                            totalQuantity
                        });
                    }
                }
                resolve(Util.removeInvalid(dist));
            });
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
        this.param.area = nextArea;
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

    handleCouponTypeChange(e) {
        this.param.couponType = e.target.value;
        this.props.form.setFieldsValue({ couponType: this.param.couponType });
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

    handleGrantChannel(e) {
        const nextGrantChannel = e.target.value;
        this.props.form.setFieldsValue({
            grantChannel: nextGrantChannel
        });
        this.param.grantChannel = e.target.value;
        if (nextGrantChannel === 1) {
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

    handleSubmit(e) {
        e.preventDefault();
        this.getFormData().then((param) => {
            // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/coupon/insertCoupons
            this.props.createCoupons(param).then((res) => {
                if (res.code === 200 && res.message === '请求成功') {
                    message.info('新增优惠券成功，请到列表页发布');
                    this.handleBack();
                } else {
                    message.error(res.message);
                }
            });
        });
    }

    textAreaChange(e) {
        const getValue = e.target.value;
        this.setState({ rcontent: getValue, rcontentnum: 15 });
    }

    handleBack() {
        this.props.history.replace('/coupon');
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const subCompanies = [];
        this.state.companies.forEach((company) => {
            subCompanies.push(company.companyName);
        });
        return (
            <div className="coupons-create">
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <div className="coupon-add-item">
                        <div className="add-message coupon-add-license">
                            <div className="add-message-body">
                                <Row>
                                    <Col span={16}>
                                        <FormItem label="优惠券名称" >
                                            {getFieldDecorator('promotionName', {
                                                rules: [
                                                    { required: true, message: '请输入优惠券名称!' },
                                                    { max: 15, message: '活动名称最长15位' },
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
                                                    max={9999}
                                                    maxlength={9999}
                                                    parser={value => Math.ceil(value)}
                                                />)}
                                            <span>元</span>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
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
                                        <FormItem className="condition" label="优惠券类型">
                                            {getFieldDecorator('couponType', {
                                                initialValue: this.param.couponType,
                                                rules: [{ required: true, message: '请选择优惠券类型' }]
                                            })(
                                                <RadioGroup
                                                    onChange={this.handleCouponTypeChange}
                                                >
                                                    <Radio
                                                        className="default"
                                                        value={'default'}
                                                    >默认</Radio>
                                                    <Radio value={'toGive'}>返券</Radio>
                                                </RadioGroup>
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
                                                    <Radio
                                                        className="default"
                                                        value={1}
                                                    >不限制</Radio>
                                                    <Radio value={0}>满</Radio>
                                                </RadioGroup>
                                                )}
                                        </FormItem>
                                        {
                                            this.param.condition === 0 ?
                                                <span style={{ height: '42px', lineHeight: '42px' }}>
                                                    <FormItem className="condition" label="">
                                                        {getFieldDecorator('quanifyAmount', {
                                                            initialValue: '',
                                                            rules: [{ required: true, message: '请输入面额' }]
                                                        })(
                                                            <InputNumber
                                                                min={1}
                                                                max={99999}
                                                                maxlength={99999}
                                                                parser={value => Math.ceil(value)}
                                                                onChange={
                                                                    this.handleQuanifyAmountChange
                                                                }
                                                            />
                                                            )}
                                                    </FormItem>
                                                    元可用
                                                </span>
                                                : null
                                        }
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
                                                    parser={value => Math.ceil(value)}
                                                />)}
                                            <span>张</span>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <FormItem label="发放形式">
                                            {getFieldDecorator('grantChannel', {
                                                initialValue: this.param.grantChannel
                                            })(
                                                <RadioGroup onChange={this.handleGrantChannel}>
                                                    <Radio className="default" value={1}>
                                                        用户领取
                                                    </Radio>
                                                    <Radio value={0}>平台发放</Radio>
                                                </RadioGroup>
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                {this.state.storeSelectorVisible ?
                                    <Row>
                                        <Col span={16} className="personQty">
                                            <FormItem label="每人可领" >
                                                {getFieldDecorator('personQty', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请输入每人可领数量!'
                                                        }
                                                    ]
                                                })(
                                                    <InputNumber
                                                        style={{ width: 150 }}
                                                        size="default"
                                                        min={1}
                                                        max={99}
                                                        parser={value => Math.ceil(value)}
                                                        formatter={value => `${value}`}
                                                    />
                                                    )}
                                                <span>张</span>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    : null
                                }
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
                                                    maxLength="15"
                                                    autosize={{
                                                        minRows: 4,
                                                        maxRows: 6
                                                    }}
                                                />
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={40} type="flex" justify="center">
                                    <Col span={8}>
                                        <FormItem>
                                            <Button type="primary" size="default" htmlType="submit">
                                                保存
                                            </Button>
                                        </FormItem>
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
