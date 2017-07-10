import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Modal, Form, Select, Input } from 'antd';

import { modifyInformationVisible, modifySupplierCooperationInfo } from '../../../actions';
import { validatorRebate } from '../../../util/validator';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({
        informationVisible: state.toJS().supplier.informationVisible,
        visibleData: state.toJS().supplier.visibleData
    }),
    dispatch => bindActionCreators({
        modifyInformationVisible,
        modifySupplierCooperationInfo
    }, dispatch)
)
class ChangeMessage extends PureComponent {
    constructor(props) {
        super(props);
        this.handleInformationOk = ::this.handleInformationOk;
        this.handleInformationCancel = ::this.handleInformationCancel;
    }

    handleInformationCancel() {
        this.props.modifyInformationVisible({isVisible: false});
    }

    handleInformationOk() {
        this.props.form.validateFields((err) => {
            if (!err) {
                const { supplierCooperationId } = this.props.visibleData;
                const result = this.props.form.getFieldsValue();
                this.props.modifySupplierCooperationInfo({
                    id: supplierCooperationId,
                    ...result
                }).then(() => {
                    this.props.getList()
                })
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {
            settlementPeriod,
            settlementAccountType,
            rebateRate,
            guaranteeMoney
        } = this.props.visibleData;
        return (
            <Modal
                title="修改合作信息"
                visible={this.props.informationVisible}
                onOk={this.handleInformationOk}
                onCancel={this.handleInformationCancel}
                width="410px"
            >
                <Form className="change-form">
                    <FormItem className="manage-form-item">
                        <span className="manage-form-label change-form-label">*结算账期</span>
                        {getFieldDecorator('settlementPeriod', {
                            rules: [{
                                required: true,
                                message: '请输入结算账期'
                            }],
                            initialValue: settlementPeriod
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
                            initialValue: String(settlementAccountType)
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
                            }, {
                                validator: validatorRebate
                            }],
                            initialValue: rebateRate
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
                            initialValue: guaranteeMoney
                        })(
                            <Input
                                className="manage-form-input"
                                placeholder="保证金金额"
                            />
                        )}
                        <span className="change-form-tip">元（例：5000.00）</span>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

ChangeMessage.propTypes = {
    modifyInformationVisible: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    visibleData: PropTypes.objectOf(PropTypes.any),
    modifySupplierCooperationInfo: PropTypes.func,
    informationVisible: PropTypes.bool,
    getList: PropTypes.func,
}

export default withRouter(Form.create()(ChangeMessage));
