/**
 * @author taoqiyu@yatang.cn
 *
 * 采购管理 - 收货单管理列表
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Input,
    Form,
    Select,
    DatePicker,
    Row,
    Col,
    Icon,
    Table,
    Menu,
    Dropdown,
    message
} from 'antd';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import { PAGE_SIZE } from '../../../constant';
import Utils from '../../../util/util';
import {
    locType,
    receivedStatus,
    poType,
    businessModeType
} from '../../../constant/procurement';
import SearchMind from '../../../components/searchMind';
import { pubFetchValueList } from '../../../actions/pub';
import { repushPurchaseReceipt } from '../../../actions/procurement';
import {
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
    fetchPoRcvMngList
} from '../../../actions';

import { Supplier } from '../../../container/search';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

@connect(state => ({
    poRcvMngList: state.toJS().procurement.poRcvMngList,
    employeeCompanyId: state.toJS().user.data.user.employeeCompanyId,
}), dispatch => bindActionCreators({
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
    fetchPoRcvMngList,
    pubFetchValueList,
    repushPurchaseReceipt
}, dispatch))

class PoRcvMngList extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleResetValue = this.handleResetValue.bind(this);
        this.onLocTypeChange = this.onLocTypeChange.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.queryRcvMngPoList = this.queryRcvMngPoList.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.searchParams = {};
        this.state = {
            spNo: '', // 供应商编码
            spId: '', // 供应商ID
            spAdrNo: '', // 供应商地点编码
            isSupplyAdrDisabled: true, // 供应商地点禁用
            locDisabled: true, // 地点禁用
            locationData: {},
            adrTypeCode: '', // 地点编码
            receivedTypeCode: '' // 收货单状态编码
        };
        // 初始页号
        this.current = 1;
        this.columns = [
            {
                title: '收货单号',
                dataIndex: 'purchaseReceiptNo',
                key: 'purchaseReceiptNo'
            }, {
                title: 'ASN',
                dataIndex: 'asn',
                key: 'asn',
                render: text => {
                    let res = text;
                    if (text === null || undefined === text || text === '') {
                        res = '-';
                    }
                    return res;
                }
            }, {
                title: '采购单号',
                dataIndex: 'purchaseOrderNo',
                key: 'purchaseOrderNo'
            }, {
                title: '经营模式',
                dataIndex: 'businessMode',
                key: 'businessMode',
                render: businessModeCode => {
                    let text = '';
                    businessModeType.data.forEach(item => {
                        if (businessModeCode === +(item.key)) {
                            text = item.value;
                            return text;
                        }
                        return text;
                    })
                    return text;
                }
            }, {
                title: '采购单类型',
                dataIndex: 'purchaseOrderType',
                key: 'purchaseOrderType',
                render: poTypeCode => {
                    let text = '';
                    poType.data.forEach(item => {
                        if (poTypeCode === +(item.key)) {
                            text = item.value;
                            return text;
                        }
                        return text;
                    })
                    return text;
                }
            }, {
                title: '供应商',
                dataIndex: 'spNo',
                key: 'spNo'
            }, {
                title: '供应商名称',
                dataIndex: 'spName',
                key: 'spName'
            }, {
                title: '供应商地点编号',
                dataIndex: 'spAdrNo',
                key: 'spAdrNo'
            }, {
                title: '供应商地点名称',
                dataIndex: 'spAdrName',
                key: 'spAdrName'
            }, {
                title: '预计送货日期',
                dataIndex: 'estimatedDeliveryDate',
                key: 'estimatedDeliveryDate',
                render: text => {
                    let res = text;
                    if (!text) {
                        res = '-';
                    } else {
                        res = (moment(new Date(text)).format(dateFormat))
                    }
                    return res;
                }
            }, {
                title: '地点类型',
                dataIndex: 'adrType',
                key: 'adrType',
                render: adrTypeCode => {
                    let text = '';
                    locType.data.forEach(item => {
                        if (adrTypeCode === +(item.key)) {
                            text = item.value;
                            return text;
                        }
                        return text;
                    });
                    return text;
                }
            }, {
                title: '地点',
                dataIndex: 'adrTypeName',
                key: 'adrTypeName'
            }, {
                title: '预计到货日期',
                dataIndex: 'estimatedReceivedDate',
                key: 'estimatedReceivedDate',
                render: text => {
                    let res = text;
                    if (!text) {
                        res = '-';
                    } else {
                        res = (moment(new Date(text)).format(dateFormat))
                    }
                    return res;
                }
            }, {
                title: '收货日期',
                dataIndex: 'receivedTime',
                key: 'receivedTime',
                render: text => {
                    let res = text;
                    if (!text) {
                        res = '-';
                    } else {
                        res = (moment(new Date(text)).format(dateFormat))
                    }
                    return res;
                }
            }, {
                title: '收货单状态',
                dataIndex: 'status',
                key: 'status',
                render: statusCode => {
                    let text = '';
                    receivedStatus.data.forEach(item => {
                        if (statusCode === +(item.key)) {
                            text = item.value;
                            return text;
                        }
                        return text;
                    });
                    return text;
                }
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: this.renderActions
            }
        ]
    }

    componentDidMount() {
        this.queryRcvMngPoList();
    }

    /**
     * 根据地点类型值控制地点值清单是否可编辑
     * 地点类型有值时：地点值清单可编辑
     * 地点类型无值时：地点值清单不可编辑、清空地点值清单
     *
     * @param {*} value
     */
    onLocTypeChange = (value) => {
        this.poAddress.reset();
        this.adressTypeCode = '';
        this.setState({
            locDisabled: locType.defaultValue === value
        })
    }

    /**
     * 分页页码改变的回调
     */
    onPaginate = (pageNumber) => {
        this.current = pageNumber;
        this.props.fetchPoRcvMngList({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            ...this.searchParams
        });
    }

    queryRcvMngPoList(params) {
        const tmp = params || {};
        const allParams = Object.assign({
            pageSize: PAGE_SIZE,
            pageNum: this.current || 1
        }, this.searchParams, tmp);
        this.props.fetchPoRcvMngList(allParams);
    }

    /**
     * 重置检索条件
     */
    handleResetValue() {
        this.current = 1;
        // 重置检索条件
        this.searchParams = {};
        // 重置form
        this.props.form.resetFields();
        this.handleSupplyClear();
        this.handleAddressClear();
    }

    /**
     * Supplier供应商组件改变的回调
     * @param {object} record 改变后值
     */
    handleSupplierChange = (record) => {
        const {spId, spNo} = record;
        if (spId === '') {
            this.setState({
                spNo: '',
                spId: '',
                isSupplyAdrDisabled: true
            });
            this.supplySearchMind.reset();
        } else {
            this.setState({
                spNo,
                spId,
                orgId: this.props.employeeCompanyId,
                isSupplyAdrDisabled: false
            });
        }
        this.handleSupplierAddressClear();
    }

    /**
     * 获取供应商地点编号
     */
    handleSupplierAddressChoose = ({ record }) => {
        this.setState({ spAdrNo: record.providerNo });
    }

    /**
     * 清空供应商地点编号
     */
    handleSupplierAddressClear = () => {
        this.setState({ spAdrNo: '' });
        this.supplyAddressSearchMind.reset();
    }

    /**
     * 地点选择
     * @return {Promise}
     */
    handleGetAddressMap = (param) => {
        const { adrType } = this.props.form.getFieldsValue(['adrType'])
        const libraryCode = '0';
        const storeCode = '1';
        let locationTypeParam = '';
        if (adrType === libraryCode) {
            locationTypeParam = 'getWarehouseInfo1';
            this.setState({
                locationData: {
                    code: 'warehouseCode',
                    name: 'warehouseName'
                }
            })
        }
        if (adrType === storeCode) {
            locationTypeParam = 'getStoreInfo';
            this.setState({
                locationData: {
                    code: 'id',
                    name: 'name'
                }
            })
        }
        return this.props.pubFetchValueList({
            param: param.value,
            pageNum: param.pagination.current || 1,
            pageSize: param.pagination.pageSize
        }, locationTypeParam);
    }

    /**
     * 获取地点编号
     */
    handleAddressChoose = ({ record }) => {
        const encoded = record[this.state.locationData.code];
        this.setState({ adrTypeCode: encoded });
    }

    /**
     * 清空地点编号
     */
    handleAddressClear = () => {
        this.setState({
            adrTypeCode: '',
            locDisabled: true
        });
        this.poAddress.reset();
    }

    handleSelect(record, index, items) {
        const { key } = items;
        switch (key) {
            case 'push': // 重新推送采购收货单失败
                this.props.repushPurchaseReceipt({
                    purchaseOrderNo: record.purchaseOrderNo
                }).then(res => {
                    if (res.code === 200) {
                        message.info('重新推送成功');
                    } else {
                        message.error('重新推送失败');
                    }
                });
                break;
            default:
                break;
        }
    }

    /**
     * 查询收货单管理列表
     */
    handleSearch() {
        this.current = 1;
        // 编辑查询条件
        this.editSearchParams();
        // 查询收货单单列表
        this.queryRcvMngPoList();
    }

    /**
     *
     * 返回查询条件
     *
     */
    editSearchParams() {
        const {
            purchaseReceiptNo,
            purchaseOrderNo,
            adrType,
            purchaseOrderType,
            status,
            businessMode
        } = this.props.form.getFieldsValue();

        // 收货日期区间
        const receivedDuringArr = this.props.form.getFieldValue('receivedDuring') || [];
        let receivedTimeStart;
        let receivedTimeEnd;
        if (receivedDuringArr.length > 0) {
            receivedTimeStart = Date.parse(receivedDuringArr[0].format(dateFormat));
        }
        if (receivedDuringArr.length > 1) {
            receivedTimeEnd = Date.parse(receivedDuringArr[1].format(dateFormat));
        }

        // 获取采购单审批日期区间
        const auditDuringArr = this.props.form.getFieldValue('auditDuring') || [];
        let startAuditTime;
        let endAuditTime;
        if (auditDuringArr.length > 0) {
            startAuditTime = Date.parse(auditDuringArr[0].format(dateFormat));
        }
        if (auditDuringArr.length > 1) {
            endAuditTime = Date.parse(auditDuringArr[1].format(dateFormat));
        }

        // 供应商编号
        const spNo = this.state.spNo;

        // 供应商地点编号
        const spAdrNo = this.state.spAdrNo;

        // 地点
        const adrTypeCode = this.state.adrTypeCode;

        // 收货单状态编码
        const receivedTypeCode = this.state.receivedTypeCode;

        const searchParams = {
            purchaseReceiptNo,
            purchaseOrderNo,
            adrType,
            adrTypeCode,
            purchaseOrderType,
            status,
            receivedTypeCode,
            spNo,
            spAdrNo,
            receivedTimeStart,
            receivedTimeEnd,
            startAuditTime,
            endAuditTime,
            businessMode
        };
        this.searchParams = Utils.removeInvalid(searchParams);
        return this.searchParams;
    }

    renderActions(text, record, index) {
        const { id, status } = record;
        const { pathname } = this.props.location;
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                <Menu.Item key="detail">
                    <a target="_blank" href={`${pathname}/${id}`}>收货单详情</a>
                </Menu.Item>
                {
                    // 仅待下发状态时能够点击重新推送采购收货单
                    (status === 0) ?
                        <Menu.Item key="push">
                            <a target="_blank" rel="noopener noreferrer">
                                重新推送采购收货单
                            </a>
                        </Menu.Item>
                        : null
                }
            </Menu>
        );
        return (
            <Dropdown overlay={menu} placement="bottomCenter">
                <a className="ant-dropdown-link">
                    表单操作
                    <Icon type="down" />
                </a>
            </Dropdown>
        )
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { data, total, pageNum, pageSize } = this.props.poRcvMngList;
        return (
            <div className="search-box">
                <Form layout="inline">
                    <div className="">
                        <Row gutter={40}>
                            <Col span={8}>
                                {/* 采购单号 */}
                                <FormItem label="采购单号" >
                                    {getFieldDecorator('purchaseOrderNo', {})(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 收货单号 */}
                                <FormItem label="收货单号" >
                                    {getFieldDecorator('purchaseReceiptNo', {})(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 收货日期 */}
                                <FormItem >
                                    <div className="row middle">
                                        <span className="ant-form-item-label search-mind-label">收货日期</span>
                                        {getFieldDecorator('receivedDuring', {})(
                                            <RangePicker
                                                className="date-range-picker"
                                                style={{ width: 250 }}
                                                format={dateFormat}
                                                showTime={{
                                                    hideDisabledOptions: true,
                                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                                }}
                                                placeholder={['开始日期', '结束日期']}
                                            />
                                        )
                                        }
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={8}>
                                {/* 采购单类型 */}
                                <FormItem label="采购单类型">
                                    {getFieldDecorator('purchaseOrderType', { initialValue: poType.defaultValue })(
                                        <Select style={{ width: '153px' }} size="default">
                                            {
                                                poType.data.map((item) => (
                                                    <Option key={item.key} value={item.key}>
                                                        {item.value}
                                                    </Option>))
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 供应商 */}
                                <FormItem>
                                    <div className="row middle">
                                        <span className="ant-form-item-label search-mind-label">供应商</span>
                                        {getFieldDecorator('spId', {
                                            initialValue: { spId: '', spNo: '', companyName: ''}
                                        })(
                                            <Supplier
                                                onChange={this.handleSupplierChange}
                                            />
                                        )}
                                    </div>
                                </FormItem>
                            </Col>
                            {/* 供应商地点 */}
                            <Col span={8}>
                                <FormItem className="">
                                    <div className="row middle">
                                        <span className="ant-form-item-label search-mind-label">供应商地点</span>
                                        <SearchMind
                                            rowKey="providerNo"
                                            compKey="search-mind-supply-address"
                                            ref={ref => {
                                                this.supplyAddressSearchMind = ref
                                            }}
                                            fetch={(params) => this.props.pubFetchValueList({
                                                orgId: this.props.employeeCompanyId,
                                                pId: this.state.spId,
                                                condition: params.value,
                                                pageNum: params.pagination.current || 1,
                                                pageSize: params.pagination.pageSize
                                            }, 'supplierAdrSearchBox')}
                                            onChoosed={this.handleSupplierAddressChoose}
                                            onClear={this.handleSupplierAddressClear}
                                            renderChoosedInputRaw={(row) => (
                                                <div>{row.providerNo} - {row.providerName}</div>
                                            )}
                                            disabled={this.state.isSupplyAdrDisabled}
                                            pageSize={6}
                                            columns={[{
                                                title: '供应商地点编码',
                                                dataIndex: 'providerNo',
                                                width: 98
                                            }, {
                                                title: '供应商地点名称',
                                                dataIndex: 'providerName'
                                            }
                                            ]}
                                        />
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={8}>
                                {/* 收货单状态 */}
                                <FormItem label="收货单状态">
                                    {getFieldDecorator('status', { initialValue: receivedStatus.defaultValue })(
                                        <Select style={{ width: '153px' }} size="default">
                                            {
                                                receivedStatus.data.map((item) => (
                                                    <Option key={item.key} value={item.key}>
                                                        {item.value}
                                                    </Option>))
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 地点类型 */}
                                <FormItem label="地点类型">
                                    {getFieldDecorator('adrType', {
                                        initialValue: locType.defaultValue
                                    })(
                                        <Select style={{ width: '153px' }} size="default" onChange={this.onLocTypeChange}>
                                            {locType.data.map((item) => (
                                                <Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Option>
                                            ))}
                                        </Select>)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 地点 */}
                                <FormItem>
                                    <div className="row middle">
                                        <span className="ant-form-item-label search-mind-label">地点</span>
                                        <SearchMind
                                            style={{ zIndex: 7 }}
                                            compKey="search-mind-key1"
                                            rowKey="id"
                                            ref={ref => { this.poAddress = ref }}
                                            fetch={this.handleGetAddressMap}
                                            onChoosed={this.handleAddressChoose}
                                            onClear={this.handleAddressClear}
                                            disabled={this.state.locDisabled}
                                            renderChoosedInputRaw={(row) => (
                                                <div>
                                                    {row[this.state.locationData.code]} -
                                                    {row[this.state.locationData.name]}
                                                </div>
                                            )}
                                            pageSize={3}
                                            columns={[
                                                {
                                                    title: '编码',
                                                    dataIndex: this.state.locationData.code,
                                                    width: 80
                                                }, {
                                                    title: '名称',
                                                    dataIndex: this.state.locationData.name
                                                }
                                            ]}
                                        />
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={8}>
                                {/* 经营模式 */}
                                <FormItem label="经营模式">
                                    {getFieldDecorator('businessMode', {
                                        initialValue: businessModeType.defaultValue
                                    })(
                                        <Select style={{ width: '153px' }} size="default" >
                                            {businessModeType.data.map((item) => (
                                                <Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Option>
                                            ))}
                                        </Select>)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 审批日期 */}
                                <FormItem>
                                    <div className="row middle">
                                        <span className="ant-form-item-label search-mind-label">审批日期</span>
                                        {
                                            getFieldDecorator('auditDuring', {})(
                                                <RangePicker
                                                    className="date-range-picker"
                                                    style={{ width: 250 }}
                                                    format={dateFormat}
                                                    showTime={{
                                                        hideDisabledOptions: true,
                                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                                    }}
                                                    placeholder={['开始日期', '结束日期']}
                                                />
                                            )
                                        }
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40} type="flex" justify="end">
                            <Col className="tr">
                                <FormItem>
                                    <Button size="default" onClick={this.handleResetValue}>
                                        重置
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" onClick={this.handleSearch} size="default">
                                        搜索
                                    </Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    <div >
                        <Table
                            dataSource={data}
                            columns={this.columns}
                            rowKey="id"
                            scroll={{
                                x: 1600
                            }}
                            pagination={{
                                current: pageNum,
                                total,
                                pageSize,
                                showQuickJumper: true,
                                onChange: this.onPaginate
                            }}
                        />
                    </div>
                </Form>
            </div >
        );
    }
}

PoRcvMngList.propTypes = {
    employeeCompanyId: PropTypes.string,
    fetchPoRcvMngList: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    poRcvMngList: PropTypes.objectOf(PropTypes.any),
    pubFetchValueList: PropTypes.func,
    repushPurchaseReceipt: PropTypes.func
};

export default withRouter(Form.create()(PoRcvMngList));
