/*
 * @Author: tanjf
 * @Description: 采购退货
 * @CreateDate: 2017-10-27 11:23:06
 * @Last Modified by: chenghaojie
 * @Last Modified time: 2018-01-10 18:46:41
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Input,
    Form,
    Select,
    Row,
    Col,
    Icon,
    Table,
    Menu,
    Dropdown,
    Modal,
    message,
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
    optionStatus,
    auditStatusOption
} from '../../../constant/procurement';
import SearchMind from '../../../components/searchMind';
import { pubFetchValueList } from '../../../actions/pub';
import {
    queryCommentHis,
    queryProcessDefinitions
} from '../../../actions/procurement';
import {
    queryProcessMsgInfo,
    queryHighChart,
    clearHighChart,
    returnAuditInfo,
} from '../../../actions/process';
import {
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap
} from '../../../actions';
import ApproModal from '../../../components/approModal'
import FlowImage from '../../../components/flowImage';

const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
const confirm = Modal.confirm;
const { TextArea } = Input;

@connect(state => ({
    processMsgInfo: state.toJS().procurement.processMsgInfo,
    processDefinitions: state.toJS().procurement.processDefinitions,
    highChartData: state.toJS().process.highChartData,
    approvalList: state.toJS().procurement.approvalList,
}), dispatch => bindActionCreators({
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
    pubFetchValueList,
    queryProcessMsgInfo,
    queryCommentHis,
    queryProcessDefinitions,
    queryHighChart,
    clearHighChart,
    returnAuditInfo,
}, dispatch))

class toDoReturnList extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleResetValue = this.handleResetValue.bind(this);
        this.onLocTypeChange = this.onLocTypeChange.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.getFormData = this.getFormData.bind(this);
        this.searchParams = {};
        this.examinationAppData = {};
        this.param = {
            outcome: '',
            comment: ''
        };
        this.state = {
            spId: '', // 供应商编码
            spAdrId: '', // 供应商地点编码
            isSupplyAdrDisabled: true, // 供应商地点禁用
            locDisabled: true, // 地点禁用
            locationData: {},
            isVisibleModal: false,
            approvalVisible: false,
            opinionVisible: false,
            approvalStatus: false,
            adrTypeCode: '', // 地点编码
            receivedTypeCode: '', // 收货单状态编码
            outcome: false,
            refundAdr: '',
            spNo: '', // 供应商编码
            spAdrNo: '', // 供应商地点编码
            status: 0, // 流程状态，默认进行中
            spName: null, // 供应商名
            spAdrName: null, // 供应商地点名
            refundAdrName: null, // 地点
        };
        // 初始页号
        this.current = 1;
        this.columns = [
            {
                title: '退货单号',
                dataIndex: 'refundNo',
                key: 'refundNo',
                render: (text, record) => (
                    <Link target="_blank" to={`/returnManagementList/returnManagementDetail/${record.id}`}>{text}</Link>
                )
            }, {
                title: '地点类型',
                dataIndex: 'adrType',
                key: 'adrType',
                render: text => {
                    if (text === null || typeof text === 'undefined') {
                        return null;
                    }
                    return (locType.data[text + 1].value);
                }
            }, {
                title: '退货地点',
                dataIndex: 'refundAdrName',
                key: 'refundAdrName'
            }, {
                title: '供应商',
                dataIndex: 'spName',
                key: 'spName'
            }, {
                title: '供应商地点',
                dataIndex: 'spAdrName',
                key: 'spAdrName'
            }, {
                title: '退货数量',
                dataIndex: 'refundAmount',
                key: 'refundAmount'
            }, {
                title: '退货成本额',
                dataIndex: 'refundCost',
                key: 'refundCost'
            }, {
                title: '退货金额(含税)',
                dataIndex: 'refundMoney',
                key: 'refundMoney'
            }, {
                title: '创建者',
                dataIndex: 'createUser',
                key: 'createUser'
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
                dataIndex: 'startTime',
                key: 'startTime',
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
                dataIndex: 'endTime',
                key: 'endTime',
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
                dataIndex: 'currentNode',
                key: 'currentNode',
                width: '160px',
                render: (text, record) => (
                    <a onClick={() => this.nodeModal(record.taskId)}>{text}</a>
                )
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: '80px',
                render: this.renderActions
            }
        ]
        this.definColumns = [
            {
                title: '流程节点编码',
                dataIndex: 'processNodeCode',
                key: 'processNodeCode'
            }, {
                title: '流程节点名称',
                dataIndex: 'processNodeName',
                key: 'processNodeName'
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
        this.props.queryProcessMsgInfo({
            map: {
                pageSize: PAGE_SIZE,
                pageNum: this.current,
                status: this.state.status
            },
            processType: 'CGTH'
        });
    }

    getFormData() {
        return new Promise((resolve, reject) => {
            this.props.form.validateFields((err, values) => {
                if (err) {
                    reject(err);
                }
                const {
                    outcome,
                    comment
                } = values;
                const dist = {
                    outcome,
                    comment
                };
                if (outcome === '') {
                    this.props.form.setFields({
                        outcome: {
                            value: values.area,
                            errors: [new Error('未选择审批状态')],
                        },
                    });
                    reject();
                } else {
                    Object.assign(dist, {
                        outcome: outcome.toString() === '0' ? 'reject' : 'pass'
                    });
                }
                if (outcome === '0') {
                    if (comment === '') {
                        this.props.form.setFields({
                            comment: {
                                value: comment,
                                errors: [new Error('请输入审批意见!')]
                            }
                        });
                        reject();
                    } else {
                        Object.assign(dist, {
                            comment
                        });
                    }
                }
                resolve(Utils.removeInvalid(dist));
            });
        });
    }


    queryReturnMngList = (page = 1) => {
        this.current = page;
        this.props.queryProcessMsgInfo({
            map: Object.assign({
                pageSize: PAGE_SIZE,
                pageNum: this.current,
                status: this.state.status
            }, this.searchParams),
            processType: 'CGTH'
        });
    }

    nodeModal = (id) => {
        this.props.queryHighChart({taskId: id})
    }

    closeCanvas = () => {
        this.props.clearHighChart();
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
        this.setState({
            status: 0
        })
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
        this.supplierAdrSearchBox.reset();
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
        this.setState({
            spAdrId: record.spId,
            spAdrName: record.providerName
        });
    }

    /**
     * 清空供应商地点编号
     */
    handleSupplierAddressClear = () => {
        this.setState({
            spAdrId: '',
            spAdrName: ''
        });
        this.joiningAdressMind.reset();
    }

    // 选择地点回调
    handleAddressChoose = ({ record }) => {
        const encoded = record.code;
        this.adressTypeCode = encoded;
        this.setState({
            refundAdr: record.warehouseCode,
            refundAdrName: record.warehouseName
        });
    }

    // 清除地点值
    handleAddressClear = () => {
        this.poAddress.reset();
        this.adressTypeCode = '';
        this.setState({
            locDisabled: true,
            refundAdr: '',
            refundAdrName: ''
        })
    }

    // 获取供应商编号
    handleSupplyChoose = ({ record }) => {
        this.setState({
            spNo: record.spNo,
            spId: record.spId,
            isSupplyAdrDisabled: false,
            spName: record.companyName
        });
    }

    // 供应商值清单-清除
    handleSupplyClear = () => {
        this.setState({
            spNo: '',
            spId: '',
            isSupplyAdrDisabled: true,
            spName: ''
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

    showApprovalModal = () => {
        this.setState({
            approvalVisible: true,
        });
    }

    handleApprovalOk = () => {
        const { refundNo, taskId } = this.examinationAppData;
        this.getFormData().then((param) => {
            this.props.returnAuditInfo({ ...param, orderNo: refundNo, taskId, type: 1 })
                .then((res) => {
                    if (res.code === 200) {
                        message.success(res.message);
                        this.setState({
                            approvalVisible: false,
                        });

                        this.queryReturnMngList(this.current);
                    }
                })
        });
    }

    handleApprovalCancel = () => {
        this.setState({
            approvalVisible: false,
        });
    }

    handleSelect(record, index, items) {
        const { key } = items;
        switch (key) {
            case 'examinationApproval':
                this.examinationAppData = record;
                this.showApprovalModal();
                break;
            case 'viewApproval':
                this.showModal();
                this.props.queryCommentHis({taskId: record.taskId})
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
        this.queryReturnMngList();
    }

    /**
     * 返回查询条件
     */
    editSearchParams() {
        const {
            purchaseRefundNo,
            purchaseOrderNo,
            outcome,
            purchaseOrderType,
            adrType
        } = this.props.form.getFieldsValue();
        // 供应商编号
        const spName = this.state.spName;

        // 供应商地点编号
        const spAdrName = this.state.spAdrName;

        // 地点
        const refundAdrName = this.state.refundAdrName;

        // 流程状态
        const status = parseInt(this.state.status, 10);
        const searchParams = {
            refundNo: purchaseRefundNo,
            purchaseOrderNo,
            outcome,
            purchaseOrderType,
            adrType,
            spName,
            spAdrName,
            refundAdrName,
            status
        };
        this.searchParams = Utils.removeInvalid(searchParams);
        return this.searchParams;
    }

    // 流程状态切换
    statusChange = (value) => {
        this.setState({
            status: parseInt(value, 10)
        })
    }

    renderActions(text, record, index) {
        const { id } = record;
        const { pathname } = this.props.location;
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                <Menu.Item key="detail">
                    <Link to={`${pathname}/returnManagementDetail/${id}`}>退货单详情</Link>
                </Menu.Item>
                {this.state.status === 0 && <Menu.Item key="examinationApproval">
                    <a target="_blank" rel="noopener noreferrer">
                        审批
                    </a>
                </Menu.Item>}
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
        const { data, total, pageNum, pageSize } = this.props.processMsgInfo;
        return (
            <Form className="to-do-return-list" layout="inline">
                <div className="search-box">
                    <Row className="row-bottom">
                        <Col>
                            {/* 退货单号 */}
                            <FormItem label="退货单号" >
                                {getFieldDecorator('purchaseRefundNo', {})(<Input size="default" />)}
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 流程状态 */}
                            <FormItem label="流程状态">
                                {getFieldDecorator('auditStatus', { initialValue: '进行中' })(
                                    <Select size="default" onChange={this.statusChange}>
                                        {
                                            auditStatusOption.data.map((item) => (
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
                            <FormItem label="供应商" className="labelTop">
                                <SearchMind
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
                            </FormItem>
                        </Col>
                        {/* 供应商地点 */}
                        <Col>
                            <FormItem label="供应商地点" className="labelTop">
                                <SearchMind
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
                                    rowKey="providerNo"
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
                                    <Select onChange={this.onLocTypeChange}>
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
                            <FormItem label="地点" className="labelTop">
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
                    </Row>
                    <Row type="flex" justify="end">
                        <Col>
                            <Button size="default" onClick={this.handleResetValue}>
                                重置
                            </Button>
                            <Button type="primary" onClick={this.handleSearch} size="default">
                                搜索
                            </Button>
                        </Col>
                    </Row>
                </div>
                <div >
                    <Table
                        dataSource={data}
                        columns={this.columns}
                        rowKey="taskId"
                        scroll={{
                            x: 1800
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
                        approvalList={this.props.approvalList}
                    />
                    <FlowImage data={this.props.highChartData} closeCanvas={this.closeCanvas} >
                        <Button type="primary" shape="circle" icon="close" className="closeBtn" onClick={this.closeCanvas} />
                    </FlowImage>
                    {
                        this.state.approvalVisible &&
                        <Modal
                            title="审批"
                            visible={this.state.approvalVisible}
                            onOk={this.handleApprovalOk}
                            onCancel={this.handleApprovalCancel}
                            width={400}
                        >
                            <div>
                                <Form onSubmit={(e) => {
                                    e.preventDefault()
                                }}
                                >
                                    {/* 审批意见 */}
                                    <FormItem label="审批意见" style={{ display: 'flex' }}>
                                        {getFieldDecorator('outcome', {
                                            initialValue: optionStatus.defaultValue,
                                            rules: [{ required: true, message: '请选择审批意见!' }]
                                        })(
                                            <Select style={{ width: '153px' }} size="default">
                                                {
                                                    optionStatus.data.map((item) => (
                                                        <Option key={item.key} value={item.key}>
                                                            {item.value}
                                                        </Option>))
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                    <FormItem label="意见" style={{ display: 'flex' }}>
                                        {getFieldDecorator('comment', {
                                            initialValue: '',
                                            rules: [
                                                { required: false, message: '请填写审批意见!' },
                                                { max: 150, message: '请输入150字以内' }
                                            ]
                                        })(
                                            <TextArea
                                                placeholder="可填写意见"
                                                style={{ resize: 'none' }}
                                                autosize={{
                                                    minRows: 4,
                                                    maxRows: 6
                                                }}
                                            />
                                        )}
                                    </FormItem>
                                </Form>
                            </div>
                        </Modal>
                    }
                </div>
            </Form>
        );
    }
}

toDoReturnList.propTypes = {
    queryProcessMsgInfo: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    processMsgInfo: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    approvalList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    pubFetchValueList: PropTypes.func,
    queryCommentHis: PropTypes.func,
    deleteBatchRefundOrder: PropTypes.func,
    queryHighChart: PropTypes.func,
    clearHighChart: PropTypes.func,
    highChartData: PropTypes.string,
    returnAuditInfo: PropTypes.func,
};

export default withRouter(Form.create()(toDoReturnList));
