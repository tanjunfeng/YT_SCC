/*
 * @Author: tanjf
 * @Description: 采购退货
 * @CreateDate: 2017-10-27 11:23:06
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-11-11 11:05:40
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
    message,
    Steps
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
    getRefundNo,
    clearRefundNo,
    deleteBatchRefundOrder,
    queryApprovalInfo,
    queryProcessDefinitions
} from '../../../actions/procurement';
import { exportPurchaseRefundList, exportPdf } from '../../../service';
import {
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
    fetchReturnMngList,
} from '../../../actions';
import ApproModal from './approModal';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const confirm = Modal.confirm;
const Step = Steps.Step;

@connect(state => ({
    poRcvMngList: state.toJS().procurement.poRcvMngList,
    returnMngList: state.toJS().procurement.returnMngList,
    getRefundNumebr: state.toJS().procurement.getRefundNumebr,
    employeeCompanyId: state.toJS().user.data.user.employeeCompanyId,
    processDefinitions: state.toJS().procurement.processDefinitions
}), dispatch => bindActionCreators({
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
    fetchReturnMngList,
    pubFetchValueList,
    getRefundNo,
    clearRefundNo,
    deleteBatchRefundOrder,
    queryApprovalInfo,
    queryProcessDefinitions,
    locTypeCodes
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
            spId: '',   // 供应商编码
            spAdrId: '',    // 供应商地点编码
            isSupplyAdrDisabled: true, // 供应商地点禁用
            locDisabled: true,  // 地点禁用
            locationData: {},
            isVisibleModal: false,
            opinionVisible: false,
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
                title: '实际退货数量',
                dataIndex: 'totalRealRefundAmount',
                key: 'totalRealRefundAmount'
            }, {
                title: '实际退货金额(含税)',
                dataIndex: 'totalRealRefundMoney',
                key: 'totalRealRefundMoney'
            }, {
                title: '退货金额(含税)',
                dataIndex: 'totalRefundMoney',
                key: 'totalRefundMoney'
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

    queryReturnMngList = () => {
        this.current = 1;
        this.props.fetchReturnMngList({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            ...this.searchParams
        });
    }

    /**
     * 重置检索条件
     */
    handleResetValue() {
        // 重置检索条件
        this.searchParams = {};
        // 重置form
        this.props.form.resetFields();
        this.handleSupplierClear();
        this.handleSupplierAddressClear();
        this.handleAddressClear();
    }

    /**
     * 根据地点类型查询地点值清单
     */
    handleGetAddressMap = ({ value }) => {
        // 地点类型
        const { locTypeCd } = this.props.form.getFieldsValue(['adrType'])
        // 根据选择的地点类型获取对应地点的值清单
        if (locTypeCd === locTypeCodes.warehouse) {
            // 地点类型为仓库
            return this.props.getWarehouseAddressMap({
                value,
            });
        } else if (locTypeCd === locTypeCodes.shop) {
            // 地点类型为门店
            return this.props.getShopAddressMap({
                value,
            });
        }
        // 如果地点类型为空，返回空promise
        return new Promise((resolve) => {
            resolve({ total: 0, data: [] });
        });
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

    showConfirm = (record) => {
        confirm({
            title: '删除退货单',
            content: '删除退货单将不能恢复，确认要删除此退货单?',
            onOk() {
                if (record.approval) {
                    message.error('该退货单不能删除。原因：只能删除制单状态且无审批记录退货单!')
                } else {
                    this.props.deleteBatchRefundOrder({id: record.id}).then((res) => {
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
                this.props.queryProcessDefinitions({ businessId: record.purchaseRefundNo });
                this.showOpinionModal();
                break;
            case 'viewApproval':
                this.props.queryApprovalInfo({businessId: record.purchaseRefundNo});
                this.showModal();
                break;
            case 'downloadTheReturnInvoice':
                Utils.exportExcel(exportPdf, {id: record.id})
                break;
            default:
                break;
        }
    }

    /**
     * 查询退货单管理列表
     */
    handleSearch() {
        this.queryReturnMngList(this.editSearchParams());
    }

    /* *************** 供货供应商 ************************* */

    // 供货供应商-值清单
    handleSupplyChoose = ({ record }) => {
        this.setState({
            spId: record.spAdrid
        })
    }

    // 供货供应商值清单-清除
    handleSupplierClear = () => {
        this.setState({
            spId: ''
        });
        this.supplySearchMind.reset();
    }

    handleCreact = () => {
        const { pathname } = this.props.location;
        this.props.getRefundNo();
        this.props.history.push(`${pathname}/modify`);
    }

    handleDelete = () => {
        const { selectedListData } = this.state;
        const pmRefundOrderIds = [];
        selectedListData.forEach((item) => {
            pmRefundOrderIds.push(item.id)
        });
        this.props.deleteBatchRefundOrder({pmRefundOrderIds: pmRefundOrderIds.join(',')}).then((res) => {
            if (res.code === 200) {
                message.success(res.message)
            }
        })
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

        // 退货地点
        const refundAdr = this.state.adrTypeCode;

        const searchParams = {
            purchaseRefundNo,
            purchaseOrderNo,
            adrType,
            refundAdr,
            purchaseOrderType,
            status,
            spId,
            spAdrId,
            createTimeStart,
            createTimeEnd,
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
                    <Link to={`${pathname}/returnManagementDetail/${id}`}>退货单详情</Link>
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
                            <Link to={`${pathname}/returnManagementCreat/${id}`}>修改</Link>
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
        const { processDefinitions } = this.props;
        const agreeOrRefuse = ['拒绝', '同意'];
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
                                            onClear={this.handleSupplierClear}
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
                            <Col className="gutter-row" span={8}>
                                <FormItem>
                                    <span className="sc-form-item-label" style={{width: 70}}>供应商地点</span>
                                    <span className="search-box-data-pic">
                                        <SearchMind
                                            style={{ zIndex: 9, verticalAlign: 'bottom' }}
                                            compKey="providerNo"
                                            ref={ref => { this.joiningAdressMind = ref }}
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
                                            onChoosed={this.handleAdressChoose}
                                            onClear={this.handleAdressClear}
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
                                    </span>
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
                                <FormItem >
                                    <div className="row small">
                                        <span className="ant-form-item-label search-mind-label">地点</span>
                                        <SearchMind
                                            compKey="comPoAddress"
                                            ref={ref => { this.poAddress = ref }}
                                            fetch={
                                                (value, pager) => (
                                                    this.handleGetAddressMap(value, pager))
                                            }
                                            renderChoosedInputRaw={
                                                (row) => (
                                                    <div>{row.code} - {row.name}</div>
                                                )}
                                            pageSize={2}
                                            columns={[
                                                {
                                                    title: '编码',
                                                    dataIndex: 'code',
                                                    width: 98
                                                }, {
                                                    title: '名称',
                                                    dataIndex: 'name',
                                                    width: 140
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
                                    <Button size="default" type="primary" onClick={this.handleCreact}>
                                        新建
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button size="default" type="danger" onClick={this.handleDelete}>
                                        删除
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button size="default" onClick={this.handleExport}>
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
                                current: this.current,
                                total,
                                pageSize,
                                pageNum,
                                showQuickJumper: true,
                                onChange: this.onPaginate
                            }}
                        />
                        {
                            this.state.isVisibleModal &&
                            <ApproModal
                                visible={this.state.isVisibleModal}
                                onOk={this.handleModalOk}
                                onCancel={this.handleModalCancel}
                            />
                        }
                    </div>
                    {
                        this.state.opinionVisible &&
                        <Modal
                            title="审批进度"
                            visible={this.state.opinionVisible}
                            onOk={this.handleOpinionOk}
                            onCancel={this.handleOpinionCancel}
                            width={1000}
                        >
                            <Steps current={1} progressDot>
                                {processDefinitions.map((item, index) => (
                                    <Step
                                        key={`toDo-${index}`}
                                        title={item.processNodeName}
                                        description={agreeOrRefuse[item.type]}
                                    />
                                ))}
                            </Steps>
                        </Modal>
                    }
                </Form>
            </div >
        );
    }
}

ReturnManagementList.propTypes = {
    fetchReturnMngList: PropTypes.func,
    getRefundNo: PropTypes.func,
    queryProcessDefinitions: PropTypes.func,
    queryApprovalInfo: PropTypes.func,
    getWarehouseAddressMap: PropTypes.func,
    getShopAddressMap: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    returnMngList: PropTypes.objectOf(PropTypes.any),
    processDefinitions: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
    pubFetchValueList: PropTypes.func,
    deleteBatchRefundOrder: PropTypes.func,
};

export default withRouter(Form.create()(ReturnManagementList));
