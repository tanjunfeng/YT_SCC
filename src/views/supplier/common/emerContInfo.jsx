/**
 * @file emerContInfo.jsx
 * @author shijh
 *
 * 供应商紧急联系人
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, message } from 'antd';
import Common from './common';
import { Validator } from '../../../util/validator';
import { editSupplierEmerContApproval } from '../../../service';

const FormItem = Form.Item;

@Common
class EmerContInfo extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = ::this.handleSubmit;
    }

    handleSubmit() {
        const { validateFields } = this.props.form;
        const { detailData, initValue } = this.props;
        validateFields((err, values) => {
            if (!err) {
                editSupplierEmerContApproval({
                    ...values,
                    id: initValue.id,
                    spId: detailData.id,
                    status: initValue.status
                }).then(() => {
                    this.props.handleCancel(true);
                    message.success('修改成功，等待审核!');
                })
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { initValue = {} } = this.props;
        return (
            <div className="detail-message-body">
                {
                    this.props.edit ?
                        <ul className="add-message-list">
                            <FormItem>
                                <li className="add-message-item"><span>*姓名：</span>
                                    <span>
                                        {getFieldDecorator('sname', {
                                            rules: [{ required: true, message: '请输入姓名!' }],
                                            initialValue: initValue.name
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
                                            initialValue: initValue.phone
                                        })(
                                            <Input placeholder="请输入手机号" onBlur={(e) => { Validator.repeat.supplierPhone(e, this, initValue.id) }} />
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
                                            initialValue: initValue.companyPhoneNumber
                                        })(
                                            <Input placeholder="请输入公司电话" onBlur={(e) => { Validator.repeat.companyPhoneNumber(e, this, initValue.id) }} />
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
                            <li className="detail-message-item"><span>公司电话：</span><span>{initValue.companyPhoneNumber}</span></li>
                            <li className="detail-message-item"><span>手机：</span><span>{initValue.phone}</span></li>
                        </ul>
                }
            </div>
        );
    }
}

EmerContInfo.propTypes = {
    initValue: PropTypes.objectOf(PropTypes.any),
    edit: PropTypes.bool,
    form: PropTypes.objectOf(PropTypes.any),
    detailData: PropTypes.objectOf(PropTypes.any),
    handleCancel: PropTypes.func,
};

export default Form.create()(EmerContInfo);
