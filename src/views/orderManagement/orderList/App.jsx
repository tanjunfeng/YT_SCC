/**
 * @file App.jsx
 * @author caoyanxuan
 *
 * 订单管理列表
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Row, Col, Select, Icon, Table, Menu, Dropdown, message, Modal, DatePicker} from 'antd';
import moment from 'moment';
import SearchMind from '../../../components/searchMind';
import {
    orderTypeOptions,
    orderStatusOptions,
    payStatusOptions,
    logisticsStatusOptions
} from '../../../constant/searchParams';
import {fetchTest} from '../../../actions/classifiedList';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const orderML = 'order-management';
const { RangePicker } = DatePicker;


const columns = [{
    title: '订单编号',
    dataIndex: 'orderNumber',
    key: 'orderNumber',
}, {
    title: '父订单编号',
    dataIndex: 'parentOrderNumber',
    key: 'parentOrderNumber',
}, {
    title: '订单类型',
    dataIndex: 'orderType',
    key: 'orderType',
}, {
    title: '加盟商编号',
    dataIndex: 'JoinerNumber',
    key: 'JoinerNumber',
}, {
    title: '所属子公司',
    dataIndex: 'belongSubCompany',
    key: 'belongSubCompany',
}, {
    title: '订单日期',
    dataIndex: 'orderDate',
    key: 'orderDate',
    render: (text) => (
        <span>
            {moment(parseInt(text, 10)).format('YYYY-MM-DD HH:mm:ss')}
        </span>
    )
}, {
    title: '订单金额',
    dataIndex: 'orderMoney',
    key: 'orderMoney',
}, {
    title: '订单状态',
    dataIndex: 'orderStatus',
    key: 'orderStatus',
}, {
    title: '支付状态',
    dataIndex: 'payStatus',
    key: 'payStatus',
}, {
    title: '物流状态',
    dataIndex: 'logisticsStatus',
    key: 'logisticsStatus',
}, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
}];

const datas = [{
    orderNumber: 'XXXXXXX02',
    parentOrderNumber: 'XXXXXXX',
    orderType: '加盟商',
    JoinerNumber: 'A000999',
    belongSubCompany: '四川子公司',
    orderDate: '1500876718',
    orderMoney: '￥140.00',
    orderStatus: '待人工审核',
    payStatus: '未支付',
    logisticsStatus: '未传送',
}, {
    orderNumber: 'XXXXXXX01',
    parentOrderNumber: 'XXXXXXX',
    orderType: '加盟商',
    JoinerNumber: 'A000999',
    belongSubCompany: '四川子公司',
    orderDate: '1500876718',
    orderMoney: '￥140.00',
    orderStatus: '待人工审核',
    payStatus: '未支付',
    logisticsStatus: '未传送',
}];


@connect(
    state => ({
        // goods: state.toJS().commodity.goods,
    }),
    dispatch => bindActionCreators({

    }, dispatch)
)
class OrderManagementList extends Component {
    constructor(props) {
        super(props);
        this.onEnterTimeChange = ::this.onEnterTimeChange;
        this.renderOperation = ::this.renderOperation;
        this.handleFormReset = ::this.handleFormReset;
        this.handleFormSearch = ::this.handleFormSearch;
        this.state = {
            choose: [],
            brandChoose: null,
            supplyChoose: null,
            subsidiaryChoose: null,
        }
    }

    componentDidMount() {
    }

    /**
     * 日期选择
     * @param {*} result 
     */
    onEnterTimeChange(result) {
        this.setState({rengeTime: result});
        if (result.length === 2) {
            this.time = {
                minSettledDate: result[0].valueOf(),
                maxSettledDate: result[1].valueOf()
            }
        } else {
            this.time = {
                minSettledDate: null,
                maxSettledDate: null
            }
        }
    }

    /**
     * table复选框
     */
    rowSelection = {
        onChange: (selectedRowKeys) => {
            this.setState({
                choose: selectedRowKeys,
            });
        }
    }
    /**
     * 品牌-值清单
     */
    // handleBrandChoose = ({ record }) => {
    //     this.setState({
    //         brandChoose: record,
    //     });
    // }

    /**
     * 暂停购进
     */
    // handleSuspendPurchase() {
    //     confirm({
    //         title: '暂停购进',
    //         content: '请确认对选中商品进行暂停购进操作，商品将不可进行采购下单',
    //         onOk: () => {
    //         },
    //         onCancel() {},
    //     });
    // }

    /**
     * 恢复采购
     */

    /**
     * 品牌值清单-清除
     */
    // handleBrandClear() {
    //     this.setState({
    //         brandChoose: null,
    //     });
    // }

    /**
     * 重置
     */
    handleFormReset() {
        this.brandSearchMind.handleClear();
        this.supplySearchMind.handleClear();
        this.subsidiarySearchMind.handleClear();
        this.props.form.resetFields();
    }

    /**
     * 查询
     */
    handleFormSearch() {
    }

    /**
     * 值清单请求
     * @param {string} value, 输入框返回的值
     * @param {number} pagination, 分页
     * @return {Promise}
     */
    handleTestFetch = ({ value, pagination }) => fetchTest({
        value,
        pagination
    })

    // 选择操作项
    handleSelect(record, items) {
        const { orderNumber } = record;
        const { key } = items;
        switch (key) {
            case 'tableAudit':
                confirm({
                    title: '你确认要删除此方案吗？',
                    onOk: () => {
                    },
                    onCancel() {},
                });
                break;
            case 'tableShowFailure':
                confirm({
                    title: '你确认要启用此方案吗？',
                    onOk: () => {
                    },
                    onCancel() {},
                });
                break;
            case 'tableCancel':
                confirm({
                    title: '你确认要停用此方案吗？',
                    onOk: () => {
                    },
                    onCancel() {},
                });
                break;
            default:

                break;
        }
    }

    /**
     * 表单操作
     * @param {Object} text 当前行的值
     * @param {object} record 单行数据
     */
    renderOperation(text, record) {
        const { orderNumber } = record;
        const pathname = window.location.pathname;
        const menu = (
            <Menu>
                <Menu.Item key={0}>
                    <Link to={`${pathname}/orderDetails/${orderNumber}`}>查看订单详情</Link>
                </Menu.Item>
                <Menu.Item key="tableAudit">
                    <a target="_blank" rel="noopener noreferrer">审核</a>
                </Menu.Item>
                <Menu.Item key="tableShowFailure">
                    <a target="_blank" rel="noopener noreferrer">查看审核未通过原因</a>
                </Menu.Item>
                <Menu.Item key="tableCancel">
                    <a target="_blank" rel="noopener noreferrer">取消</a>
                </Menu.Item>
            </Menu>
        );
        return (
            <Dropdown overlay={menu} placement="bottomCenter">
                <a className="ant-dropdown-link">
                    表单操作 <Icon type="down" />
                </a>
            </Dropdown>
        )
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        columns[columns.length - 1].render = this.renderOperation;
        return (
            <div className={`${orderML}`}>
                <div className="manage-form">
                    <Form layout="inline">
                        <div className="gutter-example">
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    {/* 订单编号 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">订单编号</span>
                                            {getFieldDecorator('orderNumber')(
                                                <Input
                                                    className="input"
                                                    placeholder="订单编号"
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 订单类型 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">订单类型</span>
                                            {getFieldDecorator('orderType', {
                                                initialValue: orderTypeOptions.defaultValue
                                            })(
                                                <Select
                                                    size="default"
                                                >
                                                    {
                                                        orderTypeOptions.data.map((item) =>
                                                            (<Option
                                                                key={item.key}
                                                                value={item.key}
                                                            >
                                                                {item.value}
                                                            </Option>)
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 订单状态 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">订单状态</span>
                                            {getFieldDecorator('orderStatus', {
                                                initialValue: orderStatusOptions.defaultValue
                                            })(
                                                <Select
                                                    size="default"
                                                >
                                                    {
                                                        orderStatusOptions.data.map((item) =>
                                                            (<Option
                                                                key={item.key}
                                                                value={item.key}
                                                            >
                                                                {item.value}
                                                            </Option>)
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    {/* 支付状态 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">支付状态</span>
                                            {getFieldDecorator('payStatus', {
                                                initialValue: payStatusOptions.defaultValue
                                            })(
                                                <Select
                                                    size="default"
                                                >
                                                    {
                                                        payStatusOptions.data.map((item) =>
                                                            (<Option
                                                                key={item.key}
                                                                value={item.key}
                                                            >
                                                                {item.value}
                                                            </Option>)
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 加盟商 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">加盟商</span>
                                            <SearchMind
                                                compKey="search-mind-brand"
                                                ref={ref => { this.brandSearchMind = ref }}
                                                fetch={(value, pager) =>
                                                    this.handleTestFetch(value, pager)
                                                }
                                                onChoosed={this.handleBrandChoose}
                                                onClear={this.handleBrandClear}
                                                renderChoosedInputRaw={(data) => (
                                                    <div>{data.id} - {data.address}</div>
                                                )}
                                                pageSize={2}
                                                columns={[
                                                    {
                                                        title: 'Name',
                                                        dataIndex: 'name',
                                                        width: 150,
                                                    }, {
                                                        title: 'Address',
                                                        dataIndex: 'address',
                                                        width: 200,
                                                    }
                                                ]}
                                            />
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 子公司 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">子公司</span>
                                            <SearchMind
                                                compKey="search-mind-brand"
                                                ref={ref => { this.brandSearchMind = ref }}
                                                fetch={(value, pager) =>
                                                    this.handleTestFetch(value, pager)
                                                }
                                                onChoosed={this.handleBrandChoose}
                                                onClear={this.handleBrandClear}
                                                renderChoosedInputRaw={(data) => (
                                                    <div>{data.id} - {data.address}</div>
                                                )}
                                                pageSize={2}
                                                columns={[
                                                    {
                                                        title: 'Name',
                                                        dataIndex: 'name',
                                                        width: 150,
                                                    }, {
                                                        title: 'Address',
                                                        dataIndex: 'address',
                                                        width: 200,
                                                    }
                                                ]}
                                            />
                                        </div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    {/* 收货人电话 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">收货人电话</span>
                                            {getFieldDecorator('consigneePhone')(
                                                <Input
                                                    className="input"
                                                    placeholder="收货人电话"
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 物流状态 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">物流状态</span>
                                            {getFieldDecorator('logisticsStatus', {
                                                initialValue: logisticsStatusOptions.defaultValue
                                            })(
                                                <Select
                                                    size="default"
                                                >
                                                    {
                                                        logisticsStatusOptions.data.map((item) =>
                                                            (<Option
                                                                key={item.key}
                                                                value={item.key}
                                                            >
                                                                {item.value}
                                                            </Option>)
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 收货人电话 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">收货人电话</span>
                                            <RangePicker
                                                style={{width: '240px'}}
                                                className="manage-form-enterTime"
                                                showTime
                                                value={this.state.rengeTime}
                                                format="YYYY-MM-DD HH:mm:ss"
                                                placeholder={['开始时间', '结束时间']}
                                                onChange={this.onEnterTimeChange}
                                            />
                                        </div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    <FormItem>
                                        <Button
                                            size="default"
                                            onClick={this.handleNationalDownSold}
                                        >批量审核</Button>
                                    </FormItem>
                                    <FormItem>
                                        <Button
                                            size="default"
                                            onClick={this.handleNationalUpSold}
                                        >批量取消</Button>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8} offset={8}>
                                    <FormItem>
                                        <Button
                                            size="default"
                                            type="primary"
                                            onClick={this.handleNationalDownSold}
                                        >查询</Button>
                                    </FormItem>
                                    <FormItem>
                                        <Button
                                            size="default"
                                            onClick={this.handleNationalUpSold}
                                        >重置</Button>
                                    </FormItem>
                                    <FormItem>
                                        <Button
                                            size="default"
                                            onClick={this.handleNationalUpSold}
                                        >导出</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </div>
                <div className="area-list">
                    <Table
                        dataSource={datas}
                        columns={columns}
                        rowSelection={this.rowSelection}
                        rowKey="orderNumber"
                    />
                </div>
            </div>
        );
    }
}

OrderManagementList.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
}

OrderManagementList.defaultProps = {
}

export default withRouter(Form.create()(OrderManagementList));
