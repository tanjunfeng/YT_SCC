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
import {
    Icon, Input, Form,
    Button, Row, Col
} from 'antd';

import Utils from '../../../util/util';
import { Validator } from '../../../util/validator';
import InlineUpload from '../../../components/inlineUpload';
import CasadingAddress from '../../../components/ascadingAddress';
import { addSupplierMessage1 } from '../../../actions/addSupplier';
import Tools from './utils';
import { TABCONTENT } from '../../../constant';

const FormItem = Form.Item;

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

        this.handleCompanyAddressChange = this.handleCompanyAddressChange.bind(this);
        this.companyAddress = {};
        this.submitData = {};
        const { detailData = {} } = this.props;
        const { supplierBankInfo = {} } = detailData;
        const { accountName = '' } = supplierBankInfo;
        this.state = {
            companyName: accountName,
        }
    }

    componentDidMount() {
        TABCONTENT.BankInfo = this;
    }

    handleGoTo = (key) => {
        const { form, onGoTo } = this.props;
        Tools.checkAddress(this.companyAddress, 'companyAddress', this);
        const { firstValue, secondValue, thirdValue } = this.companyAddress;
        if (firstValue === '-1' || secondValue === '-1' || thirdValue === '-1') {
            return;
        }
        const upload = this.nodebankFile.getValue();
        form.validateFields((err, values) => {
            if (!err) {
                const {
                    bankAccount,
                    invoiceHead,
                    openBank,
                    companyName
                } = values;
                const supplierBankInfo = Utils.removeInvalid({
                    bankAccount,
                    invoiceHead,
                    openBank,
                    accountName: companyName,
                    bankAccountLicense: upload.files[0],
                    bankLocProvince: firstValue.regionName,
                    bankLocCity: secondValue.regionName,
                    bankLocCounty: thirdValue.regionName,
                    bankLocProvinceCode: firstValue.code,
                    bankLocCityCode: secondValue.code,
                    bankLocCountyCode: thirdValue.code,
                })

                this.props.addSupplierMessage1({ supplierBankInfo });
                onGoTo(key);
            }
        });
    }

    handleNextStep = () => {
        this.handleGoTo('3');
        const { form, onGoTo } = this.props;
        Tools.checkAddress(this.companyAddress, 'companyAddress', this);
        const { firstValue, secondValue, thirdValue } = this.companyAddress;
        if (firstValue === '-1' || secondValue === '-1' || thirdValue === '-1') {
            return;
        }
        const upload = this.nodebankFile.getValue();
        form.validateFields((err, values) => {
            if (!err) {
                const {
                    bankAccount,
                    invoiceHead,
                    openBank,
                    companyName
                } = values;
                const supplierBankInfo = Utils.removeInvalid({
                    bankAccount,
                    invoiceHead,
                    openBank,
                    accountName: companyName,
                    bankAccountLicense: upload.files[0],
                    bankLocProvince: firstValue.regionName,
                    bankLocCity: secondValue.regionName,
                    bankLocCounty: thirdValue.regionName,
                    bankLocProvinceCode: firstValue.code,
                    bankLocCityCode: secondValue.code,
                    bankLocCountyCode: thirdValue.code,
                })

                this.props.addSupplierMessage1({ supplierBankInfo });
            }
        });
    }

    handlePreStep = () => {
        this.props.onGoTo('1');
    }

    handleCompanyAddressChange(data) {
        this.companyAddress = data;
        const { getFieldError } = this.props.form;
        if (
            getFieldError('companyAddress')
            && this.companyAddress.thirdValue
            && this.companyAddress.thirdValue !== '-1'
        ) {
            this.props.form.setFields({
                companyAddress: {
                    error: null
                }
            })
        }
    }

    handleCompanyNameChange = (e) => {
        this.setState({
            companyName: e.target.value
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { detailData, isEdit, data = {} } = this.props;
        const { supplierBasicInfo = {} } = data;
        const { companyName = '' } = supplierBasicInfo;
        let initData = detailData;
        if (!isEdit) {
            initData = {};
        }
        const {
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
                                    <Col span={8}><span>*开户名：</span>
                                        <FormItem>
                                            {getFieldDecorator('companyName', {
                                                rules: [
                                                    { required: true, message: '请输入开户名' },
                                                    { max: 150, message: '字符长度超限' }
                                                ],
                                                initialValue: this.state.companyName ?
                                                    this.state.companyName : companyName
                                            })(
                                                <Input
                                                    onChange={this.handleCompanyNameChange}
                                                    placeholder="开户名"
                                                />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>*供应商发票抬头：</span>
                                        <FormItem>
                                            {getFieldDecorator('invoiceHead', {
                                                rules: [
                                                    { required: true, message: '请选择供应商发票抬头' },
                                                    { max: 250, message: '字符长度超限' }
                                                ],
                                                initialValue: supplierBankInfo.invoiceHead
                                            })(
                                                <Input
                                                    placeholder="供应商发票抬头"
                                                />
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>*开户行所在地：</span>
                                        <FormItem>
                                            {getFieldDecorator('companyAddress', {
                                            })(
                                                <div>
                                                    <CasadingAddress
                                                        id="companyAddress"
                                                        defaultValue={
                                                            isEdit ? [
                                                                supplierBankInfo
                                                                    .bankLocProvinceCode,
                                                                supplierBankInfo
                                                                    .bankLocCityCode,
                                                                supplierBankInfo
                                                                    .bankLocCountyCode
                                                            ] : []
                                                        }
                                                        onChange={this.handleCompanyAddressChange}
                                                    />
                                                </div>
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>*开户行：</span>
                                        <FormItem>
                                            {getFieldDecorator('openBank', {
                                                rules: [
                                                    { required: true, message: '请输入开户行!' },
                                                    { max: 50, message: '长度超限' },
                                                    {
                                                        validator: (rule, value, callback) => {
                                                            if (value && !/^[\u4e00-\u9fa5]+$/.test(value)) {
                                                                callback('不允许输入汉字外其他字符')
                                                            }
                                                            callback()
                                                        }
                                                    }
                                                ],
                                                initialValue: supplierBankInfo.openBank
                                            })(
                                                <Input
                                                    placeholder="供应商开户行"
                                                />
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>*银行账号：</span>
                                        <FormItem>
                                            {getFieldDecorator('bankAccount', {
                                                rules: [
                                                    { required: true, message: '请输入银行账号!' },
                                                    { max: 30, message: '长度超限' },
                                                    {
                                                        validator: (rule, value, callback) => {
                                                            if (!/^[0-9]*$/.test(value)) {
                                                                callback('请输入数字')
                                                            }
                                                            callback()
                                                        }
                                                    }
                                                ],
                                                initialValue: Utils.trimAll(
                                                    supplierBankInfo.bankAccount)
                                            })(
                                                <Input
                                                    style={{ width: '200px' }}
                                                    placeholder="银行账号"
                                                    onBlur={
                                                        (e) => {
                                                            Validator.repeat.bankAccount(
                                                                e,
                                                                this,
                                                                supplierBankInfo.id,
                                                                supplierBankInfo.status
                                                            )
                                                        }
                                                    }
                                                />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>银行开户许可证电子版：</span>
                                        <InlineUpload
                                            datas={
                                                isEdit ? [supplierBankInfo.bankAccountLicense] : []}
                                            ref={node => { this.nodebankFile = node }}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className="add-message-handle">
                        <Button onClick={this.handlePreStep}>上一步</Button>
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
    data: PropTypes.objectOf(PropTypes.any),
    addSupplierMessage1: PropTypes.func
}
export default Form.create()(BankInfo);
