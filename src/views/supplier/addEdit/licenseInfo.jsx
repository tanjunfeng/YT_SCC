/**
 * @file licenseInfo.jsx
 * @author shijh
 *
 * 营业执照信息
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { Icon, Input, Form, Button, Select, Row, Col, DatePicker, Checkbox } from 'antd';

import Utils from '../../../util/util';
import { Validator } from '../../../util/validator';
import InlineUpload from '../../../components/inlineUpload';
import CasadingAddress from '../../../components/ascadingAddress';
import { addSupplierMessage1 } from '../../../actions/addSupplier';
import InlineTree from '../../../components/inlineTree';
import Tools from './utils';

// mock
import queryAllLargerRegionProvince from '../../../../mock/queryAllLargerRegionProvince';

const dateFormat = 'YYYY-MM-DD';
const { RangePicker } = DatePicker
const FormItem = Form.Item;
const Option = Select.Option;


@connect(
    state => ({
        data: state.toJS().addSupplier.data
    }),
    dispatch => bindActionCreators({
        addSupplierMessage1
    }, dispatch)
)
class LicenseInfo extends PureComponent {
    constructor(props) {
        super(props);

        this.handleNextStep = ::this.handleNextStep;
        this.handleCompanyAddressChange = ::this.handleCompanyAddressChange;
        this.handleOperatingPeriod = ::this.handleOperatingPeriod;
        this.handleSaveDraft = ::this.handleSaveDraft;
        this.handleCreatePlace = ::this.handleCreatePlace;
        this.handleSubmit = ::this.handleSubmit;
        this.handlePreStep = :: this.handlePreStep;
        this.handleCompanyLicenseLocChange = ::this.handleCompanyLicenseLocChange;
        this.companyAddress = {};
        this.licenseLoc = {}
        this.state = {
            checked: false
        }
        this.submitData = {};
    }

    componentDidMount() {
    }

    handleNextStep() {
        const { form, onGoTo, isEdit, detailData = {} } = this.props;
        Tools.checkAddress(this.companyAddress, 'companyAddress', this);
        Tools.checkAddress(this.bankLoc, 'bankLoc', this);
        form.validateFields((err, values) => {
            if (!err) {
                const {
                    accountName,
                    bankAccount,
                    taxpayerType,
                    companyDetailAddress,
                    companyName,
                    mainAccountNo,
                    openBank,
                    spNo,
                    spRegNo,
                    taxpayerNumber,
                } = values;

                this.submitData.supplierBasicInfo = {
                    companyName,
                    spNo,
                    spRegNo,
                    mainAccountNo
                };

                const { firstValue, secondValue, thirdValue } = this.companyAddress;
                this.submitData.supplierOperTaxInfo = {
                    companyLocProvince: firstValue.regionName,
                    companyLocCity: secondValue.regionName,
                    companyLocCounty: thirdValue.regionName,
                    companyLocProvinceCode: firstValue.code,
                    companyLocCityCode: secondValue.code,
                    companyLocCountyCode: thirdValue.code,
                    companyDetailAddress,
                    registrationCertificate: this.certificate.getValue()[0],
                    qualityIdentification: this.quality.getValue()[0],
                    taxRegCertificate: this.taxReg.getValue()[0],
                    taxpayerNumber,
                    taxpayerType,
                    generalTaxpayerQualifiCerti: this.general.getValue()[0],
                }

                this.submitData.supplierBankInfo = {
                    accountName,
                    openBank,
                    bankAccount,
                    bankAccountLicense: this.bank.getValue()[0],
                    bankLocProvince: this.bankLoc.firstValue.regionName,
                    bankLocCity: this.bankLoc.secondValue.regionName,
                    bankLocCounty: this.bankLoc.thirdValue.regionName,
                    bankLocCountyCode: this.bankLoc.thirdValue.code,
                    bankLocCityCode: this.bankLoc.secondValue.code,
                    bankLocProvinceCode: this.bankLoc.firstValue.code,
                }

                if (isEdit) {
                    Object.assign(
                        this.submitData.supplierBasicInfo,
                        {id: detailData.supplierBasicInfo.id}
                    )
                    Object.assign(
                        this.submitData.supplierOperTaxInfo,
                        {id: detailData.supplierOperTaxInfo.id}
                    )
                    Object.assign(
                        this.submitData.supplierBankInfo,
                        {id: detailData.supplierBankInfo.id}
                    )
                }

                this.props.addSupplierMessage1(this.submitData)
                onGoTo('2');
            }
        })
    }

    handleSaveDraft() {
        this.getVlaue()
    }

    handleCreatePlace() {

    }

    handleSubmit() {

    }

    handlePreStep() {

    }

    getVlaue() {
        const { form, onGoTo, isEdit, detailData = {} } = this.props;
        Tools.checkAddress(this.companyAddress, 'companyAddress', this);
        form.validateFields((err, values) => {
            console.log(values)
            if (!err) {
                const { firstValue, secondValue, thirdValue } = this.companyAddress;
                const {
                    businessScope,
                    companyDetailAddress,
                    establishDate,
                    guaranteeMoney,
                    legalRepreCardNum,
                    legalRepresentative,
                    licenseAddress,
                    registLicenceNumber,
                    registeredCapital,
                    startEndDate
                } = values;
                this.submitData.supplierOperTaxInfo = {
                    companyLocProvince: firstValue.regionName,
                    companyLocCity: secondValue.regionName,
                    companyLocCounty: thirdValue.regionName,
                    companyLocProvinceCode: firstValue.code,
                    companyLocCityCode: secondValue.code,
                    companyLocCountyCode: thirdValue.code,
                    companyDetailAddress,
                    registrationCertificate: this.refs['registrationCertificate'].getValue().files[0],
                    regCerExpiringDate: this.refs['registrationCertificate'].getValue().time,
                    qualityIdentification: this.refs['qualityIdentification'].getValue().files[0],
                    quaIdeExpiringDate: this.refs['qualityIdentification'].getValue().time,
                    generalTaxpayerQualifiCerti: this.refs['generalTaxpayerQualifiCerti'].getValue().files[0],
                    taxpayerCertExpiringDate: this.refs['generalTaxpayerQualifiCerti'].getValue().files[0],
                }
                this.submitData.supplierlicenseInfo = {
                    companyName: this.props.data.supplierBasicInfo.companyName,
                    registLicenceNumber,
                    legalRepresentative,
                    legalRepreCardNum,
                    legalRepreCardPic1: this.refs['legalRepreCardPic'].getValue().files[0],
                    legalRepreCardPic2: this.refs['legalRepreCardPic'].getValue().files[1],
                    licenseLocProvince: this.licenseLoc.firstValue.regionName,
                    licenseLocCity: this.licenseLoc.secondValue.regionName,
                    licenseLocCounty: this.licenseLoc.thirdValue.regionName,
                    licenseLocProvinceCode: this.licenseLoc.thirdValue.code,
                    licenseLocCityCode: this.licenseLoc.secondValue.code,
                    licenseLocCountyCode: this.licenseLoc.firstValue.code,
                    licenseAddress,
                    establishDate: establishDate._d * 1,
                    startDate: startEndDate[0]._d * 1,
                    endDate: startEndDate[1]._d * 1,
                    perpetualManagement: this.state.checked ? 1 : 0,
                    registeredCapital,
                    businessScope,
                    registLicencePic: this.refs['registLicencePic'].getValue().files[0],
                    guaranteeMoney
                }

                console.log(this.submitData);
            }
        })
    }

    handleCompanyAddressChange(data) {
        this.companyAddress = data;
    }

    handleCompanyLicenseLocChange(data) {
        this.licenseLoc = data;
    }
 
    handleNextStep() {
        this.props.history.push('/supplierInputList/place/add/123123')
    }

    handleOperatingPeriod() {
        this.setState({
            checked: !this.state.checked
        })
    }

    render() {
        const { supplierBasicInfo = {} } = this.props.data;
        const { companyName } = supplierBasicInfo
        const { getFieldDecorator } = this.props.form;
        const { detailData, isEdit } = this.props;
        let initData = detailData;
        if (!isEdit) {
            initData = {};
        }
        const {
            supplierOperTaxInfo = {},
            supplierBankInfo = {},
            supplierlicenseInfo = {}
        } = initData;
        return (
            <div className="supplier-add-message">
                <Form>
                    <div className="supplier-add-item">
                        <div className="add-message supplier-add-license">
                            <div className="add-message-header">
                                <Icon type="solution" className="add-message-header-icon" />经营及证照信息
                            </div>
                            <div className="add-message-body">
                                <Row>
                                    <Col span={8}>
                                        <span>公司所在地：</span>
                                        <CasadingAddress
                                            id="companyLoc"
                                            onChange={this.handleCompanyAddressChange}
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <span>公司详细地址：</span>
                                        <FormItem>
                                            {getFieldDecorator('companyDetailAddress', {
                                                rules: [{ required: true, message: '请输入公司详细地址!' }],
                                                initialValue: supplierOperTaxInfo.companyDetailAddress
                                            })(
                                                <Input
                                                    placeholder="公司详细地址"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>食品安全认证：</span>
                                        <InlineUpload
                                            showEndTime
                                            ref="qualityIdentification"
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <span>商标注册证/受理通知书：</span>
                                        <InlineUpload
                                            showEndTime
                                            ref="registrationCertificate"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>食品经营许可证：</span>
                                        <InlineUpload
                                            showEndTime
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <span>一般纳税人资格证电子版：</span>
                                        <InlineUpload
                                            showEndTime
                                            ref="generalTaxpayerQualifiCerti"
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className="supplier-add-item supplier-add-license">
                        <div className="add-message">
                            <div className="add-message-header">
                                <Icon type="solution" className="add-message-header-icon" />公司营业执照信息（副本）
                            </div>
                            <div className="add-message-body">
                                <Row>
                                    <Col span={8}>
                                        <span>公司名称：</span>
                                        <span>{companyName}</span>
                                    </Col>
                                    <Col span={8}>
                                        <span>注册号(营业执照号)：</span>
                                        <FormItem>
                                            {getFieldDecorator('registLicenceNumber', {
                                                rules: [{ required: true, message: '请输入注册号(营业执照号)!' }],
                                                initialValue: supplierlicenseInfo.registLicenceNumber
                                            })(
                                                <Input
                                                    placeholder="注册号(营业执照号)"
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>法定代表：</span>
                                        <FormItem>
                                            {getFieldDecorator('legalRepresentative', {
                                                rules: [{ required: true, message: '请输入法定代表!' }],
                                                initialValue: supplierlicenseInfo.legalRepresentative
                                            })(
                                                <Input
                                                    placeholder="法定代表"
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>法人身份证号：</span>
                                        <FormItem>
                                            {getFieldDecorator('legalRepreCardNum', {
                                                rules: [{ required: true, message: '请输入法人身份证号!' }],
                                                initialValue: supplierlicenseInfo.legalRepreCardNum
                                            })(
                                                <Input
                                                    placeholder="法人身份证号"
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} id="createTime">
                                        <span>成立日期：</span>
                                        {getFieldDecorator('establishDate', {
                                            rules: [{required: true, message: '请选择供应商入驻日期'}],
                                            initialValue: supplierlicenseInfo.establishDate
                                        })(
                                            <DatePicker
                                                getCalendarContainer={() => document.getElementById('createTime')}
                                                format={dateFormat}
                                            />
                                        )}
                                    </Col>
                                    <Col span={8}>
                                        <span>营业执照所在地：</span>
                                        <CasadingAddress
                                            id="licenseLoc"
                                            onChange={this.handleCompanyLicenseLocChange}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} id="useDate">
                                        <span>营业期限：</span>
                                        {getFieldDecorator('startEndDate', {
                                            rules: [{required: true, message: '请选择供应商入驻日期'}],
                                            initialValue: supplierlicenseInfo.establishDate
                                        })(
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
                                            />
                                        )}
                                        <span style={{marginLeft: '10px'}}>
                                            <Checkbox
                                                checked={this.state.checked}
                                                defaultChecked={supplierlicenseInfo.perpetualManagement}
                                                onChange={this.handleOperatingPeriod}
                                            >
                                                {'永久经营'}
                                            </Checkbox>
                                        </span>
                                    </Col>
                                    <Col span={8}>
                                        <span>营业执照详细地址：</span>
                                        <FormItem>
                                            {getFieldDecorator('licenseAddress', {
                                                rules: [{ required: true, message: '请输入营业执照详细地址!' }],
                                                initialValue: supplierlicenseInfo.licenseAddress
                                            })(
                                                <Input
                                                    placeholder="营业执照详细地址"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>注册资本：</span>
                                        <FormItem>
                                            {getFieldDecorator('registeredCapital', {
                                                rules: [{ required: true, message: '请输入注册资本!' }],
                                                initialValue: supplierlicenseInfo.registeredCapital
                                            })(
                                                <Input
                                                    placeholder="注册资本"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                            &nbsp;万元
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>供应商质保金收取金额：</span>
                                        <FormItem>
                                            {getFieldDecorator('guaranteeMoney', {
                                                rules: [{ required: true, message: '请输入供应商质保金收取金额!' }],
                                                initialValue: supplierlicenseInfo.guaranteeMoney
                                            })(
                                                <Input
                                                    placeholder="供应商质保金收取金额"
                                                />
                                            )}
                                            &nbsp;元
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>经营范围：</span>
                                        <FormItem>
                                            {getFieldDecorator('businessScope', {
                                                rules: [{ required: true, message: '请输入经营范围!' }],
                                                initialValue: supplierlicenseInfo.businessScope
                                            })(
                                                <Input
                                                    placeholder="经营范围"
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>法人身份证电子版：</span>
                                        <InlineUpload
                                            showEndTime={false}
                                            limit={2}
                                            ref="legalRepreCardPic"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>* 营业执照副本电子版 ：</span>
                                        <InlineUpload
                                            showEndTime={false}
                                            ref="registLicencePic"
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className="add-message-handle">
                        <Button onClick={this.handlePreStep}>上一步</Button>
                        <Button onClick={this.handleSubmit}>提交</Button>
                        <Button onClick={this.handleCreatePlace}>创建供应商地点</Button>
                        <Button onClick={this.handleSaveDraft}>保存为制单</Button>
                    </div>
                </Form>
            </div>
        )
    }
}

LicenseInfo.propTypes = {
    onGoTo: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    isEdit: PropTypes.bool,
    detailData: PropTypes.objectOf(PropTypes.any),
    addSupplierMessage1: PropTypes.func,
}
export default Form.create()(withRouter(LicenseInfo));
