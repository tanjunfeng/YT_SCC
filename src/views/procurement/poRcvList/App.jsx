import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, DatePicker, Row, Col, Icon, Table, Menu, Dropdown } from 'antd';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { PAGE_SIZE, DATE_FORMAT } from '../../../constant';
import Utils from '../../../util/util';
import {
    locType,
    poType,
    locTypeCodes,
    poStatusCodes
} from '../../../constant/procurement';
import SearchMind from '../../../components/searchMind';
import {
    getWarehouseAddressMap,
    getShopAddressMap,
    getSupplierMap,
    getSupplierLocMap,
    getBigClassMap,
    fetchPoRcvList
} from '../../../actions';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

@connect(
    state => ({
        poRcvListAction: state.toJS().procurement.poRcvList
    }),
    dispatch => bindActionCreators({
        getWarehouseAddressMap,
        getShopAddressMap,
        getSupplierMap,
        getSupplierLocMap,
        getBigClassMap,
        fetchPoRcvList
    }, dispatch)
)
class PoRcvList extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSearch = ::this.handleSearch;
        this.handleResetValue = ::this.handleResetValue;
        this.onLocTypeChange = ::this.onLocTypeChange;
        this.handleGetAddressMap = ::this.handleGetAddressMap;
        this.handleGetBigClassMap = ::this.handleGetBigClassMap;
        this.handleGetSupplierMap = ::this.handleGetSupplierMap;
        this.handleGetSupplierLocMap = ::this.handleGetSupplierLocMap;
        this.renderActions = ::this.renderActions;
        this.queryPoRcvPoList = ::this.queryPoRcvPoList;
        this.searchParams = {};
        this.state = {
            // 地点是否可编辑
            locDisabled: true
        };
        // 初始页号
        this.current = 1;
        this.columns = [

            {
                title: '采购单号',
                dataIndex: 'poNo',
                key: 'poNo',
            },
            {
                title: '采购单类型',
                dataIndex: 'poTypeName',
                key: 'poTypeName',
            },
            {
                title: '供应商编号',
                dataIndex: 'supplierCd',
                key: 'supplierCd',
            },
            {
                title: '供应商名称',
                dataIndex: 'supplierName',
                key: 'supplierName',
            },
            {
                title: '供应商地点编号',
                dataIndex: 'supplierLocCd',
                key: 'supplierLocCd',
            }, {
                title: '供应商地点名称',
                dataIndex: 'supplierLocName',
                key: 'supplierLocName',
            },
            {
                title: '预计送货日期',
                dataIndex: 'estDeliveryDate',
                key: 'estDeliveryDate'
            },
            {
                title: '地点类型',
                dataIndex: 'locTypeName',
                key: 'locTypeName'
            },
            {
                title: '地点',
                dataIndex: 'address',
                key: 'address'
            },
            {
                title: '大类编号',
                dataIndex: 'bigCLassCd',
                key: 'bigCLassCd'

            },
            {
                title: '大类名称',
                dataIndex: 'bigCLassName',
                key: 'bigCLassName'
            },
            {
                title: '状态',
                dataIndex: 'statusName',
                key: 'statusName',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: this.renderActions
            }
        ]
    }

    componentDidMount() {
        this.queryPoRcvPoList();
    }

    /**
      * 根据地点类型值控制地点值清单是否可编辑
      * 地点类型有值时：地点值清单可编辑
      * 地点类型无值时：地点值清单不可编辑、清空地点值清单
      *
      * @param {*} value
      */
    onLocTypeChange(value) {
        // 地点类型有值
        if (value) {
            // 地点类型有值时，地点可编辑
            // TODO SearchMind 需实现是否可编辑功能
        } else {
            // 地点类型无值时，地点不可编辑
            // TODO SearchMind 需实现是否可编辑功能
        }
        // 清空地点值
        this.poAddress.reset();
    }

    /**
     * 根据供应商值控制供应商地点值清单是否可编辑
     * 供应商有值时：供应商地点值清单可编辑
     * 供应商无值时：供应商地点值清单不可编辑、清空供应商地点值清单
     *
     * @param {*} value
     */
    onSupplierChange(value) {
        if (value) {
            // 供应商有值时，供应商地点可编辑
            // TODO SearchMind 需实现是否可编辑功能
        } else {
            // 供应商无值时，供应商地点不可编辑
            // TODO SearchMind 需实现是否可编辑功能
        }
        // 清空供应商地点值
        this.supplierLoc.reset();
    }
    /**
    *
    * 返回查询条件
    * 界面可见查询条件+采购单状态编码（已审核）
    *
    */
    editSearchParams() {
        const {
            poNo,
            locTypeCd,
            poTypeCd,
        } = this.props.form.getFieldsValue();

        // 创建日期区间
        const createdDuringArr = this.props.form.getFieldValue('createdDuring') || [];
        let createdDuringFrom;
        let createdDuringTo;
        if (createdDuringArr.length > 0) {
            createdDuringFrom = createdDuringArr[0].format(DATE_FORMAT);
        }
        if (createdDuringArr.length > 1) {
            createdDuringTo = createdDuringArr[1].format(DATE_FORMAT);
        }

        // 获取采购单审批日期区间
        const auditDuringArr = this.props.form.getFieldValue('auditDuring') || [];
        let auditDuringFrom;
        let auditDuringTo;
        if (auditDuringArr.length > 0) {
            auditDuringFrom = auditDuringArr[0].format(DATE_FORMAT);
        }
        if (auditDuringArr.length > 1) {
            auditDuringTo = auditDuringArr[1].format(DATE_FORMAT);
        }
        // 大类
        let bigClassCd = null;
        const selectedBigClassRawData = this.bigClass.state.selectedRawData;
        if (selectedBigClassRawData) {
            bigClassCd = selectedBigClassRawData.code;
        }

        // 地点
        let addressCd;
        const selectedAddressRawData = this.poAddress.state.selectedRawData;
        if (selectedAddressRawData) {
            addressCd = selectedAddressRawData.code;
        }
        // 供应商
        let supplierCd;
        const selectedSupplierRawData = this.supplier.state.selectedRawData;
        if (selectedSupplierRawData) {
            supplierCd = selectedSupplierRawData.code;
        }

        // 供应商地点
        let supplierLocCd;
        const selectedSupplierLocRawData = this.supplierLoc.state.selectedRawData;
        if (selectedSupplierRawData) {
            supplierLocCd = selectedSupplierLocRawData.code;
        }

        // 采购单状态：已审核
        const statusCd = poStatusCodes.approved;
        const searchParams = {
            poNo,
            locTypeCd,
            addressCd,
            poTypeCd,
            bigClassCd,
            statusCd,
            supplierCd,
            supplierLocCd,
            createdDuringFrom,
            createdDuringTo,
            auditDuringFrom,
            auditDuringTo
        };

        this.searchParams = Utils.removeInvalid(searchParams);
        return this.searchParams;
    }

    /**
     * 查询待收货采购单列表（已审批 && 未收货）
     */
    handleSearch() {
        // 编辑查询条件
        this.editSearchParams();
        // 查询待收货采购单
        this.queryPoRcvPoList();
    }

    queryPoRcvPoList(params) {
        const tmp = params || {};
        const allParams = Object.assign({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
        }, this.searchParams, tmp);
        this.props.fetchPoRcvList(allParams);
    }

    /**
    * 重置检索条件
    */
    handleResetValue() {
        // 重置检索条件
        this.searchParams = {};
        // 重置form
        this.props.form.resetFields();
        // 重置值清单
        this.bigClass.reset();
        this.supplier.reset();
        this.supplierLoc.reset();
        this.poAddress.reset();
    }

    /**
     * 根据地点类型查询地点值清单
     */
    handleGetAddressMap = ({ value }) => {
        // 地点类型
        const { locTypeCd } = this.props.form.getFieldsValue(['locTypeCd'])
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
     * 查询大类值清单
     */
    handleGetBigClassMap = ({ value }) => {
        this.props.getBigClassMap({ value });
    }

    /**
     * 查询供应商值清单
     */
    handleGetSupplierMap = ({ value }) => {
        this.props.getSupplierMap({ value });
    }

    /**
     * 根据供应商编码，查询供应商地点值清单
     */
    handleGetSupplierLocMap = ({ value }) => {
        let supplierCd;
        const selectedSupplierRawData = this.supplier.state.selectedRawData;
        if (selectedSupplierRawData) {
            supplierCd = selectedSupplierRawData.code;
        }

        // 如果供应商地点为空，返回空promise
        if (!supplierCd) {
            return new Promise((resolve) => {
                resolve({ total: 0, data: [] });
            });
        }
        // 根据供应商编码、输入查询内容获取供应商地点信息
        return this.props.getSupplierLocMap({
            value,
            supplierCd
        });
    }

    renderActions(text, record) {
        const { id } = record;
        const { pathname } = this.props.location;
        const menu = (
            <Menu>
                <Menu.Item key="detail">
                    <Link to={`${pathname}/${id}`}>采购单详情</Link>
                </Menu.Item>
                <Menu.Item key="rcv">
                    <Link to={`/porcvlist/create/${id}`} >收货</Link>
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
        const { data, total, pageNum, pageSize } = this.props.poRcvListAction;
        return (
            <div className="search-box">
                <Form layout="inline">
                    <div className="">
                        <Row gutter={40}>
                            <Col span={8}>
                                {/* 采购单号 */}
                                <FormItem label="采购单号" >
                                    {getFieldDecorator('poNo', {})(<Input />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 地点类型 */}
                                <FormItem label="地点类型">
                                    {getFieldDecorator('locTypeCd', {
                                        initialValue: locType.defaultValue
                                    })(
                                        <Select style={{ width: '153px' }} size="default" onChange={this.onLocTypeChange}>
                                            {
                                                locType.data.map((item) => (
                                                    <Option key={item.key} value={item.key}>
                                                        {item.value}</Option>
                                                ))
                                            }
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 地点 */}
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
                                                    width: 150,
                                                }, {
                                                    title: '名称',
                                                    dataIndex: 'name',
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
                                {/* 采购单类型 */}
                                <FormItem label="采购单类型">
                                    {getFieldDecorator('poTypeCd', {
                                        initialValue: poType.defaultValue
                                    })(
                                        <Select style={{ width: '153px' }} size="default">
                                            {
                                                poType.data.map((item) => (
                                                    <Option key={item.key} value={item.key}>
                                                        {item.value}</Option>
                                                ))
                                            }
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 大类 */}
                                <FormItem >
                                    <div className="row small">
                                        <span className="ant-form-item-label search-mind-label">大类</span>
                                        <SearchMind
                                            compKey="comBigClass"
                                            ref={ref => { this.bigClass = ref }}
                                            fetch={
                                                (value, pager) => (
                                                    this.handleGetBigClassMap(value, pager))
                                            }
                                            renderChoosedInputRaw={(row) => (
                                                <div>{row.code} - {row.name}</div>
                                            )}
                                            pageSize={2}
                                            columns={[
                                                {
                                                    title: '编码',
                                                    dataIndex: 'code',
                                                    width: 150,
                                                }, {
                                                    title: '名称',
                                                    dataIndex: 'name',
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
                                {/* 供应商 */}
                                <FormItem >
                                    <div className="row middle">
                                        <span className="ant-form-item-label search-mind-label">供应商</span>
                                        <SearchMind
                                            compKey="comSupplier"
                                            ref={ref => { this.supplier = ref }}
                                            fetch={
                                                (value, pager) => (
                                                    this.handleGetSupplierMap(value, pager))
                                            }
                                            renderChoosedInputRaw={(row) => (
                                                <div>{row.code} - {row.name}</div>
                                            )}
                                            pageSize={2}
                                            columns={[
                                                {
                                                    title: '编码',
                                                    dataIndex: 'code',
                                                    width: 150,
                                                }, {
                                                    title: '名称',
                                                    dataIndex: 'name',
                                                    width: 200,
                                                }
                                            ]}
                                        />
                                    </div>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 供应商地点 */}
                                <FormItem >
                                    <div className="row middle">
                                        <span className="ant-form-item-label search-mind-label">供应商地点</span>
                                        <SearchMind
                                            compKey="comSupplierLoc"
                                            ref={ref => { this.supplierLoc = ref }}
                                            fetch={
                                                (value, pager) => (
                                                    this.handleGetSupplierLocMap(value, pager)
                                                )
                                            }
                                            renderChoosedInputRaw={(row) => (
                                                <div>{row.code} - {row.name}</div>
                                            )}
                                            pageSize={2}
                                            columns={[
                                                {
                                                    title: '编码',
                                                    dataIndex: 'code',
                                                    width: 150,
                                                }, {
                                                    title: '名称',
                                                    dataIndex: 'name',
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
                                {/* 创建日期 */}
                                <FormItem >
                                    <div>
                                        <span className="ant-form-item-label search-mind-label">创建日期</span>
                                        {getFieldDecorator('createdDuring', {
                                        })(
                                            <RangePicker
                                                style={{ width: '200px' }}
                                                format={DATE_FORMAT}
                                                placeholder={['开始日期', '结束日期']}
                                            />)}
                                    </div>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 审批日期 */}
                                <FormItem >
                                    <div>
                                        <span className="ant-form-item-label search-mind-label">审批日期</span>
                                        {getFieldDecorator('auditDuring', {

                                        })(
                                            <RangePicker
                                                style={{ width: '200px' }}
                                                format={DATE_FORMAT}
                                                placeholder={['开始日期', '结束日期']}
                                            />)}
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>


                        <Row gutter={40} type="flex" justify="end">
                            <Col>
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
                            }}
                        />
                    </div>
                </Form>
            </div >
        );
    }
}

PoRcvList.propTypes = {
    fetchPoRcvList: PropTypes.func,
    getWarehouseAddressMap: PropTypes.func,
    getShopAddressMap: PropTypes.func,
    getBigClassMap: PropTypes.func,
    getSupplierMap: PropTypes.func,
    getSupplierLocMap: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    poRcvListAction: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(PoRcvList));
