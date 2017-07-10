/**
 * @file licenseInfo.jsx
 * @author shijh
 *
 * 公司营业执照信息(副本)
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, DatePicker, Checkbox, message } from 'antd';
import moment from 'moment';
import InlineUpload from '../../../components/inlineUpload';
import CasadingAddress from '../../../components/ascadingAddress';
import Common from './common';
import Tools from '../../addSupplier/utils';
import { Validator } from '../../../util/validator';
import { updateSupplierLicenseInfo } from '../../../service'

const FormItem = Form.Item;
const { RangePicker } = DatePicker
const dateFormat = 'YYYY-MM-DD';
const dateType = 'YYYY年MM月DD日';

@Common
class LicenseInfo extends Component {
    constructor(props) {
        super(props);
        this.handleDatePickerChange = ::this.handleDatePickerChange;
        this.handleRangePickerChange = ::this.handleRangePickerChange;
        this.handleCompanyAddressChange = ::this.handleCompanyAddressChange;
        this.handleSubmit = ::this.handleSubmit;
        this.handleLicenceChanage = ::this.handleLicenceChanage;
        this.handleLegalChange = ::this.handleLegalChange;

        const { initValue } = props;
        this.state = {
            checked: !!initValue.perpetualManagement,
            establishDate: moment(new Date(initValue.establishDate), dateFormat),
            useDate: [
                moment(new Date(initValue.startDate), dateFormat),
                moment(new Date(initValue.endDate), dateFormat)
            ]
        }
        this.licenseImg = [];
        this.legalImg = [];
    }

    handleDatePickerChange(data) {
        this.setState({
            establishDate: data
        })
    }

    handleRangePickerChange(data) {
        this.setState({
            useDate: data
        })
    }

    handleSubmit() {
        const { validateFields } = this.props.form;
        const { detailData, initValue } = this.props;
        Tools.checkAddress(this.licenseLoc, 'bankLoc', this);
        validateFields((err, values) => {
            if (!err) {
                const { firstValue, secondValue, thirdValue } = this.licenseLoc;
                const { useDate, establishDate, checked } = this.state;
                const {
                    businessScope,
                    companyName,
                    legalRepreCardNum,
                    legalRepresentative,
                    licenseAddress,
                    registLicenceNumber,
                    registeredCapital
                } = values
                updateSupplierLicenseInfo({
                    businessScope,
                    companyName,
                    legalRepreCardNum,
                    legalRepresentative,
                    licenseAddress,
                    registLicenceNumber,
                    registeredCapital,
                    perpetualManagement: checked ? 1 : 0,
                    establishDate: establishDate.format('x'),
                    startDate: useDate[0].format('x'),
                    endDate: useDate[1].format('x'),
                    legalRepreCardPic1: this.legalImg[0],
                    legalRepreCardPic2: this.legalImg[1],
                    registLicencePic: this.licenseImg[0],
                    licenseLocProvince: firstValue.regionName,
                    licenseLocCity: secondValue.regionName,
                    licenseLocCounty: thirdValue.regionName,
                    licenseLocProvinceCode: firstValue.code,
                    licenseLocCityCode: secondValue.code,
                    licenseLocCountyCode: thirdValue.code,
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

    handleCompanyAddressChange(data) {
        this.licenseLoc = data;
    }

    handleLicenceChanage(data) {
        this.licenseImg = data;
    }

    handleLegalChange(data) {
        this.legalImg = data;
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
                                <li className="add-message-item"><span>公司名称：</span>
                                    <span>
                                        {getFieldDecorator('companyName', {
                                            rules: [{ required: true, message: '请输入公司名!' }],
                                            initialValue: initValue.companyName
                                        })(
                                            <Input placeholder="请输入公司名" />
                                        )}
                                    </span>
                                </li>
                            </FormItem>
                            <FormItem>
                                <li className="add-message-item">
                                    <span>注册号(营业执照号)：</span>
                                    <span>
                                        {getFieldDecorator('registLicenceNumber', {
                                            rules: [{ required: true, message: '请输入营业执照号!' }],
                                            initialValue: initValue.registLicenceNumber
                                        })(
                                            <Input placeholder="请输入营业执照号" onBlur={(e) => { Validator.repeat.registLicenceNumber(e, this, initValue.id) }} />
                                        )}
                                    </span>
                                </li>
                            </FormItem>
                            <FormItem>
                                <li className="add-message-item"><span>法定代表人：</span>
                                    <span>
                                        {getFieldDecorator('legalRepresentative', {
                                            rules: [{ required: true, message: '请输入法定代表人!' }],
                                            initialValue: initValue.legalRepresentative
                                        })(
                                            <Input placeholder="请输入法定代表人" />
                                        )}
                                    </span>
                                </li>
                            </FormItem>
                            <FormItem>
                                <li className="add-message-item"><span>法人身份证号：</span>
                                    <span>
                                        {getFieldDecorator('legalRepreCardNum', {
                                            rules: [{ required: true, message: '请输入法人身份证号!' }],
                                            initialValue: initValue.legalRepreCardNum
                                        })(
                                            <Input placeholder="请输入法人身份证号" />
                                        )}
                                    </span>
                                </li>
                            </FormItem>
                            <li className="add-message-item"><span>法人身份证电子版：</span>
                                <InlineUpload
                                    limit={2}
                                    datas={
                                        initValue.legalRepreCardPic1
                                        ? [initValue.legalRepreCardPic1, initValue.legalRepreCardPic2]
                                        : []
                                    }
                                    onChange={this.handleLegalChange}
                                />
                            </li>
                            <FormItem>
                                {getFieldDecorator('licenseLoc', {
                                })(
                                    <li className="add-message-item">
                                        <span>营业执照所在地：</span>
                                        <span>
                                            <CasadingAddress
                                                id="licenseLoc"
                                                showNum="3"
                                                defaultValue={[
                                                    initValue.licenseLocProvinceCode,
                                                    initValue.licenseLocCityCode,
                                                    initValue.licenseLocCountyCode
                                                ]}
                                                onChange={this.handleCompanyAddressChange}
                                            />
                                        </span>
                                    </li>
                                )}
                            </FormItem>
                            <FormItem>
                                <li className="add-message-item"><span>营业执照详细地址：</span>
                                    <span>
                                        {getFieldDecorator('licenseAddress', {
                                            rules: [{ required: true, message: '营业执照详细地址!' }],
                                            initialValue: initValue.licenseAddress
                                        })(
                                            <Input placeholder="营业执照详细地址" />
                                        )}
                                    </span>
                                </li>
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('establishDate', {
                                })(
                                    <li className="add-message-item">
                                        <span>成立日期：</span>
                                        <span>
                                            <DatePicker
                                                format={dateFormat}
                                                value={this.state.establishDate}
                                                getCalendarContainer={() => document.getElementById('establishDate')}
                                                onChange={this.handleDatePickerChange}
                                            />
                                        </span>
                                    </li>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('useDate', {
                                })(
                                    <li className="add-message-item">
                                        <span>营业期限：</span>
                                        <span>
                                            <RangePicker
                                                disabled={this.state.checked}
                                                value={this.state.useDate}
                                                getCalendarContainer={() => document.getElementById('useDate')}
                                                onChange={this.handleRangePickerChange}
                                            />
                                        </span>
                                        <span style={{marginLeft: '10px'}}>
                                            <Checkbox
                                                checked={this.state.checked}
                                                onChange={this.handleOperatingPeriod}
                                            >
                                                {'永久经营'}
                                            </Checkbox>
                                        </span>
                                    </li>
                                )}
                            </FormItem>
                            <FormItem>
                                <li className="add-message-item"><span>注册资本：</span>
                                    <span>
                                        {getFieldDecorator('registeredCapital', {
                                            rules: [{ required: true, message: '请输入注册资本!' }],
                                            initialValue: initValue.registeredCapital
                                        })(
                                            <Input placeholder="请输入注册资本" />
                                        )}
                                        &nbsp;万元
                                    </span>
                                </li>
                            </FormItem>
                            <FormItem>
                                <li className="add-message-item"><span>经营范围：</span>
                                    <span>
                                        {getFieldDecorator('businessScope', {
                                            rules: [{ required: true, message: '请输入经营范围!' }],
                                            initialValue: initValue.businessScope
                                        })(
                                            <Input placeholder="请输入经营范围" />
                                        )}
                                    </span>
                                </li>
                            </FormItem>
                            <FormItem>
                                <li className="add-message-item"><span>营业执照副本电子版：</span>
                                    <InlineUpload
                                        datas={
                                            initValue.registLicencePic
                                            ? [initValue.registLicencePic]
                                            : []
                                        }
                                        onChange={this.handleLicenceChanage}
                                    />
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
                            <li className="detail-message-item"><span>公司名称：</span><span>{initValue.companyName}</span></li>
                            <li className="detail-message-item"><span>注册号(营业执照号)：</span><span>{initValue.registLicenceNumber}</span></li>
                            <li className="detail-message-item"><span>法定代表人：</span><span>{initValue.legalRepresentative}</span></li>
                            <li className="detail-message-item"><span>法人身份证号：</span><span>{initValue.legalRepreCardNum}</span></li>
                            <li className="detail-message-item">
                                <span>法人身份证电子版：</span>
                                <span>
                                    证件1：
                                    <a target="_blank" href={initValue.legalRepreCardPic1}>点击查看</a>
                                    &nbsp;
                                    证件2：
                                    <a target="_blank" href={initValue.legalRepreCardPic2}>点击查看</a>
                                </span>
                            </li>
                            <li className="detail-message-item"><span>营业执照地址：</span>
                                <span>{`${initValue.licenseLocProvince}${initValue.licenseLocCity}${initValue.licenseLocCounty}`}</span>
                            </li>
                            <li className="detail-message-item"><span>营业执照详细地址：</span>
                                <span>{initValue.licenseAddress}</span>
                            </li>
                            <li className="detail-message-item"><span>成立日期：</span>
                                <span>{moment(initValue.establishDate).format(dateType)}</span>
                            </li>
                            <li className="detail-message-item"><span>营业期限：</span>
                                <span>
                                    {
                                        initValue.perpetualManagement === 1
                                        ? '永久经营'
                                        : `${moment(initValue.startDate).format(dateType)}-${moment(initValue.endDate).format(dateType)}`
                                    }
                                </span>
                            </li>
                            <li className="detail-message-item"><span>注册资本：</span><span>{initValue.registeredCapital}万</span></li>
                            <li className="detail-message-item"><span>经营范围：</span><span>{initValue.businessScope}</span></li>
                            <li className="detail-message-item"><span>营业执照副本电子版：</span><span><a target="_blank" href={initValue.registLicencePic}>点击查看</a></span></li>
                        </ul>
                }
            </div>
        );
    }
}

LicenseInfo.propTypes = {
    initValue: PropTypes.objectOf(PropTypes.any),
    edit: PropTypes.bool,
    form: PropTypes.objectOf(PropTypes.any),
    detailData: PropTypes.objectOf(PropTypes.any),
    handleCancel: PropTypes.func,
};

export default Form.create()(LicenseInfo);
