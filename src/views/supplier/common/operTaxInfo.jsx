/**
 * @file operTaxInfo.jsx
 * @author shijh
 *
 * 公司经营及税务信息
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select, Button, message } from 'antd';
import InlineUpload from '../../../components/inlineUpload';
import CasadingAddress from '../../../components/ascadingAddress';
import { Validator } from '../../../util/validator';
import Tools from '../../addSupplier/utils';
import { updateSupplierOperTaxInfo } from '../../../service';
import Common from './common';

const FormItem = Form.Item;

@Common
class OperTaxInfo extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = ::this.handleSubmit;
        this.handleCompanyAddressChange = ::this.handleCompanyAddressChange;
        this.address = {};
    }

    handleSubmit() {
        const { validateFields, getFieldsValue } = this.props.form;
        const { detailData, initValue } = this.props;
        Tools.checkAddress(this.address, 'bankLoc', this);
        validateFields((err, values) => {
            if (!err) {
                const { firstValue, secondValue, thirdValue } = this.address;
                const {
                    taxpayerNumber,
                    taxpayerType,
                    companyDetailAddress
                } = values
                const registrationCertificate = this.certificate.getValue()[0];
                const qualityIdentification = this.quality.getValue()[0];
                const taxRegCertificate = this.taxReg.getValue()[0];
                const generalTaxpayerQualifiCerti = this.qualifiCerti.getValue()[0];
                updateSupplierOperTaxInfo({
                    companyDetailAddress,
                    taxpayerNumber,
                    taxpayerType,
                    taxRegCertificate,
                    registrationCertificate,
                    qualityIdentification,
                    generalTaxpayerQualifiCerti,
                    companyLocProvince: firstValue.regionName,
                    companyLocCity: secondValue.regionName,
                    companyLocCounty: thirdValue.regionName,
                    companyLocProvinceCode: firstValue.code,
                    companyLocCityCode: secondValue.code,
                    companyLocCountyCode: thirdValue.code,
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

    handleCompanyAddressChange(data) {
        this.address = data;
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
                                {getFieldDecorator('companyAddress', {
                                })(
                                    <li className="add-message-item"><span>公司所在地：</span>
                                        <span>
                                            <CasadingAddress
                                                id="space"
                                                showNum="3"
                                                defaultValue={[
                                                    initValue.companyLocProvinceCode,
                                                    initValue.companyLocCityCode,
                                                    initValue.companyLocCountyCode
                                                ]}
                                                onChange={this.handleCompanyAddressChange}
                                            />
                                        </span>
                                    </li>
                                )}
                            </FormItem>
                            <FormItem>
                                <li className="add-message-item">
                                    <span>*公司详细地址：</span>
                                    <span>
                                        {getFieldDecorator('companyDetailAddress', {
                                            rules: [{ required: true, message: '请输入公司详细地址!' }],
                                            initialValue: initValue.companyDetailAddress
                                        })(
                                            <Input placeholder="公司详细地址" />
                                        )}
                                    </span>
                                </li>
                            </FormItem>
                            <li className="add-message-item"><span>商标注册证/受理通知书：</span>
                                <InlineUpload
                                    datas={
                                        initValue.registrationCertificate
                                        ? [initValue.registrationCertificate]
                                        : []
                                    }
                                    ref={ref => { this.certificate = ref }}
                                />
                            </li>
                            <li className="add-message-item"><span>食品安全许可证：</span>
                                <InlineUpload
                                    datas={
                                        initValue.qualityIdentification
                                        ? [initValue.qualityIdentification]
                                        : []
                                    }
                                    ref={ref => { this.quality = ref }}
                                />
                            </li>
                            <FormItem>
                                <li className="add-message-item">
                                    <span>*纳税人识别号：</span>
                                    <span>
                                        {getFieldDecorator('taxpayerNumber', {
                                            rules: [{ required: true, message: '请输入纳税人识别号!' }],
                                            initialValue: initValue.taxpayerNumber
                                        })(
                                            <Input placeholder="纳税人识别号" onBlur={(e) => { Validator.repeat.taxpayerNumber(e, this, initValue.id) }} />
                                        )}
                                    </span>
                                </li>
                            </FormItem>
                            <FormItem>
                                <li className="add-message-item"><span>*纳税人类型：</span>
                                    {getFieldDecorator('taxpayerType', {
                                        initialValue: String(initValue.taxpayerType)
                                    })(
                                        <Select
                                            style={{ width: 140 }}
                                            placeholder="请选择纳税人类型"
                                        >
                                            <Option value="0">一般纳税人</Option>
                                            <Option value="1">小规模纳税人</Option>
                                        </Select>
                                    )}
                                </li>
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('taxRegCertificate', {
                                })(
                                    <li className="add-message-item"><span>*税务登记证电子版：</span>
                                        <InlineUpload
                                            datas={
                                                initValue.taxRegCertificate
                                                ? [initValue.taxRegCertificate]
                                                : []
                                            }
                                            ref={ref => { this.taxReg = ref }}
                                        />
                                    </li>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('generalTaxpayerQualifiCerti', {
                                })(
                                    <li className="add-message-item"><span>一般纳税人资格证电子版：</span>
                                        <InlineUpload
                                            datas={
                                                initValue.generalTaxpayerQualifiCerti
                                                ? [initValue.generalTaxpayerQualifiCerti]
                                                : []
                                            }
                                            ref={ref => { this.qualifiCerti = ref }}
                                        />
                                    </li>
                                )}
                            </FormItem>
                            <FormItem className="add-message-button">
                                <Button type="primary" style={{ marginRight: '20px' }} onClick={this.handleSubmit}>提交修改</Button>
                                <Button
                                    onClick={this.props.handleCancel}
                                >取消</Button>
                            </FormItem>
                        </ul>
                        : <ul className="detail-message-list">
                            <li className="detail-message-item"><span>公司所在地：</span>
                                <span>{initValue.companyLocProvince}{initValue.companyLocCity}{initValue.companyLocCounty}</span>
                            </li>
                            <li className="detail-message-item"><span>公司详细地址：</span><span>{initValue.companyDetailAddress}</span></li>
                            <li className="detail-message-item"><span>商标注册证/受理通知书：</span><span><a target="_blank" href={initValue.registrationCertificate}>点击查看</a></span></li>
                            <li className="detail-message-item"><span>食品安全许可证：</span><span><a target="_blank" href={initValue.qualityIdentification}>点击查看</a></span></li>
                            <li className="detail-message-item"><span>纳税人识别号：</span><span>{initValue.taxpayerNumber}</span></li>
                            <li className="detail-message-item"><span>纳税人类型：</span>
                                <span>{initValue.taxpayerType === 0 ? '一般纳税人' : '小规模纳税人'}</span>
                            </li>
                            <li className="detail-message-item"><span>税务登记证电子版：</span><span><a target="_blank" href={initValue.taxRegCertificate}>点击查看</a></span></li>
                            <li className="detail-message-item"><span>一般纳税人资格证电子版：</span><span><a target="_blank" href={initValue.generalTaxpayerQualifiCerti}>点击查看</a></span></li>
                        </ul>
                }
            </div>
        );
    }
}

OperTaxInfo.propTypes = {
    initValue: PropTypes.objectOf(PropTypes.any),
    handleEditClick: PropTypes.func,
    edit: PropTypes.bool,
};

export default Form.create()(OperTaxInfo);