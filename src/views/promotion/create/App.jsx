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
    Form, Row, Col, Input,
    Button, DatePicker, Checkbox
} from 'antd';

import { createPromotion } from '../../../actions/promotion';
import Area from './Area';
import { DATE_FORMAT, MINUTE_FORMAT } from '../../../constant';
import { overlayOptions } from '../constants';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

@connect(() => ({
}), dispatch => bindActionCreators({
    createPromotion
}, dispatch))

class PromotionCreate extends PureComponent {
    getFormData = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log(values);
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.getFormData();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
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
                            })(<Area />)}
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
