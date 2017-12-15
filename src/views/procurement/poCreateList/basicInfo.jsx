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
import { locType, poType, poNo, businessModeType } from '../../../constant/procurement';
import SearchMind from '../../../components/searchMind';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';
import { Supplier } from '../../../container/search';

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
            totalQuantity: 0,
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
            businessMode: null,
            status: 0,
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
                adrType, settlementPeriod, payType, payCondition, estimatedDeliveryDate,
                purchaseOrderType, currencyCode, spAdrId, spAdrName, businessMode,
                createdByName, createdAt, spId, spName, adrTypeCode, adrTypeName,
                status,
            } = nextProps.basicInfo;
            this.setState({
                locDisabled: !(adrType === 0 || adrType === 1),
                isSupplyAdrDisabled: false,
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
                status
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
     * Supplier供应商组件改变的回调
     * @param {Object} value
     */
    handleSupplierChange = (value) => {
        const { spId } = value;
        const { basicInfo } = this.props;
        if (spId !== '') {
            this.props.updatePoBasicinfo(basicInfo);
        }
        this.props.stateChange({spId});
        this.clearSupplierAbout();
    }

    /**
     *   1.清空供应商地点
     *   2.删除采购商品行
     *   3.清空账期、付款方式
     */
    clearSupplierAbout = () => {
        // 1.清空供应商地点，仓库值清单
        this.supplierLoc.reset();
        if (this.state.localType === '0') {
            this.poAddress.reset();
        }
        // 2.删除所有商品行
        this.props.deletePoLines();
        // 3.清空账期、付款方式、付款条件
        const basicInfo = this.props.basicInfo;
        basicInfo.settlementPeriod = null;
        basicInfo.payType = null;
        basicInfo.payCondition = null;
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
     * 清空供应商地点事件
     */
    applySupplierLocClear = () => {
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
     * 渲染付款方式
     * @param {*} key
     */
    renderPayType = (key) => {
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
    renderPayCondition = (key) => {
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

    /**
     * 渲染账期
     * @param {*} key
     */
    renderPeriod = (key) => {
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

    render() {
        const Option = Select.Option;
        const dateFormat = 'YYYY-MM-DD';
        const { getFieldDecorator } = this.props.form;
        // 创建者
        const createdByName = this.state.createdByName
            ? this.state.createdByName
            : this.props.data.user.employeeName

        // 创建日期
        const createdAt = this.state.createdAt
            ? this.state.createdAt
            : moment().format('YYYY-MM-DD')

        // 供应商
        const spDefaultValue = this.state.spId
            ? `${this.state.spId}-${this.state.spName}`
            : ''

        // 供应商地点值清单回显数据
        const spAdrDefaultValue = this.state.spAdrId
            ? `${this.state.spAdrId}-${this.state.spAdrName}`
            : ''

        // 地点值清单回显数据
        const adresssDefaultValue = this.state.adrTypeCode
            ? `${this.state.adrTypeCode}-${this.state.adrTypeName}`
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
                                <span className="text">{this.state.purchaseOrderNo}</span>
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
                                    {this.state.poStatusName ? this.state.poStatusName : '制单'}
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
                                        initialValue: { spId: this.state.spId || '', spNo: this.state.spNo || '', companyName: this.state.spName || '' }
                                    })(
                                        <Supplier
                                            onChange={this.handleSupplierChange}
                                            initialValue={spDefaultValue}
                                        />)}
                                    {this.tooltipItem('修改供应商会清空仓库地点和采购商品')}
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
                                                pageSize: params.pagination.pageSize,
                                                isContainsHeadBranchCompany: true
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
                                    {this.tooltipItem('修改供应商地点会清空仓库地点和采购商品')}
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
                                <span>
                                    {this.renderPeriod(this.state.settlementPeriod)}
                                </span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 付款方式 */}
                            <FormItem label="付款方式">
                                <span>
                                    {this.renderPayType(this.state.payType)}
                                </span>
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
                                    </Select>)}
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
                                    <Select size="default" onChange={this.businessModeTypeChange}>
                                        {
                                            businessModeType.data.map((item) =>
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
}

BasicInfo.propTypes = {
    basicInfo: PropTypes.objectOf(PropTypes.any),
    form: PropTypes.objectOf(PropTypes.any),
    data: PropTypes.objectOf(PropTypes.any),
    pubFetchValueList: PropTypes.func,
    updatePoBasicinfo: PropTypes.func,
    stateChange: PropTypes.func,
    purchaseOrderTypeChange: PropTypes.func,
    deletePoLines: PropTypes.func,
    isCheck: PropTypes.bool,
    checkResult: PropTypes.func,
}
export default withRouter(Form.create()(BasicInfo));
