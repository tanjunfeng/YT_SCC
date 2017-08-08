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
    locType,
    poType,
    locTypeCodes,
    poStatusCodes,
    poTypeCodes
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
} from '../../../actions'
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
        this.handleGetAddressMap =:: this.handleGetAddressMap;
        this.onActionMenuSelect = ::this.onActionMenuSelect;
        this.renderActions = ::this.renderActions;
        this.queryRcvMngPoList =:: this.queryRcvMngPoList;
        this.searchParams = {};
        this.state = {
            locDisabled: true, //地点是否可编辑
            spNo: '', // 供应商编码
            spAdrNo: '', // 供应商地点编码
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
                key: 'asn'
            }, {
                title: '采购单号',
                dataIndex: 'purchaseOrderNo',
                key: 'purchaseOrderNo'
            }, {
                title: '采购单类型',
                dataIndex: 'purchaseOrderType',
                key: 'purchaseOrderType'
            }, {
                title: '收货单状态',
                dataIndex: 'purchaseReceiptStatus',
                key: 'purchaseReceiptStatus'
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
                key: 'estimatedDeliveryDate'
            }, {
                title: '地点类型',
                dataIndex: 'adrType',
                key: 'adrType'
            }, {
                title: '地点',
                dataIndex: 'adrTypeName',
                key: 'adrTypeName'
            }, {
                title: '预计到货日期',
                dataIndex: 'estimatedReceivedDate',
                key: 'estimatedReceivedDate'

            }, {
                title: '收货日期',
                dataIndex: 'receivedTime',
                key: 'receivedTime'
            }, {
                title: '状态',
                dataIndex: 'statusName',
                key: 'statusName'
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
        //清空地点值
        this.poAddress.reset();
    }
    /**
         *
         * 返回查询条件
         *
         */
    editSearchParams() {
        const { purchaseReceiptNo, purchaseOrderNo, adrType, purchaseOrderType } = this.props.form.getFieldsValue();

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

        //地点
        let addressCd;
        let selectedAddressRawData = this.poAddress.state.selectedRawData;
        if (selectedAddressRawData) {
            addressCd = selectedAddressRawData.code;
        }
        //供应商编号
        let spNo = this.state.spNo;

        //供应商地点编号
        let spAdrNo = this.state.spAdrNo;

        const searchParams = {
            purchaseReceiptNo,
            purchaseOrderNo,
            adrType,
            addressCd,
            purchaseOrderType,
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
         * 查询收货单管理列表
         */
    handleSearch() {
        //编辑查询条件
        this.editSearchParams();
        //查询收获单列表
        this.queryRcvMngPoList();
    }

    componentDidMount() {
        this.queryRcvMngPoList();
    }

    queryRcvMngPoList(params) {
        let tmp = params || {};
        let allParams = Object.assign({
            pageSize: PAGE_SIZE,
            pageNum: this.current
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
        this.poAddress.reset();
        this.supplySearchMind.handleClear(); // 供应商查询清空
        this.addressSearchMind.reset(); // 供应商地址清空
    }

    // 获取供应商编号
    handleSupplyChoose = ({ record }) => {
        this.setState({ spNo: record.spAdrid })
    }

    // 供应商值清单-清除
    handleSupplyClear = () => {
        this.setState({ spNo: '' });
    }

    /**
         * 获取供应商地点编号
         */
    handleAdressChoose = ({ record }) => {
        this.setState({ spAdrNo: record.spAdrid });
    }

    /**
         * 清空供应商地点编号
         */
    handleAdressClear = ({ record }) => {
        this.setState({ spAdrNo: '' });
    }

    /**
         * 点击新建按钮跳转到采购单收货列表
         */
    handleCreate() {
        const { history } = this.props;
        history.push('/porcvlist');
    }

    handleGetAddressMap = ({ value, pagination }) => {
        //地点类型
        let { adrType } = this.props.form.getFieldsValue(["adrType"])
        let companyId = null; //TODO 从session获取？
        let pageNum = pagination.current || 1;
        //根据选择的地点类型获取对应地点的值清单
        if (adrType === locTypeCodes.warehouse) {
            //地点类型为仓库
            return this.props.getWarehouseAddressMap({ value, companyId, pageNum });
        } else if (adrType === locTypeCodes.shop) {
            //地点类型为门店
            return this.props.getShopAddressMap({ value, companyId, pageNum });
        } else {
            //如果地点类型为空，返回空promise
            return new Promise(function (resolve, reject) {
                resolve({ total: 0, data: [] });
            });
        }
    }

    renderActions(text, record, index) {
        const { statusCd, id } = record;
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
                            <Col span={6}>
                                {/* 采购单号 */}
                                <FormItem label="采购单号" formItemLayout>
                                    {getFieldDecorator('purchaseOrderNo', {})(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                {/* 收货单号 */}
                                <FormItem label="收货单号" formItemLayout>
                                    {getFieldDecorator('purchaseReceiptNo', {})(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                {/* 收货日期 */}
                                <FormItem >
                                    <div>
                                        <span className="ant-form-item-label">
                                            <label>收货日期</label>
                                        </span>
                                        {getFieldDecorator('receivedDuring', {
                                            initialValue: [
                                                moment(new Date(), dateFormat),
                                                moment(new Date(), dateFormat)
                                            ]
                                        })(<RangePicker
                                            style={{
                                                width: '320px'
                                            }}
                                            format={dateFormat}
                                            placeholder={['开始日期', '结束日期']} />)}
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={6}>
                                {/* 采购单类型 */}
                                <FormItem label="采购单类型">
                                    {getFieldDecorator('purchaseOrderType', { initialValue: poType.defaultValue })(
                                        <Select
                                            style={{
                                                width: '153px'
                                            }}
                                            size="default">
                                            {poType
                                                .data
                                                .map((item) => {
                                                    return <Option key={item.key} value={item.key}>{item.value}</Option>
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
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
                                            rowKey="spAdrid"
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
                                            ]} />
                                    </div>
                                </FormItem>
                            </Col>
                            {/* 供应商地点 */}
                            <Col span={6}>
                                <FormItem className="">
                                    <div className="row middle">
                                        <span className="ant-form-item-label">
                                            <label>供应商地点</label>
                                        </span>
                                        <SearchMind
                                            rowKey="spAdrid"
                                            compKey="search-mind-supply"
                                            ref={ref => {
                                                this.addressSearchMind = ref
                                            }}
                                            fetch={(params) => this.props.pubFetchValueList({
                                                condition: params.value,
                                                pageSize: params.pagination.pageSize,
                                                pageNum: params.pagination.current || 1
                                            }, 'supplierAdrSearchBox')}
                                            onChoosed={this.handleAdressChoose}
                                            onClear={this.handleAdressClear}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.providerNo}
                                                    - {data.providerName}</div>
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
                                                    dataIndex: 'spAdrid',
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
                                            ]} />
                                    </div>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                {/* 收货单状态 */}
                                <FormItem label="收货单状态">
                                    {getFieldDecorator('purchaseReceiptStatus', { initialValue: poType.defaultValue })(
                                        <Select
                                            style={{
                                                width: '153px'
                                            }}
                                            size="default">
                                            {
                                                poType.data.map((item) => {
                                                    return <Option key={item.key} value={item.key}>{item.value}</Option>
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={6}>
                                {/* 地点类型 */}
                                <FormItem label="地点类型">
                                    {getFieldDecorator('adrType', { initialValue: locType.defaultValue })(
                                        <Select
                                            style={{
                                                width: '153px'
                                            }}
                                            size="default"
                                            onChange={this.onLocTypeChange}>
                                            {locType
                                                .data
                                                .map((item) => {
                                                    return <Option key={item.key} value={item.key}>{item.value}</Option>
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                {/* 地点 */}
                                <FormItem formItemLayout>
                                    <div className="row small">
                                        <span className="ant-form-item-label">
                                            <label>地点</label>
                                        </span>
                                        <SearchMind
                                            compKey="comPoAddress"
                                            ref={ref => {
                                                this.poAddress = ref
                                            }}
                                            fetch={(value, pager) => this.handleGetAddressMap(value, pager)}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.code}
                                                    - {data.name}</div>
                                            )}
                                            pageSize={2}
                                            columns={[
                                                {
                                                    title: '编码',
                                                    dataIndex: 'code',
                                                    width: 150
                                                }, {
                                                    title: '名称',
                                                    dataIndex: 'name',
                                                    width: 200
                                                }
                                            ]} />
                                    </div>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                {/* 审批日期 */}
                                <FormItem >
                                    <div>
                                        <span className="ant-form-item-label">
                                            <label>审批日期</label>
                                        </span>
                                        {getFieldDecorator('auditDuring', {})(<RangePicker
                                            style={{
                                                width: '320px'
                                            }}
                                            format={dateFormat}
                                            placeholder={['开始日期', '结束日期']} />)}
                                    </div>
                                </FormItem>

                            </Col>
                        </Row>

                        <Row gutter={40} type="flex" justify="end">
                            <Col>
                                {/* <FormItem>
                                    <Button size="default" onClick={this.handleCreate}>
                                        新建
                                        </Button>
                                </FormItem> */}
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
