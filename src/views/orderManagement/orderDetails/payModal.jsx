/**
 * @file payModal.jsx
 * @author caoyanxuan
 *
 * 订单管理-新增付款模态框
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Form, Input, Modal, Select,
    Row, Col, DatePicker, InputNumber,
    message,
} from 'antd';
import moment from 'moment';
import Util from '../../../util/util';
import { DATE_FORMAT } from '../../../constant/index';
import { payChannel } from '../../../constant/searchParams';
import { modifyPayModalVisible } from '../../../actions/modify/modifyPayModalVisible';
import { modifyAddPaymentInfo, fetchPaymentDetailInfo } from '../../../actions/order';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

@connect(
    state => ({
        payModalVisible: state.toJS().order.payModalVisible,
        orderDetailData: state.toJS().order.orderDetailData
    }),
    dispatch => bindActionCreators({
        modifyPayModalVisible,
        fetchPaymentDetailInfo,
    }, dispatch)
)

class PayModal extends Component {
    state = {
        textAreaNote: '',
    }

    /**
     * 模态框确认
     */
    handleNewPayOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const params = {
                    orderId: this.props.orderDetailData.id,
                    comment: this.state.textAreaNote
                }
                Object.assign(params, values);
                params.payDate = moment().format(DATE_FORMAT);
                params.amount = params.amount.toString();
                modifyAddPaymentInfo(params)
                    .then((res) => {
                        if (res.code === 200 && res.data) {
                            message.error(res.data);
                        }
                        this.props.modifyPayModalVisible({ isShow: false });
                        // 清空数据
                        this.props.form.resetFields();
                        this.setState({
                            textAreaNote: ''
                        });
                        this.props.fetchPaymentDetailInfo({ orderId: this.props.orderDetailData.id });
                    });
            }
        });
    }

    /**
     * 模态框取消
     */
    handleNewPayCancel = () => {
        this.props.modifyPayModalVisible({ isShow: false });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { payModalVisible } = this.props;
        return (
            <Modal
                title="新增付款"
                maskClosable={false}
                visible={payModalVisible}
                onOk={this.handleNewPayOk}
                onCancel={this.handleNewPayCancel}
                width={1200}
            >
                <Form layout="inline">
                    <Row gutter={40}>
                        <Col className="pay-col" span={8}>
                            {/* 类型 */}
                            <FormItem >
                                <div>
                                    <span className="sc-form-item-label">支付类型：</span>
                                    <span>未支付</span>
                                </div>
                            </FormItem>

                        </Col>
                        <Col className="pay-col" span={8}>
                            {/* 金额 */}
                            <FormItem>
                                <div>
                                    <span className="sc-form-item-label">支付金额：</span>
                                    {getFieldDecorator('amount', {
                                        rules: [{
                                            required: true, message: '请填写支付金额'
                                        }, {
                                            validator: Util.limitTwoDecimalPlaces
                                        }],
                                    })(
                                        <InputNumber
                                            min={1}
                                            max={this.props.totalAmount}
                                        />)} 元
                                </div>
                            </FormItem>
                        </Col>
                        <Col className="pay-col" span={8}>
                            {/* 方式 */}
                            <FormItem>
                                <div>
                                    <span className="sc-form-item-label">支付方式：</span>
                                    {getFieldDecorator('channel', {
                                        initialValue: '',
                                        rules: [{ required: true, message: '请选择支付方式' }],
                                    })(
                                        <Select
                                            size="default"
                                            onChange={this.orderTypeSelect}
                                        >
                                            {
                                                payChannel.data.map((item) =>
                                                    (<Option
                                                        key={item.key}
                                                        value={item.key}
                                                    >
                                                        {item.value}
                                                    </Option>)
                                                )
                                            }
                                        </Select>
                                        )}
                                </div>
                            </FormItem>
                        </Col>
                        <Col className="pay-col" span={8}>
                            {/* 支付账号 */}
                            <FormItem>
                                <div>
                                    <span className="sc-form-item-label">支付账号：</span>
                                    {getFieldDecorator('payAccount')(
                                        <Input
                                            className="input"
                                            placeholder="支付账号"
                                            size="default"
                                        />
                                    )}
                                </div>
                            </FormItem>
                        </Col>
                        <Col className="pay-col" span={8}>
                            {/* 参考号或交易号 */}
                            <FormItem>
                                <div>
                                    <span className="sc-form-item-label">参考号/交易号：</span>
                                    {getFieldDecorator('tranNum', {
                                        rules: [{ required: true, message: '请填写参考号/交易号' }, {
                                            validator: Util.limit12to20Places
                                        }],
                                    })(
                                        <Input
                                            className="input"
                                            placeholder="参考号/交易号"
                                            size="default"
                                        />
                                        )}
                                </div>
                            </FormItem>
                        </Col>
                        <Col className="pay-col" span={8}>
                            {/* 日期 */}
                            <FormItem>
                                <div>
                                    <span className="sc-form-item-label">支付日期：</span>
                                    {getFieldDecorator('payDate', {
                                        initialValue: moment(new Date(), DATE_FORMAT),
                                        rules: [{
                                            required: true,
                                            message: '请填写日期'
                                        }]
                                    })(
                                        <DatePicker
                                            placeholder="日期"
                                        />
                                        )}
                                </div>
                            </FormItem>
                        </Col>
                        <Col className="pay-col" span={24}>
                            {/* 备注 */}
                            <FormItem>
                                <div>
                                    <span className="sc-form-item-label">备注: </span>
                                    <TextArea
                                        autosize={{ minRows: 3, maxRows: 6 }}
                                        value={this.state.textAreaNote}
                                        style={{ resize: 'none' }}
                                        maxLength="250"
                                        onChange={(e) => {
                                            this.setState({
                                                textAreaNote: e.target.value
                                            })
                                        }}
                                    />
                                </div>
                            </FormItem>
                        </Col>
                    </Row>

                </Form>
            </Modal>
        )
    }
}

PayModal.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    modifyPayModalVisible: PropTypes.func,
    fetchPaymentDetailInfo: PropTypes.func,
    payModalVisible: PropTypes.bool,
    orderDetailData: PropTypes.objectOf(PropTypes.any),
    totalAmount: PropTypes.number
}

PayModal.defaultProps = {
}

export default withRouter(Form.create()(PayModal));
