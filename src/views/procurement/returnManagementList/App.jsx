/*
 * @Author: tanjf
 * @Description: 采购退货
 * @CreateDate: 2017-10-27 11:23:06
 * @Last Modified by: chenghaojie
 * @Last Modified time: 2017-12-22 18:07:14
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
    returnStatus,
    locTypeCodes
} from '../../../constant/procurement';
import SearchMind from '../../../components/searchMind';
import { pubFetchValueList } from '../../../actions/pub';
import {
    deleteBatchRefundOrder,
    cancelRefund
} from '../../../actions/procurement';
import {
    processImageBusi,
    clearprocessImageBusi,
    queryCommentHisBusi
} from '../../../actions/process';
import { exportPurchaseRefundList, exportPdf } from '../../../service';
import {
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
    fetchReturnMngList,
} from '../../../actions';
import ApproModal from '../../../components/approModal';
import { Supplier } from '../../../container/search';
import FlowImage from '../../../components/flowImage';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const confirm = Modal.confirm;

const statusTypes = { 0: '制单', 1: '已提交', 2: '已审核', 3: '已拒绝', 4: '待退货', 5: '已退货', 6: '已取消', 7: '取消失败', 8: '异常' }
const adrTypes = { 0: '仓库', 1: '门店' }
@connect(state => ({
    returnMngInfo: state.toJS().procurement.returnMngInfo,
    processImageBusiData: state.toJS().process.processImageBusiData,
    commentHisBusiList: state.toJS().process.commentHisByBusi,
}), dispatch => bindActionCreators({
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
    fetchReturnMngList,
    pubFetchValueList,
    deleteBatchRefundOrder,
    queryCommentHisBusi,
    processImageBusi,
    locTypeCodes,
    cancelRefund,
    clearprocessImageBusi,
}, dispatch))

class ReturnManagementList extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleResetValue = this.handleResetValue.bind(this);
        this.onLocTypeChange = this.onLocTypeChange.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.searchParams = {};
        this.state = {
            selectedListData: [],
            spAdrId: '', // 供应商地点编码
            locDisabled: true, // 地点禁用
            locationData: {},
            isVisibleModal: false,
            opinionVisible: false,
            refundAdr: '',
            adrTypeCode: '', // 地点编码
            receivedTypeCode: '', // 收货单状态编码
            spAdrNo: '', // 供应商地点编码
        };
        // 初始页号
        this.current = 1;
        this.orderItem = 0;
        this.orderItem = 0;// 排序字段:退货单号：0,创建日期：1,状态：2
        this.columns = [
            {
                title: '退货单号',
                dataIndex: 'purchaseRefundNo',
                key: 'purchaseRefundNo',
                sorter: (a, b) => a.age - b.age,
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
                key: 'adrType',
                render: (text) => adrTypes[text]
            }, {
                title: '退货地点',
                dataIndex: 'refundAdrName',
                key: 'refundAdrName'
            }, {
                title: '退货数量',
                dataIndex: 'totalRefundAmount',
                key: 'totalRefundAmount'
            }, {
                title: '退货成本额',
                dataIndex: 'totalRefundCost',
                key: 'totalRefundCost'
            }, {
                title: '退货金额(含税)',
                dataIndex: 'totalRefundMoney',
                key: 'totalRefundMoney'
            }, {
                title: '实际退货数量',
                dataIndex: 'totalRealRefundAmount',
                key: 'totalRealRefundAmount'
            }, {
                title: '实际退货金额(含税)',
                dataIndex: 'totalRealRefundMoney',
                key: 'totalRealRefundMoney'
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
                },
                sorter: (a, b) => a.age - b.age,
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text) => statusTypes[text],
                sorter: (a, b) => a.age - b.age,
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: this.renderActions
            }
        ]
    }


    componentDidMount() {
        this.queryReturnMngList();
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
        this.current = pageNumber
        this.props.fetchReturnMngList({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            ...this.searchParams
        });
    }

    queryReturnMngList = (current = 1) => {
        this.current = current;
        this.props.fetchReturnMngList({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            ...this.searchParams
        })
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
        this.handleSupplierAddressClear();
        this.handleAddressClear();
        this.props.form.setFieldsValue({
            supplier: { reset: true }
        });
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
            locationTypeParam = 'getWarehouseLogic';
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
     * 获取供应商地点编号
     */
    handleSupplierAddressChoose = ({ record }) => {
        this.setState({ spAdrId: record.spId });
    }

    /**
     * 清空供应商地点编号
     */
    handleSupplierAddressClear = () => {
        this.setState({ spAdrId: '' });
        this.supplyAddressSearchMind.reset();
    }

    // 选择地点回调
    handleAddressChoose = ({ record }) => {
        const encoded = record.code;
        this.adressTypeCode = encoded;
        this.setState({ refundAdr: record.warehouseCode });
    }

    // 清除地点值
    handleAddressClear = () => {
        this.poAddress.reset();
        this.adressTypeCode = '';
        this.setState({
            locDisabled: true,
            refundAdr: ''
        })
    }

    showConfirm = (record) => {
        confirm({
            title: '删除退货单',
            content: '删除退货单将不能恢复，确认要删除此退货单?',
            onOk() {
                if (record.approval) {
                    message.error('该退货单不能删除。原因：只能删除制单状态且无审批记录退货单!')
                } else {
                    this.props.deleteBatchRefundOrder({ id: record.id }).then((res) => {
                        if (res.code === 200) {
                            message.success(res.message)
                        }
                    })
                }
                return false
            },
            onCancel() {
            },
        });
    }

    showModal = () => {
        this.setState({
            isVisibleModal: true,
        });
    }

    handleModalOk = () => {
        this.setState({
            isVisibleModal: false,
        });
    }
    handleModalCancel = () => {
        this.setState({
            isVisibleModal: false,
        });
    }

    handleModalOk = () => {
        this.setState({
            isVisibleModal: false,
        });
    }
    handleModalCancel = () => {
        this.setState({
            isVisibleModal: false,
        });
    }

    showOpinionModal = () => {
        this.setState({
            opinionVisible: true,
        });
    }

    nodeModal = (record) => {
        this.showOpinionModal();
        this.props.processImageBusi({id: record.id, processType: 'CGTH' });
    }

    handleOpinionOk = () => {
        this.setState({
            opinionVisible: false,
        });
    }
    handleOpinionCancel = () => {
        this.setState({
            opinionVisible: false,
        });
    }

    /**
    * 导出Excel
    */
    handleExport = () => {
        Utils.exportExcel(exportPurchaseRefundList, this.editSearchParams({
            pageSize: PAGE_SIZE,
            ageNum: this.currentp
        }));
    }

    handleSelect(record, index, items) {
        const { key } = items;
        switch (key) {
            case 'delete':
                this.showConfirm(record);
                break;
            case 'viewApprovalrogress':
                this.nodeModal({ id: record.id });
                break;
            case 'viewApproval':
                this.props.queryCommentHisBusi({id: record.id, processType: 'CGTH' });
                this.showModal();
                break;
            case 'downloadTheReturnInvoice':
                Utils.exportExcel(exportPdf, { id: record.id })
                break;
            case 'cancel':
                this.props.cancelRefund({
                    id: record.id,
                    purchaseRefundNo: record.purchaseRefundNo,
                    adrType: record.adrType,
                    refundAdrCode: record.refundAdrCode
                }).then((res) => {
                    if (res.code === 200) {
                        message.success(res.message)
                        this.queryReturnMngList(this.current);
                    }
                })
                break;
            default:
                break;
        }
    }

    /**
     * 查询退货单管理列表
     */
    handleSearch(e, current) {
        // 编辑查询条件
        this.editSearchParams();
        // 查询收货单单列表
        this.queryReturnMngList(current);
    }

    handleCreact = () => {
        const { pathname } = this.props.location;
        this.props.history.push(`${pathname}/modify`);
    }

    handleDelete = () => {
        const { selectedListData } = this.state;
        const pmRefundOrderIds = [];
        selectedListData.forEach((item) => {
            pmRefundOrderIds.push(item.id)
        });
        this.props.deleteBatchRefundOrder({ pmRefundOrderIds: pmRefundOrderIds.join(',') }).then((res) => {
            if (res.code === 200) {
                message.success(res.message);
                this.queryReturnMngList();
            }
        })
    }

    /**
     * 返回查询条件
     */
    editSearchParams() {
        const {
            purchaseRefundNo,
            purchaseOrderNo,
            adrType,
            purchaseOrderType,
            status,
            supplier
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
        const orderType = this.orderType;
        const orderItem = this.orderItem;
        // 供应商编号
        const spId = supplier.spId;

        // 供应商地点编号
        const spAdrId = this.state.spId;

        // 地点
        const refundAdrCode = this.state.refundAdr;

        const searchParams = {
            purchaseRefundNo,
            purchaseOrderNo,
            purchaseOrderType,
            status,
            spId,
            spAdrId,
            createTimeStart,
            createTimeEnd,
            adrType,
            refundAdrCode,
            orderType,
            orderItem
        };
        this.searchParams = Utils.removeInvalid(searchParams);
        return this.searchParams;
    }

    sortOnChange = (pagination, filters, sorter) => {
        if (sorter.order === 'descend') {
            this.orderType = 1
        } else {
            this.orderType = 0
        }
        if (sorter.columnKey === 'purchaseRefundNo') {
            this.orderItem = 0
        } else if (sorter.columnKey === 'createTime') {
            this.orderItem = 1
        } else if (sorter.columnKey === 'status') {
            this.orderItem = 2
        } else {
            this.orderItem = 0
        }
        this.handleSearch({}, pagination.current, this.orderType, this.orderItem);
    }

    closeCanvas = () => {
        this.props.clearprocessImageBusi();
    }

    renderActions(text, record, index) {
        const { id, status, refundAdr } = record;
        const { pathname } = this.props.location;
        // 0:制单;1:已提交;2:已审核;3:已拒绝;4:待退货;5:已退货;6:已取消;7:取消失败;8:异常
        // 0: '仓库', 1: '门店'
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                <Menu.Item key="detail">
                    <Link to={`${pathname}/returnManagementDetail/${id}`}>退货单详情</Link>
                </Menu.Item>
                {
                    // 状态为“制单”时可用
                    (status === 0) ?
                        <Menu.Item key="delete">
                            <a target="_blank" rel="noopener noreferrer">
                                删除
                            </a>
                        </Menu.Item>
                        : null
                }
                {
                    // 状态为“制单”、“已拒绝”时可用；
                    (status === 0 || status === 3) ?
                        <Menu.Item key="modify">
                            <Link to={`${pathname}/modify/${id}`}>修改</Link>
                        </Menu.Item>
                        : null
                }
                {
                    // “待退货”时可用；
                    (status === 4) ?
                        <Menu.Item key="cancel">
                            <a target="_blank" rel="noopener noreferrer">
                                取消
                            </a>
                        </Menu.Item>
                        : null
                }
                {
                    // 退货地点为门店且状态为“待退货”时可用
                    (refundAdr === 1 && status === 4) ?
                        <Menu.Item key="returnGoods">
                            <a target="_blank" rel="noopener noreferrer">
                                退货
                            </a>
                        </Menu.Item>
                        : null
                }
                {
                    // 非”制单”状态可用
                    (status !== '0') ?
                        <Menu.Item key="downloadTheReturnInvoice">
                            <a target="_blank" rel="noopener noreferrer">
                                下载退货单
                            </a>
                        </Menu.Item>
                        : null
                }
                {
                    // 点击弹出框显示审批进度信息,按钮显示条件：状态为“已提交”
                    (status === 1) ?
                        <Menu.Item key="viewApprovalrogress">
                            <a target="_blank" rel="noopener noreferrer">
                                查看审批进度
                            </a>
                        </Menu.Item>
                        : null
                }
                {
                    // 按钮显示条件：状态为“已提交”、“已审批”、“已拒绝”、“待退货”、“已退货”、“已取消”,”取消失败”
                    (status !== 0 && status !== 8) ?
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
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { data, total, pageNum, pageSize } = this.props.returnMngInfo;
        const rowSelection = {
            selectedRowKeys: this.state.chooseGoodsList,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    chooseGoodsList: selectedRowKeys,
                    selectedListData: selectedRows
                })
            },
            getCheckboxProps: record => ({
                disabled: record.status !== '0', // Column configuration not to be checked
            })
        };
        return (
            <div className="po-return-mng-list">
                <Form layout="inline">
                    <Row gutter={40}>
                        <Col>
                            {/* 退货单号 */}
                            <FormItem label="退货单号" >
                                {getFieldDecorator('purchaseRefundNo', {})(<Input size="default" />)}
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 状态 */}
                            <FormItem label="状态">
                                {getFieldDecorator('status', { initialValue: returnStatus.defaultValue })(
                                    <Select size="default">
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
                        <Col>
                            {/* 供应商 */}
                            <FormItem label="供应商类型">
                                {getFieldDecorator('supplier', {
                                    initialValue: { spId: '', spNo: '', companyName: '' }
                                })(<Supplier />)}
                            </FormItem>
                        </Col>
                        {/* 供应商地点 */}
                        <Col>
                            <FormItem label="供应商地点">
                                <SearchMind
                                    compKey="providerNo"
                                    disabled={getFieldValue('supplier').spId === ''}
                                    ref={ref => { this.supplyAddressSearchMind = ref }}
                                    fetch={(params) =>
                                        this.props.pubFetchValueList(Utils.removeInvalid({
                                            condition: params.value,
                                            pageSize: params.pagination.pageSize,
                                            pageNum: params.pagination.current || 1
                                        }), 'supplierAdrSearchBox').then((res) => {
                                            const dataArr = res.data.data || [];
                                            if (!dataArr || dataArr.length === 0) {
                                                message.warning('没有可用的数据');
                                            }
                                            return res;
                                        })}
                                    onChoosed={this.handleSupplierAddressChoose}
                                    onClear={this.handleSupplierAddressClear}
                                    renderChoosedInputRaw={(res) => (
                                        <div>{res.providerNo} - {res.providerName}</div>
                                    )}
                                    pageSize={6}
                                    columns={[
                                        {
                                            title: '供应商地点编码',
                                            dataIndex: 'providerNo',
                                            width: 98
                                        }, {
                                            title: '供应商地点名称',
                                            dataIndex: 'providerName'
                                        }
                                    ]}
                                />
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 地点类型 */}
                            <FormItem label="地点类型">
                                {getFieldDecorator('adrType', {
                                    initialValue: locType.defaultValue
                                })(
                                    <Select size="default" onChange={this.onLocTypeChange}>
                                        {locType.data.map((item) => (
                                            <Option key={item.key} value={item.key}>
                                                {item.value}
                                            </Option>
                                        ))}
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        {/* 退货地点 */}
                        <Col>
                            {/* 地点 */}
                            <FormItem label="对货地点">
                                <SearchMind
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
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 创建日期 */}
                            <FormItem label="创建日期">
                                {getFieldDecorator('createTime', {})(
                                    <RangePicker
                                        className="date-range-picker"
                                        format={dateFormat}
                                        showTime={{
                                            hideDisabledOptions: true,
                                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                        }}
                                        placeholder={['开始日期', '结束日期']}
                                    />
                                )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={40} type="flex" justify="end">
                        <Col >
                            <Button size="default" type="primary" onClick={this.handleCreact}>
                                新建
                            </Button>
                            <Button size="default" type="danger" onClick={this.handleDelete}>
                                删除
                            </Button>
                            <Button size="default" onClick={this.handleExport}>
                                导出
                            </Button>
                            <Button size="default" onClick={this.handleResetValue}>
                                重置
                            </Button>
                            <Button type="primary" onClick={this.handleSearch} size="default">
                                搜索
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <div >
                    <Table
                        rowSelection={rowSelection}
                        dataSource={data}
                        columns={this.columns}
                        onChange={this.sortOnChange}
                        rowKey="purchaseRefundNo"
                        scroll={{
                            x: 1600
                        }}
                        pagination={{
                            current: this.current,
                            total,
                            pageSize,
                            pageNum,
                            showQuickJumper: true,
                            // onChange: this.onPaginate
                        }}
                    />
                    {
                        this.state.isVisibleModal &&
                        <ApproModal
                            visible={this.state.isVisibleModal}
                            onOk={this.handleModalOk}
                            onCancel={this.handleModalCancel}
                            approvalList={this.props.commentHisBusiList}
                        />
                    }
                    <FlowImage
                        data={this.props.processImageBusiData}
                        closeCanvas={this.closeCanvas}
                    >
                        <Button type="primary" shape="circle" icon="close" className="closeBtn" onClick={this.closeCanvas} />
                    </FlowImage>
                </div>
            </div >
        );
    }
}

ReturnManagementList.propTypes = {
    fetchReturnMngList: PropTypes.func,
    processImageBusi: PropTypes.func,
    queryCommentHisBusi: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    returnMngInfo: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
    pubFetchValueList: PropTypes.func,
    deleteBatchRefundOrder: PropTypes.func,
    cancelRefund: PropTypes.func,
    clearprocessImageBusi: PropTypes.func,
    processImageBusiData: PropTypes.string,
    commentHisBusiList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
};

export default withRouter(Form.create()(ReturnManagementList));
