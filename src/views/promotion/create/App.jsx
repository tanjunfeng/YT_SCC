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
    Form, Row, Col, Input, Radio,
    Button, DatePicker, Checkbox,
    InputNumber, Select
} from 'antd';

import Util from '../../../util/util';
import { AreaSelector } from '../../../container/tree';
import { createPromotion } from '../../../actions/promotion';
import { DATE_FORMAT, MINUTE_FORMAT } from '../../../constant';
import { overlayOptions } from '../constants';
import { getChooseButton, getRules, buyType, conditionType } from './DomHelper';

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
        categorySelectorVisible: false,
        storeSelectorVisible: false,
        companies: [], // 所选区域子公司
        checkedList: []
    }

    getFormData = (callback) => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
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
            let overLayNum = 0;
            overlay.forEach(v => {
                overLayNum += v;
            });
            const dist = {
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
            console.log(data);
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { companies, areaSelectorVisible, storeSelectorVisible } = this.state;
        return (
            <Form className="promotion-create" layout="inline" onSubmit={this.handleSubmit}>
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
                    </Col>
                </Row>
                <Row>
                    <Col span={16}>
                        <FormItem label="使用条件">
                            {getFieldDecorator('condition', {
                                initialValue: 0,
                                rules: [{ required: true, message: '请选择使用条件' }]
                            })(<RadioGroup>
                                <Radio className="default" value={0}>不限制</Radio>
                                <Radio value={1}>指定条件</Radio>
                            </RadioGroup>)}
                        </FormItem>
                    </Col>
                </Row>
                {getFieldValue('condition') === 0 ?
                    getRules(getFieldDecorator, getFieldValue)
                    :
                    <Row>
                        <Col span={16}>
                            <FormItem label="优惠种类">
                                {getFieldDecorator('category', {
                                    initialValue: '0'
                                })(<Select size="default" className="wd-110">
                                    <Option key={0} value="0">购买条件</Option>
                                    <Option key={1} value="1">奖励列表</Option>
                                    <Option key={2} value="2">整个购买列表</Option>
                                </Select>)}
                            </FormItem>
                        </Col>
                    </Row>
                }
                {getFieldValue('category') === '0' ?
                    <Row>
                        {buyType(getFieldDecorator)}
                        {conditionType(getFieldDecorator)}
                    </Row> : null}
                <Row>
                    <Col span={16}>
                        <FormItem label="使用条件">
                            {getFieldDecorator('condition', {
                                initialValue: 0,
                                rules: [{ required: true, message: '请选择使用条件' }]
                            })(<RadioGroup>
                                <Radio className="default" value={0}>不限制</Radio>
                                <Radio value={1}>指定条件</Radio>
                            </RadioGroup>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={16}>
                        <FormItem label="使用区域">
                            {getFieldDecorator('area', {
                                initialValue: 0
                            })(<RadioGroup onChange={this.handleAreaChange}>
                                <Radio className="default" value={0}>全部区域</Radio>
                                <Radio value={1}>指定区域</Radio>
                                <Radio value={2}>指定门店</Radio>
                            </RadioGroup>)}
                        </FormItem>
                    </Col>
                </Row>
                {getFieldValue('area') === 1 ?
                    <Row>
                        <Col span={16}>
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
                            </FormItem>
                        </Col>
                    </Row>
                    : null
                }
                {storeSelectorVisible ?
                    <Row className="store">
                        <Col span={16}>
                            <FormItem>
                                {getFieldDecorator('storeId', {
                                    initialValue: '',
                                    rules: [{ required: true, message: '请输入指定门店' }]
                                })(<TextArea
                                    placeholder="请输入指定门店"
                                    autosize={{ minRows: 4, maxRows: 6 }}
                                />)}
                            </FormItem>
                        </Col>
                    </Row>
                    : null
                }
                {storeSelectorVisible ?
                    <Row className="tips">
                        <Col span={16}>请按照数据模板的格式准备导入数据如：A000999, A000900, A000991</Col>
                    </Row>
                    : null
                }
                <Row>
                    <Col span={16}>
                        <FormItem label="活动优先级">
                            {getFieldDecorator('priority', {
                                initialValue: 1,
                                rules: [
                                    { validator: Util.validatePositiveInteger }
                                ]
                            })(<InputNumber max={9999} className="wd-90" />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={16}>
                        <FormItem label="活动叠加">
                            {getFieldDecorator('overlay', {
                                initialValue: []
                            })(<CheckboxGroup
                                options={overlayOptions}
                            />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={16} className="few-line">
                        <FormItem label="简易描述">
                            {getFieldDecorator('simpleDescription', {
                                initialValue: '',
                                rules: [{ max: 20, message: '限填20字' }]
                            })(<TextArea placeholder="可填写简易描述，限填20字" autosize={{ minRows: 2, maxRows: 4 }} />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={16} className="multi-line">
                        <FormItem label="详细描述">
                            {getFieldDecorator('detailDescription', {
                                initialValue: '',
                                rules: [{ max: 200, message: '限填200字' }]
                            })(<TextArea placeholder="可填写详细描述，限填200字" autosize={{ minRows: 4, maxRows: 6 }} />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={16} className="multi-line">
                        <FormItem label="备注">
                            {getFieldDecorator('note', {
                                initialValue: '',
                                rules: [{ max: 200, message: '限填200字' }]
                            })(<TextArea placeholder="可填写备注，限填200字" autosize={{ minRows: 4, maxRows: 6 }} />)}
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
                    </Col>
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
