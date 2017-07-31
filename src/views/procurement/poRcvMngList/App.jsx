import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, DatePicker, Row, Col, Icon, Table, Menu, Dropdown } from 'antd';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { PAGE_SIZE } from '../../../constant';
import Utils from '../../../util/util';
import { poStatus, locType, poType, locTypeCodes, poStatusCodes, poTypeCodes } from '../../../constant/procurement';
import SearchMind from '../../../components/searchMind';
import moment from 'moment';
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
@connect(
    state => ({
        poRcvMngList: state.toJS().procurement.poRcvMngList,
    }),
    dispatch => bindActionCreators({
        getWarehouseAddressMap,
        getShopAddressMap,
        getSupplierMap,
        getSupplierLocMap,
        fetchPoRcvMngList
    }, dispatch)
)
class PoRcvMngList extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSearch = ::this.handleSearch;
        this.handleResetValue = ::this.handleResetValue;
        this.handleCreate = ::this.handleCreate;
        this.onLocTypeChange =::this.onLocTypeChange;
        this.handleGetAddressMap =::this.handleGetAddressMap;
        this.handleGetSupplierMap =::this.handleGetSupplierMap;
        this.handleGetSupplierLocMap =::this.handleGetSupplierLocMap;
        this.onActionMenuSelect = ::this.onActionMenuSelect;
        this.renderActions = ::this.renderActions;
        this.queryRcvMngPoList =::this.queryRcvMngPoList;
        this.searchParams = {};
        this.state = {
            //地点是否可编辑
            locDisabled: true
        };
        //初始页号
        this.current = 1;
        this.columns = [
            {
                title: '收货单号',
                dataIndex: 'rcvNo',
                key: 'rcvNo',
            },
            {
                title: 'ASN',
                dataIndex: 'asn',
                key: 'asn',
            },
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
                title: '预计到货日期',
                dataIndex: 'deliveryDate',
                key: 'deliveryDate'

            },
            {
                title: '收货日期',
                dataIndex: 'rcvDate',
                key: 'rcvDate'
            }
            ,
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
     * 根据供应商值控制供应商地点值清单是否可编辑
     * 供应商有值时：供应商地点值清单可编辑
     * 供应商无值时：供应商地点值清单不可编辑、清空供应商地点值清单
     * 
     * @param {*} value 
     */
    onSupplierChange(value) {
        if (value) {
            //供应商有值时，供应商地点可编辑
            //TODO SearchMind 需实现是否可编辑功能
        } else {
            //供应商无值时，供应商地点不可编辑
            //TODO SearchMind 需实现是否可编辑功能
        }
        //清空供应商地点值
        this.supplierLoc.reset();
    }
    /**
     * 
     * 返回查询条件
     * 
     */
    editSearchParams() {
        const {
            poRcvNo,
            poNo,
            locTypeCd,
            poTypeCd,
        } = this.props.form.getFieldsValue();

        //收货日期区间
        let poRcvDuringArr = this.props.form.getFieldValue("poRcvDuring") || [];
        let poRcvDuringFrom, poRcvDuringTo;
        if (poRcvDuringArr.length > 0) {
            poRcvDuringFrom = poRcvDuringArr[0].format(dateFormat);
        }
        if (poRcvDuringArr.length > 1) {
            poRcvDuringTo = poRcvDuringArr[1].format(dateFormat);
        }

        //获取采购单审批日期区间
        let auditDuringArr = this.props.form.getFieldValue("auditDuring") || [];
        let auditDuringFrom, auditDuringTo;
        if (auditDuringArr.length > 0) {
            auditDuringFrom = auditDuringArr[0].format(dateFormat);
        }
        if (auditDuringArr.length > 1) {
            auditDuringTo = auditDuringArr[1].format(dateFormat);
        }


        //地点
        let addressCd;
        let selectedAddressRawData = this.poAddress.state.selectedRawData;
        if (selectedAddressRawData) {
            addressCd = selectedAddressRawData.code;
        }
        //供应商
        let supplierCd;
        let selectedSupplierRawData = this.supplier.state.selectedRawData;
        if (selectedSupplierRawData) {
            supplierCd = selectedSupplierRawData.code;
        }

        //供应商地点
        let supplierLocCd;
        let selectedSupplierLocRawData = this.supplierLoc.state.selectedRawData;
        if (selectedSupplierLocRawData) {
            supplierLocCd = selectedSupplierLocRawData.code;
        }

        const searchParams = {
            poRcvNo,
            poNo,
            locTypeCd,
            addressCd,
            poTypeCd,
            supplierCd,
            supplierLocCd,
            poRcvDuringFrom,
            poRcvDuringTo,
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
            pageNum: this.current,
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
        //重置值清单
        this.supplier.reset();
        this.supplierLoc.reset();
        this.poAddress.reset();
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
        let { locTypeCd } = this.props.form.getFieldsValue(["locTypeCd"])
        let companyId = null;//TODO 从session获取？
        let pageNum = pagination.current || 1;
        //根据选择的地点类型获取对应地点的值清单
        if (locTypeCd === locTypeCodes.warehouse) {
            //地点类型为仓库
            return this.props.getWarehouseAddressMap({
                value, companyId, pageNum
            });
        } else if (locTypeCd === locTypeCodes.shop) {
            //地点类型为门店
            return this.props.getShopAddressMap({
                value, companyId, pageNum
            });
        } else {
            //如果地点类型为空，返回空promise
            return new Promise(function (resolve, reject) {
                resolve({ total: 0, data: [] });
            });
        }
    }

    /**
     * 查询供应商值清单
     */
    handleGetSupplierMap = ({ value, pagination }) => {
        let companyId = null;//TODO 从session获取？
        let pageNum = pagination.current || 1;
        return this.props.getSupplierMap({
            value, companyId, pageNum
        });

    }

    /**
     * 查询供应商地点值清单
     */
    handleGetSupplierLocMap = ({ value, pagination }) => {
        let supplierCd;
        let selectedSupplierRawData = this.supplier.state.selectedRawData;
        if (selectedSupplierRawData) {
            supplierCd = selectedSupplierRawData.code;
        }
        let companyId = null;//TODO 从session获取？
        let pageNum = pagination.current || 1;
        //如果供应商地点为空，返回空promise
        if (!supplierCd) {
            return new Promise(function (resolve, reject) {
                resolve({ total: 0, data: [] });
            });
        }
        //根据供应商编码、输入查询内容获取供应商地点信息
        return this.props.getSupplierLocMap({
            value,
            supplierCd,
            companyId, pageNum
        });

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
                            <Col span={8}>
                                {/* 采购单号 */}
                                <FormItem label="采购单号" formItemLayout>
                                    {getFieldDecorator('poNo', {
                                    })(
                                        <Input
                                        />
                                        )}

                                </FormItem>
                            </Col>

                            <Col span={8}>
                                {/* 收货单号 */}
                                <FormItem label="收货单号" formItemLayout>
                                    {getFieldDecorator('poRcvNo', {
                                    })(
                                        <Input
                                        />
                                        )}

                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 收货日期 */}
                                <FormItem >
                                    <div>
                                        <span className="ant-form-item-label"><label>收货日期</label> </span>
                                        {getFieldDecorator('poRcvDuring', {
                                            initialValue: [moment(new Date(), dateFormat), moment(new Date(), dateFormat)]
                                        })(
                                            <RangePicker
                                                style={{ width: '200px' }}
                                                format={dateFormat}
                                                placeholder={['开始日期', '结束日期']}
                                            />)}
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={8}>
                                {/* 供应商 */}
                                <FormItem formItemLayout >
                                    <div className="row middle">
                                        <span className="ant-form-item-label"><label>供应商</label> </span>
                                        <SearchMind
                                            compKey="comSupplier"
                                            ref={ref => { this.supplier = ref }}
                                            fetch={(value, pager) => this.handleGetSupplierMap(value, pager)}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.code} - {data.name}</div>
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
                                <FormItem formItemLayout >
                                    <div className="row middle">
                                        <span className="ant-form-item-label"><label>供应商地点</label> </span>
                                        <SearchMind
                                            compKey="comSupplierLoc"
                                            ref={ref => { this.supplierLoc = ref }}
                                            fetch={(value, pager) => this.handleGetSupplierLocMap(value, pager)}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.code} - {data.name}</div>
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
                                {/* 采购单类型 */}
                                <FormItem label="采购单类型">
                                    {getFieldDecorator('poTypeCd', {
                                        initialValue: poType.defaultValue
                                    })(
                                        <Select style={{ width: '153px' }} size="default">
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
                            <Col span={8}>
                                {/* 地点类型 */}
                                <FormItem label="地点类型">
                                    {getFieldDecorator('locTypeCd', {
                                        initialValue: locType.defaultValue
                                    })(
                                        <Select style={{ width: '153px' }} size="default" onChange={this.onLocTypeChange}>
                                            {
                                                locType.data.map((item) => {
                                                    return <Option key={item.key} value={item.key}>{item.value}</Option>
                                                })
                                            }
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 地点 */}
                                <FormItem formItemLayout >
                                    <div className="row small">
                                        <span className="ant-form-item-label"><label>地点</label> </span>
                                        <SearchMind
                                            compKey="comPoAddress"
                                            ref={ref => { this.poAddress = ref }}
                                            fetch={(value, pager) => this.handleGetAddressMap(value, pager)}
                                            renderChoosedInputRaw={(data) => (
                                                <div>{data.code} - {data.name}</div>
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
                                {/* 采购单审批日期 */}
                                <FormItem >
                                    <div>
                                        <span className="ant-form-item-label"><label>采购单审批日期</label> </span>
                                        {getFieldDecorator('auditDuring', {

                                        })(
                                            <RangePicker
                                                style={{ width: '180px' }}
                                                format={dateFormat}
                                                placeholder={['开始日期', '结束日期']}
                                            />)}
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
                        <Table dataSource={data} columns={this.columns} rowKey="id" scroll={{
                            x: 1400
                        }} pagination={{
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
    form: PropTypes.objectOf(PropTypes.any)
};



export default withRouter(Form.create()(PoRcvMngList));
