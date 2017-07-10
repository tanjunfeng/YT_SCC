import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
    Form,
    Input,
    Select,
    Modal,
    message
} from 'antd';

import { modifyAuditVisible } from '../../../actions';
import { validatorRebate } from '../../../util/validator';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({
        auditVisible: state.toJS().supplier.auditVisible
    }),
    dispatch => bindActionCreators({
        modifyAuditVisible
    }, dispatch)
)
class ChangeAudit extends PureComponent {
    constructor(props) {
        super(props);

        this.handleAuditCancel = ::this.handleAuditCancel;
        this.handleAuditOk = ::this.handleAuditOk;
        this.handleSelectChange = ::this.handleSelectChange;
    }

    state = {
        selected: -1
    }

    handleAuditCancel() {
        this.props.modifyAuditVisible({isVisible: false});
    }

    handleAuditOk() {
        const { selected } = this.state;
        if (selected === -1) {
            message.error('请选择审核结果');
            return;
        }
        this.props.form.validateFields((err) => {
            if (!err) {
                this.props.modifyAuditVisible({isVisible: false});
            }
        })
    }

    handleSelectChange(key) {
        this.setState({
            selected: key
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Modal
                title="商家入住审核"
                visible={this.props.auditVisible}
                onOk={this.handleAuditOk}
                onCancel={this.handleAuditCancel}
            >
                <div>
                    <div className="application-modal-tip">注意：审核通过，供应商的所有账号可正常登录商家后台系统。</div>
                    {
                        this.props.auditVisible &&
                        <div className="application-modal-select">
                            <span className="application-modal-label">审核：</span>
                            <Select
                                style={{ width: '153px', marginLeft: '15px' }}
                                size="default"
                                placeholder="请选择"
                                onChange={this.handleSelectChange}
                            >
                                <Option value="2">通过</Option>
                                <Option value="1">不通过</Option>
                            </Select>
                        </div>
                    }
                    {
                        this.props.auditVisible && this.state.selected === '1' &&
                        <Form layout="inline">
                            <FormItem className="application-form-item">
                                <span className="application-modal-label">*不通过原因：</span>
                                {getFieldDecorator('companyName', {
                                    rules: [{required: true, message: '请输入不通过原因', whitespace: true}]
                                })(
                                    <Input
                                        onChange={this.handleTextChange}
                                        type="textarea"
                                        placeholder="请输入不通过原因"
                                        className="application-modal-textarea"
                                        autosize={{ minRows: 2, maxRows: 8 }}
                                    />
                                )}
                            </FormItem>
                        </Form>
                    }
                    {
                        this.props.auditVisible && this.state.selected === '2' &&
                        <Form className="change-form">
                            <FormItem className="manage-form-item">
                                <span className="manage-form-label change-form-label">*结算账期：</span>
                                {getFieldDecorator('inputBalance', {
                                    rules: [{
                                        required: true,
                                        message: '请输入结算账期'
                                    }]
                                })(
                                    <Input
                                        className="manage-form-input"
                                        placeholder="结算账期"
                                    />
                                )}
                                <span className="change-form-tip">天</span>
                            </FormItem>
                            <FormItem className="manage-form-item">
                                <span className="manage-form-label change-form-label">*结算账户：</span>
                                {getFieldDecorator('inputBalanceType', {
                                    rules: [{
                                        required: true,
                                        message: '请选择结算账户'
                                    }]
                                })(
                                    <Select
                                        style={{ width: '153px' }}
                                        size="default"
                                        placeholder="请选择"
                                    >
                                        <Option value="商户雅堂金融账户">商户雅堂金融账户</Option>
                                        <Option value="商户公司银行账户">商户公司银行账户</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem className="manage-form-item">
                                <span className="manage-form-label change-form-label">*返利：</span>
                                {getFieldDecorator('inputRebate', {
                                    rules: [{
                                        required: true,
                                        message: '请输入返利'
                                    }, {
                                        validator: validatorRebate
                                    }]
                                })(
                                    <Input
                                        className="manage-form-input"
                                        placeholder="返利"
                                    />
                                )}
                                <span className="change-form-tip">%</span>
                            </FormItem>
                            <FormItem className="manage-form-item">
                                <span className="manage-form-label change-form-label">*保证金金额：</span>
                                {getFieldDecorator('inputBail', {
                                    rules: [{ required: true, message: '请输入保证金金额' }]
                                })(
                                    <Input
                                        className="manage-form-input"
                                        placeholder="保证金金额"
                                    />
                                )}
                                <span className="change-form-tip">元（例：5000.00）</span>
                            </FormItem>
                        </Form>
                    }
                </div>
            </Modal>
        );
    }
}

ChangeAudit.propTypes = {
    modifyAuditVisible: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    auditVisible: PropTypes.bool
}

export default withRouter(Form.create()(ChangeAudit));
