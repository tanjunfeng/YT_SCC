/**
 * @file emerContInfo.jsx
 * @author shijh
 *
 * 供应商紧急联系人
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Form, Input, Button, Modal, message } from 'antd';
import InlineUpload from '../../../components/inlineUpload';
import CasadingAddress from '../../../components/ascadingAddress';
import Common from './common';
import { Validator } from '../../../util/validator';
import { editSupplierSettledContApproval  } from '../../../service'

const FormItem = Form.Item;

@Common
class SettledContInfo extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = ::this.handleSubmit;
    }

    handleSubmit() {
        const { validateFields, getFieldsValue } = this.props.form;
        const { detailData, initValue } = this.props;
        validateFields((err, values) => {
            if(!err) {
                editSupplierSettledContApproval({
                    ...values,
                    id: initValue.id,
                    spId: detailData.id,
                    status: initValue.status
                }).then((res) => {
                    this.props.handleCancel(true);
                    message.success('修改成功，等待审核!');
                })
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { initValue = {}, isEdit, onChange } = this.props;
        return (
            <div className="detail-message-body">
                {
                    this.props.edit ?
                    <ul className="add-message-list">
                        <FormItem>
                            <li className="add-message-item"><span>*姓名：</span><span>
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: '请输入姓名!' }],
                                    initialValue: initValue.name
                                })(
                                    <Input placeholder="请输入姓名" />
                                )}
                            </span></li>
                        </FormItem>
                        <FormItem>
                            <li className="add-message-item">
                                <span>*手机：</span>
                                <span>
                                    {getFieldDecorator('phone', {
                                        rules: [{ required: true, message: '请输入手机号!' }],
                                        initialValue: initValue.phone
                                    })(
                                        <Input placeholder="请输入手机号" onBlur={(e) => { Validator.repeat.phone(e, this, initValue.id) }} />
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
                                        initialValue: initValue.email
                                    })(
                                        <Input placeholder="请输入邮箱" onBlur={(e) => { Validator.repeat.emial(e, this, initValue.id) }} />
                                    )}
                                </span>
                            </li>
                        </FormItem>
                        <FormItem className="add-message-button">
                            <Button type="primary" style={{marginRight: '20px'}} onClick={this.handleSubmit}>提交修改</Button>
                            <Button
                                onClick={this.props.handleCancel}
                            >取消</Button>
                        </FormItem>
                    </ul>
                    : <ul className="detail-message-list">
                        <li className="detail-message-item"><span>姓名：</span><span>{initValue.name}</span></li>
                        <li className="detail-message-item"><span>手机：</span><span>{initValue.phone}</span></li>
                        <li className="detail-message-item"><span>邮箱：</span><span>{initValue.email}</span></li>
                    </ul>
                }
            </div>
        );
    }
}

SettledContInfo.propTypes = {
    // initValue: PropTypes.objectOf(PropTypes.any),
};

export default Form.create()(SettledContInfo);