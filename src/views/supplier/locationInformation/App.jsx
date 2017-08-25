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
import {
    Icon, Input, Form, Button,
    Select, Row, Col, InputNumber, message
} from 'antd';

import Utils from '../../../util/util';
import Tip from '../../../util/tip';
import {
    addSupplierMessage1, getWarehouse, fetchWarehouseInfo,
    deleteWarehouseInfo, insertSupplierAddress
} from '../../../actions/addSupplier';
import {
    pubFetchValueList
} from '../../../actions/pub';
import {
    hanldeSupplier, fetchSupplierNo
} from '../../../actions/supplier';
import Warehouse from './warehouse';
import SearchMind from '../../../components/searchMind';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({
        data: state.toJS().addSupplier.data,
        supplierId: state.toJS().supplier.supplierId,
        warehouseInfo: state.toJS().addSupplier.warehouseInfo,
        warehouseData: state.toJS().addSupplier.warehouseData,
        placeRegion: state.toJS().supplier.placeRegion,
    }),
    dispatch => bindActionCreators({
        addSupplierMessage1,
        fetchSupplierNo,
        getWarehouse,
        fetchWarehouseInfo,
        deleteWarehouseInfo,
        insertSupplierAddress,
        pubFetchValueList,
        hanldeSupplier
    }, dispatch)
)
class BasicInfo extends PureComponent {
    constructor(props) {
        super(props);

        this.handleCompanyAddressChange = ::this.handleCompanyAddressChange;
        this.handleBankLocChange = ::this.handleBankLocChange;
        this.handleSaveDraft = ::this.handleSaveDraft;
        this.getValue = ::this.getValue;
        this.submit = ::this.submit;
        this.handleSubmit = ::this.handleSubmit;
        this.handleChoose = ::this.handleChoose;
        this.handleAreaChange = ::this.handleAreaChange;
        this.companyAddress = {};
        this.bankLoc = {};
        const { detailSp = {} } = props;
        const { spAdrBasic = {} } = detailSp;
        this.orgId = spAdrBasic.orgId || null;
        this.company = null;
        this.childName = null;
    }

    componentDidMount() {
        const { isEdit } = this.props;
        if (!isEdit) {
            this.props.fetchSupplierNo({ type: 'SP_ADR' });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.detailSp) {
            const { detailSp = {} } = this.props;
            const { spAdrBasic = {} } = detailSp;
            if (nextProps.detailSp.spAdrBasic
                && nextProps.detailSp.spAdrBasic.orgId !== spAdrBasic.orgId
            ) {
                this.orgId = nextProps.detailSp.spAdrBasic.orgId;
            }
        }
    }

    getValue(callback) {
        const { form, detailData, detailSp, isEdit } = this.props;
        const { supplierBasicInfo = {} } = detailData;
        const wareHouseIds = this.wareHouse.getValue();
        if (!this.orgId) {
            Tip(true, '请选择子公司！');
            return;
        }

        // 供应商供应地点没选择
        if (!wareHouseIds.length) {
            Tip(true, '请选择送货信息！');
            return;
        }

        form.validateFields((err, values) => {
            if (!err) {
                const {
                    belongArea,
                    goodsArrivalCycle,
                    grade,
                    operaStatus,
                    payType,
                    providerEmail,
                    providerUserName,
                    providerPhone,
                    purchaseEmail,
                    purchaseName,
                    purchasePhone,
                    settlementPeriod,
                    payCondition
                } = values
                const submit = {
                    spAdrBasic: {
                        providerNo: isEdit ? detailSp.spAdrBasic.providerNo : this.props.supplierId,
                        providerName: this.childName,
                        goodsArrivalCycle,
                        orgId: this.orgId,
                        grade,
                        operaStatus,
                        settlementPeriod,
                        belongArea,
                        payType,
                        belongAreaName: this.company,
                        payCondition
                    },
                    spAdrContact: {
                        providerName: providerUserName,
                        providerPhone,
                        providerEmail,
                        purchaseName,
                        purchasePhone,
                        purchaseEmail
                    },
                    spAdrDeliverys: wareHouseIds.map((item) => {
                        return { warehouseId: item };
                    }),
                    parentId: detailData.id
                }

                if (isEdit) {
                    Object.assign(
                        submit.spAdrBasic,
                        {
                            id: detailSp.spAdrBasic.id,
                            status: detailSp.spAdrBasic.status,
                            orgId: !this.orgId ? detailSp.spAdrBasic.orgId : this.orgId,
                            belongAreaName: !this.company ? detailSp.spAdrBasic.belongAreaName : this.company
                        }
                    )
                    Object.assign(
                        submit.spAdrContact,
                        {
                            id: detailSp.spAdrContact.id,
                            status: detailSp.spAdrContact.status
                        }
                    )
                    Object.assign(submit, {
                        id: detailSp.id,
                        parentId: detailData.id,
                        status: detailSp.status,
                    })

                }

                callback(submit)
            }
        })
    }

    submit(type) {
        const { isEdit } = this.props;
        this.getValue((data) => {
            data.commitType = type;
            this.props.hanldeSupplier(data,
                isEdit
                    ? 'updateSupplierAddressInfo'
                    : 'insertSupplierAddressInfo'
            ).then((res) => {
                this.props.history.push('/supplierInputList')
            });
        });
    }

    handleAreaChange(item) {
        const { placeRegion } = this.props;
        for (let i of placeRegion) {
            if (i.code === item) {
                this.company = i.name;
                return null;
            }
        }
    }

    handleChoose(item) {
        this.orgId = item.record.id;
    }

    handleReset = () => {
        this.orgId = null;
    }

    handleSaveDraft() {
        this.submit(0)
    }

    handleSubmit() {
        this.submit(1)
    }

    handleCompanyAddressChange(data) {
        this.companyAddress = data;
    }

    handleBankLocChange(data) {
        this.bankLoc = data;
    }

    /**
     * 供应商等级转换
     * @param {number} grade 供应商等级
     */
    renderGrade(grade) {
        switch (grade) {
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

    renderStatus(status) {
        switch (status) {
            case 0:
                return '制表'
            case 1:
                return '待审核'
            case 2:
                return '已审核'
            case 3:
                return '已拒绝'
            case 4:
                return '修改中'
            default:
                break;
        }
        return null;
    }

    renderName(spAdrBasic, supplierBasicInfo) {
        const { isEdit } = this.props;
        const { providerName } = spAdrBasic;
        const { companyName } = supplierBasicInfo;
        { isEdit && !this.company ? spAdrBasic.providerName : `${this.company} - ${supplierBasicInfo.companyName}` }
        if (isEdit && !this.company) {
            this.childName = providerName;
            return providerName;
        }
        else if (isEdit && this.company) {
            this.childName = `${this.company} - ${supplierBasicInfo.companyName}`;
            return `${this.company} - ${supplierBasicInfo.companyName}`;
        }
        else if (!isEdit && !this.company) {
            this.childName = supplierBasicInfo.companyName;
            return supplierBasicInfo.companyName;
        }
        else if (!isEdit && this.company) {
            this.childName = `${this.company} - ${supplierBasicInfo.companyName}`;
            return `${this.company} - ${supplierBasicInfo.companyName}`;
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { detailData, detailSp, isEdit, placeRegion = [] } = this.props;
        const {
            supplierBasicInfo = {},
            supplierOperTaxInfo = {},
            supplierBankInfo = {}
        } = detailData;
        const {
            spAdrBasic = {},
            spAdrContact = {},
            spAdrDeliverys = []
        } = detailSp;

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
                                        <span>{isEdit ? spAdrBasic.providerNo : this.props.supplierId}</span>
                                    </Col>
                                    <Col span={8}><span>供应商地点名称：</span>
                                        <span>
                                            {
                                                this.renderName(spAdrBasic, supplierBasicInfo)
                                            }
                                        </span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}><span>供应商地点状态：</span>
                                        <span>{isEdit ? this.renderStatus(detailSp.status) : '草稿'}</span>
                                    </Col>
                                    <Col span={8}>
                                        <span>*供应商地点经营状态：</span>
                                        <FormItem>
                                            {getFieldDecorator('operaStatus', {
                                                rules: [{ required: true, message: '请选择供应商地点经营状态' }],
                                                initialValue: isEdit ? `${spAdrBasic.operaStatus}` : '1'
                                            })(
                                                <Select
                                                    style={{ width: 140 }}
                                                    placeholder="供应商地点经营状态"
                                                >
                                                    <Option value="1">启用</Option>
                                                    <Option value="0">禁用</Option>
                                                </Select>
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>*供应商地点到货周期：</span>
                                        <FormItem>
                                            {getFieldDecorator('goodsArrivalCycle', {
                                                rules: [{ required: true, message: '请输入供应商地点到货周期!' }],
                                                initialValue: isEdit ? spAdrBasic.goodsArrivalCycle : null
                                            })(
                                                <InputNumber
                                                    min={0}
                                                    placeholder="周期"
                                                />
                                                )}
                                            &nbsp;天
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>*账期：</span>
                                        <FormItem>
                                            {getFieldDecorator('settlementPeriod', {
                                                rules: [{ required: true, message: '请选择账期！' }],
                                                initialValue: isEdit ? `${spAdrBasic.settlementPeriod}` : '0'
                                            })(
                                                <Select
                                                    style={{ width: 140 }}
                                                    placeholder="供应商账期"
                                                >
                                                    <Option value="0">周结</Option>
                                                    <Option value="1">半月结</Option>
                                                    <Option value="2">月结</Option>
                                                    {/* <Option value="3">票到付款</Option> */}
                                                </Select>
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>*供应商地点级别：</span>
                                        <FormItem>
                                            {getFieldDecorator('grade', {
                                                rules: [{ required: true, message: '请选择供应商地点级别' }],
                                                initialValue: isEdit ? `${spAdrBasic.grade}` : '1'
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
                                        <span>*供应商地点所属区域：</span>
                                        <FormItem>
                                            {getFieldDecorator('belongArea', {
                                                rules: [{ required: true, message: '请选择供应商地点所属区域' }],
                                                initialValue: isEdit ? `${spAdrBasic.belongArea}` : undefined
                                            })(
                                                <Select
                                                    style={{ width: 140 }}
                                                    placeholder="供应商地点所属区域"
                                                    onChange={this.handleAreaChange}
                                                >
                                                    {
                                                        placeRegion.map((item) => <Option
                                                            key={item.code}
                                                            value={item.code}
                                                        >
                                                            {item.name}
                                                        </Option>)
                                                    }
                                                </Select>
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>*供应商付款方式：</span>
                                        <FormItem>
                                            {getFieldDecorator('payType', {
                                                rules: [{ required: true, message: '请选择付款方式！' }],
                                                initialValue: isEdit ? `${spAdrBasic.payType}` : '0'
                                            })(
                                                <Select
                                                    style={{ width: 140 }}
                                                    placeholder="付款方式"
                                                >
                                                    <Option value="0">网银</Option>
                                                    <Option value="1">银行转账</Option>
                                                    <Option value="2">现金</Option>
                                                    <Option value="3">支票</Option>
                                                </Select>
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>*供应商地点所属子公司：</span>
                                        <FormItem>
                                            <SearchMind
                                                style={{ marginLeft: 10 }}
                                                compKey="search-mind-key2"
                                                fetch={(param) =>
                                                    this.props.pubFetchValueList(Utils.removeInvalid({
                                                        branchCompanyName: param.value,
                                                        id: isEdit ? detailSp.spAdrBasic.id : null,
                                                        parentId: detailData.id,
                                                    }), 'findCanUseCompanyInfo').then((res) => {
                                                        const { data } = res.data;
                                                        if (!data.length) {
                                                            message.warning('无可用子公司，无法完成后续操作！');
                                                        }
                                                        return res;
                                                    })
                                                }
                                                ref={node => (this.orgCompany = node)}
                                                onChoosed={this.handleChoose}
                                                onClear={this.handleReset}
                                                placeholder={'请输入子公司名称'}
                                                renderChoosedInputRaw={(data) => (
                                                    <div>{data.id} - {data.name}</div>
                                                )}
                                                defaultValue={isEdit ? `${spAdrBasic.orgId} - ${spAdrBasic.orgName}` : ''}
                                                pageSize={10}
                                                columns={[
                                                    {
                                                        title: '子公司编码',
                                                        dataIndex: 'id',
                                                        width: 150,
                                                    }, {
                                                        title: '子公司名称',
                                                        dataIndex: 'name',
                                                        width: 200,
                                                    }
                                                ]}
                                            />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <span>*付款条件：</span>
                                        <FormItem>
                                            {getFieldDecorator('payCondition', {
                                                rules: [{ required: true, message: '请选择付款条件！' }],
                                                initialValue: isEdit ? `${spAdrBasic.payCondition}` : '1'
                                            })(
                                                <Select
                                                    style={{ width: 140 }}
                                                    placeholder="付款条件"
                                                >
                                                    <Option value="1">票到七天</Option>
                                                    <Option value="2">票到十五天</Option>
                                                    <Option value="3">票到三十天</Option>
                                                </Select>
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                {
                                    isEdit &&
                                    <Row>
                                        {
                                            spAdrBasic.auditPerson &&
                                            <Col span={8}><span>供应商审核人：</span>
                                                <span>{spAdrBasic.auditPerson}</span>
                                            </Col>
                                        }
                                        {
                                            spAdrBasic.auditDate &&
                                            <Col span={8}><span>供应商审核时间：</span>
                                                <span>{moment(spAdrBasic.auditDate).format('YYYY-MM-DD')}</span>
                                            </Col>
                                        }
                                    </Row>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="supplier-add-item  supplier-add-space-basic">
                        <div className="add-message">
                            <div className="add-message-header">
                                <Icon type="solution" className="add-message-header-icon" />送货信息
                            </div>
                            <div className="add-message-body">
                                <Warehouse
                                    fetch={this.props.getWarehouse}
                                    data={this.props.warehouseData}
                                    defaultValue={spAdrDeliverys}
                                    handleChoose={this.props.fetchWarehouseInfo}
                                    handleDelete={this.props.deleteWarehouseInfo}
                                    ref={node => (this.wareHouse = node)}
                                />
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
                                        <span>*供应商姓名：</span>
                                        <FormItem>
                                            {getFieldDecorator('providerUserName', {
                                                rules: [
                                                    { required: true, message: '请输入供应商姓名!' },
                                                    { max: 6, message: '字符长度超限' }
                                                ],
                                                initialValue: spAdrContact.providerName
                                            })(
                                                <Input
                                                    placeholder="供应商姓名"
                                                />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>*供应商电话：</span>
                                        <FormItem>
                                            {getFieldDecorator('providerPhone', {
                                                rules: [
                                                    { required: true, message: '请输入供应商电话!' },
                                                    {
                                                        validator: (rule, value, callback) => {
                                                            if (!/^1[34578]\d{9}$/.test(value)) {
                                                                callback('手机号码有误')
                                                            }
                                                            callback()
                                                        }
                                                    }
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
                                        <span>*供应商邮箱：</span>
                                        <FormItem>
                                            {getFieldDecorator('providerEmail', {
                                                rules: [
                                                    { required: true, message: '请输入供应商邮箱!' },
                                                    { type: 'email', message: '请输入正确的邮箱!' }
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
                                        <span>*采购员姓名：</span>
                                        <FormItem>
                                            {getFieldDecorator('purchaseName', {
                                                rules: [
                                                    { required: true, message: '请输入采购员姓名!' },
                                                    { max: 6, message: '字符长度超限' }
                                                ],
                                                initialValue: spAdrContact.purchaseName
                                            })(
                                                <Input
                                                    placeholder="采购员姓名"
                                                />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <span>*采购员电话：</span>
                                        <FormItem>
                                            {getFieldDecorator('purchasePhone', {
                                                rules: [
                                                    { required: true, message: '请输入采购员电话!' },
                                                    {
                                                        validator: (rule, value, callback) => {
                                                            if (!/^1[34578]\d{9}$/.test(value)) {
                                                                callback('手机号码有误')
                                                            }
                                                            callback()
                                                        }
                                                    }
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
                                        <span>*采购员邮箱：</span>
                                        <FormItem>
                                            {getFieldDecorator('purchaseEmail', {
                                                rules: [
                                                    { required: true, message: '请输入采购员邮箱!' },
                                                    { type: 'email', message: '请输入正确的邮箱!' }
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
                        <Button onClick={this.handleSubmit}>提    交</Button>
                        <Button onClick={this.handleSaveDraft}>保存制单</Button>
                    </div>
                </Form>
            </div>
        )
    }
}

BasicInfo.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    isEdit: PropTypes.bool,
    detailData: PropTypes.objectOf(PropTypes.any),
    detailSp: PropTypes.objectOf(PropTypes.any),
    fetchSupplierNo: PropTypes.func
}
export default Form.create()(withRouter(BasicInfo));
