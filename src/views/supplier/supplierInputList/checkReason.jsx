/**
 * @file checkReason.jsx
 * @author Tan junfeng
 *
 * 供应商管理列表
 */

import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import {
    Form,
    Input,
    Select,
    Modal,
    message,
    Table,
} from 'antd';
import {
    modifyCheckReasonVisible,
    insertSupplierSettlementInfo,
    fetchGetProductById,
} from '../../../actions';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({
        checkResonVisible: state.toJS().supplier.checkResonVisible,
        visibleData: state.toJS().supplier.visibleData,
        editBeforeAfters: state.toJS().supplier.editBeforeAfter,
    }),
    dispatch => bindActionCreators({
        modifyCheckReasonVisible,
        insertSupplierSettlementInfo,
        fetchGetProductById,
    }, dispatch)
)
class CheckReason extends PureComponent {
    constructor(props) {
        super(props);

        this.handleCheckOk = ::this.handleCheckOk;
        this.handleCheckCancel = ::this.handleCheckCancel;
        this.handleSelectChange = ::this.handleSelectChange;
        this.handleTextChange = ::this.handleTextChange;
    }

    state = {
        selected: -1
    }

    /**
     * 弹框取消事件
     */
    handleCheckCancel() {
        this.props.modifyCheckReasonVisible(false);
    }

    /**
     * 弹框确认事件
     */
    handleCheckOk() {
        const { selected } = this.state;
        const { visibleData } = this.props;
        if (selected === -1) {
            message.error('请选择审核结果');
            return;
        }
        this.props.form.validateFields((err) => {
            if (!err) {
                this.props.insertSupplierSettlementInfo({
                    id: visibleData.id,
                    status: parseInt(selected, 10),
                    ...this.props.form.getFieldsValue()
                }).then(() => {
                    this.props.getList()
                })
            }
        })
    }

    /**
     * 表单操作
     * @param {*} key 下拉菜单对应选项操作
     */
    handleSelectChange(key) {
        this.setState({
            selected: key
        })
    }

    /**
     * 表单改变事件
     *
     * @param {*} 值数据
     */
    handleTextChange(data) {
        message.data(data.message)
    }

    render() {
        const columns = [{
            title: '项目',
            dataIndex: 'name',
        }, {
            title: '修改前',
            dataIndex: 'before',
            // render: (text, row, index) => {
            //     if (index > 1) {
            //         return <a href="#"><Icon type="picture" />{text}</a>;
            //     }
            //     return {
            //         children: text,
            //     };
            // },
        }, {
            title: '修改后',
            dataIndex: 'after',
            // render: (text, row, index) => {
            //     if (index > 1) {
            //         return <a href="#"><Icon type="picture" />{text}</a>;
            //     }
            //     return {
            //         children: text,
            //     };
            // },
        }];
        // const data = [{
        //     key: '1',
        //     name: '公司所在地',
        //     before: 1,
        //     after: 1,
        // }, {
        //     key: '2',
        //     name: '详细地址',
        //     before: 1,
        //     after: 1,
        // }, {
        //     key: '3',
        //     name: '税务登记证电子版',
        //     before: '查看',
        //     after: '查看',
        // }];
        // const o = [];
        const { getFieldDecorator } = this.props.form;
        const { editBeforeAfters } = this.props;
        const { before, after } = editBeforeAfters;

        const ko = (ele, type) => {
            const supplierBasicInfo = {
                id: '主键ID',
                companyName: '公司名称',
                spNo: '供应商编号',
                grade: '供应商等级',
            }
            const supplierOperTaxInfo = {
                spId: '供应商主表ID',
                id: '主键ID2',
                companyName: '公司名称2',
                companyLocProvince: '省份名',
                companyLocCity: '城市名',
                companyLocCounty: '地区名',
                companyLocProvinceCode: '省份code',
                companyLocCityCode: '城市code',
                companyLocCountyCode: '地区code',
                companyDetailAddress: '公司详细地址',
                registrationCertificate: '商标注册证/受理通知书',
                regCerExpiringDate: '商标注册证/受理通知书到期日',
                qualityIdentification: '食品安全认证',
                quaIdeExpiringDate: '食品安全认证到期日',
                foodBusinessLicense: '食品经营许可证',
                businessLicenseExpiringDate: '食品经营许可证到期日期',
                generalTaxpayerQualifiCerti: '一般纳税人资格证电子版',
                taxpayerCertExpiringDate: '一般纳税人资格证到期日'
            }
            const supplierBankInfo = {
                spId: '供应商主表ID',
                id: '主键ID',
                accountName: '开户名字',
                openBank: '开户行',
                bankAccount: '银行账户',
                bankAccountLicense: '银行开户许可证电子版url',
                bankLocProvince: '省份名',
                bankLocCity: '城市名',
                bankLocCounty: '地区名',
                bankLocProvinceCode: '省份code',
                bankLocCityCode: '城市code',
                bankLocCountyCode: '地区code',
                invoiceHead: '供应商发票抬头'
            }
            const supplierlicenseInfo = {
                id: '主键ID',
                companyName: '公司名称',
                registLicenceNumber: '注册号(营业执照号)',
                legalRepresentative: '法定代表人',
                legalRepreCardNum: '法人身份证号',
                legalRepreCardPic1: '法人身份证电子版1 ',
                legalRepreCardPic2: '法人身份证电子版2',
                bankLocClicenseLocProvinceounty: '省份名',
                licenseLocCity: '城市名',
                licenseLocCounty: '地区名',
                bankLocProvinceCode: '省份code',
                bankLocCityCode: '城市code',
                bankLocCountyCode: '地区code',
                licenseAddress: '营业执照详细地址',
                establishDate: '创建时间',
                startDate: '营业开始日期',
                endDate: '营业结束日期',
                registeredCapital: '注册资本(单位万元)',
                businessScope: '经营范围',
                registLicencePic: '营业执照副本电子版url',
                guaranteeMoney: '供应商质保金收取金额（保证金）'
            }
            const saleRegionInfo = {
                id: '主键ID',
                bigArea: '大区',
                province: '省份',
                city: '城市'
            }
            const supplierAdrInfoDto = {
                id: '供应商地点主表ID',
                parentId: '供应商主表ID',
                basicId: '基本信息ID',
                contId: '联系信息ID',
                spAdrBasic: '地点基础信息表'
            }
            const spAdrBasic = {
                id: '主键ID',
                providerNo: '供应商地点编码',
                providerName: '供应商地点名称',
                goodsArrivalCycle: '到货周期',
                orgId: '分公司ID',
                settlementPeriod: '账期',
                belongArea: '所属区域',
            }
            const spAdrContact = {
                id: '供应商主表ID',
                providerName: '供应商姓名',
                providerPhone: '供应商手机',
                providerEmail: '供应商邮箱',
                purchaseName: '采购员姓名',
                purchasePhone: '采购员电话',
                purchaseEmail: '采购员邮箱',
            }
            const ca = () => {
                if (type === 'supplierBasicInfo') {
                    return supplierBasicInfo
                }
                if (type === 'supplierOperTaxInfo') {
                    return supplierOperTaxInfo
                }
                if (type === 'supplierBankInfo') {
                    return supplierBankInfo
                }
                if (type === 'supplierlicenseInfo') {
                    return supplierlicenseInfo
                }
                if (type === 'saleRegionInfo') {
                    return saleRegionInfo
                }
                if (type === 'supplierAdrInfoDto') {
                    return supplierAdrInfoDto
                }
                if (type === 'spAdrBasic') {
                    return spAdrBasic
                }
                if (type === 'spAdrContact') {
                    return spAdrContact
                }
            }
            const k = Object.keys(ca(type)).indexOf(ele)
            const l = Object.values(ca(type))[k];
            return l
        }

        const w = [];
        const hh = (a, b, c, type) => {
            const a1 = Object.keys(a);
            const b2 = Object.values(b);
            const c3 = Object.values(c);
            a1.map((ele, index) => (
                w.push({name: ko(ele, type), before: b2[index], after: c3[index]})
            ))
            return w
        }
        // console.log(before)
        if (before !== undefined) {
            // const a = Object.keys(before.supplierOperTaxInfo)
            // const b = Object.values(before.supplierOperTaxInfo)
            // const c = Object.values(after.supplierOperTaxInfo)
            // a.map((ele, index) => (
            //     o.push({key: index, name: ele, before: b[index], after: c[index]})
            // ))
            // const d = Object.keys(before.supplierBasicInfo)
            // const e = Object.values(before.supplierBasicInfo)
            // const f = Object.values(after.supplierBasicInfo)
            // console.log(o)
            // d.map((ele, index) => (
            //     o.push({key: index, name: ele, before: e[index], after: f[index]})
            // ))
            hh(
                before.supplierOperTaxInfo, after.supplierOperTaxInfo,
                before.supplierBasicInfo, after.supplierBasicInfo,
                before.supplierOperTaxInfo, after.supplierOperTaxInfo,
                before.supplierBankInfo, after.supplierBankInfo,
                before.saleRegionInfo, after.saleRegionInfo,
                before.supplierAdrInfoDto, after.supplierAdrInfoDto,
                before.spAdrBasic, after.spAdrBasic,
                before.spAdrContact, after.spAdrContact,
                'supplierOperTaxInfo')
            hh(before.supplierOperTaxInfo, after.supplierOperTaxInfo,
                before.supplierBasicInfo, after.supplierBasicInfo,
                before.supplierOperTaxInfo, after.supplierOperTaxInfo,
                before.supplierBankInfo, after.supplierBankInfo,
                before.saleRegionInfo, after.saleRegionInfo,
                before.supplierAdrInfoDto, after.supplierAdrInfoDto,
                before.spAdrBasic, after.spAdrBasic,
                before.spAdrContact, after.spAdrContact,
                'supplierBasicInfo')
            // console.log(a)
            // // console.log(b)
            // // console.log(d)
            // console.log(o)
        }
        // console.log(after)
        return (
            <Modal
                title="供应商修改资料审核"
                visible={this.props.checkResonVisible}
                onOk={this.handleCheckOk}
                onCancel={this.handleCheckCancel}
                maskClosable={false}
            >
                <span>修改资料详情</span>
                <Table
                    columns={columns}
                    dataSource={w}
                    pagination={false}
                    size="small"
                    rowKey={(record) => (Object.values(record).join('.'))}
                />
                <div>
                    <div className="application-modal-tip">
                        注意：审核通过，供应商的所有账号可正常登录商家后台系统。
                    </div>
                    {
                        this.props.modifyCheckReasonVisible &&
                        <div className="application-modal-select">
                            <span className="application-modal-label">审核：</span>
                            <Select
                                style={{ width: '153px', marginLeft: '15px' }}
                                size="default"
                                placeholder="请选择"
                                onChange={this.handleSelectChange}
                            >
                                <Option value="2">通过</Option>
                                <Option value="1">不通过</Option>
                            </Select>
                        </div>
                    }
                    {
                        this.props.modifyCheckReasonVisible && this.state.selected === '1' &&
                        <Form layout="inline">
                            <FormItem className="application-form-item">
                                <span className="application-modal-label">*不通过原因：</span>
                                {getFieldDecorator('failedReason', {
                                    rules: [{ required: true, message: '请输入不通过原因', whitespace: true }]
                                })(
                                    <Input
                                        onChange={this.handleTextChange}
                                        type="textarea"
                                        placeholder="请输入不通过原因"
                                        className="application-modal-textarea"
                                        autosize={{ minRows: 2, maxRows: 8 }}
                                    />
                                    )}
                            </FormItem>
                        </Form>
                    }
                </div>
            </Modal>
        );
    }
}

CheckReason.propTypes = {
    editBeforeAfters: PropTypes.objectOf(PropTypes.any),
    modifyCheckReasonVisible: PropTypes.bool,
    checkResonVisible: PropTypes.bool,
    form: PropTypes.objectOf(PropTypes.any),
    visibleData: PropTypes.objectOf(PropTypes.any),
    insertSupplierSettlementInfo: PropTypes.objectOf(PropTypes.any),
    getList: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(CheckReason));
