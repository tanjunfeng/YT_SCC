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
import {
    Icon, Input, Form, Button,
    Select, Row, Col, DatePicker,
    Checkbox, message
} from 'antd';

import Utils from '../../../util/util';
import { Validator } from '../../../util/validator';
import InlineUpload from '../../../components/inlineUpload';
import CasadingAddress from '../../../components/ascadingAddress';
import {
    addSupplierMessage1,
} from '../../../actions/addSupplier';
import {
    hanldeSupplier
} from '../../../actions/supplier';
import InlineTree from '../../../components/inlineTree';
import Tools from './utils';

const dateFormat = 'YYYY-MM-DD';
const { RangePicker } = DatePicker
const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({
        data: state.toJS().addSupplier.data
    }),
    dispatch => bindActionCreators({
        addSupplierMessage1,
        hanldeSupplier
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
        this.handleSaveDraft = ::this.handleSaveDraft;
        this.handleCompanyLicenseLocChange = ::this.handleCompanyLicenseLocChange;
        this.submit = ::this.submit;
        this.companyAddress = {};
        this.licenseLoc = {}
        const { supplierlicenseInfo = {} } = props;
        this.state = {
            checked: 0
        }
        this.submitData = {};
        this.submitId = null;
    }

    componentDidMount() {
    }

    getVlaue() {
        const { form, onGoTo, isEdit, detailData = {}, data } = this.props;
        Tools.checkAddress(this.companyAddress, 'companyLoc', this);
        Tools.checkAddress(this.licenseLoc, 'licenseLocSpace', this);
        const registrationCertificate = this.refs.registrationCertificate.getValue();
        const qualityIdentification = this.refs.qualityIdentification.getValue();
        const generalTaxpayerQualifiCerti = this.refs.generalTaxpayerQualifiCerti.getValue();
        const foodBusinessLicense = this.refs.foodBusinessLicense.getValue();
        const legalRepreCardPic = this.refs.legalRepreCardPic.getValue();
        form.validateFields((err, values) => {
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
                const supplierOperTaxInfo = {
                    companyLocProvince: firstValue.regionName,
                    companyLocCity: secondValue.regionName,
                    companyLocCounty: thirdValue.regionName,
                    companyLocProvinceCode: firstValue.code,
                    companyLocCityCode: secondValue.code,
                    companyLocCountyCode: thirdValue.code,
                    companyDetailAddress,
                    registrationCertificate: registrationCertificate.files[0],
                    regCerExpiringDate: registrationCertificate.time,
                    qualityIdentification: qualityIdentification.files[0],
                    quaIdeExpiringDate: qualityIdentification.time,
                    generalTaxpayerQualifiCerti: generalTaxpayerQualifiCerti.files[0],
                    taxpayerCertExpiringDate: generalTaxpayerQualifiCerti.time,
                    foodBusinessLicense: foodBusinessLicense.files[0],
                    businessLicenseExpiringDate: foodBusinessLicense.time

                }
                const supplierlicenseInfo = {
                    companyName: this.props.data.supplierBasicInfo.companyName,
                    registLicenceNumber,
                    legalRepresentative,
                    legalRepreCardNum,
                    legalRepreCardPic1: legalRepreCardPic.files[0],
                    legalRepreCardPic2: legalRepreCardPic.files[1],
                    licenseLocProvince: this.licenseLoc.firstValue.regionName,
                    licenseLocCity: this.licenseLoc.secondValue.regionName,
                    licenseLocCounty: this.licenseLoc.thirdValue.regionName,
                    licenseLocProvinceCode: this.licenseLoc.firstValue.code,
                    licenseLocCityCode: this.licenseLoc.secondValue.code,
                    licenseLocCountyCode: this.licenseLoc.thirdValue.code,
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
                
                if (isEdit) {
                    Object.assign(supplierOperTaxInfo,
                        {
                            id: detailData.supplierOperTaxInfo.id,
                            status: detailData.supplierOperTaxInfo.status,
                        }
                    );
                    Object.assign(supplierlicenseInfo,
                        {
                            id: detailData.supplierlicenseInfo.id,
                            status: detailData.supplierlicenseInfo.status,
                        }
                    );
                    Object.assign(data.supplierBasicInfo,
                        {
                            id: detailData.supplierBasicInfo.id,
                            status: detailData.supplierBasicInfo.status,
                        }
                    );
                    Object.assign(data.saleRegionInfo,
                        {
                            id: detailData.saleRegionInfo.id,
                            status: detailData.saleRegionInfo.status,
                        }
                    );
                    Object.assign(data.supplierBankInfo,
                        {
                            id: detailData.supplierBankInfo.id,
                            status:  detailData.supplierBankInfo.status
                        }
                    );
                }
                Object.assign(
                    this.submitData,
                    {
                        supplierOperTaxInfo,
                        supplierlicenseInfo,
                        id: detailData.id,
                        status: detailData.status,
                        ...data
                    }
                )
            }
        })
    }

    submit(type) {
        const { isEdit } = this.props;
        this.getVlaue();
        this.submitData.commitType = type;
        this.props.hanldeSupplier(this.submitData, isEdit ? 'updateSupplierInfo' : 'insertSupplierInfo')
            .then((res) => {
                message.success('保存成功');
                this.props.handleGetDetail(!isEdit ? res.data : this.submitData.id);
                if (!isEdit) {
                    this.submitId = res.data;
                }
            });
    }

    handleSaveDraft() {
        this.submit(0);
    }

    handleCreatePlace() {
        const { detailData = {}, isEdit } = this.props;
        this.props.history.push(`/supplierInputList/add/${isEdit ? detailData.id : this.submitId}`)
    }

    handleSubmit() {
        this.submit(1);
    }

    handlePreStep() {
        this.props.onGoTo('2');
    }

    handleCompanyAddressChange(data) {
        this.companyAddress = data;
    }

    handleCompanyLicenseLocChange(data) {
        this.licenseLoc = data;
    }
 
    handleNextStep() {
        
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
                                            defaultValue={
                                                isEdit
                                                ? [
                                                    supplierOperTaxInfo.companyLocProvinceCode,
                                                    supplierOperTaxInfo.companyLocCityCode,
                                                    supplierOperTaxInfo.companyLocCountyCode
                                                ]
                                                : []
                                            }
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
                                            datas={isEdit ? [supplierOperTaxInfo.qualityIdentification] : []}
                                            defaultTime={isEdit ? supplierOperTaxInfo.quaIdeExpiringDate : null}
                                            ref="qualityIdentification"
                                            key="qualityIdentification"
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <span>商标注册证/受理通知书：</span>
                                        <InlineUpload
                                            showEndTime
                                            datas={isEdit ? [supplierOperTaxInfo.registrationCertificate] : []}
                                            defaultTime={isEdit ? supplierOperTaxInfo.regCerExpiringDate : null}
                                            ref="registrationCertificate"
                                            key="registrationCertificate"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>食品经营许可证：</span>
                                        <InlineUpload
                                            showEndTime
                                            datas={isEdit ? [supplierOperTaxInfo.foodBusinessLicense] : []}
                                            defaultTime={isEdit ? supplierOperTaxInfo.businessLicenseExpiringDate : null}
                                            ref="foodBusinessLicense"
                                            key="foodBusinessLicense"
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <span>一般纳税人资格证电子版：</span>
                                        <InlineUpload
                                            showEndTime
                                            datas={isEdit ? [supplierOperTaxInfo.generalTaxpayerQualifiCerti] : []}
                                            defaultTime={isEdit ? supplierOperTaxInfo.taxpayerCertExpiringDate : null}
                                            ref="generalTaxpayerQualifiCerti"
                                            key="generalTaxpayerQualifiCerti"
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
                                                    onBlur={(e) => { Validator.repeat.licenseNo(e, this, supplierlicenseInfo.id, supplierlicenseInfo.status) }}
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
                                            initialValue: isEdit ? moment(supplierlicenseInfo.establishDate) : null
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
                                            id="licenseLocSpace"
                                            defaultValue={
                                                isEdit
                                                ? [
                                                    supplierlicenseInfo.licenseLocProvinceCode,
                                                    supplierlicenseInfo.licenseLocCityCode,
                                                    supplierlicenseInfo.licenseLocCountyCode
                                                ]
                                                : []
                                            }
                                            onChange={this.handleCompanyLicenseLocChange}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} id="useDate">
                                        <span>营业期限：</span>
                                        {getFieldDecorator('startEndDate', {
                                            rules: [{required: true, message: '请选择供应商入驻日期'}],
                                            initialValue: [
                                                isEdit
                                                ? moment(supplierlicenseInfo.startDate)
                                                : null,
                                                isEdit
                                                ? moment(supplierlicenseInfo.endDate)
                                                : null
                                            ]
                                        })(
                                            <RangePicker
                                                disabled={this.state.checked}
                                                getCalendarContainer={() => document.getElementById('useDate')}
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
                                            datas={
                                                isEdit
                                                ? [
                                                    supplierlicenseInfo.legalRepreCardPic1,
                                                    supplierlicenseInfo.legalRepreCardPic2
                                                ]
                                                : []
                                            }
                                            ref="legalRepreCardPic"
                                            key="legalRepreCardPic"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>* 营业执照副本电子版 ：</span>
                                        <InlineUpload
                                            showEndTime={false}
                                            datas={isEdit
                                                ? [
                                                    supplierlicenseInfo.registLicencePic
                                                ]
                                                : []}
                                            ref="registLicencePic"
                                            key="registLicencePic"
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className="add-message-handle">
                        <Button onClick={this.handlePreStep}>上一步</Button>
                        <Button onClick={this.handleSubmit}>提交</Button>
                        {
                            isEdit &&
                            <Button onClick={this.handleCreatePlace}>创建供应商地点</Button>
                        }
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
