import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, Input, Form, Button, Select } from 'antd';

import Utils from '../../util/util';
import { Validator } from '../../util/validator';
import InlineUpload from '../../components/inlineUpload';
import CasadingAddress from '../../components/ascadingAddress';
import { addSupplierMessage1 } from '../../actions/addSupplier';
import Tools from './utils';

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
class SupplierMessage extends PureComponent {
    constructor(props) {
        super(props);

        this.handleNextStep = ::this.handleNextStep;
        this.handleCompanyAddressChange = ::this.handleCompanyAddressChange;
        this.handleBankLocChange = ::this.handleBankLocChange;
        this.companyAddress = {};
        this.bankLoc = {};
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
            supplierBankInfo = {}
        } = initData;
        return (
            <div className="supplier-add-message">
                <Form>
                    <div className="supplier-add-item">
                        <div className="add-message">
                            <div className="add-message-header">
                                <Icon type="solution" className="add-message-header-icon" />供应商信息
                            </div>
                            <div className="add-message-body">
                                <ul className="add-message-list">
                                    <FormItem>
                                        <li className="add-message-item">
                                            <span>*公司名称：</span>
                                            <span>
                                                {getFieldDecorator('companyName', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请输入公司名!'
                                                    }],
                                                    initialValue: supplierBasicInfo.companyName
                                                })(
                                                    <Input
                                                        placeholder="请输入公司名"
                                                        onBlur={(e) => { Validator.repeat.companyName(e, this, supplierBasicInfo.id) }}
                                                    />
                                                )}
                                            </span>
                                        </li>
                                    </FormItem>
                                    <FormItem>
                                        <li className="add-message-item">
                                            <span>*供应商编号：</span>
                                            <span>
                                                {getFieldDecorator('spNo', {
                                                    rules: [{ required: true, message: '请输入供应商编号!' }],
                                                    initialValue: supplierBasicInfo.spNo
                                                })(
                                                    <Input
                                                        placeholder="供应商编号"
                                                        onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                    />
                                                )}
                                            </span>
                                        </li>
                                    </FormItem>
                                    <FormItem>
                                        <li className="add-message-item">
                                            <span>*供应商注册号：</span>
                                            <span>
                                                {getFieldDecorator('spRegNo', {
                                                    rules: [{ required: true, message: '请输入供应商编号!' }],
                                                    initialValue: supplierBasicInfo.spRegNo
                                                })(
                                                    <Input placeholder="供应商注册号" onBlur={(e) => { Validator.repeat.spRegNo(e, this, supplierBasicInfo.id) }} />
                                                )}
                                            </span>
                                        </li>
                                    </FormItem>
                                    <FormItem>
                                        <li className="add-message-item">
                                            <span>*供应商主账号：</span>
                                            <span>
                                                {getFieldDecorator('mainAccountNo', {
                                                    rules: [{ required: true, message: '请输入供应商主账号!' }],
                                                    initialValue: supplierBasicInfo.mainAccountNo
                                                })(
                                                    <Input placeholder="供应商主账号" onBlur={(e) => { Validator.repeat.mainAccountNo(e, this, supplierBasicInfo.id) }} />
                                                )}
                                            </span>
                                        </li>
                                    </FormItem>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="supplier-add-item">
                        <div className="add-message-header">
                            <Icon type="solution" className="add-message-header-icon" />公司经营及税务信息
                        </div>
                        <div className="add-message-body">
                            <ul className="add-message-list">
                                <FormItem>
                                    {getFieldDecorator('companyAddress', {
                                    })(
                                        <li className="add-message-item"><span>公司所在地：</span>
                                            <span>
                                                {
                                                    !isEdit
                                                    ? <span><CasadingAddress
                                                        id="space"
                                                        showNum="3"
                                                        onChange={this.handleCompanyAddressChange}
                                                    /></span>
                                                    : <CasadingAddress
                                                        id="space"
                                                        showNum="3"
                                                        defaultValue={[
                                                            supplierOperTaxInfo.companyLocProvinceCode,
                                                            supplierOperTaxInfo.companyLocCityCode,
                                                            supplierOperTaxInfo.companyLocCountyCode
                                                        ]}
                                                        onChange={this.handleCompanyAddressChange}
                                                    />
                                                }
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
                                                initialValue: supplierOperTaxInfo.companyDetailAddress
                                            })(
                                                <Input placeholder="公司详细地址" />
                                            )}
                                        </span>
                                    </li>
                                </FormItem>
                                <li className="add-message-item"><span>商标注册证/受理通知书：</span>
                                    <InlineUpload
                                        key="il-1"
                                        datas={
                                            supplierOperTaxInfo.registrationCertificate
                                            ? [supplierOperTaxInfo.registrationCertificate]
                                            : []
                                        }
                                        ref={ref => { this.certificate = ref }}
                                    />
                                </li>
                                <li className="add-message-item"><span>食品安全许可证：</span>
                                    <InlineUpload
                                        key="il-2"
                                        datas={
                                            supplierOperTaxInfo.qualityIdentification
                                            ? [supplierOperTaxInfo.qualityIdentification]
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
                                                initialValue: supplierOperTaxInfo.taxpayerNumber
                                            })(
                                                <Input placeholder="纳税人识别号" onBlur={(e) => { Validator.repeat.taxpayerNumber(e, this, supplierOperTaxInfo.id) }} />
                                            )}
                                        </span>
                                    </li>
                                </FormItem>
                                <FormItem>
                                    <li className="add-message-item"><span>*纳税人类型：</span>
                                        {getFieldDecorator('taxpayerType', {
                                            initialValue: String(supplierOperTaxInfo.taxpayerType ? supplierOperTaxInfo.taxpayerType : 0)
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
                                                key="il-3"
                                                datas={
                                                    supplierOperTaxInfo.taxRegCertificate
                                                    ? [supplierOperTaxInfo.taxRegCertificate]
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
                                                key="il-4"
                                                datas={
                                                    supplierOperTaxInfo.generalTaxpayerQualifiCerti
                                                    ? [supplierOperTaxInfo.generalTaxpayerQualifiCerti]
                                                    : []
                                                }
                                                ref={ref => { this.general = ref }}
                                            />
                                        </li>
                                    )}
                                </FormItem>
                            </ul>
                        </div>
                    </div>
                    <div className="supplier-add-item">
                        <div className="add-message-header">
                            <Icon type="solution" className="add-message-header-icon" />银行信息
                        </div>
                        <div className="add-message-body">
                            <ul className="add-message-list">
                                <FormItem>
                                    <li className="add-message-item">
                                        <span>*开户名：</span>
                                        <span>
                                            {getFieldDecorator('accountName', {
                                                rules: [{ required: true, message: '请输入开户名!' }],
                                                initialValue: supplierBankInfo.accountName
                                            })(
                                                <Input placeholder="开户名" />
                                            )}
                                        </span>
                                    </li>
                                </FormItem>
                                <FormItem>
                                    <li className="add-message-item">
                                        <span>*开户行：</span>
                                        <span>
                                            {getFieldDecorator('openBank', {
                                                rules: [{ required: true, message: '请填入开户行!' }],
                                                initialValue: supplierBankInfo.openBank
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
                                                {
                                                    !isEdit
                                                    ? <span><CasadingAddress
                                                        id="bank"
                                                        showNum="3"
                                                        onChange={this.handleBankLocChange}
                                                    /></span>
                                                    : <CasadingAddress
                                                        id="bank"
                                                        showNum="3"
                                                        defaultValue={[
                                                            supplierBankInfo.bankLocProvinceCode,
                                                            supplierBankInfo.bankLocCityCode,
                                                            supplierBankInfo.bankLocCountyCode
                                                        ]}
                                                        onChange={this.handleBankLocChange}
                                                    />
                                                }
                                            </span>
                                        </li>
                                    )}
                                </FormItem>
                                <FormItem>
                                    <li className="add-message-item">
                                        <span>*银行账号：</span>
                                        {getFieldDecorator('bankAccount', {
                                            rules: [{ required: true, message: '请输入银行账户!' }],
                                            initialValue: supplierBankInfo.bankAccount
                                        })(
                                            <Input placeholder="银行账号" onBlur={(e) => { Validator.repeat.bankAccount(e, this, supplierBankInfo.id) }} />
                                        )}
                                    </li>
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('bankAccountLicense', {
                                    })(
                                        <li className="add-message-item"><span>*银行开户许可证电子版：</span>
                                            <InlineUpload
                                                key="il-5"
                                                datas={
                                                    supplierBankInfo.bankAccountLicense
                                                    ? [supplierBankInfo.bankAccountLicense]
                                                    : []
                                                }
                                                ref={ref => { this.bank = ref }}
                                            />
                                        </li>
                                    )}
                                </FormItem>
                            </ul>
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

SupplierMessage.propTypes = {
    onGoTo: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    isEdit: PropTypes.bool,
    detailData: PropTypes.objectOf(PropTypes.any),
    addSupplierMessage1: PropTypes.func,
}
export default Form.create()(SupplierMessage);
