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
import { fetchSupplierNo } from '../../../actions/supplier';
import Warehouse from './warehouse';

// mock
import queryAllLargerRegionProvince from '../../../../mock/queryAllLargerRegionProvince';

const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const Option = Select.Option;


@connect(
    state => ({
        data: state.toJS().addSupplier.data,
        supplierId: state.toJS().supplier.supplierId
    }),
    dispatch => bindActionCreators({
        addSupplierMessage1,
        fetchSupplierNo
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
        this.props.fetchSupplierNo({type: 'SP_ADR'})
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

    /**
     * 供应商等级转换
     * @param {number} grade 供应商等级
     */
    renderGrade(grade) {
        switch(grade) {
            case 1:
                return '战略供应商'
            case 2:
                return '核心供应商'
            case 3:
                return '可替代供应商'
            default:
                break;
        }
        return null;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { detailData, detailSp, isEdit } = this.props;
        // let initData = detailData;
        // if (!isEdit) {
        //     initData = {};
        // }
        const {
            supplierBasicInfo = {},
            supplierOperTaxInfo = {},
            supplierBankInfo = {}
        } = detailData;
        const {
            spAdrBasic = {},
            spAdrContact = {},
        } = detailSp
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
                                    <Col span={8}><span>供应商编号：</span>
                                        <span>{supplierBasicInfo.spNo}</span>
                                    </Col>
                                    <Col span={8}><span>供应商名称：</span>
                                        <span>{supplierBasicInfo.companyName}</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}><span>供应商等级：</span>
                                        <span>{this.renderGrade(supplierBasicInfo.grade)}</span>
                                    </Col>
                                    <Col span={8}><span>供应商入驻日期：</span>
                                        <span>
                                            {moment(supplierBasicInfo.settledTime).format('YYYY-MM-DD')}
                                        </span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}><span>供应商地点编号：</span>
                                        <span>{this.props.supplierId}</span>
                                    </Col>
                                    <Col span={8}><span>供应商地点名称：</span>
                                        <span>{supplierBasicInfo.companyName}</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}><span>供应商地点状态：</span><span>草稿</span></Col>
                                    <Col span={8}>
                                        <span>供应商地点经营状态：</span>
                                        <FormItem>
                                            {getFieldDecorator('operaStatus', {
                                                rules: [{required: true, message: '请选择供应商地点经营状态'}],
                                                initialValue: String(spAdrBasic.operaStatus ? spAdrBasic.operaStatus : 0)
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
                                            {getFieldDecorator('goodsArrivalCycle', {
                                                rules: [{ required: true, message: '请输入供应商地点到货周期!' }],
                                                initialValue: spAdrBasic.goodsArrivalCycle
                                            })(
                                                <Input
                                                    placeholder="供应商地点到货周期"
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>账期：</span>
                                        <FormItem>
                                            {getFieldDecorator('settlementPeriod', {
                                                rules: [{required: true, message: '请选择账期！'}],
                                                initialValue: spAdrBasic.settlementPeriod
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
                                            {getFieldDecorator('grade', {
                                                rules: [{required: true, message: '请选择供应商地点级别'}],
                                                initialValue: spAdrBasic.grade || '1'
                                            })(
                                                <Select
                                                    style={{ width: 140 }}
                                                    placeholder="供应商地点级别"
                                                >
                                                    <Option value="1">生产厂家</Option>
                                                    <Option value="2">批发商</Option>
                                                    <Option value="3">经销商</Option>
                                                    <Option value="4">代销商</Option>
                                                    <Option value="5">其他</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>供应商地点所属区域：</span>
                                        <FormItem>
                                            {getFieldDecorator('belongArea', {
                                                rules: [{required: true, message: '请选择供应商地点所属区域'}],
                                                initialValue: spAdrBasic.belongArea
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
                                            {getFieldDecorator('goodsArrivalCycle', {
                                                rules: [{ required: true, message: '请输入供应商地点到货周期!' }],
                                                initialValue: spAdrBasic.goodsArrivalCycle
                                            })(
                                                <Input
                                                    placeholder="供应商地点到货周期"
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>账期：</span>
                                        <FormItem>
                                            {getFieldDecorator('settlementPeriod', {
                                                rules: [{required: true, message: '请选择账期！'}],
                                                initialValue: spAdrBasic.settlementPeriod || '0'
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
                                            {getFieldDecorator('auditPerson', {
                                                rules: [{ required: true, message: '请输入供应商审核人!' }],
                                                initialValue: spAdrBasic.auditPerson
                                            })(
                                                <Input
                                                    placeholder="供应商审核人"
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} id="handle-time">
                                        <span>供应商审核日期：</span>
                                        <FormItem>
                                            {getFieldDecorator('auditDate', {
                                                rules: [{required: true, message: '请选择供应商审核日期'}],
                                                initialValue: moment(spAdrBasic.auditDate || null)
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
                                <Warehouse />
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
                                            {getFieldDecorator('providerName', {
                                                rules: [{ required: true, message: '请输入供应商姓名!' }],
                                                initialValue: spAdrContact.providerName
                                            })(
                                                <Input
                                                    placeholder="供应商姓名"
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>供应商电话：</span>
                                        <FormItem>
                                            {getFieldDecorator('providerPhone', {
                                                rules: [
                                                    { required: true, message: '请输入供应商电话!' },
                                                    Validator.phone
                                                ],
                                                initialValue: spAdrContact.providerPhone
                                            })(
                                                <Input
                                                    placeholder="供应商电话"
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>供应商邮箱：</span>
                                        <FormItem>
                                            {getFieldDecorator('providerEmail', {
                                                rules: [
                                                    { required: true, message: '请输入供应商邮箱!' },
                                                    { type: 'email', message: '请输入正确的邮箱!'}
                                                ],
                                                initialValue: spAdrContact.providerEmail
                                            })(
                                                <Input
                                                    placeholder="供应商邮箱"
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>采购员姓名：</span>
                                        <FormItem>
                                            {getFieldDecorator('purchaseName', {
                                                rules: [{ required: true, message: '请输入采购员姓名!' }],
                                                initialValue: spAdrContact.purchaseName
                                            })(
                                                <Input
                                                    placeholder="采购员姓名"
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>采购员电话：</span>
                                        <FormItem>
                                            {getFieldDecorator('purchasePhone', {
                                                rules: [
                                                    { required: true, message: '请输入采购员电话!' },
                                                    Validator.phone
                                                ],
                                                initialValue: spAdrContact.purchasePhone
                                            })(
                                                <Input
                                                    placeholder="采购员电话"
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>采购员邮箱：</span>
                                        <FormItem>
                                            {getFieldDecorator('purchaseEmail', {
                                                rules: [
                                                    { required: true, message: '请输入采购员邮箱!' },
                                                    { type: 'email', message: '请输入正确的邮箱!'}
                                                ],
                                                initialValue: spAdrContact.purchaseEmail
                                            })(
                                                <Input
                                                    placeholder="采购员邮箱"
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
