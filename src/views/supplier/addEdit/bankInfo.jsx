/**
 * @file bankInfo.jsx
 * @author shijh
 *
 * 银行信息
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, Input, Form, Button, Select, Row, Col} from 'antd';

import Utils from '../../../util/util';
import { Validator } from '../../../util/validator';
import InlineUpload from '../../../components/inlineUpload';
import CasadingAddress from '../../../components/ascadingAddress';
import { addSupplierMessage1 } from '../../../actions/addSupplier';
import InlineTree from '../../../components/inlineTree';
import Tools from './utils';

const dateFormat = 'YYYY-MM-DD';
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
class BankInfo extends PureComponent {
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
                    <div className="supplier-add-item supplier-add-bank">
                        <div className="add-message">
                            <div className="add-message-header">
                                <Icon type="solution" className="add-message-header-icon" />银行信息
                            </div>
                            <div className="add-message-body">
                                <Row>
                                    <Col span={8}><span>开户名：</span><span>深圳市豪利门业实业有限公司</span></Col>
                                    <Col span={8}>
                                        <span>供应商发票抬头：</span>
                                        <FormItem>
                                            {getFieldDecorator('invoiceHead', {
                                                rules: [{required: true, message: '请选择供应商发票抬头'}],
                                                initialValue: supplierBankInfo.invoiceHead
                                            })(
                                                <Input
                                                    placeholder="供应商发票抬头"
                                                    onBlur={(e) => { Validator.repeat.companyName(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>开户行所在地：</span>
                                        <CasadingAddress
                                            id="licenseLoc"
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <span>开户行：</span>
                                        <FormItem>
                                            {getFieldDecorator('openBank', {
                                                rules: [{ required: true, message: '请输入开户行!' }],
                                                initialValue: supplierBankInfo.openBank
                                            })(
                                                <Input
                                                    placeholder="供应商开户行"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>银行账号：</span>
                                        <FormItem>
                                            {getFieldDecorator('bankAccount', {
                                                rules: [{ required: true, message: '请输入银行账号!' }],
                                                initialValue: supplierBankInfo.bankAccount
                                            })(
                                                <Input
                                                    placeholder="银行账号"
                                                    onBlur={(e) => { Validator.repeat.companyName(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>银行开户许可证电子版：</span>
                                        <InlineUpload />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className="add-message-handle">
                        <Button onClick={this.handleNextStep}>上一步</Button>
                        <Button onClick={this.handleNextStep}>下一步</Button>
                    </div>
                </Form>
            </div>
        )
    }
}

BankInfo.propTypes = {
    onGoTo: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    isEdit: PropTypes.bool,
    detailData: PropTypes.objectOf(PropTypes.any),
    addSupplierMessage1: PropTypes.func,
}
export default Form.create()(BankInfo);
