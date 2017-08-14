/**
 * 采购管理 - 收货单管理列表
 *
 * @author taoqiyu@yatang.cn
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
    Dropdown
} from 'antd';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { PAGE_SIZE } from '../../../constant';
import Utils from '../../../util/util';
import {
    poStatus,
    locType as adrType,
    status,
    poType
} from '../../../constant/procurement';
import SearchMind from '../../../components/searchMind';
import moment from 'moment';
import { pubFetchValueList } from '../../../actions/pub';
import {
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
    fetchPoRcvMngList
} from '../../../actions';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

@connect(state => ({
    poRcvMngList: state.toJS().procurement.poRcvMngList
}), dispatch => bindActionCreators({
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
    fetchPoRcvMngList,
    pubFetchValueList
}, dispatch))
class PoRcvMngList extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSearch = ::this.handleSearch;
        this.handleResetValue = ::this.handleResetValue;
        this.handleCreate = ::this.handleCreate;
        this.onLocTypeChange =:: this.onLocTypeChange;
        this.onActionMenuSelect = ::this.onActionMenuSelect;
        this.renderActions = ::this.renderActions;
        this.queryRcvMngPoList =:: this.queryRcvMngPoList;
        this.searchParams = {};
        this.state = {
            locDisabled: true,  //地点是否可编辑
            spNo: '',   // 供应商编码
            spAdrNo: '',    // 供应商地点编码
            adrTypeCode: '',    // 地点编码
            receivedTypeCode: ''  // 收货单状态编码
        };
        //初始页号
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
                    if (null === text || undefined === text || '' === text) text = '-';
                    return text;
                }
            }, {
                title: '采购单号',
                dataIndex: 'purchaseOrderNo',
                key: 'purchaseOrderNo'
            }, {
                title: '采购单类型',
                dataIndex: 'purchaseOrderType',
                key: 'purchaseOrderType',
                render: poTypeCode => {
                    let text = '';
                    poType.data.forEach(item => {
                        if (poTypeCode === +(item.key)) {
                            return text = item.value;
                        }
                    });
                    return text;
                }
            }, {
                title: '供应商编号',
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
                    return moment(new Date(text)).format(dateFormat);
                }
            }, {
                title: '地点类型',
                dataIndex: 'adrType',
                key: 'adrType',
                render: adrTypeCode => {
                    let text = '';
                    adrType.data.forEach(item => {
                        if (adrTypeCode === +(item.key)) {
                            return text = item.value;
                        }
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
                    return moment(new Date(text)).format(dateFormat);
                }
            }, {
                title: '收货日期',
                dataIndex: 'receivedTime',
                key: 'receivedTime',
                render: text => {
                    return moment(new Date(text)).format(dateFormat);
                }
            }, {
                title: '收货单状态',
                dataIndex: 'status',
                key: 'status',
                render: statusCode => {
                    let text = '';
                    status.data.forEach(item => {
                        if (statusCode === +(item.key)) {
                            return text = item.value;
                        }
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
    /**
     * 根据地点类型值控制地点值清单是否可编辑
     * 地点类型有值时：地点值清单可编辑
     * 地点类型无值时：地点值清单不可编辑、清空地点值清单
     *
     * @param {*} value
     */
    onLocTypeChange(value) {
        //地点类型有值
        if (value) {
            //地点类型有值时，地点可编辑
            //TODO SearchMind 需实现是否可编辑功能
        } else {
            //地点类型无值时，地点不可编辑
            //TODO SearchMind 需实现是否可编辑功能
        }
    }
    /**
     *
     * 返回查询条件
     *
     */
    editSearchParams() {
        const { purchaseReceiptNo, purchaseOrderNo, adrType, purchaseOrderType, status } = this.props.form.getFieldsValue();

        //收货日期区间
        let receivedDuringArr = this.props.form.getFieldValue("receivedDuring") || [];
        let receivedTimeStart, receivedTimeEnd;
        if (receivedDuringArr.length > 0) {
            receivedTimeStart = Date.parse(receivedDuringArr[0].format(dateFormat));
        }
        if (receivedDuringArr.length > 1) {
            receivedTimeEnd = Date.parse(receivedDuringArr[1].format(dateFormat));
        }

        //获取采购单审批日期区间
        let auditDuringArr = this.props.form.getFieldValue("auditDuring") || [];
        let auditDuringFrom, auditDuringTo;
        if (auditDuringArr.length > 0) {
            auditDuringFrom = Date.parse(auditDuringArr[0].format(dateFormat));
        }
        if (auditDuringArr.length > 1) {
            auditDuringTo = Date.parse(auditDuringArr[1].format(dateFormat));
        }

        // 供应商编号
        let spNo = this.state.spNo;

        // 供应商地点编号
        let spAdrNo = this.state.spAdrNo;

        // 地点
        let adrTypeCode = this.state.adrTypeCode;

        // 收货单状态编码
        let receivedTypeCode = this.state.receivedTypeCode;

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
            auditDuringFrom,
            auditDuringTo
        };
        this.searchParams = Utils.removeInvalid(searchParams);
        return this.searchParams;
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

    /**
     * 查询收货单管理列表
     */
    handleSearch() {
        //编辑查询条件
        this.editSearchParams();
        //查询收货单单列表
        this.queryRcvMngPoList();
    }

    componentDidMount() {
        this.queryRcvMngPoList();
    }

    queryRcvMngPoList(params) {
        let tmp = params || {};
        let allParams = Object.assign({
            pageSize: PAGE_SIZE,
            pageNum: this.current || 1
        }, allParams, this.searchParams, tmp);
        this.props.fetchPoRcvMngList(allParams);
    }

    /**
     * 重置检索条件
     */
    handleResetValue() {
        //重置检索条件
        this.searchParams = {};
        //重置form
        this.props.form.resetFields();
        this.supplySearchMind.handleClear(); // 供应商查询清空
        this.supplyAddressSearchMind.handleClear(); // 供应商地址清空
        this.receiptAddressSearchMind.handleClear(); // 收货地址清空
    }

    // 获取供应商编号
    handleSupplyChoose = ({ record }) => {
        this.setState({ spNo: record.spNo })
    }

    // 供应商值清单-清除
    handleSupplyClear = () => {
        this.setState({ spNo: '' });
    }

    /**
     * 获取供应商地点编号
     */
    handleAdressChoose = ({ record }) => {
        this.setState({ spAdrNo: record.providerNo });
    }

    /**
     * 清空供应商地点编号
     */
    handleAdressClear = ({ record }) => {
        this.setState({ spAdrNo: '' });
    }

    /**
     * 获取收货地点编号
     */
    handleReceiveAdressChoose = ({ record }) => {
        this.setState({ adrTypeCode: record.warehouseCode });
    }

    /**
     * 清空收货地点编号
     */
    handleReceiveAdressClear = ({ record }) => {
        this.setState({ adrTypeCode: '' });
    }

    /**
     * 点击新建按钮跳转到采购单收货列表
     */
    handleCreate() {
        const { history } = this.props;
        history.push('/porcvlist');
    }

    renderActions(text, record, index) {
        const { status, id } = record;
        const { pathname } = this.props.location;
        const menu = (
            <Menu onClick={(item) => this.onActionMenuSelect(record, index, item)}>
                <Menu.Item key="detail">
                    <Link to={`${pathname}/${id}`}>收货单详情</Link>
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

    onActionMenuSelect(record, index, items) {
        const { id } = record;
        const { key } = items;
        //do nothing
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                span: 3
            },
            wrapperCol: {
                span: 21
            }
        };

        const { data, total, pageNum, pageSize } = this.props.poRcvMngList;
        return (
            <div className="search-box">
                <Form layout="inline">
                    <div className="">
                        <Row gutter={40}>
                            <Col span={8}>
                                {/* 采购单号 */}
                                <FormItem label="采购单号" formItemLayout>
                                    {getFieldDecorator('purchaseOrderNo', {})(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 收货单号 */}
                                <FormItem label="收货单号" formItemLayout>
                                    {getFieldDecorator('purchaseReceiptNo', {})(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 收货日期 */}
                                <FormItem >
                                    <div className="row middle">
                                        <span className="ant-form-item-label">
                                            <label>收货日期</label>
                                        </span>
                                        {getFieldDecorator('receivedDuring', {})(
                                            <RangePicker
                                                className="date-range-picker"
                                                format={dateFormat}
                                                placeholder={['开始日期', '结束日期']} />
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
                                        <Select
                                            style={{
                                                width: '153px'
                                            }}
                                            size="default">
                                            {poType.data.map((item) => {
                                                return <Option key={item.key} value={item.key}>{item.value}</Option>
                                            })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 供应商 */}
                                <FormItem formItemLayout>
                                    <div className="row middle">
                                        <span className="ant-form-item-label">
                                            <label>供应商</label>
                                        </span>
                                        <SearchMind
                                            style={{
                                                zIndex: 101
                                            }}
                                            compKey="search-mind-supply"
                                            ref={ref => {
                                                this.supplySearchMind = ref
                                            }}
                                            fetch={(params) => this.props.pubFetchValueList({
                                                condition: params.value
                                            }, 'querySuppliersList')}
                                            addonBefore=""
                                            onChoosed={this.handleSupplyChoose}
                                            onClear={this.handleSupplyClear}
                                            renderChoosedInputRaw={(companyList) => (
                                                <div
                                                    ref={supplier => {
                                                        this.supplier = supplier
                                                    }}>{companyList.spId}-{companyList.companyName}</div>
                                            )}
                                            rowKey="spId"
                                            pageSize={5}
                                            columns={[
                                                {
                                                    title: '供应商ID',
                                                    dataIndex: 'spId',
                                                    width: 150
                                                }, {
                                                    title: '供应商名称',
                                                    dataIndex: 'companyName',
                                                    width: 200
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
                                        <span className="ant-form-item-label">
                                            <label>供应商地点</label>
                                        </span>
                                        <SearchMind
                                            rowKey="providerNo"
                                            compKey="search-mind-supply-address"
                                            ref={ref => {
                                                this.supplyAddressSearchMind = ref
                                            }}
                                            fetch={(params) => this.props.pubFetchValueList({
                                                condition: params.value
                                            }, 'supplierAdrSearchBox')}
                                            onChoosed={this.handleAdressChoose}
                                            onClear={this.handleAdressClear}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.providerNo} - {data.providerName}</div>
                                            )}
                                            pageSize={6}
                                            columns={[
                                                {
                                                    title: '供应商编码',
                                                    dataIndex: 'spNo',
                                                    width: 150
                                                }, {
                                                    title: '供应商ID',
                                                    dataIndex: 'spId',
                                                    width: 200
                                                }, {
                                                    title: '供应商地点ID',
                                                    dataIndex: 'spAdrNo',
                                                    width: 200
                                                }, {
                                                    title: '供应商名称',
                                                    dataIndex: 'companyName',
                                                    width: 200
                                                }, {
                                                    title: '供应商地点编码',
                                                    dataIndex: 'providerNo',
                                                    width: 200
                                                }, {
                                                    title: '供应商地点名称',
                                                    dataIndex: 'providerName',
                                                    width: 200
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
                                    {getFieldDecorator('status', { initialValue: status.defaultValue })(
                                        <Select
                                            style={{
                                                width: '153px'
                                            }}
                                            size="default">
                                            {
                                                status.data.map((item) => {
                                                    return <Option key={item.key} value={item.key}>{item.value}</Option>
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 地点类型 */}
                                <FormItem label="地点类型">
                                    {getFieldDecorator('adrType', { initialValue: adrType.defaultValue })(
                                        <Select
                                            style={{
                                                width: '153px'
                                            }}
                                            size="default"
                                        >
                                            {
                                                adrType.data.map((item) => {
                                                    return <Option key={item.key} value={item.key}>{item.value}</Option>
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 地点 */}
                                <FormItem formItemLayout>
                                    <div className="row middle">
                                        <span className="ant-form-item-label">
                                            <label>地点</label>
                                        </span>
                                        <SearchMind
                                            style={{ zIndex: 7 }}
                                            compKey="search-mind-key1"
                                            rowKey="id"
                                            ref={ref => { this.receiptAddressSearchMind = ref }}
                                            fetch={(params) => this.props.pubFetchValueList({
                                                condition: params.value
                                            }, 'getWarehouseInfo1')}
                                            onChoosed={this.handleReceiveAdressChoose}
                                            onClear={this.handleReceiveAdressClear}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.warehouseCode} - {data.warehouseName}</div>
                                            )}
                                            pageSize={3}
                                            columns={[
                                                {
                                                    title: '仓库ID',
                                                    dataIndex: 'id',
                                                    width: 150,
                                                }, {
                                                    title: '仓库编码',
                                                    dataIndex: 'warehouseCode',
                                                    width: 200,
                                                }, {
                                                    title: '仓库名称',
                                                    dataIndex: 'warehouseName',
                                                    width: 200,
                                                }
                                            ]}
                                        />
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={8}>
                                {/* 审批日期 */}
                                <FormItem>
                                    <div className="row middle">
                                        <span className="ant-form-item-label">
                                            <label>审批日期</label>
                                        </span>
                                        {
                                            getFieldDecorator('auditDuring', {})(
                                                <RangePicker
                                                    className="date-range-picker"
                                                    format={dateFormat}
                                                    placeholder={['开始日期', '结束日期']}
                                                />
                                            )
                                        }
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40} type="flex" justify="end">
                            <Col className="ant-col-6 ant-col-offset-6 gutter-row">
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
                                x: 1400
                            }}
                            pagination={{
                                current: pageNum,
                                total,
                                pageSize,
                                showQuickJumper: true,
                                onChange: this.onPaginate
                            }} />
                    </div>
                </Form>
            </div >
        );
    }
}

PoRcvMngList.propTypes = {
    doSearch: PropTypes.func,
    onReset: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    pubFetchValueList: PropTypes.func
};

export default withRouter(Form.create()(PoRcvMngList));
