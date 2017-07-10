import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, Form, Input, Button } from 'antd';

import { Validator } from '../../util/validator';
import { insertSupplierInfo } from '../../actions/addSupplier';

const FormItem = Form.Item;

@connect(
    state => ({
        data: state.toJS().addSupplier.data
    }),
    dispatch => bindActionCreators({
        insertSupplierInfo
    }, dispatch)
)
class Contact extends PureComponent {
    constructor(props) {
        super(props);

        this.handleSubmit = ::this.handleSubmit;
        this.handlePreStep = ::this.handlePreStep;

        this.submitData = {
            supplierEmerContInfo: {},
            supplierSettledContInfo: {}
        }
    }

    handleSubmit() {
        const { form, detailData, isEdit } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                const { companyPhoneNumber, email, name, phone, sname, sphone } = values;
                this.submitData.supplierEmerContInfo = {
                    name: sname,
                    phone: sphone,
                    companyPhoneNumber
                }
                this.submitData.supplierSettledContInfo = {
                    name,
                    phone,
                    email
                }
                const { data } = this.props;
                if (isEdit) {
                    Object.assign(
                        this.submitData.supplierEmerContInfo,
                        {id: detailData.supplierEmerContInfo.id}
                    )
                    Object.assign(
                        this.submitData.supplierSettledContInfo,
                        {id: detailData.supplierSettledContInfo.id}
                    )
                }
                this.props.insertSupplierInfo({...data, ...this.submitData}).then(() => {
                    this.props.history.replace('/applicationList')
                })
            }
        })
    }

    handlePreStep() {
        this.props.onGoTo('2')
    }

    render() {
        const { getFieldDecorator, } = this.props.form;
        const { detailData = {}, isEdit } = this.props;
        let initData = detailData;
        if (!isEdit) {
            initData = {};
        }
        const {
            supplierEmerContInfo = {},
            supplierSettledContInfo = {}
        } = initData;
        return (
            <div className="supplier-add-message">
                <Form>
                    <div className="supplier-add-item">
                        <div className="add-message">
                            <div className="add-message-header">
                                <Icon type="solution" className="add-message-header-icon" />供应商紧急联系人
                            </div>
                            <div className="add-message-body">
                                <ul className="add-message-list">
                                    <FormItem>
                                        <li className="add-message-item">
                                            <span>*姓名：</span>
                                            <span>
                                                {getFieldDecorator('sname', {
                                                    rules: [{ required: true, message: '请输入姓名!' }],
                                                    initialValue: supplierEmerContInfo.name
                                                })(
                                                    <Input placeholder="请输入姓名" />
                                                )}
                                            </span>
                                        </li>
                                    </FormItem>
                                    <FormItem>
                                        <li className="add-message-item">
                                            <span>*手机：</span>
                                            <span>
                                                {getFieldDecorator('sphone', {
                                                    rules: [{ required: true, message: '请输入手机号!' }],
                                                    initialValue: supplierEmerContInfo.phone
                                                })(
                                                    <Input
                                                        placeholder="请输入手机号"
                                                        onBlur={(e) => { Validator.repeat.supplierPhone(e, this, supplierEmerContInfo.id) }}
                                                    />
                                                )}
                                            </span>
                                        </li>
                                    </FormItem>
                                    <FormItem>
                                        <li className="add-message-item">
                                            <span>*公司电话：</span>
                                            <span>
                                                {getFieldDecorator('companyPhoneNumber', {
                                                    rules: [{ required: true, message: '请输入公司电话!' }],
                                                    initialValue: supplierEmerContInfo.companyPhoneNumber
                                                })(
                                                    <Input
                                                        placeholder="请输入公司电话"
                                                        onBlur={(e) => { Validator.repeat.companyPhoneNumber(e, this, supplierEmerContInfo.id) }}
                                                    />
                                                )}
                                            </span>
                                        </li>
                                    </FormItem>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="supplier-add-item">
                        <div className="add-message-header">
                            <Icon type="solution" className="add-message-header-icon" />招商入驻联系人
                        </div>
                        <div className="add-message-body">
                            <ul className="add-message-list">
                                <FormItem>
                                    <li className="add-message-item">
                                        <span>*姓名：</span>
                                        <span>
                                            {getFieldDecorator('name', {
                                                rules: [{ required: true, message: '请输入姓名!' }],
                                                initialValue: supplierSettledContInfo.name
                                            })(
                                                <Input placeholder="请输入姓名" />
                                            )}
                                        </span>
                                    </li>
                                </FormItem>
                                <FormItem>
                                    <li className="add-message-item">
                                        <span>*手机：</span>
                                        <span>
                                            {getFieldDecorator('phone', {
                                                rules: [{ required: true, message: '请输入手机号!' }],
                                                initialValue: supplierSettledContInfo.phone
                                            })(
                                                <Input placeholder="请输入手机号" onBlur={(e) => { Validator.repeat.phone(e, this, supplierSettledContInfo.id) }} />
                                            )}
                                        </span>
                                    </li>
                                </FormItem>
                                <FormItem>
                                    <li className="add-message-item">
                                        <span>*邮箱：</span>
                                        <span>
                                            {getFieldDecorator('email', {
                                                rules: [{ required: true, message: '请输入邮箱!' }],
                                                initialValue: supplierSettledContInfo.email
                                            })(
                                                <Input placeholder="请输入邮箱" onBlur={(e) => { Validator.repeat.emial(e, this, supplierSettledContInfo.id) }} />
                                            )}
                                        </span>
                                    </li>
                                </FormItem>
                            </ul>
                        </div>
                    </div>
                    <div className="add-message-handle">
                        <Button onClick={this.handlePreStep} className="add-message-pre">上一步</Button>
                        <Button onClick={this.handleSubmit}>提交入驻信息</Button>
                    </div>
                </Form>
            </div>
        )
    }
}

Contact.propTypes = {
    isEdit: PropTypes.bool,
    insertSupplierInfo: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    detailData: PropTypes.objectOf(PropTypes.any),
    data: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
    onGoTo: PropTypes.func,
}

Contact.defaultProps = {
}

export default withRouter(Form.create()(Contact));
