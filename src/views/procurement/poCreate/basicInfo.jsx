import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import {
    Form, Select, Icon, Row, Tooltip,
    Col, DatePicker
} from 'antd';

import {
    getMaterialMap,
    createPo,
    ModifyPo,
    auditPo,
    queryPoDetail,
    updatePoBasicinfo,
    addPoLines,
    updatePoLine,
    deletePoLine,
    fetchNewPmPurchaseOrderItem,
} from '../../../actions/procurement';
import { pubFetchValueList } from '../../../actions/pub';
import { locType, poType, poNo } from '../../../constant/procurement';
import SearchMind from '../../../components/searchMind';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';
import { Supplier } from '../../../container/search';
import { renderPayType, renderPayCondition, renderPeriod, supplierOrderStatus} from '../constants'

const FormItem = Form.Item;

@connect(state => ({
    po: state.toJS().procurement.po || {},
    newPcOdData: state.toJS().procurement.newPcOdData || {},
    // 回显数据
    basicInfo: state.toJS().procurement.po.basicInfo || {},
    // 用户信息
    data: state.toJS().user.data || {}
}), dispatch => bindActionCreators({
    getMaterialMap,
    createPo,
    ModifyPo,
    auditPo,
    queryPoDetail,
    updatePoBasicinfo,
    addPoLines,
    updatePoLine,
    deletePoLine,
    pubFetchValueList,
    fetchNewPmPurchaseOrderItem,
    modifyCauseModalVisible
}, dispatch))

class BasicInfo extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            // 地点是否可编辑
            locDisabled: true,
            adrTypeCode: null,
            // 地点类型
            localType: '',
            // 日期
            pickerDate: null,
            // 账期
            settlementPeriod: null,
            // 付款方式
            payType: null,
            // 付款条件
            payCondition: null,
            // 供应商地点附带信息
            applySupplierRecord: {},
            // 采购单类型
            purchaseOrderType: '',
            // 货币类型
            currencyCode: 'CNY',
            // 供应商id
            spId: null,
            spName: null,
            // 供应商地点id
            spAdrId: null,
            // 供应商地点名
            spAdrName: null,
            // 经营模式
            businessMode: '',
            status: 0,
            // 供应商接单状态
            supOrderStatus: 2,
        }
        // 因为新增和编辑的经营模式没有寄售选项，所以没有引用公共的
        this.businessModeType = {
            defaultValue: '',
            data: [{
                key: '',
                value: '请选择'
            }, {
                key: '0',
                value: '经销'
            }, {
                key: '1',
                value: '代销'
            }]
        }
    }

    componentWillReceiveProps(nextProps) {
        const {isCheck } = nextProps;
        if (this.props.isCheck !== isCheck && isCheck === true) {
            this.checkReturn();
        }
        if (Object.keys(this.props.basicInfo).length === 0 &&
           Object.keys(nextProps.basicInfo).length !== 0) {
            const {
                adrType, settlementPeriod, payType, payCondition, spAdrId, spAdrName,
                estimatedDeliveryDate, purchaseOrderType, currencyCode,
                businessMode, createdByName, createdAt, spId, spName, adrTypeCode, adrTypeName,
                status, supOrderStatus,
            } = nextProps.basicInfo;
            this.setState({
                locDisabled: !(adrType === 0 || adrType === 1),
                settlementPeriod,
                payType,
                payCondition,
                spAdrId,
                spAdrName,
                pickerDate: estimatedDeliveryDate
                    ? moment(parseInt(estimatedDeliveryDate, 10))
                    : null,
                purchaseOrderType: purchaseOrderType === 0 || purchaseOrderType === 1 || purchaseOrderType === 2 ? `${purchaseOrderType}` : '',
                localType: adrType === 0 || adrType === 1 ? `${adrType}` : '',
                currencyCode: currencyCode === 'CNY' ? `${currencyCode}` : 'CNY',
                businessMode: businessMode === 0 || businessMode === 1 ? `${businessMode}` : '',
                createdByName,
                createdAt,
                spId,
                spName,
                adrTypeCode,
                adrTypeName,
                status,
                supOrderStatus
            })
        }
    }

    /**
     * 地点类型改变时，做如下处理
     * 1.控制地点值清单是否可编辑
     * 2.清空地点值
     * @param {*} value
     */
    onLocTypeChange = (value) => {
        // 地点类型有值
        if (value) {
            // 地点类型有值时，地点可编辑
            this.setState({
                locDisabled: false,
                localType: value,
            });
        } else {
            // 地点类型无值时，地点不可编辑
            this.setState({ locDisabled: true });
        }
    }

    /**
     * 返回采购单基本信息
     */
    getFormBasicInfo = () => {
        const formValues = this.props.form.getFieldsValue();
        // 地点---仓库/门店
        let addressId;
        let addressCd;
        let address;
        if (this.state.localType === '0') {
            const selectedAddressRawData = this.poAddress.state.selectedRawData;
            if (selectedAddressRawData) {
                addressId = selectedAddressRawData.id;
                addressCd = selectedAddressRawData.warehouseCode;
                address = selectedAddressRawData.warehouseName;
            }
        } else if (this.state.localType === '1') {
            const selectedAddressRawData = this.poStore.state.selectedRawData;
            if (selectedAddressRawData) {
                addressId = selectedAddressRawData.id;
                addressCd = selectedAddressRawData.id;
                address = selectedAddressRawData.name;
            }
        }

        // 供应商
        const { spId, spNo, companyName } = this.props.form.getFieldValue('supplier');
        // 供应商地点
        let spAdrId;
        let spAdrNo;
        let spAdrName;
        const selectedSupplierLocRawData = this.supplierLoc.state.selectedRawData;
        if (selectedSupplierLocRawData) {
            spAdrId = selectedSupplierLocRawData.spAdrid;
            spAdrNo = selectedSupplierLocRawData.providerNo;
            spAdrName = selectedSupplierLocRawData.providerName;
        }

        const { applySupplierRecord, pickerDate } = this.state;
        const mapValues = {
            addressId,
            addressCd,
            address,
            spId,
            spNo,
            spName: companyName,
            spAdrId,
            spAdrNo,
            spAdrName,
            estimatedDeliveryDate: pickerDate,
        };
        const basicInfo = Object.assign({}, formValues, mapValues, applySupplierRecord);
        return basicInfo;
    }

    /**
     * 校验输入数据
     */
    validateForm = () => {
        // 新增时数据
        const basicInfoNew = this.getFormBasicInfo();
        const {
            addressId,
            spId,
            spAdrId,
        } = basicInfoNew;
        const { pickerDate } = this.state;

        // 修改时数据
        const basicInfoModify = this.state;
        let isOk = true;
        const { form } = this.props;
        form.validateFields((err) => {
            if (!err) {
                if (basicInfoModify.status === 0 || basicInfoModify.status === 3) {
                    // 修改页
                    if (
                        basicInfoModify.localType
                        && basicInfoModify.adrTypeCode
                        && basicInfoModify.spId
                        && basicInfoModify.spAdrId
                        && basicInfoModify.pickerDate
                    ) {
                        isOk = true;
                        return isOk;
                    }
                    isOk = false;
                    return isOk;
                }
                // 新增页
                if (addressId && spId && spAdrId && pickerDate) {
                    isOk = true;
                    return isOk;
                }
                isOk = false;
                return isOk;
            }
            isOk = false;
            return isOk;
        });
        return isOk;
    }

    // 进行校验后返回校验结果和数据
    checkReturn = () => {
        const isSuccess = this.validateForm();
        // 基本信息，商品行均校验通过,获取有效值
        const basicInfo = isSuccess ?
            Object.assign({}, this.props.basicInfo, this.getFormBasicInfo()) : {};
        this.props.checkResult(isSuccess, basicInfo)
    }
    // 采购单类型变化
    purchaseOrderTypeChange = (value) => {
        this.setState({
            purchaseOrderType: value,
        })
        this.props.purchaseOrderTypeChange({purchaseOrderType: value});
    }

    /**
     * 供应商地点变更时，做如下处理
     *  1.删除采购商品行
     *  2.清空账期、付款方式、付款条件
     * @param {*} res
     */
    applySupplierLocChoosed = (res) => {
        if (res) {
            const record = res.record;
            if (this.state.localType === '0') {
                this.poAddress.reset();
            }
            if (res.record) {
                // 1.删除所有商品行
                this.props.deletePoLines();
                // 2.清空账期、付款方式、付款条件
                const basicInfo = this.props.basicInfo;
                basicInfo.settlementPeriod = null;
                basicInfo.payType = null;
                basicInfo.payCondition = null;
                this.props.updatePoBasicinfo(basicInfo);
                // 设置预计收货日期为：now + 提前期
                this.setState({
                    pickerDate: moment().add(record.goodsArrivalCycle, 'days'),
                    // 账期
                    settlementPeriod: record.settlementPeriod,
                    // 付款方式
                    payType: record.payType,
                    // 付款条件
                    payCondition: record.payCondition,
                    applySupplierRecord: record,
                    spAdrId: record.spAdrid,
                    spAdrName: record.providerName
                });
                this.props.stateChange({spAdrId: record.spAdrid.toString()})
            }
        }
    }

    /**
     * 经营模式改变通知父组件
     */
    businessModeTypeChange = (value) => {
        this.props.stateChange({businessMode: value})
    }
    /**
     * Supplier供应商组件改变的回调
     * @param {Object} value
     */
    handleSupplierChange = (value) => {
        this.clearSupplierAbout();
        const { spId, companyName } = value;
        if (spId !== '') {
            this.setState({spName: companyName});
            this.setState({spId});
            this.props.stateChange({spId});
        }
    }

    /**
     *   1.清空供应商地点
     *   2.删除采购商品行
     *   3.清空账期、付款方式
     */
    clearSupplierAbout = () => {
        // 1.清空供应商地点，仓库值清单
        this.supplierLoc.reset();
        // 2.删除所有商品行
        this.props.deletePoLines();
        this.setState({
            localType: '',
            adrTypeCode: null,
            // 日期
            pickerDate: null,
            // 账期
            settlementPeriod: null,
            // 付款方式
            payType: null,
            // 付款条件
            payCondition: null,
            // 供应商地点附带信息
            applySupplierRecord: {},
            // 采购单类型
            purchaseOrderType: '',
            // 货币类型
            currencyCode: 'CNY',
            // 供应商id
            spId: null,
            // 供应商名
            spName: null,
            // 供应商地点id
            spAdrId: null,
            // 供应商地点名
            spAdrName: null,
            // 经营模式
            businessMode: '',
        })
    }

    /**
     * 供应商/供应商地点tooltip组件
     * @param {string} title 提示的文本
     */
    tooltipItem = (title) => (
        <Tooltip title={title}>
            <Icon type="question-circle-o" className="detail-tooltip-icon" />
        </Tooltip>
    )

    /**
     * 地点改变事件
     */
    locChange = (res) => {
        const record = res.record;
        if (record) {
            this.setState({
                adrTypeCode: record.warehouseCode,
                adrTypeName: record.warehouseName
            })
        }
    }

    /**
     * 清空供应商地点事件
     */
    applySupplierLocClear = () => {
        if (this.state.localType === '0') {
            this.poAddress.reset();
        }
        this.setState({
            adrTypeCode: null,
            adrTypeName: null,
            spAdrId: null,
            spAdrName: null,
            // 账期
            settlementPeriod: null,
            // 付款方式
            payType: null,
            // 付款条件
            payCondition: null
        })
    }

    /**
     * 获取供应商地点列表
     */
    querySupplierLoc = (params) => (
        this.props.pubFetchValueList({
            orgId: this.props.data.user.employeeCompanyId,
            pId: this.props.form.getFieldValue('supplier').spId,
            condition: params.value,
            pageNum: params.pagination.current || 1,
            pageSize: params.pagination.pageSize,
            isContainsHeadBranchCompany: true
        }, 'supplierAdrSearchBox')
    )

    /**
     * 获取仓库地点列表
     */
    querywarehouse = (params) => (
        this.props.pubFetchValueList({
            supplierAddressId: this.state.spAdrId,
            param: params.value,
            pageNum: params.pagination.current || 1,
            pageSize: params.pagination.pageSize
        }, 'getWarehouseLogic')
    )

    /**
     * 获取门店地点列表
     */
    querystores = (params) => (
        this.props.pubFetchValueList({
            param: params.value,
            pageNum: params.pagination.current || 1,
            pageSize: params.pagination.pageSize
        }, 'getStoreInfo')
    )

    /**
     * 获取大类列表
     */
    queryBigClass = (params) => (
        this.props.pubFetchValueList({
            param: params.value,
            level: '2'
        }, 'queryCategorysByLevel')
    )

    render() {
        const Option = Select.Option;
        const dateFormat = 'YYYY-MM-DD';
        const { getFieldDecorator } = this.props.form;
        const state = this.state;
        const props = this.props;
        // 创建者
        const createdByName = state.createdByName
            ? state.createdByName
            : props.data.user.employeeName

        // 创建日期
        const createdAt = state.createdAt
            ? state.createdAt
            : moment().format('YYYY-MM-DD')

        // 供应商
        const spDefaultValue = state.spNo
            ? `${state.spNo}-${state.spName}`
            : ''

        // 供应商地点值清单回显数据
        const spAdrDefaultValue = state.spAdrId
            ? `${state.spAdrId}-${state.spAdrName}`
            : ''

        // 地点值清单回显数据
        const adresssDefaultValue = state.adrTypeCode
            ? `${state.adrTypeCode}-${state.adrTypeName}`
            : ''

        return (
            <div className="basic-box">
                <div className="header">
                    <Icon type="solution" className="header-icon" />基础信息
                </div>
                <div className="body">
                    <Row >
                        <Col span={8}>
                            {/* 采购单号 */}
                            <FormItem label="采购单号">
                                <span className="text">{props.basicInfo.purchaseOrderNo}</span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 采购单类型 */}
                            <FormItem label="采购单类型">
                                {getFieldDecorator('purchaseOrderType', {
                                    rules: [{ required: true, message: '请输入采购单类型' }],
                                    initialValue: state.purchaseOrderType
                                })(
                                    <Select size="default" onChange={this.purchaseOrderTypeChange}>
                                        {
                                            poType.data.map((item) =>
                                                (<Option
                                                    key={item.key}
                                                    value={item.key}
                                                >{item.value}</Option>
                                                ))
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 状态 */}
                            <FormItem label="状态">
                                <span className="text">
                                    {state.poStatusName ? state.poStatusName : '制单'}
                                </span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={8}>
                            {/* 供应商 */}
                            <FormItem label="供应商" >
                                {getFieldDecorator('supplier', {
                                    rules: [{ required: true, message: '请输入供应商' }],
                                    initialValue: { spId: state.spId || '', spNo: state.spNo || '', companyName: state.spName || '' }
                                })(
                                    <Supplier
                                        onChange={this.handleSupplierChange}
                                        initialValue={spDefaultValue}
                                    />)}
                                {this.tooltipItem('修改供应商会清空仓库地点和采购商品')}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 供应商地点 */}
                            <FormItem >
                                <div className="row middle">
                                    <span className="ant-form-item-label">
                                        <span className="label-wrap">
                                            <span style={{ color: '#F00' }}>*</span>
                                            供应商地点:
                                        </span>
                                    </span>
                                    <SearchMind
                                        style={{ zIndex: 9000 }}
                                        compKey="providerNo"
                                        rowKey="providerNo"
                                        ref={ref => { this.supplierLoc = ref }}
                                        fetch={this.querySupplierLoc}
                                        disabled={props.form.getFieldValue('supplier').spId === ''}
                                        defaultValue={spAdrDefaultValue}
                                        onChoosed={this.applySupplierLocChoosed}
                                        onClear={this.applySupplierLocClear}
                                        renderChoosedInputRaw={(data) => (
                                            <div>{data.providerNo} - {data.providerName}</div>
                                        )}
                                        pageSize={6}
                                        columns={[
                                            {
                                                title: '供应商编码',
                                                dataIndex: 'providerNo',
                                                width: 98
                                            }, {
                                                title: '供应商名称',
                                                dataIndex: 'providerName',
                                                width: 140
                                            }
                                        ]}
                                    />
                                    {this.tooltipItem('修改供应商地点会清空仓库地点和采购商品')}
                                </div>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 预计送货日期 */}
                            <FormItem >
                                <span className="ant-form-item-label">
                                    <span className="label-wrap">
                                        <span style={{ color: '#F00' }}>*</span>
                                        预计送货日期:
                                    </span>
                                </span>
                                <DatePicker
                                    style={{ width: 241 }}
                                    format={dateFormat}
                                    value={state.pickerDate}
                                    onChange={(e) => {
                                        this.setState({
                                            pickerDate: e
                                        })
                                    }}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={8}>
                            {/* 地点类型 */}
                            <FormItem>
                                <span className="ant-form-item-label">
                                    <span className="label-wrap">
                                        <span style={{ color: '#F00' }}>*</span>
                                        地点类型:
                                    </span>
                                </span>
                                {getFieldDecorator('adrType', {
                                    rules: [{ required: true, message: '请输入地点类型' }],
                                    initialValue: state.localType,
                                })(
                                    <Select size="default" onChange={this.onLocTypeChange}>
                                        {
                                            locType.data.map((item) =>
                                                (<Option
                                                    key={item.key}
                                                    value={item.key}
                                                >{item.value}</Option>
                                                ))
                                        }
                                    </Select>)}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 地点 */}
                            <FormItem formItemLayout >
                                <div className="row middle">
                                    <span className="ant-form-item-label">
                                        <span className="label-wrap">
                                            <span style={{ color: '#F00' }}>*</span>
                                            地点:
                                        </span>
                                    </span>
                                    {
                                        // 仓库
                                        state.localType === '0'
                                        && <SearchMind
                                            style={{ zIndex: 8000 }}
                                            compKey="warehouseCode"
                                            rowKey="warehouseCode"
                                            ref={ref => { this.poAddress = ref }}
                                            fetch={this.querywarehouse}
                                            onChoosed={this.locChange}
                                            disabled={props.form.getFieldValue('supplier').spId === '' || state.localType !== '0'}
                                            defaultValue={adresssDefaultValue}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.warehouseCode}-{data.warehouseName}</div>
                                            )}
                                            pageSize={6}
                                            columns={[
                                                {
                                                    title: '仓库编码',
                                                    dataIndex: 'warehouseCode',
                                                    width: 98
                                                }, {
                                                    title: '仓库名称',
                                                    dataIndex: 'warehouseName',
                                                    width: 140
                                                }
                                            ]}
                                        />
                                    }
                                    {
                                        // 门店
                                        state.localType !== '0'
                                        && <SearchMind
                                            style={{ zIndex: 8000 }}
                                            disabled={state.locDisabled}
                                            compKey="id"
                                            rowKey="id"
                                            ref={ref => { this.poStore = ref }}
                                            fetch={this.querystores}
                                            onChoosed={this.locChange}
                                            defaultValue={adresssDefaultValue}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.id} - {data.name}</div>
                                            )}
                                            pageSize={6}
                                            columns={[
                                                {
                                                    title: '门店id',
                                                    dataIndex: 'id',
                                                    width: 98
                                                }, {
                                                    title: '门店名称',
                                                    dataIndex: 'name',
                                                    width: 140
                                                }
                                            ]}
                                        />
                                    }
                                </div>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 大类 */}
                            <FormItem formItemLayout >
                                <div className="row small">
                                    <span className="ant-form-item-label">
                                        <span className="label-wrap"> 大类: </span>
                                    </span>
                                    <SearchMind
                                        disabled
                                        style={{ zIndex: 7000 }}
                                        compKey="id"
                                        rowKey="id"
                                        ref={ref => { this.bigClass = ref }}
                                        fetch={this.queryBigClass}
                                        renderChoosedInputRaw={(data) => (
                                            <div>{data.id} - {data.categoryName}</div>
                                        )}
                                        pageSize={6}
                                        columns={[
                                            {
                                                title: '大类id',
                                                dataIndex: 'id',
                                                width: 98
                                            }, {
                                                title: '大类名称',
                                                dataIndex: 'categoryName',
                                                width: 140
                                            }
                                        ]}
                                    />
                                </div>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={8}>
                            {/* 账期 */}
                            <FormItem label="账期">
                                <span>
                                    {renderPeriod(state.settlementPeriod)}
                                </span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 付款方式 */}
                            <FormItem label="付款方式">
                                <span>
                                    {renderPayType(state.payType)}
                                </span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 货币类型 */}
                            <FormItem label="货币类型">
                                {getFieldDecorator('currencyCode', {
                                    initialValue: state.currencyCode
                                })(
                                    <Select size="default">
                                        {
                                            poNo.data.map((item) =>
                                                (<Option
                                                    key={item.key}
                                                    value={item.key}
                                                >{item.value}</Option>
                                                ))
                                        }
                                    </Select>)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={8}>
                            {/* 付款条件 */}
                            <FormItem label="付款条件">
                                <span>
                                    {renderPayCondition(state.payCondition)}
                                </span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 经营模式 */}
                            <FormItem>
                                <span className="ant-form-item-label">
                                    <span className="label-wrap">
                                        <span style={{ color: '#F00' }}>*</span>
                                        经营模式:
                                    </span>
                                </span>
                                {getFieldDecorator('businessMode', {
                                    rules: [{ required: true, message: '请输入经营模式' }],
                                    initialValue: state.businessMode
                                })(
                                    <Select size="default" onChange={this.businessModeTypeChange}>
                                        {
                                            this.businessModeType.data.map((item) =>
                                                (<Option
                                                    key={item.key}
                                                    value={item.key}
                                                >{item.value}</Option>
                                                ))
                                        }
                                    </Select>)}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 供应商接单状态 */}
                            <FormItem label="供应商接单状态">
                                <span>
                                    {supplierOrderStatus(state.supOrderStatus)}
                                </span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={8}>
                            {/* 创建者 */}
                            <FormItem label="创建者">
                                <span>{createdByName}</span>
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            {/* 创建日期 */}
                            <FormItem label="创建日期">
                                <span>{createdAt}</span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 审核人 */}
                            <FormItem label="审核人">
                                <span>{props.basicInfo.approvedByName}</span>
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            {/* 审核日期 */}
                            <FormItem label="审核日期">
                                <span>{props.basicInfo.approvedAt}</span>
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

BasicInfo.propTypes = {
    basicInfo: PropTypes.objectOf(PropTypes.any),
    form: PropTypes.objectOf(PropTypes.any),
    data: PropTypes.objectOf(PropTypes.any),
    pubFetchValueList: PropTypes.func,
    updatePoBasicinfo: PropTypes.func,
    purchaseOrderTypeChange: PropTypes.func,
    deletePoLines: PropTypes.func,
    isCheck: PropTypes.bool,
    checkResult: PropTypes.func,
    stateChange: PropTypes.func
}
export default withRouter(Form.create()(BasicInfo));
