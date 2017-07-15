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
        this.handleBankLocChange = ::this.handleBankLocChange;
        this.companyAddress = {};
        this.bankLoc = {};
        this.state = {
            checked: false
        }
        this.submitData = {
            supplierBasicInfo: {},
            supplierOperTaxInfo: {},
            supplierBankInfo: {}
        };
    }

    componentDidMount() {
        this.props.form.refs = this;
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

    handleCompanyAddressChange(data) {
        this.companyAddress = data;
        // if ( data.thirdValue !== '-1' ) {
        //     this.props.form.setFields({
        //         companyAddress: {
        //             errors: null,
        //         }
        //     });
        // }
    }

    handleBankLocChange(data) {
        this.bankLoc = data;
        // if ( data.thirdValue !== '-1' ) {
        //     this.props.form.setFields({
        //         bankLoc: {
        //             errors: null,
        //         }
        //     });
        // }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { detailData, isEdit } = this.props;
        let initData = detailData;
        if (!isEdit) {
            initData = {};
        }
        const {
            supplierBasicInfo = {},
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
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <span>公司详细地址：</span>
                                        <FormItem>
                                            {getFieldDecorator('companyDetailAddress', {
                                                rules: [{ required: true, message: '请输入公司详细地址!' }],
                                                initialValue: supplierBasicInfo.spNo
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
                                        <FormItem>
                                            <InlineUpload />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>商标注册证/受理通知书：</span>
                                        <FormItem>
                                            <InlineUpload />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>食品安全认证：</span>
                                        <FormItem>
                                            <InlineUpload />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>一般纳税人资格证电子版：</span>
                                        <FormItem>
                                            <InlineUpload />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>食品经营许可证：</span>
                                        <FormItem>
                                            <InlineUpload />
                                        </FormItem>
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
                                        <span>成都市××食品公司</span>
                                    </Col>
                                    <Col span={8}>
                                        <span>注册号(营业执照号)：</span>
                                        <FormItem>
                                            {getFieldDecorator('companyDetailAddress', {
                                                rules: [{ required: true, message: '请输入注册号(营业执照号)!' }],
                                                initialValue: supplierBasicInfo.spNo
                                            })(
                                                <Input
                                                    placeholder="注册号(营业执照号)"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>法定代表：</span>
                                        <FormItem>
                                            {getFieldDecorator('companyDetailAddress', {
                                                rules: [{ required: true, message: '请输入法定代表!' }],
                                                initialValue: supplierBasicInfo.spNo
                                            })(
                                                <Input
                                                    placeholder="法定代表"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>法人身份证电子版：</span>
                                        <FormItem>
                                            <InlineUpload />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>法人身份证号：</span>
                                        <FormItem>
                                            {getFieldDecorator('companyDetailAddress', {
                                                rules: [{ required: true, message: '请输入法人身份证号!' }],
                                                initialValue: supplierBasicInfo.spNo
                                            })(
                                                <Input
                                                    placeholder="法人身份证号"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} id="create-time">
                                        <span>成立日期：</span>
                                        {getFieldDecorator('establishDate', {
                                            rules: [{required: true, message: '请选择供应商入驻日期'}],
                                            initialValue: moment('2015/01/01', dateFormat)
                                        })(
                                            <DatePicker
                                                getCalendarContainer={() => document.getElementById('create-time')}
                                                format={dateFormat}
                                            />
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>营业执照所在地：</span>
                                        <CasadingAddress
                                            id="licenseLoc"
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <span>营业执照详细地址：</span>
                                        <FormItem>
                                            {getFieldDecorator('companyDetailAddress', {
                                                rules: [{ required: true, message: '请输入营业执照详细地址!' }],
                                                initialValue: supplierBasicInfo.spNo
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
                                    <Col span={8} id="useDate">
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
                                    </Col>
                                    <Col span={8}>
                                        <span>注册资本：</span>
                                        <FormItem>
                                            {getFieldDecorator('registeredCapital', {
                                                rules: [{ required: true, message: '请输入注册资本!' }],
                                                initialValue: supplierBasicInfo.spNo
                                            })(
                                                <Input
                                                    placeholder="注册资本"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                            万元
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>经营范围：</span>
                                        <FormItem>
                                            {getFieldDecorator('registeredCapital', {
                                                rules: [{ required: true, message: '请输入经营范围!' }],
                                                initialValue: supplierBasicInfo.spNo
                                            })(
                                                <Input
                                                    placeholder="经营范围"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>供应商质保金收取金额：</span>
                                        <FormItem>
                                            {getFieldDecorator('guaranteeMoney', {
                                                rules: [{ required: true, message: '请输入供应商质保金收取金额!' }],
                                                initialValue: supplierBasicInfo.spNo
                                            })(
                                                <Input
                                                    placeholder="供应商质保金收取金额"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                            元
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className="add-message-handle">
                        <Button onClick={this.handleNextStep}>下一步</Button>
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
export default Form.create()(LicenseInfo);
