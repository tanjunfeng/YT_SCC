/**
 * @file causeModal.jsx
 * @author caoyanxuan
 *
 * 订单管理-取消原因模态框
 */

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Input, Modal, message, Select, InputNumber } from 'antd';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';
import { modifyAuditRefund, modifyConfirmRefund, fetchPaymentDetailInfo } from '../../../actions/order';


const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

@connect(
    state => ({
        payAuditModalVisible: state.toJS().order.payAuditModalVisible,
        chooseData: state.toJS().order.chooseData,
        recordData: state.toJS().order.recordData,
    }),
    dispatch => bindActionCreators({
        modifyCauseModalVisible,
        fetchPaymentDetailInfo,
    }, dispatch)
)
class RefundModal extends PureComponent {
    constructor(props) {
        super(props);
        this.handleTableCauseOk = ::this.handleTableCauseOk;
        this.handleTableCauseCancel = ::this.handleTableCauseCancel;
        this.state = {
            option: '请选择'
        }
    }

    componentDidMount() {
    }

    /**
     * 模态框确认
     */
    handleTableCauseOk() {
        const { causeTextArea, inputNumber } = this.props.form.getFieldsValue();
        const { recordData } = this.props
        const { option } = this.state;
        switch (option) {
            case '请选择':
                message.error('请选择！')
                return;
            case '通过':
                if (recordData.state === 'pending_audit') {
                    // 审核退款
                    modifyAuditRefund({
                        refundNo: recordData.id,
                        passed: true,
                        amount: inputNumber
                    }).then(res => {
                        this.props.fetchPaymentDetailInfo({ orderId: recordData.orderId });
                        this.props.modifyCauseModalVisible({ isShow: false });
                        this.setState({
                            option: '请选择'
                        })
                        message.success(res.message);
                    })
                } else {
                    // 确认退款
                    modifyConfirmRefund({
                        refundNo: recordData.id,
                        passed: true,
                    }).then(res => {
                        this.props.fetchPaymentDetailInfo({ orderId: recordData.orderId });
                        this.props.modifyCauseModalVisible({ isShow: false });
                        this.setState({
                            option: '请选择'
                        })
                        message.success(res.message);
                    })
                }
                break;
            case '不通过':
                this.props.form.validateFields((error) => {
                    if (!error) {
                        if (recordData.state === 'pending_audit') {
                            // 审核退款
                            modifyAuditRefund({
                                amount: recordData.amount,
                                refundNo: recordData.id,
                                passed: false,
                                remark: causeTextArea
                            }).then(() => {
                                this.props.fetchPaymentDetailInfo({ orderId: recordData.orderId });
                                this.props.modifyCauseModalVisible({ isShow: false });
                                this.setState({
                                    option: '请选择'
                                })
                                message.success('退款审核成功');
                            })
                        } else {
                            // 确认退款
                            modifyConfirmRefund({
                                refundNo: recordData.id,
                                passed: false,
                                remark: causeTextArea
                            }).then(() => {
                                this.props.fetchPaymentDetailInfo({ orderId: recordData.orderId });
                                this.props.modifyCauseModalVisible({ isShow: false });
                                this.setState({
                                    option: '请选择'
                                })
                                message.success('确认退款成功');
                            })
                        }
                    }
                })
                break;
            default:
                break;
        }
    }

    /**
     * 模态框取消
     */
    handleTableCauseCancel() {
        this.props.modifyCauseModalVisible({ isShow: false });
        this.setState({
            option: '请选择'
        })
    }

    render() {
        const { payAuditModalVisible, recordData} = this.props;
        const { getFieldDecorator } = this.props.form;
        const { option } = this.state;
        return (
            <div>
                {
                    payAuditModalVisible
                    && <Modal
                        title="审核"
                        maskClosable={false}
                        visible={payAuditModalVisible}
                        onOk={this.handleTableCauseOk}
                        onCancel={this.handleTableCauseCancel}
                    >
                        <Form>
                            <FormItem>
                                <div>
                                    <span className="order-modal-label">
                                        <span style={{ color: '#f00' }}>*</span>
                                        请选择:
                                    </span>
                                    <Select
                                        defaultValue="请选择"
                                        onChange={(value) => {
                                            this.setState({
                                                option: value
                                            })
                                        }}
                                    >
                                        <Option value="请选择" disabled>请选择</Option>
                                        <Option value="通过">通过</Option>
                                        <Option value="不通过">不通过</Option>
                                    </Select>
                                </div>
                            </FormItem>
                            {
                                option === '通过' && recordData.state === 'pending_audit'
                                &&
                                <FormItem>
                                    <div>
                                        <span className="order-modal-label">
                                            订单金额:
                                        </span>
                                        {getFieldDecorator('totalAmount', {
                                            initialValue: this.props.totalAmount
                                        })(
                                            <InputNumber
                                                min={0.00}
                                                disabled
                                                max={this.props.totalAmount}
                                                step={0.01}
                                            />
                                            )}
                                    </div>
                                </FormItem>
                            }
                            {option === '通过' && recordData.state === 'pending_audit'
                                &&
                                <FormItem>
                                    <div>
                                        <span className="order-modal-label">
                                            退款金额:
                                        </span>
                                        {getFieldDecorator('inputNumber', {
                                            initialValue: recordData.amount
                                        })(
                                            <InputNumber
                                                min={0.00}
                                                max={recordData.amount}
                                                step={0.01}
                                            />
                                            )}
                                    </div>
                                </FormItem>}
                            {
                                option === '不通过'
                                && <FormItem>
                                    <div>
                                        <span className="order-modal-label">
                                            <span style={{ color: '#f00' }}>*</span>
                                            不通过原因:
                                        </span>
                                        {getFieldDecorator('causeTextArea', {
                                            rules: [{
                                                required: true,
                                                message: '请填写取消原因!',
                                                whitespace: true
                                            }],
                                        })(
                                            <TextArea
                                                autosize={{ minRows: 5, maxRows: 6 }}
                                                style={{ resize: 'none' }}
                                            />
                                            )}
                                    </div>
                                </FormItem>
                            }
                        </Form>
                    </Modal>
                }
            </div>
        );
    }
}

RefundModal.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    fetchPaymentDetailInfo: PropTypes.arrayOf(PropTypes.any),
    recordData: PropTypes.arrayOf(PropTypes.any),
    payAuditModalVisible: PropTypes.bool,
    modifyCauseModalVisible: PropTypes.func,
    totalAmount: PropTypes.number
}

RefundModal.defaultProps = {
}

export default withRouter(Form.create()(RefundModal));
