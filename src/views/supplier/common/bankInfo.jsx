/**
 * @file basicInfo.jsx
 * @author shijh
 *
 * 银行信息
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Form, Input, Select, Button, Modal, message } from 'antd';
import InlineUpload from '../../../components/inlineUpload';
import CasadingAddress from '../../../components/ascadingAddress';
import { Validator } from '../../../util/validator';
import { updateSupplierBankInfo  } from '../../../service';
import Tools from '../../addSupplier/utils';
import Common from './common';

const FormItem = Form.Item;

@Common
class BankInfo extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = ::this.handleSubmit;
        this.handleBankLocChange = ::this.handleBankLocChange;
        this.handleLicenseChange = ::this.handleLicenseChange;

        this.address = {};
        this.img = [];
    }

    handleSubmit() {
        const { validateFields } = this.props.form;
        const { detailData, initValue } = this.props;
        Tools.checkAddress(this.address, 'bankLoc', this);
        validateFields((err, values) => {
            if (!err) {
                const { firstValue, secondValue, thirdValue } = this.address;
                const {
                    accountName,
                    bankAccount,
                    openBank
                } = values

                updateSupplierBankInfo({
                    accountName,
                    bankAccount,
                    openBank,
                    bankAccountLicense: this.img[0],
                    bankLocProvince: firstValue.regionName,
                    bankLocCity: secondValue.regionName,
                    bankLocCounty: thirdValue.regionName,
                    bankLocProvinceCode: firstValue.code,
                    bankLocCityCode: secondValue.code,
                    bankLocCountyCode: thirdValue.code,
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

    handleBankLocChange(data) {
        this.address = data;
    }

    handleLicenseChange(data) {
        this.img = data;
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
                                <li className="add-message-item"><span>*开户名：</span>
                                    <span>
                                        {getFieldDecorator('accountName', {
                                            rules: [{ required: true, message: '请输入开户名!' }],
                                            initialValue: initValue.accountName
                                        })(
                                            <Input placeholder="开户名" />
                                        )}
                                    </span>
                                </li>
                            </FormItem>
                            <FormItem>
                                <li className="add-message-item"><span>*开户行：</span>
                                    <span>
                                        {getFieldDecorator('openBank', {
                                            rules: [{ required: true, message: '请填入开户行!' }],
                                            initialValue: initValue.openBank
                                        })(
                                            <Input placeholder="开户行" />
                                        )}
                                    </span>
                                </li>
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('bankLoc', {
                                })(
                                    <li className="add-message-item"><span>*开户行所在地：</span>
                                        <span>
                                            <CasadingAddress
                                                id="bank"
                                                showNum="3"
                                                defaultValue={[
                                                    initValue.bankLocProvinceCode,
                                                    initValue.bankLocCityCode,
                                                    initValue.bankLocCountyCode
                                                ]}
                                                onChange={this.handleBankLocChange}
                                            />
                                        </span>
                                    </li>
                                )}
                            </FormItem>
                            <FormItem>
                                <li className="add-message-item">
                                    <span>*银行账号：</span>
                                    {getFieldDecorator('bankAccount', {
                                        rules: [{ required: true, message: '请输入银行账户!' }],
                                        initialValue: initValue.bankAccount
                                    })(
                                        <Input placeholder="银行账号" onBlur={(e) => { Validator.repeat.bankAccount(e, this, initValue.id) }} />
                                    )}
                                </li>
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('bankAccountLicense', {
                                })(
                                    <li className="add-message-item"><span>*银行开户许可证电子版：</span>
                                        <InlineUpload
                                            datas={
                                                initValue.bankAccountLicense
                                                ? [initValue.bankAccountLicense]
                                                : []
                                            }
                                            onChange={this.handleLicenseChange}
                                        />
                                    </li>
                                )}
                            </FormItem>
                            <FormItem className="add-message-button">
                                <Button type="primary" style={{marginRight: '20px'}} onClick={this.handleSubmit}>提交修改</Button>
                                <Button
                                    onClick={this.props.handleCancel}
                                >取消</Button>
                            </FormItem>
                        </ul>
                        : <ul className="detail-message-list">
                            <li className="detail-message-item"><span>开户名：</span><span>{initValue.accountName}</span></li>
                            <li className="detail-message-item"><span>开户行：</span><span>{initValue.openBank}</span></li>
                            <li className="detail-message-item"><span>开户行所在地：</span>
                                <span>
                                    {initValue.bankLocProvince}
                                    {initValue.bankLocCity}
                                    {initValue.bankLocCounty}
                                </span>
                            </li>
                            <li className="detail-message-item"><span>银行账号：</span><span>{initValue.bankAccount}</span></li>
                            <li className="detail-message-item"><span>银行开户许可证电子版：</span><span><a target="_blank" href={initValue.bankAccountLicense}>点击查看</a></span></li>
                        </ul>
                }
            </div>
        );
    }
}

BankInfo.propTypes = {
    initValue: PropTypes.objectOf(PropTypes.any),
    edit: PropTypes.bool,
    form: PropTypes.objectOf(PropTypes.any),
    detailData: PropTypes.objectOf(PropTypes.any),
    handleCancel: PropTypes.func,
};

export default Form.create()(BankInfo);
