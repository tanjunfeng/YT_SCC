/*
 * @Author: tanjf
 * @Description: 采购单审批列表
 * @CreateDate: 2017-10-27 11:23:06
 * @Last Modified by: chenghaojie
 * @Last Modified time: 2017-12-06 09:45:39
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
    message
} from 'antd';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import { PAGE_SIZE } from '../../../constant';
import Utils from '../../../util/util';
import { locType, auditStatusOption } from '../../../constant/procurement';
import SearchMind from '../../../components/searchMind';
import { pubFetchValueList } from '../../../actions/pub';
import {
    queryApprovalInfo,
    queryPoDetail
} from '../../../actions/procurement';
import {
    queryProcessMsgList,
} from '../../../actions/process';
import {
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
} from '../../../actions';
import ApproModal from './approModal';
import { Supplier } from '../../../container/search';

const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
const confirm = Modal.confirm;

@connect(state => ({
    queryPurchaseRefundList: state.toJS().procurement.queryPurchaseRefundList
}), dispatch => bindActionCreators({
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
    pubFetchValueList,
    queryProcessMsgList,
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
            spAdrId: '', // 供应商地点编码
            locDisabled: true, // 地点禁用
            locationData: {},
            isVisibleModal: false,
            approvalVisible: false,
            opinionVisible: false,
            approvalStatus: false,
            adrTypeCode: '', // 地点编码
            receivedTypeCode: '', // 收货单状态编码
            refundAdr: '',
            spNo: '', // 供应商编码
            spAdrNo: '', // 供应商地点编码
            status: 0 // 流程状态，默认进行中
        };
        // 初始页号
        this.current = 1;
        this.columns = [
            {
                title: '采购单号',
                dataIndex: 'purchaseRefundNo',
                key: 'purchaseRefundNo',
                render: (text, record) => (
                    <Link target="_blank" to={`po/detail/${record.id}`} onClick={this.toPurDetail}>{text}</Link>
                )
            }, {
                title: '地点类型',
                dataIndex: 'adrType',
                key: 'adrType'
            }, {
                title: '退货地点',
                dataIndex: 'refundAdrName',
                key: 'refundAdrName'
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
        this.props.queryProcessMsgList({
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
                    auditResult,
                    auditOpinion
                } = values;
                const dist = {
                    auditResult,
                    auditOpinion
                };
                if (auditResult === '') {
                    this.props.form.setFields({
                        auditResult: {
                            value: values.area,
                            errors: [new Error('未选择审批状态')],
                        },
                    });
                    reject();
                } else {
                    Object.assign(dist, {
                        auditResult
                    });
                }
                if (auditResult === '0') {
                    if (auditOpinion === '') {
                        this.props.form.setFields({
                            auditOpinion: {
                                value: auditOpinion,
                                errors: [new Error('请输入审批意见!')]
                            }
                        });
                        reject();
                    } else {
                        Object.assign(dist, {
                            auditOpinion
                        });
                    }
                }
                resolve(Utils.removeInvalid(dist));
            });
        });
    }


    queryReturnMngList = (page = 1) => {
        this.current = page;
        this.props.queryProcessMsgList({
            map: {
                pageSize: PAGE_SIZE,
                pageNum: this.current,
                status: this.state.status
            },
            processType: 'CGTH'
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
        this.handleSupplierAddressClear();
        this.handleAddressClear();
        this.props.form.setFieldsValue({
            supplier: { reset: true }
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
            opinionVisible: false,
        });
    }

    showApprovalModal = () => {
        this.setState({
            approvalVisible: true,
        });
    }

    handleApprovalOk = () => {
        const { processNodeId, id } = this.examinationAppData;
        const processId = processNodeId;
        this.getFormData().then((param) => {
            this.props.approveRefund({ ...param, processId, businessId: id, type: 1 })
                .then((res) => {
                    if (res.code === 200) {
                        message.success(res.message);
                        this.setState({
                            approvalVisible: false,
                        });

                        this.queryReturnMngList(this.current);
                    }
                });
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
                this.showOpinionModal();
                break;
            case 'viewApproval':
                this.showModal();
                this.props.queryApprovalInfo({ businessId: record.purchaseRefundNo })
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
            adrType,
            auditStatus,
            supplier
        } = this.props.form.getFieldsValue();

        // 供应商编号
        const spId = supplier.spId;

        // 供应商地点编号
        const spAdrId = this.state.spAdrId;

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
            adrTypeCode,
            auditStatus
        };
        this.searchParams = Utils.removeInvalid(searchParams);
        return this.searchParams;
    }

    // 流程状态切换
    statusChange = (value) => {
        this.setState({
            status: value
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
        const { data, total, pageNum, pageSize } = this.props.queryPurchaseRefundList;
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
                                    {getFieldDecorator('auditStatus', { initialValue: '进行中' })(
                                        <Select style={{ width: '153px' }} size="default" onChange={this.statusChange}>
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
                            <Col span={8}>
                                {/* 供应商 */}
                                <FormItem>
                                    <div className="row middle">
                                        <span className="ant-form-item-label search-mind-label">供应商</span>
                                        {getFieldDecorator('supplier', {
                                            initialValue: { spId: '', spNo: '', companyName: '' }
                                        })(<Supplier />)}
                                    </div>
                                </FormItem>
                            </Col>
                            {/* 供应商地点 */}
                            <Col className="gutter-row" span={8}>
                                <FormItem>
                                    <span className="sc-form-item-label" style={{ width: 70 }}>供应商地点</span>
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
                        </Row>
                        <Row gutter={40} type="flex" justify="end">
                            <Col className="ant-col-10 ant-col-offset-10 gutter-row" style={{ textAlign: 'right' }}>
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
    queryProcessMsgList: PropTypes.func,
    approveRefund: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    queryPurchaseRefundList: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    pubFetchValueList: PropTypes.func,
    queryApprovalInfo: PropTypes.func,
    queryPoDetail: PropTypes.func,
    deleteBatchRefundOrder: PropTypes.func
};

export default withRouter(Form.create()(toDoPurchaseList));
