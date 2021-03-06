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
    Row, Col, DatePicker,
    Checkbox, message,
    InputNumber
} from 'antd';

import Utils from '../../../util/util';
import { Validator } from '../../../util/validator';
import InlineUpload from '../../../components/inlineUpload';
import CasadingAddress from '../../../components/ascadingAddress';
import {
    addSupplierMessage1,
} from '../../../actions/addSupplier';
import {
    hanldeSupplier, removeDetailData
} from '../../../actions/supplier';
import Tools from './utils';
import { TABCONTENT } from '../../../constant';

const dateFormat = 'YYYY-MM-DD';
const { RangePicker } = DatePicker
const FormItem = Form.Item;

@connect(
    state => ({
        data: state.toJS().addSupplier.data
    }),
    dispatch => bindActionCreators({
        addSupplierMessage1,
        hanldeSupplier,
        removeDetailData
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
        this.companyAddress = {};
        this.licenseLoc = {}
        const { detailData = {} } = props;
        const { supplierlicenseInfo = {} } = detailData;
        this.state = {
            checked: !!supplierlicenseInfo.perpetualManagement,
            isSubmit: false,
            isSending: false
        }
        this.submitData = {};
        this.submitId = null;
    }

    componentDidMount() {
        TABCONTENT.LicenseInfo = this;
    }

    getVlaue(callback) {
        const { form, isEdit, detailData = {}, data } = this.props;
        const { checked } = this.state;
        Tools.checkAddress(this.companyAddress, 'companyLoc', this);
        Tools.checkAddress(this.licenseLoc, 'licenseLocSpace', this);
        const { firstValue, secondValue, thirdValue } = this.companyAddress;
        if (
            firstValue === '-1'
            || secondValue === '-1'
            || thirdValue === '-1'
            || this.licenseLoc.firstValue === '-1'
            || this.licenseLoc.secondValue === '-1'
            || this.licenseLoc.thirdValue === '-1'
        ) {
            return;
        }
        const registrationCertificate = this.registrationCertificate.getValue();
        const qualityIdentification = this.qualityIdentification.getValue();
        const generalTaxpayerQualifiCerti = this.generalTaxpayerQualifiCerti.getValue();
        const foodBusinessLicense = this.foodBusinessLicense.getValue();
        const legalRepreCardPic = this.legalRepreCardPic.getValue();
        const registLicencePic = this.registLicencePic.getValue();

        if (generalTaxpayerQualifiCerti) {
            const { files } = generalTaxpayerQualifiCerti;
            if (files.length === 0) {
                message.error('请上传一般纳税人资格证电子版！')
                return;
            }
        }

        if (registLicencePic) {
            const { files } = registLicencePic;
            if (files.length === 0) {
                message.error('请上传营业执照副本电子版！')
                return;
            }
        }

        form.validateFields((err, values) => {
            if (!err) {
                // const { firstValue, secondValue, thirdValue } = this.companyAddress;
                const first = this.companyAddress.firstValue;
                const second = this.companyAddress.secondValue;
                const third = this.companyAddress.thirdValue;
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

                if (!checked && !startEndDate[0]) {
                    message.error('请选择营业期限！');
                    return null;
                }
                if (!establishDate) {
                    message.error('请选择供应商入驻日期！');
                    return null;
                }

                const supplierOperTaxInfo = Utils.removeInvalid({
                    companyLocProvince: first.regionName,
                    companyLocCity: second.regionName,
                    companyLocCounty: third.regionName,
                    companyLocProvinceCode: first.code,
                    companyLocCityCode: second.code,
                    companyLocCountyCode: third.code,
                    companyDetailAddress,
                    registrationCertificate: registrationCertificate.files[0],
                    regCerExpiringDate: registrationCertificate.time,
                    qualityIdentification: qualityIdentification.files[0],
                    quaIdeExpiringDate: qualityIdentification.time,
                    generalTaxpayerQualifiCerti: generalTaxpayerQualifiCerti.files[0],
                    foodBusinessLicense: foodBusinessLicense.files[0],
                    businessLicenseExpiringDate: foodBusinessLicense.time
                })

                const supplierlicenseInfo = Utils.removeInvalid({
                    companyName: this.props.data.supplierBasicInfo.companyName,
                    registLicenceNumber,
                    legalRepresentative,
                    legalRepreCardNum: legalRepreCardNum === '' ? null : legalRepreCardNum,
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
                    startDate: startEndDate[0] ? startEndDate[0]._d * 1 : null,
                    endDate: startEndDate[0] ? startEndDate[1]._d * 1 : null,
                    perpetualManagement: this.state.checked ? 1 : 0,
                    registeredCapital,
                    businessScope,
                    registLicencePic: registLicencePic.files[0],
                    guaranteeMoney: guaranteeMoney < 0 ? '' : guaranteeMoney
                })

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

                    if (data.supplierBankInfo) {
                        Object.assign(data.supplierBankInfo,
                            {
                                id: detailData.supplierBankInfo.id,
                                status: detailData.supplierBankInfo.status
                            }
                        );
                    } else {
                        data.supplierBankInfo = detailData.supplierBankInfo;
                    }
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
                if (typeof callback === 'function') callback();
            }
            return '';
        })
    }

    componentWillUnMount() {
        this.props.removeDetailData();
    }

    handleGoTo = (key) => {
        this.props.onGoTo(key);
        this.getVlaue();
    }

    handleSaveDraft() {
        this.getVlaue(() => {
            const { isEdit } = this.props;
            this.getVlaue();
            this.submitData.commitType = 0;
            this.props.hanldeSupplier(Utils.removeInvalid(this.submitData), isEdit ? 'updateSupplierInfo' : 'insertSupplierInfo')
                .then((res) => {
                    message.success('保存成功');
                    this.props.history.push('/suppliersAppList')
                    if (!isEdit) {
                        this.submitId = res.data;
                    }
                }).catch(() => {
                    this.setState({ isSending: false });
                });
        })
    }

    handleCreatePlace() {
        const { detailData = {}, isEdit } = this.props;
        this.props.history.push(`/supplierInputList/add/${isEdit ? detailData.id : this.submitId}`)
    }

    handleSubmit() {
        this.getVlaue(() => {
            const { isEdit } = this.props;
            this.getVlaue();
            this.submitData.commitType = 1;
            this.setState({
                isSending: true
            })
            this.props.hanldeSupplier(Utils.removeInvalid(this.submitData), isEdit ? 'updateSupplierInfo' : 'insertSupplierInfo')
                .then((res) => {
                    message.success('保存成功');
                    if (!isEdit) {
                        this.submitId = res.data;
                    }
                    this.setState({
                        isSubmit: true
                    })
                });
        })
    }

    handlePreStep() {
        this.props.onGoTo('2');
    }

    handleCompanyAddressChange(data) {
        this.companyAddress = data;
        const { getFieldError } = this.props.form;
        if (
            getFieldError('companyLoc')
            && this.companyAddress.thirdValue
            && this.companyAddress.thirdValue !== '-1'
        ) {
            this.props.form.setFields({
                companyLoc: {
                    error: null
                }
            })
        }
    }

    handleCompanyLicenseLocChange(data) {
        this.licenseLoc = data;
        const { getFieldError } = this.props.form;
        if (
            getFieldError('licenseLocSpace')
            && this.licenseLoc.thirdValue
            && this.licenseLoc.thirdValue !== '-1'
        ) {
            this.props.form.setFields({
                licenseLocSpace: {
                    error: null
                }
            })
        }
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
                                        <span>*公司所在地：</span>
                                        <FormItem>
                                            {getFieldDecorator('companyLoc', {
                                            })(
                                                <div>
                                                    <CasadingAddress
                                                        id="companyLoc"
                                                        key="companyLoc"
                                                        defaultValue={
                                                            isEdit
                                                                ? [
                                                                    supplierOperTaxInfo
                                                                        .companyLocProvinceCode,
                                                                    supplierOperTaxInfo
                                                                        .companyLocCityCode,
                                                                    supplierOperTaxInfo
                                                                        .companyLocCountyCode
                                                                ]
                                                                : []
                                                        }
                                                        onChange={this.handleCompanyAddressChange}
                                                    />
                                                </div>
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>*公司详细地址：</span>
                                        <FormItem>
                                            {getFieldDecorator('companyDetailAddress', {
                                                rules: [
                                                    { required: true, message: '请输入公司详细地址!' },
                                                    { max: 30, message: '详细地址最长30位' }
                                                ],
                                                initialValue: supplierOperTaxInfo
                                                    .companyDetailAddress
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
                                            datas={isEdit ?
                                                [supplierOperTaxInfo.qualityIdentification] : []}
                                            defaultTime={isEdit ?
                                                supplierOperTaxInfo.quaIdeExpiringDate : null}
                                            ref={node => { this.qualityIdentification = node }}
                                            key="qualityIdentification"
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <span>商标注册证/受理通知书：</span>
                                        <InlineUpload
                                            showEndTime
                                            datas={isEdit ?
                                                [supplierOperTaxInfo.registrationCertificate] : []}
                                            defaultTime={isEdit ?
                                                supplierOperTaxInfo.regCerExpiringDate : null}
                                            ref={node => { this.registrationCertificate = node }}
                                            key="registrationCertificate"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>食品经营许可证：</span>
                                        <InlineUpload
                                            showEndTime
                                            datas={isEdit ?
                                                [supplierOperTaxInfo.foodBusinessLicense] : []}
                                            defaultTime={isEdit ? supplierOperTaxInfo
                                                .businessLicenseExpiringDate : null}
                                            ref={node => { this.foodBusinessLicense = node }}
                                            key="foodBusinessLicense"
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <span>*一般纳税人资格证电子版：</span>
                                        <InlineUpload
                                            datas={isEdit ? [supplierOperTaxInfo
                                                .generalTaxpayerQualifiCerti] : []}
                                            ref={node => {
                                                this.generalTaxpayerQualifiCerti = node
                                            }}
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
                                        <span>*注册号(营业执照号)：</span>
                                        <FormItem>
                                            {getFieldDecorator('registLicenceNumber', {
                                                rules: [
                                                    { required: true, message: '请输入注册号(营业执照号)!' },
                                                    { max: 25, message: '营业执照号最长25位' },
                                                    {
                                                        validator: (rule, value, callback) => {
                                                            if (value && !/^[0-9a-zA-Z]+$/.test(value)) {
                                                                callback('营业执照号只能包含数字和字母！')
                                                            }
                                                            callback()
                                                        }
                                                    }
                                                ],
                                                initialValue: supplierlicenseInfo
                                                    .registLicenceNumber
                                            })(
                                                <Input
                                                    style={{ width: '200px' }}
                                                    placeholder="注册号(营业执照号)"
                                                    onBlur={(e) => {
                                                        Validator.repeat.licenseNo(e, this,
                                                            supplierlicenseInfo.id,
                                                            supplierlicenseInfo.status)
                                                    }}
                                                />
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>*法定代表：</span>
                                        <FormItem>
                                            {getFieldDecorator('legalRepresentative', {
                                                rules: [
                                                    { required: true, message: '请输入法定代表!' },
                                                    {
                                                        validator: (rule, value, callback) => {
                                                            if (value && !/^[\u4e00-\u9fa5]{1,6}$/.test(value)) {
                                                                callback('请输入1-6个汉字')
                                                            }
                                                            callback()
                                                        }
                                                    }
                                                ],
                                                initialValue: supplierlicenseInfo
                                                    .legalRepresentative
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
                                                rules: [
                                                    {
                                                        validator: (rule, value, callback) => {
                                                            if (value && !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
                                                                callback('请输入正确的身份证号')
                                                            }
                                                            callback()
                                                        }
                                                    }
                                                ],
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
                                        <span>*成立日期：</span>
                                        <FormItem>
                                            {getFieldDecorator('establishDate', {
                                                rules: [{ required: true, message: '请选择供应商入驻日期' }],
                                                initialValue: isEdit ?
                                                    moment(supplierlicenseInfo.establishDate) : null
                                            })(
                                                <DatePicker
                                                    getCalendarContainer={() => document.getElementById('createTime')}
                                                    disabledDate={(current) => (
                                                        current && current.valueOf() > Date.now()
                                                    )}
                                                    format={dateFormat}
                                                />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>*营业执照所在地：</span>
                                        <FormItem>
                                            {getFieldDecorator('licenseLocSpace', {
                                            })(
                                                <div>
                                                    <CasadingAddress
                                                        id="licenseLocSpace"
                                                        key="licenseLocSpace"
                                                        defaultValue={
                                                            isEdit
                                                                ? [
                                                                    supplierlicenseInfo
                                                                        .licenseLocProvinceCode,
                                                                    supplierlicenseInfo
                                                                        .licenseLocCityCode,
                                                                    supplierlicenseInfo
                                                                        .licenseLocCountyCode
                                                                ]
                                                                : []
                                                        }
                                                        onChange={
                                                            this.handleCompanyLicenseLocChange}
                                                    />
                                                </div>
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} id="useDate">
                                        <span>*营业期限：</span>
                                        {getFieldDecorator('startEndDate', {
                                            rules: [{ required: true, message: '请选择供应商入驻日期' }],
                                            initialValue: [
                                                (isEdit && supplierlicenseInfo.startDate)
                                                    ? moment(supplierlicenseInfo.startDate)
                                                    : null,
                                                (isEdit && supplierlicenseInfo.endDate)
                                                    ? moment(supplierlicenseInfo.endDate)
                                                    : null
                                            ]
                                        })(
                                            <RangePicker
                                                disabled={this.state.checked}
                                                getCalendarContainer={() => document.getElementById('useDate')}
                                            />
                                            )}
                                        <span style={{ marginLeft: '10px' }}>
                                            <Checkbox
                                                checked={this.state.checked}
                                                onChange={this.handleOperatingPeriod}
                                            >
                                                {'永久经营'}
                                            </Checkbox>
                                        </span>
                                    </Col>
                                    <Col span={8}>
                                        <span>*营业执照详细地址：</span>
                                        <FormItem>
                                            {getFieldDecorator('licenseAddress', {
                                                rules: [
                                                    { required: true, message: '请输入营业执照详细地址!' },
                                                    { max: 30, message: '详细地址最长30位' }
                                                ],
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
                                        <span>*注册资本：</span>
                                        <FormItem>
                                            {getFieldDecorator('registeredCapital', {
                                                rules: [{ required: true, message: '请输入注册资本!' }],
                                                initialValue: supplierlicenseInfo.registeredCapital
                                            })(
                                                <InputNumber
                                                    style={{ width: '200px' }}
                                                    min={0}
                                                    max={99999999}
                                                    precision={2}
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
                                                rules: [{ required: false, message: '请输入供应商质保金收取金额!' }],
                                                initialValue: supplierlicenseInfo.guaranteeMoney
                                            })(
                                                <InputNumber
                                                    style={{ width: '200px' }}
                                                    min={0}
                                                    max={99999999}
                                                    precision={2}
                                                    placeholder="供应商质保金收取金额"
                                                />
                                                )}
                                            &nbsp;元
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>*经营范围：</span>
                                        <FormItem>
                                            {getFieldDecorator('businessScope', {
                                                rules: [
                                                    { required: true, message: '请输入经营范围!' },
                                                    { max: 300, message: '字符长度超限' }
                                                ],
                                                initialValue: supplierlicenseInfo.businessScope
                                            })(
                                                <Input
                                                    type="textarea"
                                                    autosize={{ minRows: 2, maxRows: 6 }}
                                                    style={{ maxWidth: '200px' }}
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
                                            tilte={'请上传身份证正反面'}
                                            datas={
                                                isEdit
                                                    ? [
                                                        supplierlicenseInfo.legalRepreCardPic1,
                                                        supplierlicenseInfo.legalRepreCardPic2
                                                    ]
                                                    : []
                                            }
                                            ref={node => { this.legalRepreCardPic = node }}
                                            key="legalRepreCardPic"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>*营业执照副本电子版 ：</span>
                                        <InlineUpload
                                            showEndTime={false}
                                            datas={isEdit
                                                ? [
                                                    supplierlicenseInfo.registLicencePic
                                                ]
                                                : []}
                                            ref={node => { this.registLicencePic = node }}
                                            key="registLicencePic"
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className="add-message-handle">
                        <Button onClick={this.handlePreStep}>上一步</Button>
                        {
                            (!this.state.isSubmit || !this.state.isSending) &&
                            <Button onClick={this.handleSubmit}>提交</Button>
                        }
                        {(initData.status === 1
                            || initData.status === 2
                            || this.state.isSubmit)
                            ? <Button onClick={this.handleCreatePlace}>创建供应商地点</Button>
                            : null
                        }
                        {
                            (!this.state.isSubmit || !this.state.isSending) &&
                            <Button onClick={this.handleSaveDraft}>保存为制单</Button>
                        }
                    </div>
                </Form>
            </div>
        )
    }
}

LicenseInfo.propTypes = {
    onGoTo: PropTypes.func,
    removeDetailData: PropTypes.func,
    hanldeSupplier: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    isEdit: PropTypes.bool,
    detailData: PropTypes.objectOf(PropTypes.any),
    data: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any)
}
export default Form.create()(withRouter(LicenseInfo));
