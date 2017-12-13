/**
 *促销管理 - 下单打折查询参与数据查询表单
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, DatePicker, Row, Col } from 'antd';
import { withRouter } from 'react-router';
import Util from '../../../util/util';
import { BranchCompany } from '../../../container/search';
import { DATE_FORMAT, MINUTE_FORMAT } from '../../../constant';
import { participate } from '../constants';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class SearchForm extends PureComponent {
    getStatus = (stateName) => {
        const keys = Object.keys(participate[stateName]);
        return keys.map((key) => (
            <Option key={key} value={key}>
                {participate[stateName][key]}
            </Option>
        ));
    }

    getStatusFromCode = (statusCode) => {
        if (statusCode === 'ALL') {
            return '';
        }
        return statusCode;
    }

    getSearchCondition = () => {
        const {
            orderId,
            promotionName,
            participateTimeRange,
            orderStateCode,
            paymentStateCode,
            shippingStateCode,
            franchiseeStoreId,
            branchCompany
        } = this.props.form.getFieldsValue();
        return Util.removeInvalid({
            orderId,
            promotionName,
            orderState: this.getStatusFromCode(orderStateCode),
            paymentState: this.getStatusFromCode(paymentStateCode),
            shippingState: this.getStatusFromCode(shippingStateCode),
            startTime: participateTimeRange.length > 1 ? participateTimeRange[0].valueOf() : '',
            endTime: participateTimeRange.length > 1 ? participateTimeRange[1].valueOf() : '',
            franchiseeStoreId,
            branchCompanyId: branchCompany.id
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.onParticipateSearch(this.getSearchCondition());
    }

    handleReset = () => {
        this.props.form.resetFields(); // 清除当前查询条件
        this.props.onParticipateReset(); // 通知父页面已清空
        // 点击重置时清除 seachMind 引用文本
        this.props.form.setFieldsValue({
            branchCompany: { reset: true }
        });
    }

    handleExport = () => {
        this.props.onParticipateExport(this.getSearchCondition()); // 通知父组件导出数据
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" onSubmit={this.handleSubmit} className="promotion">
                <Row gutter={40}>
                    <Col span={8}>
                        <FormItem label="订单编号">
                            {getFieldDecorator('orderId')(<Input size="default" />)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="订单状态">
                            {getFieldDecorator('orderStateCode', {
                                initialValue: 'ALL'
                            })(<Select size="default">
                                {this.getStatus('orderState')}
                            </Select>)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="支付状态">
                            {getFieldDecorator('paymentStateCode', {
                                initialValue: 'ALL'
                            })(<Select size="default">
                                {this.getStatus('paymentState')}
                            </Select>)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="物流状态">
                            {getFieldDecorator('shippingStateCode', {
                                initialValue: 'ALL'
                            })(<Select size="default">
                                {this.getStatus('shippingState')}
                            </Select>)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="门店编号">
                            {getFieldDecorator('franchiseeStoreId')(<Input size="default" />)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="所属公司">
                            {getFieldDecorator('branchCompany', {
                                initialValue: { id: '', name: '' }
                            })(<BranchCompany />)}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="使用时间">
                            {getFieldDecorator('participateTimeRange', {
                                initialValue: []
                            })(<RangePicker
                                size="default"
                                className="manage-form-enterTime"
                                showTime={{ format: MINUTE_FORMAT }}
                                format={`${DATE_FORMAT} ${MINUTE_FORMAT}`}
                                placeholder={['开始时间', '结束时间']}
                            />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={40} type="flex" justify="end">
                    <Col>
                        <Button type="primary" size="default" htmlType="submit">
                            查询
                        </Button>
                        <Button size="default" onClick={this.handleExport}>
                            导出
                        </Button>
                        <Button size="default" onClick={this.handleReset}>
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm.propTypes = {
    onParticipateSearch: PropTypes.func,
    onParticipateReset: PropTypes.func,
    onParticipateExport: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any)
};

SearchForm.defaultProps = {
    prefixCls: 'ParticipateList'
}

export default withRouter(Form.create()(SearchForm));
