/**
 * @file locationInformation.jsx
 * @author shijh
 *
 * 供应地点信息
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
// import Tools from './utils';

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
        // const { form, onGoTo, isEdit, detailData = {} } = this.props;
        // Tools.checkAddress(this.companyAddress, 'companyAddress', this);
        // Tools.checkAddress(this.bankLoc, 'bankLoc', this);
        // form.validateFields((err, values) => {
        //     if (!err) {
        //         const {
        //             accountName,
        //             bankAccount,
        //             taxpayerType,
        //             companyDetailAddress,
        //             companyName,
        //             mainAccountNo,
        //             openBank,
        //             spNo,
        //             spRegNo,
        //             taxpayerNumber,
        //         } = values;

        //         this.submitData.supplierBasicInfo = {
        //             companyName,
        //             spNo,
        //             spRegNo,
        //             mainAccountNo
        //         };

        //         const { firstValue, secondValue, thirdValue } = this.companyAddress;

        //         this.submitData.supplierOperTaxInfo = {
        //             companyLocProvince: firstValue.regionName,
        //             companyLocCity: secondValue.regionName,
        //             companyLocCounty: thirdValue.regionName,
        //             companyLocProvinceCode: firstValue.code,
        //             companyLocCityCode: secondValue.code,
        //             companyLocCountyCode: thirdValue.code,
        //             companyDetailAddress,
        //             registrationCertificate: this.certificate.getValue()[0],
        //             qualityIdentification: this.quality.getValue()[0],
        //             taxRegCertificate: this.taxReg.getValue()[0],
        //             taxpayerNumber,
        //             taxpayerType,
        //             generalTaxpayerQualifiCerti: this.general.getValue()[0],
        //         }

        //         this.submitData.supplierBankInfo = {
        //             accountName,
        //             openBank,
        //             bankAccount,
        //             bankAccountLicense: this.bank.getValue()[0],
        //             bankLocProvince: this.bankLoc.firstValue.regionName,
        //             bankLocCity: this.bankLoc.secondValue.regionName,
        //             bankLocCounty: this.bankLoc.thirdValue.regionName,
        //             bankLocCountyCode: this.bankLoc.thirdValue.code,
        //             bankLocCityCode: this.bankLoc.secondValue.code,
        //             bankLocProvinceCode: this.bankLoc.firstValue.code,
        //         }

        //         if (isEdit) {
        //             Object.assign(
        //                 this.submitData.supplierBasicInfo,
        //                 {id: detailData.supplierBasicInfo.id}
        //             )
        //             Object.assign(
        //                 this.submitData.supplierOperTaxInfo,
        //                 {id: detailData.supplierOperTaxInfo.id}
        //             )
        //             Object.assign(
        //                 this.submitData.supplierBankInfo,
        //                 {id: detailData.supplierBankInfo.id}
        //             )
        //         }

        //         this.props.addSupplierMessage1(this.submitData)
        //         onGoTo('2');
        //     }
        // })
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
            <div className="supplier-add-message supplier-add-space">
                <Form>
                    <div className="supplier-add-item">
                        <div className="add-message supplier-add-space-basic">
                            <div className="add-message-header">
                                <Icon type="solution" className="add-message-header-icon" />基础信息
                            </div>
                            <div className="add-message-body">
                                <Row>
                                    <Col span={8}><span>供应商编号：</span><span>YTXC1001</span></Col>
                                    <Col span={8}><span>供应商名称：</span><span>深圳市豪利门业实业有限公司</span></Col>
                                </Row>
                                <Row>
                                    <Col span={8}><span>供应商等级：</span><span>战略供应商</span></Col>
                                    <Col span={8}><span>供应商入驻日期：</span><span>2017-07-02</span></Col>
                                </Row>
                                <Row>
                                    <Col span={8}><span>供应商地点编号：</span><span>1000001</span></Col>
                                    <Col span={8}><span>供应商地点名称：</span><span>四川 - 深圳市豪利门业实业有限公司</span></Col>
                                </Row>
                                <Row>
                                    <Col span={8}><span>供应商地点状态：</span><span>草稿</span></Col>
                                    <Col span={8}>
                                        <span>供应商地点经营状态：</span>
                                        <FormItem>
                                            {getFieldDecorator('locationStatus', {
                                                rules: [{required: true, message: '请选择供应商地点经营状态'}],
                                                initialValue: String(supplierOperTaxInfo.taxpayerType ? supplierOperTaxInfo.taxpayerType : 0)
                                            })(
                                                <Select
                                                    style={{ width: 140 }}
                                                    placeholder="供应商地点经营状态"
                                                >
                                                    <Option value="0">启用</Option>
                                                    <Option value="1">禁用</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>供应商地点到货周期：</span>
                                        <FormItem>
                                            {getFieldDecorator('spNo', {
                                                rules: [{ required: true, message: '请输入供应商地点到货周期!' }],
                                                initialValue: supplierBasicInfo.spNo
                                            })(
                                                <Input
                                                    placeholder="供应商地点到货周期"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>账期：</span>
                                        <FormItem>
                                            {getFieldDecorator('locationStatus', {
                                                rules: [{required: true, message: '请选择账期！'}],
                                                initialValue: String(supplierOperTaxInfo.taxpayerType ? supplierOperTaxInfo.taxpayerType : 0)
                                            })(
                                                <Select
                                                    style={{ width: 140 }}
                                                    placeholder="供应商账期"
                                                >
                                                    <Option value="0">月结</Option>
                                                    <Option value="1">半月结</Option>
                                                    <Option value="2">票到付款</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>供应商地点级别：</span>
                                        <FormItem>
                                            {getFieldDecorator('supplierLevel', {
                                                rules: [{required: true, message: '请选择供应商地点级别'}],
                                                initialValue: String(supplierOperTaxInfo.taxpayerType ? supplierOperTaxInfo.taxpayerType : 0)
                                            })(
                                                <Select
                                                    style={{ width: 140 }}
                                                    placeholder="供应商地点级别"
                                                >
                                                    <Option value="0">生产厂家</Option>
                                                    <Option value="1">批发商</Option>
                                                    <Option value="2">经销商</Option>
                                                    <Option value="2">代销商</Option>
                                                    <Option value="2">其他</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>供应商地点级别：</span>
                                        <FormItem>
                                            {getFieldDecorator('supplierLevel', {
                                                rules: [{required: true, message: '请选择供应商地点所属区域'}],
                                                initialValue: String(supplierOperTaxInfo.taxpayerType ? supplierOperTaxInfo.taxpayerType : 0)
                                            })(
                                                <Select
                                                    style={{ width: 140 }}
                                                    placeholder="供应商地点所属区域"
                                                >
                                                    <Option value="0">四川</Option>
                                                    <Option value="1">广州</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>供应商地点到货周期：</span>
                                        <FormItem>
                                            {getFieldDecorator('spNo', {
                                                rules: [{ required: true, message: '请输入供应商地点到货周期!' }],
                                                initialValue: supplierBasicInfo.spNo
                                            })(
                                                <Input
                                                    placeholder="供应商地点到货周期"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>账期：</span>
                                        <FormItem>
                                            {getFieldDecorator('locationStatus', {
                                                rules: [{required: true, message: '请选择账期！'}],
                                                initialValue: String(supplierOperTaxInfo.taxpayerType ? supplierOperTaxInfo.taxpayerType : 0)
                                            })(
                                                <Select
                                                    style={{ width: 140 }}
                                                    placeholder="供应商账期"
                                                >
                                                    <Option value="0">月结</Option>
                                                    <Option value="1">半月结</Option>
                                                    <Option value="2">票到付款</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>供应商审核人：</span>
                                        <FormItem>
                                            {getFieldDecorator('spNo', {
                                                rules: [{ required: true, message: '请输入供应商审核人!' }],
                                                initialValue: supplierBasicInfo.spNo
                                            })(
                                                <Input
                                                    placeholder="供应商审核人"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} id="handle-time">
                                        <span>供应商审核日期：</span>
                                        <FormItem>
                                            {getFieldDecorator('arrivalDate', {
                                                rules: [{required: true, message: '请选择供应商审核日期'}],
                                                initialValue: moment('2015/01/01', dateFormat)
                                            })(
                                                <DatePicker
                                                    getCalendarContainer={() => document.getElementById('handle-time')}
                                                    format={dateFormat}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className="supplier-add-item  supplier-add-space-basic">
                        <div className="add-message">
                            <div className="add-message-header">
                                <Icon type="solution" className="add-message-header-icon" />送货信息
                            </div>
                            <div className="add-message-body">
                                <Row>
                                    <Col span={8}>
                                        <span>仓储服务方：</span>
                                        <FormItem>
                                            {getFieldDecorator('locationStatus', {
                                                rules: [{required: true, message: '请选择仓储服务方!'}],
                                                initialValue: String(supplierOperTaxInfo.taxpayerType ? supplierOperTaxInfo.taxpayerType : 0)
                                            })(
                                                <Select
                                                    style={{ width: 140 }}
                                                    placeholder="仓储服务方"
                                                >
                                                    <Option value="0">新希望集团</Option>
                                                    <Option value="1">蒙牛集团</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>供应商送货仓库编码：</span>
                                        <FormItem>
                                            {getFieldDecorator('spNo', {
                                                rules: [{ required: true, message: '请输入供应商送货仓库编码!' }],
                                                initialValue: supplierBasicInfo.spNo
                                            })(
                                                <Input
                                                    placeholder="供应商送货仓库编码"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>供应商送货仓库名称：</span>
                                        <FormItem>
                                            {getFieldDecorator('locationStatus', {
                                                rules: [{required: true, message: '请选择供应商送货仓库名称!'}],
                                                initialValue: String(supplierOperTaxInfo.taxpayerType ? supplierOperTaxInfo.taxpayerType : 0)
                                            })(
                                                <Select
                                                    style={{ width: 140 }}
                                                    placeholder="供应商送货仓库名称"
                                                >
                                                    <Option value="0">雅堂一号仓库</Option>
                                                    <Option value="1">雅堂二号仓库</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>供应商送货仓储区域：</span>
                                        <CasadingAddress
                                            id="licenseLoc"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>供应商送货仓库详细地址：</span>
                                        <FormItem>
                                            {getFieldDecorator('spNo', {
                                                rules: [{ required: true, message: '请输入供应商送货仓库详细地址!' }],
                                                initialValue: supplierBasicInfo.spNo
                                            })(
                                                <Input
                                                    placeholder="供应商送货仓库详细地址"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>供应商送货仓库联系人：</span>
                                        <FormItem>
                                            {getFieldDecorator('spNo', {
                                                rules: [{ required: true, message: '请输入供应商送货仓库联系人!' }],
                                                initialValue: supplierBasicInfo.spNo
                                            })(
                                                <Input
                                                    placeholder="供应商供应商送货仓库联系人"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>供应商送货仓库联系方式：</span>
                                        <FormItem>
                                            {getFieldDecorator('spNo', {
                                                rules: [{ required: true, message: '请输入供应商送货仓库联系方式!' }],
                                                initialValue: supplierBasicInfo.spNo
                                            })(
                                                <Input
                                                    placeholder="供应商送货仓库联系方式"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className="supplier-add-item  supplier-add-basic">
                        <div className="add-message">
                            <div className="add-message-header">
                                <Icon type="solution" className="add-message-header-icon" />联系信息
                            </div>
                            <div className="add-message-body">
                                <Row>
                                    <Col span={8}>
                                        <span>供应商姓名：</span>
                                        <FormItem>
                                            {getFieldDecorator('spNo', {
                                                rules: [{ required: true, message: '请输入供应商姓名!' }],
                                                initialValue: supplierBasicInfo.spNo
                                            })(
                                                <Input
                                                    placeholder="供应商姓名"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>供应商电话：</span>
                                        <FormItem>
                                            {getFieldDecorator('spNo', {
                                                rules: [
                                                    { required: true, message: '请输入供应商电话!' },
                                                    Validator.phone
                                                ],
                                                initialValue: supplierBasicInfo.spNo
                                            })(
                                                <Input
                                                    placeholder="供应商电话"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>供应商邮箱：</span>
                                        <FormItem>
                                            {getFieldDecorator('spNo', {
                                                rules: [
                                                    { required: true, message: '请输入供应商邮箱!' },
                                                    { type: 'email', message: '请输入正确的邮箱!'}
                                                ],
                                                initialValue: supplierBasicInfo.spNo
                                            })(
                                                <Input
                                                    placeholder="供应商邮箱"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>采购员姓名：</span>
                                        <FormItem>
                                            {getFieldDecorator('spNo', {
                                                rules: [{ required: true, message: '请输入采购员姓名!' }],
                                                initialValue: supplierBasicInfo.spNo
                                            })(
                                                <Input
                                                    placeholder="采购员姓名"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>采购员电话：</span>
                                        <FormItem>
                                            {getFieldDecorator('spNo', {
                                                rules: [
                                                    { required: true, message: '请输入采购员电话!' },
                                                    Validator.phone
                                                ],
                                                initialValue: supplierBasicInfo.spNo
                                            })(
                                                <Input
                                                    placeholder="采购员电话"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>采购员邮箱：</span>
                                        <FormItem>
                                            {getFieldDecorator('spNo', {
                                                rules: [
                                                    { required: true, message: '请输入采购员邮箱!' },
                                                    { type: 'email', message: '请输入正确的邮箱!'}
                                                ],
                                                initialValue: supplierBasicInfo.spNo
                                            })(
                                                <Input
                                                    placeholder="采购员邮箱"
                                                    onBlur={(e) => { Validator.repeat.spNo(e, this, supplierBasicInfo.id) }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className="add-message-handle">
                        <Button onClick={this.handleNextStep}>提    交</Button>
                        <Button onClick={this.handleNextStep}>保存草稿 </Button>
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
