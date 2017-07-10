import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Icon, Form, Input, Select, Button, Modal, message } from 'antd';
import moment from 'moment';
import Common from './common';
import { editSupplierCooperationApproval  } from '../../../service'

const FormItem = Form.Item;
const Option = Select.Option;

@Common
class Cooperative extends PureComponent {
    constructor(props) {
        super(props);

        this.handleSubmit = ::this.handleSubmit;
    }

    handleSubmit() {
        const { validateFields } = this.props.form;
        const { detailData } = this.props;
        validateFields((err, values) => {
            if (!err) {
                editSupplierCooperationApproval({
                    ...values,
                    id: detailData.supplierCooperationInfo.id
                }).then(() => {
                    this.props.handleCancel();
                    this.props.getDtail();
                    message.success('修改成功');
                })
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { detailData = {} } = this.props;
        const { supplierCooperationInfo = {} } = detailData;

        return (
            <div className="detail-message-body">
                {
                    this.props.edit
                    ? <Form className="change-form">
                        <span className="detail-message-item">
                            <span>入驻时间：</span>
                            <span>{moment(supplierCooperationInfo.settledRequestTime).format('YYYY-MM-DD')}</span>
                        </span>
                        <FormItem className="manage-form-item">
                            <span className="manage-form-label change-form-label">*结算账期</span>
                            {getFieldDecorator('settlementPeriod', {
                                rules: [{
                                    required: true,
                                    message: '请输入结算账期'
                                }],
                                initialValue: supplierCooperationInfo.settlementPeriod
                            })(
                                <Input
                                    className="manage-form-input"
                                    placeholder="结算账期"
                                />
                            )}
                            <span className="change-form-tip">天</span>
                        </FormItem>
                        <FormItem className="manage-form-item">
                            <span className="manage-form-label change-form-label">*结算账户</span>
                            {getFieldDecorator('settlementAccountType', {
                                rules: [{
                                    required: true,
                                    message: '请选择结算账户'
                                }],
                                initialValue: String(supplierCooperationInfo.settlementAccountType)
                            })(
                                <Select
                                    style={{ width: '153px' }}
                                    size="default"
                                    placeholder="请选择"
                                >
                                    <Option key="0" value="0">商户雅堂金融账户</Option>
                                    <Option key="1" value="1">商户公司银行账户</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem className="manage-form-item">
                            <span className="manage-form-label change-form-label">*返利</span>
                            {getFieldDecorator('rebateRate', {
                                rules: [{
                                    required: true,
                                    message: '请输入返利'
                                }],
                                initialValue: supplierCooperationInfo.rebateRate
                            })(
                                <Input
                                    className="manage-form-input"
                                    placeholder="返利"
                                />
                            )}
                            <span className="change-form-tip">%</span>
                        </FormItem>
                        <FormItem className="manage-form-item">
                            <span className="manage-form-label change-form-label">*保证金金额</span>
                            {getFieldDecorator('guaranteeMoney', {
                                rules: [{ required: true, message: '请输入保证金金额' }],
                                initialValue: supplierCooperationInfo.guaranteeMoney
                            })(
                                <Input
                                    className="manage-form-input"
                                    placeholder="保证金金额"
                                />
                            )}
                            <span className="change-form-tip">元（例：5000.00）</span>
                        </FormItem>
                        <FormItem className="add-message-button">
                            <Button
                                type="primary"
                                style={{ marginRight: '20px' }}
                                onClick={this.handleSubmit}
                            >
                                提交修改
                            </Button>
                            <Button
                                onClick={this.props.handleCancel}
                            >
                                取消
                            </Button>
                        </FormItem>
                    </Form>
                    : <ul className="detail-message-list">
                        <li className="detail-message-item">
                            <span>入驻时间：</span>
                            <span>{moment(supplierCooperationInfo.settledRequestTime).format('YYYY-MM-DD')}</span>
                        </li>
                        <li className="detail-message-item">
                            <span>结算账期：</span>
                            <span>{supplierCooperationInfo.settlementPeriod} 天</span>
                        </li>
                        <li className="detail-message-item">
                            <span>结算账户：</span>
                            <span>
                                {
                                    supplierCooperationInfo.settlementAccountType
                                    ? '商户公司银行账户'
                                    : '商户雅堂金融账户'
                                }
                            </span>
                        </li>
                        <li className="detail-message-item">
                            <span>返利（%）：</span>
                            <span>{supplierCooperationInfo.rebateRate}</span>
                        </li>
                        <li className="detail-message-item">
                            <span>保证金余额：</span>
                            <span>{supplierCooperationInfo.guaranteeMoney}</span>
                        </li>
                    </ul>
                }
            </div>
        )
    }
}

Cooperative.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    detailData: PropTypes.objectOf(PropTypes.any),
    handleCancel: PropTypes.func,
    getDtail: PropTypes.func,
    edit: PropTypes.bool,
}

Cooperative.defaultProps = {
}

export default withRouter(Form.create()(Cooperative));
