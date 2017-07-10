import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, Form, Input, Button, DatePicker, Checkbox } from 'antd';
import moment from 'moment';

import InlineUpload from '../../components/inlineUpload';
import Utils from '../../util/util';
import { Validator } from '../../util/validator';
import CasadingAddress from '../../components/ascadingAddress';
import { addSupplierMessage1 } from '../../actions/addSupplier';
import Tools from './utils';

const FormItem = Form.Item;
const { RangePicker } = DatePicker
const dateFormat = 'YYYY-MM-DD';

@connect(
    state => ({
        data: state.toJS().addSupplier.data
    }),
    dispatch => bindActionCreators({
        addSupplierMessage1
    }, dispatch)
)
class Qualification extends PureComponent {
    constructor(props) {
        super(props);

        this.handleNextStep = ::this.handleNextStep;
        this.handlePreStep = ::this.handlePreStep;
        this.handleOperatingPeriod = ::this.handleOperatingPeriod;
        this.handleCompanyAddressChange = ::this.handleCompanyAddressChange;
        this.handleRangePickerChange = ::this.handleRangePickerChange;
        this.handleDatePickerChange = ::this.handleDatePickerChange;

        this.state = {
            checked: false
        }

        this.adderss = {}

        this.submitData = {
            supplierlicenseInfo: {},
            supplierOrgCodeInfo: {}
        }

        this.time = {
            establishment: null,
            term: []
        }
    }

    handleNextStep() {
        const { form, onGoTo, isEdit, detailData = {} } = this.props;
        const { supplierlicenseInfo = {} } = detailData;
        Tools.checkAddress(this.adderss, 'licenseLoc', this);
        form.validateFields((err, values) => {
            if (!err) {
                const {
                    businessScope,
                    companyName,
                    legalRepreCardNum,
                    legalRepresentative,
                    licenseAddress,
                    orgCode,
                    registLicenceNumber,
                    registeredCapital
                } = values;
                const { firstValue, secondValue, thirdValue } = this.adderss;
                let { establishment, term } = this.time;
                const { checked } = this.state;

                if (isEdit) {
                    if (!establishment) {
                        establishment = moment(supplierlicenseInfo.establishment);
                    }
                    if (term.length === 0) {
                        term = [
                            moment(supplierlicenseInfo.startDate),
                            moment(supplierlicenseInfo.endDate)
                        ];
                    }
                }
                const legal = this.legal.getValue();
                this.submitData.supplierlicenseInfo = {
                    companyName,
                    registLicenceNumber,
                    legalRepresentative,
                    legalRepreCardNum,
                    licenseAddress,
                    legalRepreCardPic1: legal[0],
                    legalRepreCardPic2: legal[1],
                    licenseLocProvince: firstValue.regionName,
                    licenseLocCity: secondValue.regionName,
                    licenseLocCounty: thirdValue.regionName,
                    licenseLocProvinceCode: firstValue.code,
                    licenseLocCityCode: secondValue.code,
                    licenseLocCountyCode: thirdValue.code,
                    establishDate: establishment.format('x'),
                    startDate: term[0] && term[0].format('x'),
                    endDate: term[1] && term[1].format('x'),
                    perpetualManagement: checked ? 1 : 0,
                    registeredCapital,
                    businessScope,
                    registLicencePic: this.LicencePic.getValue()[0],
                }
                this.submitData.supplierOrgCodeInfo = {
                    orgCode,
                    orgCodeCerPic: this.orgCode.getValue()[0]
                }

                if (isEdit) {
                    Object.assign(
                        this.submitData.supplierlicenseInfo,
                        {id: detailData.supplierlicenseInfo.id}
                    )
                    Object.assign(
                        this.submitData.supplierOrgCodeInfo,
                        {id: detailData.supplierOrgCodeInfo.id}
                    )
                }

                this.props.addSupplierMessage1(this.submitData);
                onGoTo('3')
            }
        })
    }

    handlePreStep() {
        this.props.onGoTo('1');
    }

    handleOperatingPeriod(value) {
        this.setState({
            checked: value.target.checked
        })
    }

    handleCompanyAddressChange(data) {
        this.adderss = data;
    }

    handleRangePickerChange(data) {
        this.time.term = data;
    }

    handleDatePickerChange(data) {
        this.time.establishment = data;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { detailData = {}, isEdit } = this.props;
        let initData = detailData;
        if (!isEdit) {
            initData = {};
        }
        const {
            supplierlicenseInfo = {},
            supplierOrgCodeInfo = {}
        } = initData;

        return (
            <div className="supplier-add-message">
                <Form>
                    <div className="supplier-add-item">
                        <div className="add-message">
                            <div className="add-message-header">
                                <Icon type="solution" className="add-message-header-icon" />公司营业执照信息(副本)
                            </div>
                            <div className="add-message-body">
                                <ul className="add-message-list">
                                    <FormItem>
                                        <li className="add-message-item">
                                            <span>公司名称：</span>
                                            <span>
                                                {getFieldDecorator('companyName', {
                                                    rules: [{ required: true, message: '请输入公司名!' }],
                                                    initialValue: supplierlicenseInfo.companyName
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
                                                    initialValue: supplierlicenseInfo.registLicenceNumber
                                                })(
                                                    <Input
                                                        placeholder="请输入营业执照号"
                                                        onBlur={(e) => { Validator.repeat.registLicenceNumber(e, this, supplierlicenseInfo.id) }}
                                                    />
                                                )}
                                            </span>
                                        </li>
                                    </FormItem>
                                    <FormItem>
                                        <li className="add-message-item">
                                            <span>法定代表人：</span>
                                            <span>
                                                {getFieldDecorator('legalRepresentative', {
                                                    rules: [{ required: true, message: '请输入法定代表人!' }],
                                                    initialValue: supplierlicenseInfo.legalRepresentative
                                                })(
                                                    <Input placeholder="请输入法定代表人" />
                                                )}
                                            </span>
                                        </li>
                                    </FormItem>
                                    <FormItem>
                                        <li className="add-message-item">
                                            <span>法人身份证号：</span>
                                            <span>
                                                {getFieldDecorator('legalRepreCardNum', {
                                                    rules: [{ required: true, message: '请输入法人身份证号!' }],
                                                    initialValue: supplierlicenseInfo.legalRepreCardNum
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
                                                supplierlicenseInfo.legalRepreCardPic1
                                                ? [
                                                    supplierlicenseInfo.legalRepreCardPic1,
                                                    supplierlicenseInfo.legalRepreCardPic2
                                                ]
                                                : []
                                            }
                                            ref={ref => { this.legal = ref }}
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
                                                            supplierlicenseInfo.licenseLocProvinceCode,
                                                            supplierlicenseInfo.licenseLocCityCode,
                                                            supplierlicenseInfo.licenseLocCountyCode
                                                        ]}
                                                        onChange={this.handleCompanyAddressChange}
                                                    />
                                                </span>
                                            </li>
                                        )}
                                    </FormItem>
                                    <FormItem>
                                        <li className="add-message-item">
                                            <span>营业执照详细地址：</span>
                                            <span>
                                                {getFieldDecorator('licenseAddress', {
                                                    rules: [{ required: true, message: '营业执照详细地址!' }],
                                                    initialValue: supplierlicenseInfo.licenseAddress
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
                                                        defaultValue={
                                                            isEdit
                                                            ? moment(new Date(supplierlicenseInfo.establishDate), dateFormat)
                                                            : null
                                                        }
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
                                                        getCalendarContainer={() => document.getElementById('useDate')}
                                                        defaultValue={[
                                                            isEdit
                                                            ? moment(new Date(supplierlicenseInfo.startDate), dateFormat)
                                                            : null,
                                                            isEdit
                                                            ? moment(new Date(supplierlicenseInfo.endDate), dateFormat)
                                                            : null
                                                        ]}
                                                        onChange={this.handleRangePickerChange}
                                                    />
                                                </span>
                                                <span style={{marginLeft: '10px'}}>
                                                    <Checkbox
                                                        checked={this.state.checked}
                                                        defaultChecked={supplierlicenseInfo.perpetualManagement}
                                                        onChange={this.handleOperatingPeriod}
                                                    >
                                                        {'永久经营'}
                                                    </Checkbox>
                                                </span>
                                            </li>
                                        )}
                                    </FormItem>
                                    <FormItem>
                                        <li className="add-message-item">
                                            <span>注册资本：</span>
                                            <span>
                                                {getFieldDecorator('registeredCapital', {
                                                    rules: [{ required: true, message: '请输入注册资本!' }],
                                                    initialValue: supplierlicenseInfo.registeredCapital
                                                })(
                                                    <Input placeholder="请输入注册资本" />
                                                )}
                                                &nbsp;万元
                                            </span>
                                        </li>
                                    </FormItem>
                                    <FormItem>
                                        <li className="add-message-item">
                                            <span>经营范围：</span>
                                            <span>
                                                {getFieldDecorator('businessScope', {
                                                    rules: [{ required: true, message: '请输入经营范围!' }],
                                                    initialValue: supplierlicenseInfo.businessScope
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
                                                    supplierlicenseInfo.registLicencePic
                                                    ? [supplierlicenseInfo.registLicencePic]
                                                    : []
                                                }
                                                ref={ref => { this.LicencePic = ref }}
                                            />
                                        </li>
                                    </FormItem>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="supplier-add-item">
                        <div className="add-message-header">
                            <Icon type="solution" className="add-message-header-icon" />组织机构代码证
                        </div>
                        <div className="add-message-body">
                            <ul className="add-message-list">
                                <FormItem>
                                    <li className="add-message-item">
                                        <span>组织机构代码：</span>
                                        {getFieldDecorator('orgCode', {
                                            rules: [{ required: true, message: '请输入组织机构代码!' }],
                                            initialValue: supplierOrgCodeInfo.orgCode
                                        })(
                                            <Input placeholder="请输入组织机构代码" onBlur={(e) => { Validator.repeat.orgCode(e, this, supplierOrgCodeInfo.id) }} />
                                        )}
                                    </li>
                                </FormItem>
                                <li className="add-message-item"><span>组织机构代码证电子版：</span>
                                    <InlineUpload
                                        datas={
                                            supplierOrgCodeInfo.orgCodeCerPic
                                            ? [supplierOrgCodeInfo.orgCodeCerPic]
                                            : []
                                        }
                                        ref={ref => { this.orgCode = ref }}
                                    />
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="add-message-handle">
                        <Button onClick={this.handlePreStep} className="add-message-pre">上一步</Button>
                        <Button onClick={this.handleNextStep}>下一步</Button>
                    </div>
                </Form>
            </div>
        )
    }
}

Qualification.propTypes = {
    onGoTo: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    isEdit: PropTypes.bool,
    detailData: PropTypes.objectOf(PropTypes.any),
    addSupplierMessage1: PropTypes.func,
}

export default Form.create()(Qualification);
