/*
 * @Author: tanjf
 * @Description: 采购退货
 * @CreateDate: 2017-10-27 11:23:06
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-10-27 11:23:06
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
    Modal,
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
    returnStatus
} from '../../../constant/procurement';
import SearchMind from '../../../components/searchMind';
import { pubFetchValueList } from '../../../actions/pub';
import { repushPurchaseReceipt } from '../../../actions/procurement';
import {
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
    fetchReturnMngList
} from '../../../actions';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const confirm = Modal.confirm;

@connect(state => ({
    poRcvMngList: state.toJS().procurement.poRcvMngList,
    returnMngList: state.toJS().procurement.returnMngList,
    employeeCompanyId: state.toJS().user.data.user.employeeCompanyId,
}), dispatch => bindActionCreators({
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
    fetchReturnMngList,
    pubFetchValueList,
    repushPurchaseReceipt
}, dispatch))

class ReturnManagementList extends PureComponent {
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
            spId: '',   // 供应商编码
            spAdrId: '',    // 供应商地点编码
            isSupplyAdrDisabled: true, // 供应商地点禁用
            locDisabled: true,  // 地点禁用
            locationData: {},
            adrTypeCode: '',    // 地点编码
            receivedTypeCode: ''  // 收货单状态编码
        };
        // 初始页号
        this.current = 1;
        this.columns = [
            {
                title: '退货单号',
                dataIndex: 'purchaseRefundNo',
                key: 'purchaseRefundNo'
            }, {
                title: '供应商',
                dataIndex: 'supplier',
                key: 'supplier',
                render: text => {
                    let res = text;
                    if (text === null || undefined === text || text === '') {
                        res = '-';
                    }
                    return res;
                }
            }, {
                title: '供应商地点',
                dataIndex: 'supplierAddress',
                key: 'supplierAddress'
            }, {
                title: '地点类型',
                dataIndex: 'adrType',
                key: 'adrType'
            }, {
                title: '退货地点',
                dataIndex: 'refundAdr',
                key: 'refundAdr'
            }, {
                title: '退货数量',
                dataIndex: 'totalRefundAmount',
                key: 'totalRefundAmount'
            }, {
                title: '退货成本额',
                dataIndex: 'totalRefundCost',
                key: 'totalRefundCost'
            }, {
                title: '实际退货金额(含税)',
                dataIndex: 'totalRealRefundMoney',
                key: 'totalRealRefundMoney'
            }, {
                title: '退货金额(含税)',
                dataIndex: 'returnAmount',
                key: 'returnAmount'
            }, {
                title: '创建日期',
                dataIndex: 'createTime',
                key: 'createTime',
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
                title: '状态',
                dataIndex: 'status',
                key: 'status'
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: this.renderActions
            }
        ]
    }

    componentWillMount() {
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
        this.props.fetchReturnMngList({
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
        this.props.fetchReturnMngList(allParams);
    }

    /**
     * 重置检索条件
     */
    handleResetValue() {
        // 重置检索条件
        this.searchParams = {};
        // 重置form
        this.props.form.resetFields();
        this.handleSupplyClear();
        this.handleAddressClear();
    }

    // 获取供应商编号
    handleSupplyChoose = ({ record }) => {
        this.setState({
            spAdrId: record.spId,
            spId: record.spId,
            orgId: this.props.employeeCompanyId,
            isSupplyAdrDisabled: false
        });
        this.handleSupplierAddressClear();
    }

    // 供应商值清单-清除
    handleSupplyClear = () => {
        this.setState({
            spAdrId: '',
            spId: '',
            isSupplyAdrDisabled: true
        });
        this.supplySearchMind.reset();
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

    showConfirm = () => {
        confirm({
            title: '删除退货单',
            content: '删除退货单将不能恢复，确认要删除此退货单?',
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    handleSelect(record, index, items) {
        const { key } = items;
        switch (key) {
            case 'delete':
                this.showConfirm();
                break;
            default:
                break;
        }
    }

    /**
     * 查询退货单管理列表
     */
    handleSearch() {
        // 编辑查询条件
        this.editSearchParams();
        // 查询收货单单列表
        this.queryRcvMngPoList();
    }

    /* *************** 供货供应商 ************************* */

    // 供货供应商-值清单
    handleSupplyChoose = ({ record }) => {
        this.setState({
            stopBuyDisabled: false,
            spId: record.spAdrid
        })
    }

    // 供货供应商值清单-清除
    handleSupplyClear = () => {
        this.setState({
            stopBuyDisabled: true,
            spId: ''
        });
    }

    /**
     *
     * 返回查询条件
     *
     */
    editSearchParams() {
        const {
            purchaseRefundNo,
            purchaseOrderNo,
            adrType,
            purchaseOrderType,
            status,
        } = this.props.form.getFieldsValue();
        // 创建时间
        const auditDuringArr = this.props.form.getFieldValue('createTime') || [];
        let createTimeStart;
        let createTimeEnd;
        if (auditDuringArr.length > 0) {
            createTimeStart = Date.parse(auditDuringArr[0].format(dateFormat));
        }
        if (auditDuringArr.length > 1) {
            createTimeEnd = Date.parse(auditDuringArr[1].format(dateFormat));
        }

        // 供应商编号
        const spId = this.state.spId;

        // 供应商地点编号
        const spAdrId = this.state.spAdrId;

        // 地点
        const adrTypeCode = this.state.adrTypeCode;

        const searchParams = {
            purchaseRefundNo,
            purchaseOrderNo,
            adrType,
            adrTypeCode,
            purchaseOrderType,
            status,
            spId,
            spAdrId,
            createTimeStart,
            createTimeEnd
        };
        this.searchParams = Utils.removeInvalid(searchParams);
        return this.searchParams;
    }

    renderActions(text, record, index) {
        const { id, status, refundAdr } = record;
        const { pathname } = this.props.location;
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                <Menu.Item key="detail">
                    <Link to={`${pathname}/${id}`}>退货单详情</Link>
                </Menu.Item>
                {
                    // 状态为“制单”时可用
                    (status === '制单') ?
                        <Menu.Item key="delete">
                            <a target="_blank" rel="noopener noreferrer">
                                删除
                            </a>
                        </Menu.Item>
                        : null
                }
                {
                    // 状态为“制单”、“已拒绝”时可用；
                    (status === '制单' || status === '已拒绝') ?
                        <Menu.Item key="modify">
                            <a target="_blank" rel="noopener noreferrer">
                                修改
                            </a>
                        </Menu.Item>
                        : null
                }
                {
                    // 状态为“已审核”、“待退货”时可用；
                    (status === '已审核' || status === '待退货') ?
                        <Menu.Item key="cancel">
                            <a target="_blank" rel="noopener noreferrer">
                                取消
                            </a>
                        </Menu.Item>
                        : null
                }
                {
                    // 退货地点为门店且状态为“待退货”时可用
                    (refundAdr === '门店' || status === '待退货') ?
                        <Menu.Item key="returnGoods">
                            <a target="_blank" rel="noopener noreferrer">
                                退货
                            </a>
                        </Menu.Item>
                        : null
                }
                {
                    // 非”制单”状态可用
                    (status !== '制单') ?
                        <Menu.Item key="downloadTheReturnInvoice">
                            <a target="_blank" rel="noopener noreferrer">
                                下载退货单
                            </a>
                        </Menu.Item>
                        : null
                }
                {
                    // 点击弹出框显示审批进度信息,按钮显示条件：状态为“已提交”
                    (status !== '已提交') ?
                        <Menu.Item key="viewApprovalrogress">
                            <a target="_blank" rel="noopener noreferrer">
                                查看审批进度
                            </a>
                        </Menu.Item>
                        : null
                }
                {
                    // 按钮显示条件：状态为“已提交”、“已审批”、“已拒绝”、“待退货”、“已退货”、“已取消”,”取消失败”
                    (status !== '制单' && status !== '异常') ?
                        <Menu.Item key="viewApproval">
                            <a target="_blank" rel="noopener noreferrer">
                                查看审批意见
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
        const { data, total, pageNum, pageSize } = this.props.returnMngList;
        // const selectListlength = this.state.chooseGoodsList.length === 0;
        const rowSelection = {
            selectedRowKeys: this.state.chooseGoodsList,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    chooseGoodsList: selectedRowKeys,
                    selectedListData: selectedRows
                })
            },
        };
        return (
            <div className="search-box">
                <Form layout="inline">
                    <div className="">
                        <Row gutter={56}>
                            <Col span={8}>
                                {/* 退货单号 */}
                                <FormItem label="退货单号" >
                                    {getFieldDecorator('purchaseRefundNo', {})(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 状态 */}
                                <FormItem label="状态">
                                    {getFieldDecorator('status', { initialValue: returnStatus.defaultValue })(
                                        <Select style={{ width: '153px' }} size="default">
                                            {
                                                returnStatus.data.map((item) => (
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
                                        <SearchMind
                                            style={{
                                                zIndex: 101
                                            }}
                                            compKey="search-mind-supply"
                                            ref={ref => {
                                                this.supplySearchMind = ref
                                            }}
                                            fetch={(params) => this.props.pubFetchValueList({
                                                condition: params.value,
                                                pageSize: params.pagination.pageSize,
                                                pageNum: params.pagination.current || 1
                                            }, 'querySuppliersList')}
                                            addonBefore=""
                                            onChoosed={this.handleSupplyChoose}
                                            onClear={this.handleSupplyClear}
                                            renderChoosedInputRaw={(row) => (
                                                <div>{row.spId}-{row.companyName}</div>
                                            )}
                                            rowKey="spId"
                                            pageSize={5}
                                            columns={[
                                                {
                                                    title: '供应商',
                                                    dataIndex: 'spId',
                                                    width: 80
                                                }, {
                                                    title: '供应商名称',
                                                    dataIndex: 'companyName'
                                                }
                                            ]}
                                        />
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
                            <Col span={8}>
                                {/* 地点类型 */}
                                <FormItem label="地点类型">
                                    {getFieldDecorator('adrType', { initialValue: locType.defaultValue })(
                                        <Select style={{ width: '153px' }} size="default">
                                            {
                                                locType.data.map((item) => (
                                                    <Option key={item.key} value={item.key}>
                                                        {item.value}
                                                    </Option>))
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            {/* 退货地点 */}
                            <Col span={8}>
                                <FormItem>
                                    <div className="row middle">
                                        <span className="ant-form-item-label search-mind-label">退货地点</span>
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
                                                    title: '退货地点编码',
                                                    dataIndex: this.state.locationData.code,
                                                    width: 80
                                                }, {
                                                    title: '退货地点名称',
                                                    dataIndex: this.state.locationData.name
                                                }
                                            ]}
                                        />
                                    </div>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 创建日期 */}
                                <FormItem >
                                    <div className="row middle">
                                        <span className="ant-form-item-label search-mind-label">创建日期</span>
                                        {getFieldDecorator('createTime', {})(
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
                            <Col className="ant-col-10 ant-col-offset-10 gutter-row" style={{ textAlign: 'right'}}>
                                <FormItem>
                                    <Button size="default" type="primary" >
                                        新建
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button size="default" type="danger" >
                                        删除
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button size="default">
                                        导出
                                    </Button>
                                </FormItem>
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
                            rowSelection={rowSelection}
                            dataSource={data}
                            columns={this.columns}
                            rowKey="purchaseRefundNo"
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

ReturnManagementList.propTypes = {
    employeeCompanyId: PropTypes.string,
    fetchReturnMngList: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    returnMngList: PropTypes.objectOf(PropTypes.any),
    pubFetchValueList: PropTypes.func,
};

export default withRouter(Form.create()(ReturnManagementList));
