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
    Form, Row, Col, Input, Radio,
    Button, DatePicker, Checkbox
} from 'antd';

import { AreaSelector } from '../../../container/tree';

import { createPromotion } from '../../../actions/promotion';
import { DATE_FORMAT, MINUTE_FORMAT } from '../../../constant';
import { overlayOptions } from '../constants';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

@connect(() => ({
}), dispatch => bindActionCreators({
    createPromotion
}, dispatch))

class PromotionCreate extends PureComponent {
    state = {
        areaSelectorVisible: false,
        categorySelectorVisible: false,
        storeSelectorVisible: false,
        companies: [],  // 所选区域子公司
        categoryObj: {}, // 所选品类对象
        checkedList: []
    }

    getFormData = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log(values);
        });
    }

    getSubCompanies = () => {
        const subCompanies = this.state.companies.map(company => company.companyName);
        return (<span className="sub-companies">
            <a href="#" onClick={this.handleSubCompaniesRechoose}>{subCompanies.length > 0 ? '重新选择' : '选择'}</a>
        </span>);
    }

    handleSelectorOk = (companies) => {
        this.setState({
            areaSelectorVisible: false,
            companies
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
        this.getFormData();
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
                            {getFieldDecorator('promotionDateRange', {
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
                                    initialValue: companies.map(company => company.companyId),
                                    rules: [{ required: true, message: '请选择子公司' }]
                                })(<Input disabled />)}
                                {this.getSubCompanies()}
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
                        <Col span={16}>
                            请按照数据模板的格式准备导入数据如：A000999, A000900, A000991
                                        </Col>
                    </Row>
                    : null
                }
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
                    <Col span={16} className="multi-line">
                        <FormItem label="简易描述">
                            {getFieldDecorator('quote', {
                                initialValue: ''
                            })(<TextArea placeholder="可填写备注" autosize={{ minRows: 4, maxRows: 6 }} />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={16} className="multi-line">
                        <FormItem label="详细描述">
                            {getFieldDecorator('description', {
                                initialValue: ''
                            })(<TextArea placeholder="可填写备注" autosize={{ minRows: 4, maxRows: 6 }} />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={16} className="multi-line">
                        <FormItem label="备注">
                            {getFieldDecorator('note', {
                                initialValue: ''
                            })(<TextArea placeholder="可填写备注" autosize={{ minRows: 4, maxRows: 6 }} />)}
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
