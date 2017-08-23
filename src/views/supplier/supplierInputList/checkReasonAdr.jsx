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
import { PAGE_SIZE } from '../../../constant';
import {
    insertSupplierSettlementInfo,
    fetchGetProductById,
    fetchEditBeforeAfter,
    suppplierSettledAudit,
    fetchQueryManageList
} from '../../../actions';
import {
    modifyAdrVisible,
    auditSupplierEditInfoAction
} from '../../../actions/supplier';

const FormItem = Form.Item;
const Option = Select.Option;

const TEXT = {
    supplierBasicInfo: {
        // id: '主键ID',
        companyName: '供应商名称',
        spNo: '供应商编号',
        grade: '供应商等级',
    },
    supplierOperTaxInfo: {
        spId: '供应商主表ID',
        // id: '主键ID2',
        companyName: '纳税单位名称',
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
    },
    supplierBankInfo: {
        // spId: '供应商主表ID',
        // id: '主键ID',
        accountName: '开户名',
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
    },
    supplierlicenseInfo: {
        // id: '主键ID',
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
    },
    saleRegionInfo: {
        // id: '主键ID',
        bigArea: '大区',
        province: '省份',
        city: '城市'
    },
    supplierAdrInfoDto: {
        // id: '供应商地点主表ID',
        // parentId: '供应商主表ID',
        basicId: '基本信息ID',
        contId: '联系信息ID',
        spAdrBasic: '地点基础信息表'
    },
    spAdrBasic: {
        // id: '主键ID',
        providerNo: '供应商地点编码',
        providerName: '供应商地点名称',
        goodsArrivalCycle: '到货周期',
        orgId: '分公司',
        settlementPeriod: '账期',
        belongArea: '所属区域',
        // auditDate: '审核时间',
        // auditPerson: '审核人',
    },
    spAdrContact: {
        // id: '供应商主表ID',
        providerName: '供应商姓名',
        providerPhone: '供应商手机',
        providerEmail: '供应商邮箱',
        purchaseName: '采购员姓名',
        purchasePhone: '采购员电话',
        purchaseEmail: '采购员邮箱',
    }
}

const parse = (before, after, rawText) => {
    const  data = [];
    const keys = Object.keys(before);
    for (let i of keys) {
        const b = before[i];
        const a = after[i];
        const t = rawText[i];
        const childKeys = Object.keys(b);
        for (let j of childKeys) {
            const cb = b[j];
            const ca = a[j];
            const ct = t[j];
            if (ct) {
                data.push({
                    before: cb,
                    after: ca,
                    name: ct,
                })
            }
        }
    }
    return data;
}

@connect(
    state => ({
        visibleData: state.toJS().supplier.visibleData,
        editBeforeAfters: state.toJS().supplier.editBeforeAfter,
        visibleReasonDatas: state.toJS().supplier.visibleReasonData,
        checkResonVisibled: state.toJS().supplier.checkResonVisibled,
    }),
    dispatch => bindActionCreators({
        insertSupplierSettlementInfo,
        fetchGetProductById,
        fetchEditBeforeAfter,
        suppplierSettledAudit,
        fetchQueryManageList,
        modifyAdrVisible,
        auditSupplierEditInfoAction
    }, dispatch)
)
class CheckReason extends PureComponent {
    constructor(props) {
        super(props);

        this.handleSelectChange = ::this.handleSelectChange;
        this.handleAuditOk = ::this.handleAuditOk;
        this.handleAuditCancel = ::this.handleAuditCancel;

        this.searchForm = {};
        this.current = 1;
    }

    state = {
        selected: -1
    }


    componentDidMount() {
        const { id } = this.props.visibleReasonDatas;
        this.props.fetchEditBeforeAfter({
            spId: id
        })
    }

    /**
     * 弹框取消事件
     */
    handleCheckCancel() {
        this.props.modifyAdrVisible({isVisible: false});
        this.setState({
            selected: -1
        })
    }

    /**
     * 弹框确认事件
     */
    handleAuditOk() {
        const { id, spStatus } = this.props.visibleReasonDatas;
        const { selected } = this.state;
        const { editBeforeAfters } = this.props;
        const { before = {} } = editBeforeAfters;
        if (selected === '2' && spStatus === 3) {
            message.error('供应商为已拒绝，供应商地点不能审核通过！');
            return;
        }
        if (selected === -1) {
            message.error('请选择审核结果');
            return;
        }
        this.props.form.validateFields((err) => {
            if (!err) {
                this.props.auditSupplierEditInfoAction({
                    id: Number(id),
                    pass: parseInt(selected, 10) === 1 ? false : true,
                    adrBasicId: before.spAdrBasic.id,
                    contId: before.spAdrContact.id,
                    ...this.props.form.getFieldsValue()
                }).then((res) => {
                    message.success(res.message)
                    this.props.modifyAdrVisible({isVisible: false});
                    this.props.fetchQueryManageList({
                        pageNum: this.current,
                        pageSize: PAGE_SIZE,
                        ...this.searchForm
                    })
                }).catch(() => {
                    message.success('修改审核失败')
                })
            }
        })
    }

    /**
     * 数据列表查询
     */
    handleGetList(page) {
        const currentPage = page;
        this.props.fetchQueryManageList({
            pageSize: PAGE_SIZE,
            pageNum: currentPage,
            ...this.searchForm
        });
    }

    /**
     * 弹框取消事件
     */
    handleAuditCancel() {
        this.props.modifyAdrVisible({isVisible: false});
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

    render() {
        const columns = [{
            title: '项目',
            dataIndex: 'name',
        }, {
            title: '修改前',
            dataIndex: 'before',
        }, {
            title: '修改后',
            dataIndex: 'after',
        }];
        const { getFieldDecorator } = this.props.form;
        const { editBeforeAfters } = this.props;
        const { before = {}, after = {} } = editBeforeAfters;
        const formData = parse(before, after, TEXT);
        return (
            <div>
                {
                    this.props.checkResonVisibled
                    && <Modal
                        title="供应商修改地点审核"
                        visible={this.props.checkResonVisibled}
                        onOk={this.handleAuditOk}
                        onCancel={this.handleAuditCancel}
                        maskClosable={false}
                    >
                        <span>修改资料详情</span>
                        <Table
                            columns={columns}
                            dataSource={formData}
                            pagination={false}
                            size="small"
                        />
                        <div>
                            <div className="application-modal-tip">
                                注意：审核通过，供应商的所有账号可正常登录商家后台系统。
                            </div>
                            {
                                this.props.checkResonVisibled &&
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
                                this.props.checkResonVisibled && this.state.selected === '1' &&
                                <Form layout="inline">
                                    <FormItem className="application-form-item">
                                        <span className="application-modal-label">*不通过原因：</span>
                                        {getFieldDecorator('failedReason', {
                                            rules: [{ required: true, message: '请输入不通过原因', whitespace: true }]
                                        })(
                                            <Input
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
                }
            </div>
        );
    }
}

CheckReason.propTypes = {
    editBeforeAfters: PropTypes.objectOf(PropTypes.any),
    visibleReasonDatas: PropTypes.objectOf(PropTypes.any),
    fetchEditBeforeAfter: PropTypes.func,
    auditSupplierEditInfoAction: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    modifyAdrVisible: PropTypes.objectOf(PropTypes.any),
    checkResonVisibled: PropTypes.bool,
}

export default withRouter(Form.create()(CheckReason));
