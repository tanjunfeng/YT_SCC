/*
 * @Author: tanjf
 * @Description: 采购单审批列表
 * @CreateDate: 2017-10-27 11:23:06
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-11-11 21:32:20
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
import {
    queryAuditPurReList,
    queryApprovalInfo,
    queryPoDetail
} from '../../../actions/procurement';
import {
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
} from '../../../actions';
import ApproModal from './approModal';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const confirm = Modal.confirm;

@connect(state => ({
    auditPurReList: state.toJS().procurement.auditPurReList
}), dispatch => bindActionCreators({
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
    pubFetchValueList,
    queryAuditPurReList,
    queryApprovalInfo,
    queryPoDetail
}, dispatch))

class toDoPurchaseList extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleResetValue = this.handleResetValue.bind(this);
        this.onLocTypeChange = this.onLocTypeChange.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.searchParams = {};
        this.state = {
            spId: '',   // 供应商编码
            spAdrId: '',    // 供应商地点编码
            isSupplyAdrDisabled: true, // 供应商地点禁用
            locDisabled: true,  // 地点禁用
            locationData: {},
            isVisibleModal: false,
            approvalVisible: false,
            opinionVisible: false,
            approvalStatus: false,
            adrTypeCode: '',    // 地点编码
            receivedTypeCode: '',  // 收货单状态编码
            refundAdr: '',
            spNo: '',   // 供应商编码
            spAdrNo: '',    // 供应商地点编码
        };
        // 初始页号
        this.current = 1;
        this.columns = [
            {
                title: '采购单号',
                dataIndex: 'purchaseRefundNo',
                key: 'purchaseRefundNo',
                render: (text, record) => {
                    return (
                        <Link onClick={this.toPurDetail} to={`po/detail/${record.id}`}>{text}</Link>
                    )
                }
            }, {
                title: '地点类型',
                dataIndex: 'adrType',
                key: 'adrType'
            }, {
                title: '退货地点',
                dataIndex: 'refundAdr',
                key: 'refundAdr'
            }, {
                title: '供应商',
                dataIndex: 'supplier',
                key: 'supplier'
            }, {
                title: '供应商地点',
                dataIndex: 'supplierAddress',
                key: 'supplierAddress'
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
                dataIndex: 'totalRefundMoney',
                key: 'totalRefundMoney'
            }, {
                title: '创建者',
                dataIndex: 'createUserId',
                key: 'createUserId'
            }, {
                title: '退货单创建时间',
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
                title: '流程开始时间',
                dataIndex: 'processEndTime',
                key: 'processEndTime',
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
                title: '流程结束时间',
                dataIndex: 'processStartTime',
                key: 'processStartTime',
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
                title: '当前节点',
                dataIndex: 'processNodeName',
                key: 'processNodeName',
                render: (text) => (
                    <a onClick={this.nodeModal}>{text}</a>
                )
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
        this.props.queryAuditPurReList({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            ...this.searchParams
        });
    }

    queryReturnMngList = () => {
        this.current = 1;
        this.props.queryAuditPurReList({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            ...this.searchParams
        });
    }

    nodeModal = () => {

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
        this.joiningAdressMind.reset();
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

    // 获取供应商编号
    handleSupplyChoose = ({ record }) => {
        this.setState({
            spNo: record.spNo,
            spId: record.spId,
            isSupplyAdrDisabled: false
        });
    }

    // 供应商值清单-清除
    handleSupplyClear = () => {
        this.setState({
            spNo: '',
            spId: '',
            isSupplyAdrDisabled: true
        });
        this.supplySearchMind.reset();
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

    showOpinionModal = () => {
        this.setState({
            opinionvisible: true,
        });
    }

    handleOpinionOk = () => {
        this.setState({
            opinionvisible: false,
        });
    }
    handleOpinionCancel = () => {
        this.setState({
            opinionvisible: false,
        });
    }

    handleSelect(record, index, items) {
        const { key } = items;
        switch (key) {
            case 'examinationApproval':
                this.showOpinionModal();
                break;
            case 'viewApproval':
                this.showModal();
                this.props.queryApprovalInfo({businessId: record.purchaseRefundNo})
                break;
            default:
                break;
        }
    }

    toPurDetail = (record) => {
        this.props.queryPoDetail(record.id);
    }

    /**
     * 查询退货单管理列表
     */
    handleSearch() {
        // 编辑查询条件
        this.editSearchParams();
        // 查询收货单单列表
        this.queryReturnMngList();
    }

    /**
     * 返回查询条件
     */
    editSearchParams() {
        const {
            purchaseRefundNo,
            purchaseOrderNo,
            approvalStatus,
            purchaseOrderType,
            status,
            adrType
        } = this.props.form.getFieldsValue();
        // 流程开始时间
        const auditDuringArr = this.props.form.getFieldValue('createTime') || [];
        let createTimeStart;
        let createTimeEnd;
        if (auditDuringArr.length > 0) {
            createTimeStart = Date.parse(auditDuringArr[0].format(dateFormat));
        }
        if (auditDuringArr.length > 1) {
            createTimeEnd = Date.parse(auditDuringArr[1].format(dateFormat));
        }
        // 流程结束间
        const auditDuringArrEnd = this.props.form.getFieldValue('stopTime') || [];
        let stopTimeStart;
        let stopTimeEnd;
        if (auditDuringArrEnd.length > 0) {
            stopTimeStart = Date.parse(auditDuringArrEnd[0].format(dateFormat));
        }
        if (auditDuringArrEnd.length > 1) {
            stopTimeEnd = Date.parse(auditDuringArrEnd[1].format(dateFormat));
        }

        // 供应商编号
        const spId = this.state.spId;

        // 供应商地点编号
        const spAdrId = this.state.spId;

        // 地点
        const adrTypeCode = this.state.refundAdr;

        const searchParams = {
            purchaseRefundNo,
            purchaseOrderNo,
            approvalStatus,
            purchaseOrderType,
            status,
            adrType,
            spId,
            spAdrId,
            createTimeStart,
            createTimeEnd,
            stopTimeStart,
            stopTimeEnd,
            adrTypeCode
        };
        this.searchParams = Utils.removeInvalid(searchParams);
        return this.searchParams;
    }

    renderActions(text, record, index) {
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                <Menu.Item key="examinationApproval">
                    <a target="_blank" rel="noopener noreferrer">
                        审批
                    </a>
                </Menu.Item>
                <Menu.Item key="viewApproval">
                    <a target="_blank" rel="noopener noreferrer">
                        查看审批意见
                    </a>
                </Menu.Item>
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
        const { data, total, pageNum, pageSize } = this.props.auditPurReList;
        return (
            <div className="search-box">
                <Form layout="inline">
                    <div className="">
                        <Row gutter={56}>
                            <Col span={8}>
                                {/* 退货单号 */}
                                <FormItem label="采购单号" >
                                    {getFieldDecorator('purchaseRefundNo', {})(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 流程状态 */}
                                <FormItem label="流程状态">
                                    {getFieldDecorator('auditStatus', { initialValue: returnStatus.defaultValue })(
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
                                                <div>{row.spNo}-{row.companyName}</div>
                                            )}
                                            rowKey="spId"
                                            pageSize={5}
                                            columns={[
                                                {
                                                    title: '供应商',
                                                    dataIndex: 'spNo',
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
                                    </span>
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
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                            {/* 退货地点 */}
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
                            <Col span={8}>
                                {/* 流程开始时间 */}
                                <FormItem >
                                    <div className="row middle">
                                        <span className="ant-form-item-label search-mind-label">流程开始时间</span>
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
                            <Col span={8}>
                                {/* 流程结束间 */}
                                <FormItem >
                                    <div className="row middle">
                                        <span className="ant-form-item-label search-mind-label">流程结束间</span>
                                        {getFieldDecorator('stopTime', {})(
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
                                current: this.current,
                                total,
                                pageSize,
                                pageNum,
                                showQuickJumper: true,
                                onChange: this.onPaginate
                            }}
                        />
                        <ApproModal
                            visible={this.state.isVisibleModal}
                            onOk={this.handleModalOk}
                            onCancel={this.handleModalCancel}
                        />
                        <Modal
                            title="Basic Modal"
                            visible={this.state.opinionvisible}
                            onOk={this.handleOpinionOk}
                            onCancel={this.handleOpinionCancel}
                        >
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                        </Modal>
                    </div>
                </Form>
            </div >
        );
    }
}

toDoPurchaseList.propTypes = {
    employeeCompanyId: PropTypes.string,
    queryAuditPurReList: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    auditPurReList: PropTypes.objectOf(PropTypes.any),
    pubFetchValueList: PropTypes.func,
    queryApprovalInfo: PropTypes.func,
    queryPoDetail: PropTypes.func,
    deleteBatchRefundOrder: PropTypes.func,
};

export default withRouter(Form.create()(toDoPurchaseList));