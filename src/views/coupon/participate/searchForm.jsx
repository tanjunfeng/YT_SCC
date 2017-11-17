/**
 * 促销管理 - 参与数据查询表单
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
            recordTimeRange, // 使用时间
            activityTimeRange, // 领取时间
            canceledTimeRange, // 作废时间
            orderState,
            paymentState,
            shippingStateCode,
            franchiseeId,
            storeId,
            branchCompany
        } = this.props.form.getFieldsValue();
        const { match } = this.props;
        return Util.removeInvalid({
            promoId: match.params.id,
            orderId,
            storeId,
            promotionName,
            orderState: this.getStatusFromCode(orderState),
            paymentState: this.getStatusFromCode(paymentState),
            shippingState: this.getStatusFromCode(shippingStateCode),
            recordTimeStart: recordTimeRange.length > 1 ? recordTimeRange[0].valueOf() : '',
            recordTimeEnd: recordTimeRange.length > 1 ? recordTimeRange[1].valueOf() : '',
            activityDateStart: activityTimeRange.length > 1 ? activityTimeRange[0].valueOf() : '',
            activityDateEnd: activityTimeRange.length > 1 ? activityTimeRange[1].valueOf() : '',
            canceledDateStart: canceledTimeRange.length > 1 ? canceledTimeRange[0].valueOf() : '',
            canceledDateEnd: canceledTimeRange.length > 1 ? canceledTimeRange[1].valueOf() : '',
            franchiseeId,
            branchCompanyId: branchCompany.id
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.onSearch(this.getSearchCondition());
    }

    handleReset = () => {
        this.props.form.resetFields();  // 清除当前查询条件
        this.props.onReset();  // 通知父页面已清空
    }

    handleExport = () => {
        this.props.onExport(this.getSearchCondition());   // 通知父组件导出数据
    }

    render() {
        const { form, value } = this.props;
        const { getFieldDecorator } = form;
        const page = value.page;
        return (
            <div className="search-box participate">
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <div className="search-conditions">
                        {page === 'used' ?
                            <Row gutter={40}>
                                <Col span={8}>
                                    <FormItem label="订单编号" style={{ paddingRight: 10 }}>
                                        {getFieldDecorator('orderId')(<Input size="default" />)}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label="订单状态">
                                        {getFieldDecorator('orderState', {
                                            initialValue: 'ALL'
                                        })(
                                            <Select style={{ width: '153px' }} size="default">
                                                {this.getStatus('orderState')}
                                            </Select>
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label="支付状态">
                                        {getFieldDecorator('paymentState', {
                                            initialValue: 'ALL'
                                        })(
                                            <Select style={{ width: '153px' }} size="default">
                                                {this.getStatus('paymentState')}
                                            </Select>
                                            )}
                                    </FormItem>
                                </Col>
                            </Row> : null}
                        <Row gutter={40}>
                            <Col span={8}>
                                <FormItem label="门店编号">
                                    {getFieldDecorator('storeId')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="加盟商编号">
                                    {getFieldDecorator('franchiseeId')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="所属公司">
                                    {getFieldDecorator('branchCompany', {
                                        initialValue: { id: '', name: '' }
                                    })(<BranchCompany />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40}>
                            {page === 'unused' ?
                                <Col span={8}>
                                    <FormItem label="领取时间">
                                        {getFieldDecorator('activityTimeRange', {
                                            initialValue: []
                                        })(
                                            <RangePicker
                                                size="default"
                                                className="manage-form-enterTime"
                                                showTime={{ format: MINUTE_FORMAT }}
                                                format={`${DATE_FORMAT} ${MINUTE_FORMAT}`}
                                                placeholder={['开始时间', '结束时间']}
                                            />
                                            )}
                                    </FormItem>
                                </Col> : null}
                            {page === 'used' ?
                                <Col span={8}>
                                    <FormItem label="使用时间">
                                        {getFieldDecorator('recordTimeRange', {
                                            initialValue: []
                                        })(
                                            <RangePicker
                                                size="default"
                                                className="manage-form-enterTime"
                                                showTime={{ format: MINUTE_FORMAT }}
                                                format={`${DATE_FORMAT} ${MINUTE_FORMAT}`}
                                                placeholder={['开始时间', '结束时间']}
                                            />
                                            )}
                                    </FormItem>
                                </Col>
                                : null}
                            {page === 'garbage' ?
                                <Col span={8}>
                                    <FormItem label="作废时间">
                                        {getFieldDecorator('canceledTimeRange', {
                                            initialValue: []
                                        })(
                                            <RangePicker
                                                size="default"
                                                className="manage-form-enterTime"
                                                showTime={{ format: MINUTE_FORMAT }}
                                                format={`${DATE_FORMAT} ${MINUTE_FORMAT}`}
                                                placeholder={['开始时间', '结束时间']}
                                            />
                                            )}
                                    </FormItem>
                                </Col>
                                : null
                            }
                        </Row>
                        <Row gutter={40} type="flex" justify="end">
                            <Col>
                                <FormItem>
                                    <Button type="primary" size="default" htmlType="submit">
                                        查询
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button size="default" onClick={this.handleExport}>
                                        导出
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button size="default" onClick={this.handleReset}>
                                        重置
                                    </Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div >
        );
    }
}

SearchForm.propTypes = {
    onSearch: PropTypes.func,
    onReset: PropTypes.func,
    onExport: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    value: PropTypes.objectOf(PropTypes.any),
    match: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(SearchForm));
