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
import Utils from '../../../util/util';
import SearchMind from '../../../components/searchMind';
import { BranchCompany } from '../../../container/search';
import {
    orderTypeOptions,
    orderStatusOptions,
    payStatusOptions,
    logisticsStatusOptions
} from '../../../constant/searchParams';
import { exportOrderList } from '../../../service';
import CauseModal from './causeModal';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';
import {
    fetchOrderList,
    modifyBatchApproval,
    modifyResendOrder,
    modifyApprovalOrder
} from '../../../actions/order';
import { pubFetchValueList } from '../../../actions/pub';
import { DATE_FORMAT, PAGE_SIZE } from '../../../constant/index';
import { orderListColumns as columns } from '../columns';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const orderML = 'order-management';
const { RangePicker } = DatePicker;
const yesterdayDate = moment().subtract(6, 'days').valueOf().toString();
const todayDate = moment().valueOf().toString();
const yesterdayrengeDate = [moment().subtract(6, 'days'), moment()];

@connect(
    state => ({
        orderListData: state.toJS().order.orderListData,
    }),
    dispatch => bindActionCreators({
        modifyCauseModalVisible,
        fetchOrderList,
        pubFetchValueList
    }, dispatch)
)
class OrderManagementList extends Component {
    constructor(props) {
        super(props);
        this.onEnterTimeChange = ::this.onEnterTimeChange;
        this.handleOrderBatchReview = ::this.handleOrderBatchReview;
        this.handleOrderBatchCancel = ::this.handleOrderBatchCancel;
        this.handleOrderSearch = ::this.handleOrderSearch;
        this.handleOrderReset = ::this.handleOrderReset;
        this.handleOrderOutput = ::this.handleOrderOutput;
        this.handleJoiningChoose = ::this.handleJoiningChoose;
        this.handleJoiningClear = ::this.handleJoiningClear;
        this.handlePaginationChange = ::this.handlePaginationChange;
        this.orderTypeSelect = ::this.orderTypeSelect;
        this.getSearchData = ::this.getSearchData;
        this.joiningSearchMind = null;
        this.renderOperation = ::this.renderOperation;
        this.searchData = {};
        this.current = 1;
        this.state = {
            choose: [],
            franchiseeId: null,
            rengeTime: yesterdayrengeDate,
            auditModalVisible: false,
            tableOrderNumber: null,
            isPayDisabled: false,
            time: {
                submitStartTime: yesterdayDate,
                submitEndTime: todayDate,
            }
        }
    }

    componentDidMount() {
        this.getSearchData();
    }

    /**
     * 订单日期选择
     * @param {array} result [moment, moment]
     */
    onEnterTimeChange(result) {
        let start = yesterdayDate;
        let end = todayDate;
        if (result.length === 2) {
            start = result[0].valueOf().toString();
            end = result[1].valueOf().toString();
        }
        if (result.length === 0) {
            start = '';
            end = '';
        }
        this.setState({
            rengeTime: result,
            time: {
                submitStartTime: start,
                submitEndTime: end
            }
        });
    }

    /**
    * 获取表单信息,并查询列表
    */
    getSearchData() {
        const {
            id,
            orderType,
            orderState,
            paymentState,
            cellphone,
            shippingState,
            thirdPartOrderNo,
            branchCompany
        } = this.props.form.getFieldsValue();

        const { franchiseeId } = this.state;
        const { submitStartTime, submitEndTime } = this.state.time;
        this.current = 1;
        this.searchData = {
            id,
            orderState: orderState === 'ALL' ? null : orderState,
            orderType: orderType === 'ALL' ? null : orderType,
            paymentState: paymentState === 'ALL' ? null : paymentState,
            cellphone,
            shippingState: shippingState === 'ALL' ? null : shippingState,
            franchiseeId,
            branchCompanyId: branchCompany.id,
            submitStartTime,
            thirdPartOrderNo,
            submitEndTime,
            pageSize: PAGE_SIZE,
        }
        const searchData = this.searchData;
        searchData.page = 1;
        this.props.fetchOrderList({
            ...Utils.removeInvalid(searchData)
        })
    }

    /**
     * 订单类型
     */
    orderTypeSelect(value) {
        if (value === 'ZYYH') {
            this.setState({
                isPayDisabled: true
            })
        } else {
            this.setState({
                isPayDisabled: false
            })
        }
    }

    /**
     * 分页查询
     * @param {number} goto 跳转页码
     */
    handlePaginationChange(goto) {
        this.current = goto;
        const searchData = this.searchData;
        searchData.page = goto;
        this.props.fetchOrderList({
            ...Utils.removeInvalid(searchData)
        })
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
            franchiseeId: record.franchiseeId,
        });
    }

    /**
     * 加盟商-清除
     */
    handleJoiningClear() {
        this.setState({
            franchiseeId: null,
        });
    }

    /**
     * 批量审核
     */
    handleOrderBatchReview() {
        confirm({
            title: '批量审核',
            content: '确认批量审核通过？',
            onOk: () => {
                // ToDo:带入参数（this.state.choose），调接口
                modifyBatchApproval(
                    this.state.choose
                ).then(() => {
                    message.success('批量审批成功！');
                    this.getSearchData();
                })
            },
            onCancel() { },
        });
    }

    /**
     * 批量取消
     */
    handleOrderBatchCancel() {
        const { choose } = this.state;
        this.props.modifyCauseModalVisible({ isShow: true, choose });
    }

    /**
     * 查询
     */
    handleOrderSearch() {
        this.getSearchData();
    }

    /**
     * 重置
     */
    handleOrderReset() {
        this.setState({
            rengeTime: yesterdayrengeDate,
            isPayDisabled: false,
            time: {
                submitStartTime: yesterdayDate,
                submitEndTime: todayDate,
            }
        });
        this.joiningSearchMind.handleClear();
        this.props.form.resetFields();
    }

    /**
     * 导出
     */
    handleOrderOutput() {
        const searchData = this.searchData;
        searchData.page = this.current;
        Utils.exportExcel(exportOrderList, Utils.removeInvalid(searchData));
    }

    // 选择操作项
    handleSelect(record, items) {
        const { key } = items;
        const { cancelReason, id } = record;
        switch (key) {
            case 'tableAudit':
                confirm({
                    title: '审核',
                    content: '确认审核通过？',
                    onOk: () => {
                        modifyApprovalOrder({
                            id
                        }).then(res => {
                            this.getSearchData();
                            message.success(res.message);
                        })
                    },
                    onCancel() { }
                });
                break;
            case 'tableCancel':
                this.props.modifyCauseModalVisible({ isShow: true, id })
                break;
            case 'tableRetransfer':
                modifyResendOrder({
                    id: record.id
                }).then(res => {
                    this.getSearchData();
                    message.success(res.message);
                })
                break;
            case 'tableShowFailure':
                Modal.info({
                    title: '取消原因',
                    content: (
                        <div>
                            <p>{cancelReason}</p>
                        </div>
                    ),
                    okText: '返回',
                    onOk() { }
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
        const { id, orderStateDesc, shippingStateDesc } = record;
        const pathname = window.location.pathname;
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, item)}>
                <Menu.Item key="detail">
                    <a target="_blank" href={`${pathname}/orderDetails/${id}`}>查看订单详情</a>
                </Menu.Item>
                {
                    (orderStateDesc === '待审核'
                        || orderStateDesc === '待人工审核')
                    && <Menu.Item key="tableAudit">
                        <a target="_blank" rel="noopener noreferrer">审核</a>
                    </Menu.Item>
                }
                {
                    shippingStateDesc !== '待收货'
                    && shippingStateDesc !== '已签收'
                    && orderStateDesc !== '已取消'
                    && <Menu.Item key="tableCancel">
                        <a target="_blank" rel="noopener noreferrer">取消</a>
                    </Menu.Item>
                }
                {
                    orderStateDesc === '已取消'
                    && <Menu.Item key="tableShowFailure">
                        <a target="_blank" rel="noopener noreferrer">查看取消原因</a>
                    </Menu.Item>
                }
                {
                    (shippingStateDesc === '仓库拒收' || shippingStateDesc === '未传送')
                    && <Menu.Item key="tableRetransfer">
                        <a target="_blank" rel="noopener noreferrer">重新传送</a>
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
        const { orderListData } = this.props;
        columns[columns.length - 1].render = this.renderOperation;
        return (
            <div className={orderML}>
                <div className="manage-form">
                    <Form layout="inline">
                        <div className="gutter-example">
                            <Row>
                                <Col className="gutter-row" span={8}>
                                    {/* 订单编号 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">订单编号</span>
                                            {getFieldDecorator('id')(
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
                                                    onChange={this.orderTypeSelect}
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
                                            {getFieldDecorator('orderState', {
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
                                <Col className="gutter-row" span={8}>
                                    {/* 支付状态 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">支付状态</span>
                                            {getFieldDecorator('paymentState', {
                                                initialValue: payStatusOptions.defaultValue
                                            })(
                                                <Select
                                                    size="default"
                                                    disabled={this.state.isPayDisabled}
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
                                                rowKey="franchiseeId"
                                                compKey="search-mind-joining"
                                                ref={ref => { this.joiningSearchMind = ref }}
                                                fetch={(params) =>
                                                    this.props.pubFetchValueList({
                                                        param: params.value,
                                                        pageNum: params.pagination.current || 1,
                                                        pageSize: params.pagination.pageSize
                                                    }, 'getFranchiseeInfo')
                                                }
                                                onChoosed={this.handleJoiningChoose}
                                                onClear={this.handleJoiningClear}
                                                renderChoosedInputRaw={(row) => (
                                                    <div>
                                                        {row.franchiseeId} - {row.franchiseeName}
                                                    </div>
                                                )}
                                                pageSize={6}
                                                columns={[
                                                    {
                                                        title: '加盟商id',
                                                        dataIndex: 'franchiseeId',
                                                        width: 98
                                                    }, {
                                                        title: '加盟商名字',
                                                        dataIndex: 'franchiseeName',
                                                        width: 140
                                                    }
                                                ]}
                                            />
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">子公司</span>
                                            {getFieldDecorator('branchCompany', {
                                                initialValue: { id: '', name: '' }
                                            })(<BranchCompany />)}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 收货人电话 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">收货人电话</span>
                                            {getFieldDecorator('cellphone', {
                                                rules: [{ validator: Utils.validatePhone }]
                                            })(
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
                                            {getFieldDecorator('shippingState', {
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
                                                style={{ width: '240px' }}
                                                className="manage-form-enterTime"
                                                value={this.state.rengeTime}
                                                format={DATE_FORMAT}
                                                placeholder={['开始时间', '结束时间']}
                                                onChange={this.onEnterTimeChange}

                                            />
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 电商订单编号 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">电商订单编号</span>
                                            {getFieldDecorator('thirdPartOrderNo')(
                                                <Input
                                                    className="input"
                                                    placeholder="请输入电商订单编号"
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row type="flex" justify="end">
                                <Col className="tr">
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
                            <Row>
                                <Col className="gutter-row" span={8}>
                                    <FormItem>
                                        <Button
                                            size="default"
                                            disabled={this.state.choose.length === 0}
                                            onClick={this.handleOrderBatchReview}
                                        >批量审核</Button>
                                    </FormItem>
                                    <FormItem>
                                        <Button
                                            size="default"
                                            disabled={this.state.choose.length === 0}
                                            onClick={this.handleOrderBatchCancel}
                                        >批量取消</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </div>
                <div className="area-list">
                    <Table
                        dataSource={orderListData.data}
                        columns={columns}
                        rowSelection={this.rowSelection}
                        rowKey="id"
                        pagination={{
                            current: orderListData.pageNum,
                            total: orderListData.total,
                            pageSize: orderListData.pageSize,
                            showQuickJumper: true,
                            onChange: this.handlePaginationChange
                        }}
                    />
                </div>
                <div>
                    <CauseModal getSearchData={this.getSearchData} />
                </div>
            </div>
        );
    }
}

OrderManagementList.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    orderListData: PropTypes.objectOf(PropTypes.any),
    modifyCauseModalVisible: PropTypes.func,
    fetchOrderList: PropTypes.func,
    pubFetchValueList: PropTypes.func
}

OrderManagementList.defaultProps = {
}

export default withRouter(Form.create()(OrderManagementList));
