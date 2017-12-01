/**
 * @file App.jsx
 * @author twh
 *
 * 采购单编辑页面
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import Immutable, { fromJS } from 'immutable';
import {
    Table, Form, Select, Icon, Dropdown, Modal, Row, Tooltip,
    Col, DatePicker, Button, message, Menu, Affix
} from 'antd';
import EditableCell from './EditableCell';
import Audit from './auditModal';
import Utils from '../../../util/util';
import {
    getMaterialMap,
    initPoDetail,
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
import { locType, poType, poNo, poStatusCodes, businessModeType } from '../../../constant/procurement';
import SearchMind from '../../../components/searchMind';
import { exportProcurementPdf } from '../../../service';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';
import { Supplier } from '../../../container/search';

const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
/**
 * 界面状态
 */
const PAGE_MODE = {
    NEW: 'new',
    UPDATE: 'update',
    READONLY: 'readonly'
};
/**
 * 商品行状态
 */
const RECORD_STATUS = {
    NEW: 'new',
};

@connect(state => ({
    po: state.toJS().procurement.po || {},
    newPcOdData: state.toJS().procurement.newPcOdData || {},
    // 回显数据
    basicInfo: state.toJS().procurement.po.basicInfo || {},
    poLines: state.toJS().procurement.po.poLines || [],
    // 用户信息
    data: state.toJS().user.data || {}
}), dispatch => bindActionCreators({
    getMaterialMap,
    initPoDetail,
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

class PoDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.onLocTypeChange = :: this.onLocTypeChange;
        this.S4 = :: this.S4;
        this.guid = :: this.guid;
        this.isMaterialExists = :: this.isMaterialExists;
        this.renderActions = :: this.renderActions;
        this.onActionMenuSelect = :: this.onActionMenuSelect;
        this.caculate = :: this.caculate;
        this.handleSave = :: this.handleSave;
        this.handleSubmit = :: this.handleSubmit;
        this.handleAudit = :: this.handleAudit;
        this.handleDownPDF = :: this.handleDownPDF;
        this.hasInvalidateMaterial = :: this.hasInvalidateMaterial;
        this.hasEmptyQtyMaterial = :: this.hasEmptyQtyMaterial;
        this.applyAuditOk = :: this.applyAuditOk;
        this.applyAuditCancel = :: this.applyAuditCancel;
        this.validateForm = :: this.validateForm;
        this.getPageMode = :: this.getPageMode;
        this.getActionAuth = :: this.getActionAuth;
        this.getPoData = :: this.getPoData;
        this.getBaiscInfoElements = :: this.getBaiscInfoElements;
        this.applySupplierLocChoosed = :: this.applySupplierLocChoosed;
        this.applySupplierLocClear = :: this.applySupplierLocClear;
        this.deletePoLines = :: this.deletePoLines;
        this.getFormBasicInfo = :: this.getFormBasicInfo;
        this.renderPeriod = :: this.renderPeriod;
        this.renderPayType = :: this.renderPayType;
        this.renderPayCondition = :: this.renderPayCondition;
        this.getAllValue = :: this.getAllValue;
        this.handleSupplierChange = :: this.handleSupplierChange;
        this.clearSupplierAbout = :: this.clearSupplierAbout;
        this.createPoRequest = :: this.createPoRequest;
        // 采购单商品行信息
        this.columns = [
            {
                title: '行号',
                dataIndex: 'rowNo',
                key: 'rowNo',
                render: (text, record, index) => index + 1
            },
            {
                title: '商品编码',
                dataIndex: 'productCode',
                key: 'productCode',

            },
            {
                title: '商品名称',
                dataIndex: 'productName',
                key: 'productName',
            },
            {
                title: '商品条码',
                dataIndex: 'internationalCode',
                key: 'internationalCode',
            },
            {
                title: '规格',
                dataIndex: 'packingSpecifications',
                key: 'packingSpecifications',
            },
            {
                title: '产地',
                dataIndex: 'producePlace',
                key: 'producePlace',
            }, {
                title: '采购内装数',
                dataIndex: 'purchaseInsideNumber',
                key: 'purchaseInsideNumber',
            },
            {
                title: '单位',
                dataIndex: 'unitExplanation',
                key: 'unitExplanation'
            },
            {
                title: '税率(%)',
                dataIndex: 'inputTaxRate',
                key: 'inputTaxRate'
            },
            {
                title: '采购价格（含税）',
                dataIndex: 'purchasePrice',
                key: 'purchasePrice',
                render: (text, record, index) =>
                    (<EditableCell
                        value={this.state.purchaseOrderType === '1' ? 0 : text}
                        editable={this.state.currentType !== 'detail' && this.state.purchaseOrderType === '2'}
                        step={record.purchaseInsideNumber}
                        purchaseInsideNumber={null}
                        onChange={value => this.applyPriceChange(record, index, value)}
                    />)
            },
            {
                title: '采购数量',
                dataIndex: 'purchaseNumber',
                key: 'purchaseNumber',
                render: (text, record, index) =>
                    (<EditableCell
                        value={text}
                        editable={this.state.currentType !== 'detail'}
                        step={record.purchaseInsideNumber}
                        purchaseInsideNumber={record.purchaseInsideNumber}
                        onChange={value => this.applyQuantityChange(record, index, value)}
                    />)
            },
            {
                title: '采购金额（含税）',
                dataIndex: 'totalAmount',
                key: 'totalAmount',
                render: (text) => {
                    if (this.state.purchaseOrderType === '1') {
                        return 0
                    }
                    return text
                }
            },
            {
                title: '已收货数量',
                dataIndex: 'receivedNumber',
                key: 'receivedNumber'
            },
            {
                title: '是否有效',
                dataIndex: 'isValid',
                key: 'isValid',
                render: (text) => {
                    switch (text) {
                        case 0:
                            return '无效';
                        default:
                            return '有效';
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: this.renderActions
            }
        ];
        this.state = {
            totalQuantity: 0,
            totalAmount: 0,
            // new:新建 update:编辑 readonly 只读
            pageMode: '',
            // 操作权限
            actionAuth: {},
            // 审核弹出框是否可见
            auditModalVisible: false,
            editable: false,
            locDisabled: true,
            localType: '',
            pickerDate: null,
            // 账期
            settlementPeriod: null,
            // 付款方式
            payType: null,
            // 付款条件
            payCondition: null,
            // 详细收货地点
            adrName: null,
            // 供应商地点附带信息
            applySupplierRecord: {},
            // 采购单类型
            purchaseOrderType: '0',
            // 货币类型
            currencyCode: 'CNY',
            // 供应商id
            spId: null,
            // 供应商地点id
            spAdrId: null,
            // 当前状态
            currentType: '',
            // nextProps里的polings
            nextPoLines: [],
            // 修改页，仓库是否被清空的标志
            ispoAddressClear: false,
            // 经营模式
            businessMode: null
        }
    }

    componentDidMount() {
        const that = this;
        const { match } = this.props;
        const { type } = match.params;
        this.setState({
            currentType: type,
        })
        // 采购单id
        const poId = match.params.purchaseOrderNo;
        // 采购单id不存在
        if (type === 'create') {
            // 初始化采购单详情
            that.props.initPoDetail({
                basicInfo: {},
                poLines: []
            }).then(() => {
                const tmpPageMode = that.getPageMode();
                that.setState({ pageMode: tmpPageMode });
                that.setState({ actionAuth: that.getActionAuth() });
                // //计算采购总数量、采购总金额
                if (tmpPageMode !== PAGE_MODE.READONLY) {
                    that.setState({ editable: true });
                } else {
                    that.setState({ editable: false });
                }
            });
        } else {
            // 1.采购单id存在，查询采购单详情
            // 2.设置界面状态，操作按钮状态
            that.props.queryPoDetail({
                id: poId
            }).then(() => {
                // 获取采购单状态：编辑/只读
                const tmpPageMode = that.getPageMode();
                that.setState({ pageMode: tmpPageMode });
                that.setState({ actionAuth: that.getActionAuth() });
                if (tmpPageMode !== PAGE_MODE.READONLY) {
                    that.setState({ editable: true });
                } else {
                    that.setState({ editable: false });
                }
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const {
            adrType, settlementPeriod, payType, payCondition, estimatedDeliveryDate,
            purchaseOrderType, currencyCode, id, spAdrId, businessMode
        } = nextProps.basicInfo;
        const { basicInfo = {} } = this.props;
        const newPo = fromJS(nextProps.po.poLines);
        const oldPo = fromJS(this.props.po.poLines);
        if (!Immutable.is(newPo, oldPo)) {
            this.caculate(nextProps.po.poLines);
        }
        if (basicInfo.id !== id) {
            this.setState({
                locDisabled: !(adrType === 0 || adrType === 1),
                isSupplyAdrDisabled: false,
                settlementPeriod,
                payType,
                payCondition,
                spAdrId,
                pickerDate: estimatedDeliveryDate
                    ? moment(parseInt(estimatedDeliveryDate, 10))
                    : null,
                purchaseOrderType: purchaseOrderType === 0 || purchaseOrderType === 1 || purchaseOrderType === 2 ? `${purchaseOrderType}` : '',
                localType: adrType === 0 || adrType === 1 ? `${adrType}` : '',
                currencyCode: currencyCode === 'CNY' ? `${currencyCode}` : 'CNY',
                businessMode: businessMode === 0 || businessMode === 1 ? `${businessMode}` : '',
            })
        }
    }

    componentWillUnmount() {
        this.props.initPoDetail({
            basicInfo: {},
            poLines: []
        })
    }

    /**
     * 地点类型改变时，做如下处理
     * 1.控制地点值清单是否可编辑
     * 2.清空地点值
     * @param {*} value
     */
    onLocTypeChange(value) {
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
     * 表单操作
     * @param {*} record 行数据
     * @param {*} index 行下标
     * @param {*} items 行项
     */
    onActionMenuSelect(record, index, items) {
        const { key } = items;
        const that = this;
        switch (key) {
            case 'delete':
                Modal.confirm({
                    title: '你确认要删除该商品？',
                    onOk: () => {
                        // 新添加商品(未存数据库),物理删除
                        that.props.deletePoLine(record);
                        that.props.updatePoLine(record);
                        message.success('删除成功');
                    },
                    onCancel() {
                    },
                });
                break;
            default:
                break;
        }
    }

    /**
     * 根据状态渲染对应的页面
     */
    getBaiscInfoElements() {
        const { getFieldDecorator } = this.props.form;
        const purchaseOrderType = () => {
            switch (this.props.basicInfo.purchaseOrderType) {
                case 0:
                    return '普通采购单';
                case 1:
                    return '赠品采购单';
                case 2:
                    return '促销采购单';
                default:
                    return '';
            }
        }
        const businessMode = () => {
            switch (this.props.basicInfo.businessMode) {
                case 0:
                    return '经销';
                case 1:
                    return '代销';
                default:
                    return '';
            }
        }
        const purchaseOrderState = () => {
            switch (this.props.basicInfo.status) {
                case 0:
                    return '制单';
                case 1:
                    return '已提交';
                case 2:
                    return '已审核';
                case 3:
                    return '已拒绝';
                case 4:
                    return '已关闭';
                default:
                    return '';
            }
        }
        const purchaseOrderAdrType = () => {
            switch (this.props.basicInfo.adrType) {
                case 0:
                    return '仓库';
                case 1:
                    return '门店';
                default:
                    return '';
            }
        }
        const { basicInfo } = this.props;
        const { currentType } = this.state;
        // 创建者
        const createdByName = basicInfo.createdByName
            ? this.basicInfo.createdByName
            : this.props.data.user.employeeName

        // 创建日期
        const createdAt = basicInfo.createdAt
            ? basicInfo.createdAt
            : moment().format('YYYY-MM-DD')


        // 供应商地点值清单回显数据
        const spAdrDefaultValue = basicInfo.spAdrId
            ? `${basicInfo.spAdrId}-${basicInfo.spAdrName}`
            : ''

        // 地点值清单回显数据
        const adresssDefaultValue = basicInfo.adrTypeCode
            ? `${basicInfo.adrTypeCode}-${basicInfo.adrTypeName}`
            : ''

        // 回显预期送货日期
        const estimatedDeliveryDate = basicInfo.estimatedDeliveryDate ? moment(basicInfo.estimatedDeliveryDate).format('YYYY-MM-DD') : null

        // 回显创建日期
        const createTime = basicInfo.createTime ? moment(basicInfo.createTime).format('YYYY-MM-DD') : null

        // 回显审核日期
        const auditTime = basicInfo.auditTime ? moment(basicInfo.auditTime).format('YYYY-MM-DD') : null
        // 只读
        if (currentType === 'detail') {
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
                                    <span>{this.props.basicInfo.purchaseOrderNo}</span>
                                </FormItem>
                            </Col>
                            <Col span={3}>
                                {/* 经营模式 */}
                                <FormItem label="经营模式">
                                    <span>{businessMode()}</span>
                                </FormItem>
                            </Col>
                            <Col span={5}>
                                {/* 采购单类型 */}
                                <FormItem label="采购单类型">
                                    <span>{purchaseOrderType()}</span>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 状态 */}
                                <FormItem label="状态">
                                    <span>{purchaseOrderState()}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={8}>
                                {/* 供应商 */}
                                <FormItem label="供应商">
                                    <span>
                                        {this.props.basicInfo.spNo}
                                        -{this.props.basicInfo.spName}
                                    </span>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 供应商地点 */}
                                <FormItem label="供应商地点">
                                    <span>
                                        {this.props.basicInfo.spAdrNo}
                                        -{this.props.basicInfo.spAdrName}
                                    </span>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 预计送货日期 */}
                                <FormItem label="预计送货日期">
                                    <span>{estimatedDeliveryDate}</span>

                                </FormItem>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={8}>
                                {/* 地点类型 */}
                                <FormItem label="地点类型">
                                    <span>{purchaseOrderAdrType()}</span>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 地点 */}
                                <FormItem label="地点">
                                    <span>
                                        {this.props.basicInfo.adrTypeCode}
                                        -{this.props.basicInfo.adrTypeName}
                                    </span>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 大类 */}
                                <FormItem label="大类">
                                    <span>{this.props.basicInfo.secondCategoryName}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={8}>
                                {/* 账期 */}
                                <FormItem label="账期">
                                    <span>
                                        {this.renderPeriod(this.props.basicInfo.settlementPeriod)}
                                    </span>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 付款方式 */}
                                <FormItem label="付款方式">
                                    <span>{this.renderPayType(this.props.basicInfo.payType)}</span>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 货币类型 */}
                                <FormItem label="货币类型">
                                    <span>{this.props.basicInfo.currencyCode}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={8}>
                                {/* 付款条件 */}
                                <FormItem label="付款条件">
                                    <span>
                                        {this.renderPayCondition(this.props.basicInfo.payCondition)}
                                    </span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row >
                            <Col span={8}>
                                {/* 创建者 */}
                                <FormItem label="创建者">
                                    <span>{this.props.basicInfo.createUserName}</span>
                                </FormItem>
                            </Col>
                            <Col span={4}>
                                {/* 创建日期 */}
                                <FormItem label="创建日期">
                                    <span>{createTime}</span>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 审核人 */}
                                <FormItem label="审核人">
                                    <span>{this.props.basicInfo.auditUserName}</span>
                                </FormItem>
                            </Col>
                            <Col span={4}>
                                {/* 审核日期 */}
                                <FormItem label="审核日期">
                                    <span>{auditTime}</span>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                </div>
            )
        }
        // 新增/编辑页
        /**
         * 供应商/供应商地点tooltip组件
         * @param {string} title 提示的文本
         */
        const tooltipItem = (title) => (
            <Tooltip title={title}>
                <Icon type="question-circle-o" className="detail-tooltip-icon" />
            </Tooltip>
        )
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
                                <span className="text">{this.props.basicInfo.purchaseOrderNo}</span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 采购单类型 */}
                            <FormItem>
                                <span className="ant-form-item-label">
                                    <span className="label-wrap">
                                        <span style={{ color: '#F00' }}>*</span>
                                        采购单类型:
                                    </span>
                                </span>
                                {getFieldDecorator('purchaseOrderType', {
                                    rules: [{ required: true, message: '请输入采购单类型' }],
                                    initialValue: this.state.purchaseOrderType
                                })(
                                    <Select size="default" onChange={this.selectChange}>
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
                                    {this.props.basicInfo.poStatusName ? this.props.basicInfo.poStatusName : '制单'}
                                </span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={8}>
                            {/* 供应商 */}
                            <FormItem formItemLayout >
                                <div className="row middle">
                                    <span className="ant-form-item-label">
                                        <span className="label-wrap">
                                            <span style={{ color: '#F00' }}>*</span>
                                            供应商:
                                        </span>
                                    </span>
                                    {getFieldDecorator('supplier', {
                                        initialValue: { spId: basicInfo.spId || '', spNo: basicInfo.spNo || '', companyName: basicInfo.spName || '' }
                                    })(
                                        <Supplier
                                            onChange={this.handleSupplierChange}
                                        />
                                        )}
                                    {tooltipItem('修改供应商会清空仓库地点和采购商品')}
                                </div>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 供应商地点 */}
                            <FormItem formItemLayout >
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
                                        ref={ref => { this.supplierLoc = ref }}
                                        fetch={(params) =>
                                            this.props.pubFetchValueList({
                                                orgId: this.props.data.user.employeeCompanyId,
                                                pId: this.props.form.getFieldValue('supplier').spId,
                                                condition: params.value,
                                                pageNum: params.pagination.current || 1,
                                                pageSize: params.pagination.pageSize
                                            }, 'supplierAdrSearchBox')
                                        }
                                        disabled={this.props.form.getFieldValue('supplier').spId === ''}
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
                                    {tooltipItem('修改供应商地点会清空仓库地点和采购商品')}
                                </div>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 预计送货日期 */}
                            <FormItem formItemLayout>
                                <span className="ant-form-item-label">
                                    <span className="label-wrap">
                                        <span style={{ color: '#F00' }}>*</span>
                                        预计送货日期:
                                    </span>
                                </span>
                                <DatePicker
                                    style={{ width: 241 }}
                                    format={dateFormat}
                                    value={this.state.pickerDate}
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
                                    initialValue: this.state.localType,
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
                                    </Select>
                                    )}
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
                                        this.state.localType === '0'
                                        && <SearchMind
                                            style={{ zIndex: 8000 }}
                                            compKey="warehouseCode"
                                            ref={ref => { this.poAddress = ref }}
                                            fetch={(params) =>
                                                this.props.pubFetchValueList({
                                                    supplierAddressId: this.state.spAdrId,
                                                    param: params.value,
                                                    pageNum: params.pagination.current || 1,
                                                    pageSize: params.pagination.pageSize
                                                }, 'getWarehouseInfo1')
                                            }
                                            onChoosed={() => {
                                                this.setState({
                                                    ispoAddressClear: false
                                                })
                                            }}
                                            disabled={this.props.form.getFieldValue('supplier').spId === '' || this.state.localType !== '0'}
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
                                        this.state.localType !== '0'
                                        && <SearchMind
                                            style={{ zIndex: 8000 }}
                                            disabled={this.state.locDisabled}
                                            compKey="id"
                                            ref={ref => { this.poStore = ref }}
                                            fetch={(params) =>
                                                this.props.pubFetchValueList({
                                                    param: params.value,
                                                    pageNum: params.pagination.current || 1,
                                                    pageSize: params.pagination.pageSize
                                                }, 'getStoreInfo')
                                            }
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
                                        ref={ref => { this.bigClass = ref }}
                                        fetch={(params) =>
                                            this.props.pubFetchValueList({
                                                param: params.value,
                                                level: '2'
                                            }, 'queryCategorysByLevel')
                                        }
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
                                <span>{this.renderPeriod(this.state.settlementPeriod)}</span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 付款方式 */}
                            <FormItem label="付款方式">
                                <span>{this.renderPayType(this.state.payType)}</span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 货币类型 */}
                            <FormItem label="货币类型" formItemLayout>
                                {getFieldDecorator('currencyCode', {
                                    initialValue: this.state.currencyCode
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
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={8}>
                            {/* 付款条件 */}
                            <FormItem label="付款条件">
                                <span>
                                    {this.renderPayCondition(this.state.payCondition)}
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
                                    initialValue: this.state.businessMode
                                })(
                                    <Select size="default">
                                        {
                                            businessModeType.data.map((item) =>
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
                                <span>{this.props.basicInfo.approvedByName}</span>
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            {/* 审核日期 */}
                            <FormItem label="审核日期">
                                <span>{this.props.basicInfo.approvedAt}</span>
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }

    /**
     * 根据是否存在采购单id、根据采购单状态返回操作按钮状态
     * 1.采购单基本信息或采购单id 不存在。按钮状态：保存、提交可用
     * 2.采购单状态=制单。按钮状态：保存、提交、下载PDF可用
     * 3.采购单状态=已提交。按钮状态：审核、下载PDF可用
     * 4.采购单状态=已审核、已拒绝、已关闭。按钮状态：下载PDF可用
     */
    getActionAuth() {
        const basicInfo = this.props.basicInfo;
        let actionAuth = {};
        // 基本信息新不存在或采购单id不存在
        if (!basicInfo || !basicInfo.id) {
            actionAuth = { save: true, submit: true };
            return actionAuth;
        }

        // 根据采购单状态 判断按钮可用状态
        const poStatus = basicInfo.status;
        if (poStatus === poStatusCodes.draft) {
            actionAuth = { save: true, submit: true, downloadPDF: true };
        } else if (poStatus === poStatusCodes.submited) {
            actionAuth = { approve: true, downloadPDF: true };
        } else if ((poStatus === poStatusCodes.approved)
            || (poStatus === poStatusCodes.rejected)
            || (poStatus === poStatusCodes.closed)) {
            actionAuth = { downloadPDF: true };
        }
        return actionAuth;
    }

    /**
     * 根据是否存在采购单id、采购单状态返回界面可编辑状态
     * 1.采购单基本信息或采购单id 不存在。界面状态：新建(new)
     * 2.采购单状态=制单。界面状态：可编辑(update)
     * 3.采购单状态=已提交、已审核、已拒绝、已关闭。界面状态：只读(readonly)
     */
    getPageMode() {
        const basicInfo = this.props.basicInfo;
        let pageMode;
        // 基本信息新不存在或采购单id不存在
        if (!basicInfo || !basicInfo.id) {
            pageMode = PAGE_MODE.NEW;
            return pageMode;
        }
        // 根据采购单状态 判断界面状态
        const poStatus = basicInfo.status;
        if (poStatus === 0) {
            pageMode = PAGE_MODE.UPDATE;
        } else if ((poStatus === 1)
            || (poStatus === 2)
            || (poStatus === 3)
            || (poStatus === 4)) {
            pageMode = PAGE_MODE.READONLY;
        }
        return pageMode;
    }

    /**
     * 返回采购单数据
     * 格式如下
     *  {
     *    basicInfo:{基本信息},
     *    poLines:[采购商品信息]
     *   }
     *   采购商品信息说明：
     *       行状态(recordStatus):.new(新添加)  其他情况：既存
     *       行删除标志(deleteFlg):true(已删除) 其他情况:未删除
     */
    getPoData() {
        const basicInfo = this.props.basicInfo;
        // 整理poLines数据,删除无用属性
        const poLinesTmp = this.props.poLines || [];
        const clearedPoLines = poLinesTmp.map((i) => {
            const item = i;
            // 新建商品删除id属性
            if (item.recordStatus === RECORD_STATUS.NEW) {
                if ('id' in item) {
                    delete item.id
                }
            }
            // 删除校验状态属性
            if ('isValidate' in item) {
                delete item.isValidate
            }
            return item;
        });
        const poData = { basicInfo, poLines: clearedPoLines };
        return poData;
    }

    /**
     * 返回采购单基本信息
     */
    getFormBasicInfo() {
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
        };
        const { applySupplierRecord } = this.state;
        const basicInfo = Object.assign({}, formValues, mapValues, applySupplierRecord);
        return basicInfo;
    }

    /**
     * 点击保存/提交
     * 校验内容：
     *     1.基本信息是否正确
     *     2.是否存在采购商品行
     *     3.采购商品行信息是否正确
     */
    getAllValue(status, isGoBack) {
        // 筛选出有效商品行
        const validPoLines = this.getPoData().poLines.filter((item) =>
            item.isValid !== 0
        )
        // 筛选出无效商品行
        const invalidPoLines = this.getPoData().poLines.filter((item) =>
            item.isValid === 0
        )
        // 检验基本信息
        if (!this.validateForm()) {
            message.error('校验失败，请检查！');
            return;
        }
        // 校验商品行
        if (this.hasInvalidateMaterial()) {
            message.error('采购商品校验失败，请检查！');
            return;
        }
        // 合法采购商品
        const tmpPoLines = this.props.poLines.filter((record) =>
            (!record.deleteFlg)
        );

        // 校验是否存在采购商品，无则异常
        if (tmpPoLines.length === 0) {
            message.error('请添加采购商品！');
            return;
        }

        // 校验是否存在采购数量为空商品
        if (this.hasEmptyQtyMaterial(tmpPoLines)) {
            message.error('请输入商品采购数量！');
            return;
        }

        // 校验有效商品数量
        if (validPoLines.length === 0) {
            message.error('无有效的商品！');
            return;
        }

        // 清除无效商品弹框
        if (invalidPoLines.length !== 0) {
            const invalidGoodsList = invalidPoLines.map(item =>
                (<p key={item.prodPurchaseId} >
                    {item.productName}
                </p>)
            );
            Modal.confirm({
                title: '是否默认清除以下无效商品？',
                content: invalidGoodsList,
                onOk: () => {
                    this.createPoRequest(validPoLines, status, isGoBack);
                },
                onCancel() {
                },
            });
        } else {
            this.createPoRequest(validPoLines, status, isGoBack);
        }
    }

    selectChange = (value) => {
        this.setState({
            purchaseOrderType: value,
            totalAmounts: 0
        })
    }

    /**
     * 新增/修改的请求
     */
    createPoRequest(validPoLines, status) {
        const CId = this.props.basicInfo.id;
        const that = this;
        // 基本信息，商品行均校验通过,获取有效值
        const basicInfo = Object.assign({}, this.getPoData().basicInfo, this.getFormBasicInfo());
        const poData = {
            basicInfo,
            poLines: validPoLines
        }
        // 基本信息
        const {
            spAdrId,
            payType,
            payCondition,
            adrType,
            currencyCode,
            purchaseOrderType,
            addressCd
        } = poData.basicInfo;
        // 采购商品信息
        const pmPurchaseOrderItems = poData.poLines.map((item) => {
            const {
                id,
                prodPurchaseId,
                productId,
                productCode,
                purchaseNumber
            } = item;
            return {
                ...Utils.removeInvalid({
                    id,
                    prodPurchaseId,
                    productId,
                    productCode,
                    purchaseNumber
                })
            }
        })

        // 预计送货日期
        const estimatedDeliveryDate = this.state.pickerDate
            ? this.state.pickerDate.valueOf().toString()
            : null;

        if (CId) {
            // 修改页
            this.props.ModifyPo({
                pmPurchaseOrder: {
                    id: CId,
                    spAdrId: `${spAdrId || this.props.basicInfo.spAdrId}`,
                    estimatedDeliveryDate,
                    payType,
                    payCondition,
                    adrType: parseInt(adrType, 10),
                    adrTypeCode: addressCd || this.props.basicInfo.adrTypeCode,
                    currencyCode,
                    purchaseOrderType: parseInt(purchaseOrderType, 10),
                    status,
                },
                pmPurchaseOrderItems
            }).then((res) => {
                // 如果创建成功，刷新界面数据
                if (res.success) {
                    message.success('提交成功！');
                    that.props.history.goBack();
                } else {
                    message.error('提交失败，请检查！');
                }
            });
        } else {
            // 新增页
            this.props.createPo({
                pmPurchaseOrder: {
                    spAdrId: `${spAdrId || this.props.basicInfo.spAdrId}`,
                    estimatedDeliveryDate,
                    payType,
                    payCondition,
                    adrType: parseInt(adrType, 10),
                    adrTypeCode: addressCd || this.props.basicInfo.adrTypeCode,
                    currencyCode,
                    purchaseOrderType: parseInt(purchaseOrderType, 10),
                    status,
                },
                pmPurchaseOrderItems
            }).then((res) => {
                // 如果创建成功，刷新界面数据
                if (res.success) {
                    message.success('提交成功！');
                    that.props.history.goBack();
                } else {
                    message.error('提交失败，请检查！');
                }
            });
        }
    }

    /**
     * 商品行采购数量变化回调，做如下处理
     *  1.更新store中该行信息（校验结果，采购数量，采购金额）
     *  2.计算采购总数量、采购总金额并更新store
     * result:{value:输入值,isValidate:检验结果 true/false}
     */
    applyQuantityChange = (records, index, result) => {
        const record = records;
        const { value, isValidate } = result;
        // 更新store中采购单商品
        if (record) {
            // 未输入采购数量，则清空store中采购数量，采购金额
            if (!value) {
                record.purchaseNumber = null;
                record.totalAmount = null;
                this.props.updatePoLine(record);
            } else {
                // 保存输入数据和校验状态 给submit用
                record.purchaseNumber = value;
                // 计算采购金额（含税）
                record.totalAmount = Math.round(value * record.purchasePrice * 100) / 100;
                // 校验状态
                record.isValidate = isValidate;
                this.props.updatePoLine(record);

                // 输入采购数量合法，更新store
                if (!isValidate) {
                    message.error('采购数量必须为采购内装数的整数倍');
                }
            }
        }
    }
    /**
     * 商品行价格变化回调，做如下处理
     *  1.更新store中该行信息（校验结果，采购价格，采购金额）
     *  2.计算采购总金额并更新store
     * result:{value:输入值,isValidate:检验结果 true/false}
     */
    applyPriceChange = (records, index, result) => {
        const record = records;
        const { value, isValidate } = result;
        // 更新store中采购单商品
        if (record) {
            // 未输入采购价格，则清空store中采购数量，采购金额
            if (!value) {
                record.purchasePrice = null;
                record.totalAmount = null;
                this.props.updatePoLine(record);
            } else {
                // 保存输入数据和校验状态 给submit用
                record.purchasePrice = value;
                // 计算采购金额（含税）
                record.totalAmount = Math.round(value * record.purchaseNumber * 100) / 100;
                // 校验状态
                record.isValidate = isValidate;
                this.props.updatePoLine(record);
            }
        }
    }
    /**
     * 计算采购总数量、采购总金额
     * 计算对象：未删除&&采购数量不为空
     */
    caculate(list = []) {
        const poLines = list;
        // 合计采购数量
        let totalQuantitys = 0;
        // 合计采购金额
        let totalAmounts = 0;
        poLines.forEach((item) => {
            if (item && item.purchaseNumber && !item.deleteFlg) {
                totalQuantitys += item.purchaseNumber;
            }
            if (item && item.totalAmount) {
                totalAmounts += item.totalAmount
            }
        });
        totalAmounts = Math.round(totalAmounts * 100) / 100;
        this.setState({
            totalQuantitys,
            totalAmounts: Math.round(totalAmounts * 100) / 100
        });
    }
    /**
     * Supplier供应商组件改变的回调
     * @param {Object} value
     */
    handleSupplierChange(value) {
        const { spId } = value;
        const { basicInfo } = this.props;
        if (spId !== '') {
            this.props.updatePoBasicinfo(basicInfo);
        }
        this.clearSupplierAbout();
    }
    /**
     *   1.清空供应商地点
     *   2.删除采购商品行
     *   3.清空账期、付款方式
     */
    clearSupplierAbout() {
        // 1.清空供应商地点，仓库值清单
        this.supplierLoc.reset();
        if (this.state.localType === '0') {
            this.poAddress.reset();
        }
        // 2.删除所有商品行
        this.deletePoLines();
        // 3.清空账期、付款方式、付款条件
        const basicInfo = this.props.basicInfo;
        basicInfo.settlementPeriod = null;
        basicInfo.payType = null;
        basicInfo.payCondition = null;
    }

    /**
     * 供应商地点变更时，做如下处理
     *  1.删除采购商品行
     *  2.清空账期、付款方式、付款条件
     * @param {*} res
     */
    applySupplierLocChoosed(res) {
        if (res) {
            const record = res.record;
            if (this.state.localType === '0') {
                this.poAddress.reset();
                this.setState({
                    ispoAddressClear: true
                })
            }
            if (res.record) {
                // 1.删除所有商品行
                this.deletePoLines();
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
                    spAdrId: record.spAdrid
                });
            }
        }
    }

    /**
     * 清空供应商地点事件
     */
    applySupplierLocClear() {
        if (this.state.localType === '0') {
            this.poAddress.reset();
        }
        this.setState({
            // 账期
            settlementPeriod: null,
            // 付款方式
            payType: null,
            // 付款条件
            payCondition: null
        })
    }

    /**
     * 删除所有商品行
     * 1.行状态=new ,物理删除
     * 2.行状态!=new，逻辑删除
     */
    deletePoLines() {
        this.props.initPoDetail({
            poLines: []
        })
    }

    S4() {
        return (((1 + Math.random()) * 0x10000) || 0).toString(16).substring(1);
    }

    guid() {
        return `${this.S4()}${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}${this.S4()}${this.S4()}`;
    }

    /**
     * 检查添加商品是否已经存在于采购单商品列表
     */
    isMaterialExists = (productCode) => {
        let result = { exsited: true, record: null };
        if (!productCode) {
            result = { exsited: true, record: null };
            return result;
        }

        const tmp = this.props.poLines;
        // 商品行列表为空，则不存在改商品
        if (!tmp) {
            result = { exsited: false, record: null };
            return result;
        }

        for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].productCode === productCode) {
                result = { exsited: true, record: tmp[i] };
                return result;
            }
        }
        return ({ exsited: false, record: null });
    }

    /**
     * 添加采购商品
     *  .检查商品列表中是否存在该商品
     *    a.已存在：显示已存在
     *    b   在：添加该商品(recordStatus:new 新添加)
     */
    handleChoosedMaterialMap = ({ record }) => {
        // 检查商品列表是否已经存在该商品
        const result = this.isMaterialExists(record.productCode);
        if (result.exsited) {
            if (result.record && result.record.deleteFlg) {
                result.record.deleteFlg = false;
                this.props.updatePoLine(result.record);
            } else {
                message.error('该商品已经存在');
            }
        } else {
            this.props.fetchNewPmPurchaseOrderItem({
                // 商品id, 供应商地点id
                productId: record.productId,
                spAdrId: this.state.spAdrId
            }).then(() => {
                const { newPcOdData } = this.props;
                const uuid = this.guid();
                const poLine = Object.assign(
                    {},
                    newPcOdData,
                    { id: uuid, recordStatus: RECORD_STATUS.NEW }
                );
                this.props.addPoLines(poLine);
            })
        }
    }

    /**
     * 返回商品行中是否存在检验失败记录
     */
    hasInvalidateMaterial() {
        return this.props.poLines.some((element) => {
            if (!element.isValidate) {
                return false;
            }
            return (!element.isValidate);
        })
    }

    /**
     * 商品行是否有未输入采购数量商品
     */
    hasEmptyQtyMaterial(poLines = []) {
        if (poLines.length === 0) {
            return false;
        }
        return poLines.some((element) =>
            !element.purchaseNumber
        )
    }

    /**
     * 校验输入数据
     */
    validateForm() {
        // 新增时数据
        const basicInfo = this.getFormBasicInfo();
        const {
            addressId,
            spId,
            spAdrId,
        } = basicInfo;
        const { pickerDate, ispoAddressClear } = this.state;

        // 修改时数据
        const updateBasicInfo = this.props.basicInfo;
        let isOk = true;
        const { form } = this.props;
        form.validateFields((err) => {
            if (!err) {
                if (updateBasicInfo.status === 0) {
                    // 修改页
                    if (
                        !ispoAddressClear
                        && updateBasicInfo.adrTypeCode
                        && updateBasicInfo.spId
                        && updateBasicInfo.spAdrId
                        && updateBasicInfo.estimatedDeliveryDate
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


    /**
     * 点击保存
     */
    handleSave() {
        this.getAllValue(0, false);
    }

    /**
     * 点击提交
     */
    handleSubmit() {
        this.getAllValue(1, true);
    }

    /**
     * 审核弹出框点击"确定" 回调函数
     * @param {*} values
     */
    applyAuditOk(values) {
        const that = this;
        // 调用审批api
        this.props.auditPo(values).then((res) => {
            if (res.success) {
                message.success('审批成功！');
                that.setState({ auditModalVisible: false });
                // 跳转到采购单管理列表界面
                history.back();
            } else {
                message.error('审批失败，请检查！');
            }
        });
    }

    /**
     * 审核弹出框点击"取消" 回调函数
     */
    applyAuditCancel() {
        this.setState({ auditModalVisible: false });
    }

    /**
     * 点击审批
     */
    handleAudit() {
        this.props.modifyCauseModalVisible({ isShow: true, id: this.props.basicInfo.id });
    }

    /**
     * 下载pdf
     */
    handleDownPDF() {
        Utils.exportExcel(
            exportProcurementPdf,
            { purchaseOrderNo: this.props.basicInfo.purchaseOrderNo }
        );
    }

    /**
     * 表单操作
     * @param {*} text 行值
     * @param {*} record 行数据
     * @param {*} index 行下标
     */
    renderActions(text, record, index) {
        const menu = (
            <Menu onClick={(item) => this.onActionMenuSelect(record, index, item)}>
                <Menu.Item key="delete">
                    <a target="_blank" rel="noopener noreferrer">删除</a>
                </Menu.Item>
            </Menu>
        )
        return (
            <Dropdown overlay={menu} placement="bottomCenter">
                <a className="ant-dropdown-link">
                    表单操作
                    <Icon type="down" />
                </a>
            </Dropdown>
        )
    }

    /**
     * 渲染账期
     * @param {*} key
     */
    renderPeriod(key) {
        switch (key) {
            case 0:
                return '周结';
            case 1:
                return '半月结';
            case 2:
                return '月结';
            case 3:
                return '票到付款';
            default:
                return '';
        }
    }

    /**
     * 渲染付款方式
     * @param {*} key
     */
    renderPayType(key) {
        switch (key) {
            case 0:
                return '网银';
            case 1:
                return '银行转账';
            case 2:
                return '现金';
            case 3:
                return '支票';
            default:
                return '';
        }
    }

    /**
     * 渲染付款条件
     * @param {*} key
     */
    renderPayCondition(key) {
        switch (key) {
            case 1:
                return '票到七天';
            case 2:
                return '票到十五天';
            case 3:
                return '票到三十天';
            case 4:
                return '票到付款';
            default:
                return '';
        }
    }

    render() {
        const { totalAmounts, totalQuantitys, spAdrId } = this.state;
        const supplierInfo = spAdrId ? `${spAdrId}-1` : null;
        const { poLines, basicInfo } = this.props;
        const baiscInfoElements = this.getBaiscInfoElements(this.state.pageMode);
        if (
            this.state.currentType === 'detail'
            && this.columns[this.columns.length - 1].key === 'operation'
        ) {
            this.columns.pop();
        }
        return (
            <div className="po-detail">
                <Form layout="inline">
                    {baiscInfoElements}
                    {this.state.currentType !== 'detail' && <div className="addMaterialContainer">
                        <Row >
                            <Col span={8}>
                                <div className="row middle">
                                    <SearchMind
                                        style={{ zIndex: 6000, marginBottom: 5 }}
                                        compKey="productCode"
                                        ref={ref => { this.addPo = ref }}
                                        fetch={(params) =>
                                            this.props.pubFetchValueList({
                                                supplierInfo,
                                                teamText: params.value,
                                                pageNum: params.pagination.current || 1,
                                                pageSize: params.pagination.pageSize
                                            }, 'queryProductForSelect')
                                        }
                                        disabled={this.props.form.getFieldValue('supplier').spId === ''}
                                        addonBefore="添加商品"
                                        onChoosed={this.handleChoosedMaterialMap}
                                        renderChoosedInputRaw={(data) => (
                                            <div>{data.productCode} - {data.saleName}</div>
                                        )}
                                        pageSize={6}
                                        columns={[
                                            {
                                                title: '商品编码',
                                                dataIndex: 'productCode',
                                                width: 98
                                            }, {
                                                title: '商品名称',
                                                dataIndex: 'saleName',
                                                width: 140
                                            }
                                        ]}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>}
                    <div className="poLines area-list">
                        <Table
                            dataSource={poLines.filter((record) =>
                                !record.deleteFlg
                            )}
                            pagination={false}
                            columns={this.columns}
                            rowKey="productCode"
                            scroll={{
                                x: 1300
                            }}
                        />
                    </div>
                    <div>
                        <Row type="flex">
                            <Col span={8}>
                                <div>
                                    <span>合计数量:</span>
                                    <span style={{ color: '#F00' }}>{totalQuantitys}</span>
                                </div>

                            </Col>
                            <Col span={8}>
                                <div>
                                    <span>合计金额:</span>
                                    <span style={{ color: '#F00' }}>{totalAmounts}</span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Affix offsetBottom={0}>
                        <div className="actions">
                            <Row gutter={40} type="flex" justify="end" >
                                <Col>
                                    {
                                        this.state.currentType !== 'detail'
                                        && (basicInfo.status === 0
                                            || this.state.currentType === 'create')
                                        && <FormItem>
                                            <Button size="default" onClick={this.handleSave}>
                                                保存
                                            </Button>
                                        </FormItem>
                                    }
                                    {
                                        this.state.currentType !== 'detail'
                                        && (basicInfo.status === 0
                                            || this.state.currentType === 'create')
                                        && <FormItem>
                                            <Button size="default" onClick={this.handleSubmit}>
                                                提交
                                            </Button>
                                        </FormItem>
                                    }
                                    {
                                        this.state.currentType === 'detail'
                                        && basicInfo.status === 1
                                        && <FormItem>
                                            <Button size="default" onClick={this.handleAudit}>
                                                审批
                                            </Button>
                                        </FormItem>
                                    }
                                    {
                                        this.state.currentType === 'detail'
                                        && <FormItem>
                                            <Button size="default" onClick={this.handleDownPDF}>
                                                下载PDF
                                            </Button>
                                        </FormItem>
                                    }
                                </Col>
                            </Row>
                        </div>
                    </Affix>
                </Form>
                <div>
                    <Audit />
                </div>
            </div>
        )
    }
}

PoDetail.propTypes = {
    match: PropTypes.objectOf(PropTypes.any),
    newPcOdData: PropTypes.objectOf(PropTypes.any),
    basicInfo: PropTypes.objectOf(PropTypes.any),
    poLines: PropTypes.objectOf(PropTypes.any),
    po: PropTypes.objectOf(PropTypes.any),
    initPoDetail: PropTypes.objectOf(PropTypes.any),
    form: PropTypes.objectOf(PropTypes.any),
    data: PropTypes.objectOf(PropTypes.any),
    pubFetchValueList: PropTypes.func,
    ModifyPo: PropTypes.func,
    createPo: PropTypes.func,
    updatePoLine: PropTypes.func,
    updatePoBasicinfo: PropTypes.func,
    fetchNewPmPurchaseOrderItem: PropTypes.func,
    addPoLines: PropTypes.func,
    auditPo: PropTypes.func,
    modifyCauseModalVisible: PropTypes.func,
}

export default withRouter(Form.create()(PoDetail));
