/**
 * @file basicInfo.jsx
 * @author shijh
 *
 * 基础信息
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { Icon, Input, Form, Button, Select, Row, Col, DatePicker } from 'antd';

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
class BasicInfo extends PureComponent {
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
                        <div className="add-message supplier-add-basic">
                            <div className="add-message-header">
                                <Icon type="solution" className="add-message-header-icon" />基础信息
                            </div>
                            <div className="add-message-body">
                                <Row>
                                    <Col span={8}><span>供应商类型：</span><span>供应商</span></Col>
                                    <Col span={8}><span>供应商状态：</span><span>工作表</span></Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>供应商编号：</span>
                                        <span>YTXC1001</span>
                                    </Col>
                                    <Col span={8}>
                                        <span>供应商名称：</span>
                                        <FormItem>
                                            {getFieldDecorator('companyName', {
                                                rules: [{ required: true, message: '请输入供应商名称!' }],
                                                initialValue: supplierBasicInfo.companyName
                                            })(
                                                <Input
                                                    placeholder="供应商名称"
                                                    onBlur={(e) => { Validator.repeat.companyName(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>供应商等级：</span>
                                        <FormItem>
                                            {getFieldDecorator('supplierLevel', {
                                                rules: [{required: true, message: '请选择等级'}],
                                                initialValue: String(supplierOperTaxInfo.taxpayerType ? supplierOperTaxInfo.taxpayerType : 0)
                                            })(
                                                <Select
                                                    style={{ width: 140 }}
                                                    placeholder="请选择供应商等级"
                                                >
                                                    <Option value="0">战略供应商</Option>
                                                    <Option value="1">核心供应商</Option>
                                                    <Option value="2">可替代供应商</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} id="in-time">
                                        <span>供应商入驻日期：</span>
                                        <FormItem>
                                            {getFieldDecorator('arrivalDate', {
                                                rules: [{required: true, message: '请选择供应商入驻日期'}],
                                                initialValue: null
                                            })(
                                                <DatePicker
                                                    getCalendarContainer={() => document.getElementById('in-time')}
                                                    format={dateFormat} />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div
                        className="supplier-add-item  supplier-add-city"
                        id="supplier-add-city"
                    >
                        <div className="add-message">
                            <div className="add-message-header">
                                <Icon type="solution" className="add-message-header-icon" />供应商辐射城市
                            </div>
                            <div className="add-message-body">
                                <InlineTree
                                    initValue={queryAllLargerRegionProvince.data}
                                />
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

BasicInfo.propTypes = {
    onGoTo: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    isEdit: PropTypes.bool,
    detailData: PropTypes.objectOf(PropTypes.any),
    addSupplierMessage1: PropTypes.func,
}
export default Form.create()(BasicInfo);
