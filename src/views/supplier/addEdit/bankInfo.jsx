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
        this.handlePreStep = ::this.handlePreStep;
        this.companyAddress = {};
        this.submitData = {};
    }

    componentDidMount() {
        this.props.form.refs = this;
    }

    handleNextStep() {
        const { form, onGoTo, isEdit, detailData = {}, data = {} } = this.props;
        const { supplierBasicInfo = {} } = data;
        Tools.checkAddress(this.companyAddress, 'companyAddress', this);
        form.validateFields((err, values) => {
            const upload = this.nodebankFile.getValue();
            const { firstValue, secondValue, thirdValue } = this.companyAddress;
            if (!err) {
                const {
                    bankAccount,
                    invoiceHead,
                    openBank
                } = values;

                const supplierBankInfo = {
                    bankAccount,
                    invoiceHead,
                    openBank,
                    accountName: supplierBasicInfo.companyName,
                    bankAccountLicense: upload.files[0],
                    bankLocProvince: firstValue.regionName,
                    bankLocCity: secondValue.regionName,
                    bankLocCounty: thirdValue.regionName,
                    bankLocProvinceCode: firstValue.code,
                    bankLocCityCode: secondValue.code,
                    bankLocCountyCode: thirdValue.code,
                }
                if (isEdit) {
                    Object.assign(supplierBankInfo,
                        {
                            id: detailData.supplierBankInfo.id,
                            status:  detailData.supplierBankInfo.status
                        }
                    );
                }

                this.props.addSupplierMessage1({supplierBankInfo});
                onGoTo('3');
            }
        })
    }

    handlePreStep() {
        this.props.onGoTo('1')
    }

    handleCompanyAddressChange(data) {
        this.companyAddress = data;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { detailData, isEdit } = this.props;
        const { companyName = '' } = this.props.data.supplierBasicInfo;
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
                                    <Col span={8}><span>开户名：</span><span>{companyName}</span></Col>
                                    <Col span={8}>
                                        <span>供应商发票抬头：</span>
                                        <FormItem>
                                            {getFieldDecorator('invoiceHead', {
                                                rules: [{required: true, message: '请选择供应商发票抬头'}],
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
                                        <span>开户行所在地：</span>
                                        <CasadingAddress
                                            id="companyAddress"
                                            defaultValue={
                                                isEdit && [
                                                    supplierBankInfo.bankLocProvinceCode,
                                                    supplierBankInfo.bankLocCityCode,
                                                    supplierBankInfo.bankLocCountyCode
                                                ]
                                            }
                                            onChange={this.handleCompanyAddressChange}
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
                                                    onBlur={(e) => { Validator.repeat.bankAccount(e, this, supplierBankInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>银行开户许可证电子版：</span>
                                        <InlineUpload
                                            datas={isEdit ? [supplierBankInfo.bankAccountLicense] : []}
                                            ref={node => (this.nodebankFile = node)}
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
    addSupplierMessage1: PropTypes.func,
}
export default Form.create()(BankInfo);
