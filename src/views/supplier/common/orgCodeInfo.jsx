/**
 * @file licenseInfo.jsx
 * @author shijh
 *
 * 组织机构代码证
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Form, Input, Select, Button, Modal, message } from 'antd';
import InlineUpload from '../../../components/inlineUpload';
import Common from './common';
import { Validator } from '../../../util/validator';
import { updateSupplierOrgCodeInfo  } from '../../../service'

const FormItem = Form.Item;

@Common
class OrgCodeInfo extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = ::this.handleSubmit;
    }

    handleSubmit() {
        const { validateFields, getFieldsValue } = this.props.form;
        const { detailData, initValue } = this.props;
        const orgCodeCerPic = this.orgCode.getValue()[0];
        validateFields((err, values) => {
            if (!err) {
                updateSupplierOrgCodeInfo({
                    ...values,
                    orgCodeCerPic,
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
                            <li className="add-message-item">
                                <span>组织机构代码：</span>
                                {getFieldDecorator('orgCode', {
                                    rules: [{ required: true, message: '请输入组织机构代码!' }],
                                    initialValue: initValue.orgCode
                                })(
                                    <Input placeholder="请输入组织机构代码" onBlur={(e) => { Validator.repeat.orgCode(e, this, initValue.id) }} />
                                )}
                            </li>
                        </FormItem>
                        <li className="add-message-item"><span>组织机构代码证电子版：</span>
                            <InlineUpload
                                datas={
                                    initValue.orgCodeCerPic
                                    ? [initValue.orgCodeCerPic]
                                    : []
                                }
                                ref={ref => { this.orgCode = ref }}
                            />
                        </li>
                        <FormItem className="add-message-button">
                            <Button type="primary" style={{marginRight: '20px'}} onClick={this.handleSubmit}>提交修改</Button>
                            <Button
                                onClick={this.props.handleCancel}
                            >取消</Button>
                        </FormItem>
                    </ul>
                    : <ul className="detail-message-list">
                        <li className="detail-message-item"><span>组织机构代码：</span><span>{initValue.orgCode}</span></li>
                        <li className="detail-message-item"><span>组织机构代码证电子版：</span><span><a target="_blank" href={initValue.orgCodeCerPic}>点击查看</a></span></li>
                    </ul>
                }
            </div>
        );
    }
}

OrgCodeInfo.propTypes = {
    initValue: PropTypes.objectOf(PropTypes.any),
    handleEditClick: PropTypes.func,
};

export default Form.create()(OrgCodeInfo);