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
import {
    Form, Input, Button, Row, Col,
    Select, Icon, Table, Menu, Dropdown,
    message, Modal, DatePicker
} from 'antd';
import moment from 'moment';
import SearchMind from '../../../components/searchMind';
import {
    orderTypeOptions,
    orderStatusOptions,
    payStatusOptions,
    logisticsStatusOptions
} from '../../../constant/searchParams';
import {fetchTest} from '../../../actions/classifiedList';
import AuditModal from './auditModal';
import { modifyAuditModalVisible } from '../../../actions/modify/modifyAuditModalVisible';

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
    logisticsStatus: '待收货',
}, {
    orderNumber: 'XXXXXXX01',
    parentOrderNumber: 'XXXXXXX',
    orderType: '加盟商',
    JoinerNumber: 'A000999',
    belongSubCompany: '四川子公司',
    orderDate: '1500876718',
    orderMoney: '￥140.00',
    orderStatus: '已取消',
    payStatus: '未支付',
    logisticsStatus: '取消送货',
}];


@connect(
    state => ({
        // ToDo：查询调接口时，需要走redux拿数据
    }),
    dispatch => bindActionCreators({
        modifyAuditModalVisible
    }, dispatch)
)
class OrderManagementList extends Component {
    constructor(props) {
        super(props);
        this.onEnterTimeChange = ::this.onEnterTimeChange;
        this.renderOperation = ::this.renderOperation;
        this.handleOrderBatchReview = ::this.handleOrderBatchReview;
        this.handleOrderBatchCancel = ::this.handleOrderBatchCancel;
        this.handleOrderSearch = ::this.handleOrderSearch;
        this.handleOrderReset = ::this.handleOrderReset;
        this.handleOrderOutput = ::this.handleOrderOutput;
        this.handleJoiningChoose = ::this.handleJoiningChoose;
        this.handleSubCompanyChoose = ::this.handleSubCompanyChoose;
        this.handleJoiningClear = ::this.handleJoiningClear;
        this.handleSubCompanyClear = ::this.handleSubCompanyClear;
        this.joiningSearchMind = null;
        this.subCompanySearchMind = null;
        this.time = {
            minSettledDate: null,
            maxSettledDate: null
        }
        this.state = {
            choose: [],
            joiningChoose: null,
            subCompanyChoose: null,
            rengeTime: null,
            auditModalVisible: false,
            tableOrderNumber: null,
        }
    }

    componentDidMount() {
    }

    /**
     * 订单日期选择
     * @param {array} result [moment, moment]
     */
    onEnterTimeChange(result) {
        this.setState({
            rengeTime: result
        });
        if (result.length === 2) {
            this.time = {
                minSettledDate: result[0].valueOf().toString(),
                maxSettledDate: result[1].valueOf().toString()
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
     * 加盟商-值清单
     */
    handleJoiningChoose = ({ record }) => {
        this.setState({
            joiningChoose: record,
        });
    }

    /**
     * 子公司-值清单
     */
    handleSubCompanyChoose = ({ record }) => {
        this.setState({
            subCompanyChoose: record,
        });
    }

    /**
     * 加盟商-清除
     */
    handleJoiningClear() {
        this.setState({
            joiningChoose: null,
        });
    }

    /**
     * 子公司-清除
     */
    handleSubCompanyClear() {
        this.setState({
            subCompanyChoose: null,
        });
    }

    /**
     * 批量审核
     */
    handleOrderBatchReview() {
        confirm({
            title: '批量审核',
            content: '确认批量审核？',
            onOk: () => {
                // ToDo:带入参数（this.state.choose），调接口
                message.success('批量审批成功！');
            },
            onCancel() {},
        });
    }

    /**
     * 批量取消
     */
    handleOrderBatchCancel() {
        confirm({
            title: '批量取消',
            content: '确认批量取消？',
            onOk: () => {
                // ToDo:带入参数（this.state.choose），调接口
                message.success('批量取消成功！');
            },
            onCancel() {},
        });
    }

    /**
     * 查询
     */
    handleOrderSearch() {
        // ToDo:发请求，查询（以下是需要的所有参数）

        // const {
        //     orderNumber,
        //     orderType,
        //     orderStatus,
        //     payStatus,
        //     consigneePhone,
        //     logisticsStatus,
        // } = this.props.form.getFieldsValue();
        // 日期对象
        // console.log(this.time)
        // 加盟商值清单数据对象
        // console.log(this.state.joiningChoose)
        // 子公司值清单数据对象
        // console.log(this.state.subCompanyChoose)
    }

    /**
     * 重置
     */
    handleOrderReset() {
        this.setState({
            rengeTime: null
        });
        this.time = {
            minSettledDate: null,
            maxSettledDate: null
        }
        this.joiningSearchMind.handleClear();
        this.subCompanySearchMind.handleClear();
        this.props.form.resetFields();
    }

    /**
     * 导出
     */
    handleOrderOutput() {
        // ToDo:导出excel
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
        const { key } = items;
        const { orderNumber } = record;
        switch (key) {
            case 'tableAudit':
                this.props.modifyAuditModalVisible({isVisible: true, record });
                break;
            case 'tableCancel':
                confirm({
                    title: '确定取消？',
                    onOk: () => {
                    },
                    onCancel() {},
                });
                break;
            case 'tableShowFailure':
                Modal.info({
                    title: '审核未通过原因',
                    content: (
                        <div>
                            <p>{orderNumber}</p>
                        </div>
                    ),
                    okText: '返回',
                    onOk() {},
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
        const { orderNumber, orderStatus, logisticsStatus } = record;
        const pathname = window.location.pathname;
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, item)}>
                <Menu.Item key={0}>
                    <Link to={`${pathname}/orderDetails/${orderNumber}`}>查看订单详情</Link>
                </Menu.Item>
                {
                    (orderStatus === '待人工审核' || orderStatus === '待审核') &&
                    <Menu.Item key="tableAudit">
                        <a target="_blank" rel="noopener noreferrer">审核</a>
                    </Menu.Item>
                }
                {
                    (logisticsStatus !== '待收货' &&
                    logisticsStatus !== '未送达' &&
                    logisticsStatus !== '已签收') &&
                    <Menu.Item key="tableCancel">
                        <a target="_blank" rel="noopener noreferrer">取消</a>
                    </Menu.Item>
                }
                {
                    orderStatus === '已取消' &&
                    <Menu.Item key="tableShowFailure">
                        <a target="_blank" rel="noopener noreferrer">查看审核未通过原因</a>
                    </Menu.Item>
                }
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
                                                compKey="search-mind-joining"
                                                ref={ref => { this.joiningSearchMind = ref }}
                                                fetch={(value, pager) =>
                                                    this.handleTestFetch(value, pager)
                                                }
                                                onChoosed={this.handleJoiningChoose}
                                                onClear={this.handleJoiningClear}
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
                                                compKey="search-mind-sub-company"
                                                ref={ref => { this.subCompanySearchMind = ref }}
                                                fetch={(value, pager) =>
                                                    this.handleTestFetch(value, pager)
                                                }
                                                onChoosed={this.handleSubCompanyChoose}
                                                onClear={this.handleSubCompanyClear}
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
                                    {/* 订单日期 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">订单日期</span>
                                            <RangePicker
                                                style={{width: '240px'}}
                                                className="manage-form-enterTime"
                                                value={this.state.rengeTime}
                                                format="YYYY-MM-DD"
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
                                            onClick={this.handleOrderBatchReview}
                                        >批量审核</Button>
                                    </FormItem>
                                    <FormItem>
                                        <Button
                                            size="default"
                                            onClick={this.handleOrderBatchCancel}
                                        >批量取消</Button>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8} offset={8}>
                                    <FormItem>
                                        <Button
                                            size="default"
                                            type="primary"
                                            onClick={this.handleOrderSearch}
                                        >查询</Button>
                                    </FormItem>
                                    <FormItem>
                                        <Button
                                            size="default"
                                            onClick={this.handleOrderReset}
                                        >重置</Button>
                                    </FormItem>
                                    <FormItem>
                                        <Button
                                            size="default"
                                            onClick={this.handleOrderOutput}
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
                <div>
                    <AuditModal />
                </div>
            </div>
        );
    }
}

OrderManagementList.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    modifyAuditModalVisible: PropTypes.func,
}

OrderManagementList.defaultProps = {
}

export default withRouter(Form.create()(OrderManagementList));
