/**
 * @file App.jsx
 * @author caoyanxuan
 *
 * 供应商结算
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Form, Input, Button, Row, Col,
    Select, DatePicker
} from 'antd';
import moment from 'moment';
import Utils from '../../../util/util';
import SearchMind from '../../../components/searchMind';
import {
    orderTypeOptions,
    orderStatusOptions,
    payStatusOptions,
    logisticsStatusOptions
} from '../../../constant/searchParams';
import { exportOrderList } from '../../../service';
import { fetchOrderList } from '../../../actions/order';
import { pubFetchValueList } from '../../../actions/pub';
import { DATE_FORMAT, PAGE_SIZE } from '../../../constant/index';

const FormItem = Form.Item;
const Option = Select.Option;
const orderML = 'order-management';
const { RangePicker } = DatePicker;
const yesterdayDate = moment().subtract(1, 'days').valueOf().toString();
const todayDate = moment().valueOf().toString();
const yesterdayrengeDate = [moment().subtract(1, 'days'), moment()];

@connect(
    state => ({
        orderListData: state.toJS().order.orderListData,
    }),
    dispatch => bindActionCreators({
        fetchOrderList,
        pubFetchValueList,
    }, dispatch)
)
class OrderManagementList extends Component {
    constructor(props) {
        super(props);
        this.onEnterTimeChange = :: this.onEnterTimeChange;
        this.renderOperation = :: this.renderOperation;
        this.handleOrderBatchReview = :: this.handleOrderBatchReview;
        this.handleOrderBatchCancel = :: this.handleOrderBatchCancel;
        this.handleOrderSearch = :: this.handleOrderSearch;
        this.handleOrderReset = :: this.handleOrderReset;
        this.handleOrderOutput = :: this.handleOrderOutput;
        this.handleJoiningChoose = :: this.handleJoiningChoose;
        this.handleSubCompanyChoose = :: this.handleSubCompanyChoose;
        this.handleJoiningClear = :: this.handleJoiningClear;
        this.handleSubCompanyClear = :: this.handleSubCompanyClear;
        this.handlePaginationChange = :: this.handlePaginationChange;
        this.orderTypeSelect = :: this.orderTypeSelect;
        this.getSearchData = :: this.getSearchData;
        this.joiningSearchMind = null;
        this.subCompanySearchMind = null;
        this.searchData = {};
        this.current = 1;
        this.state = {
            choose: [],
            franchiseeId: null,
            branchCompanyId: null,
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
        } = this.props.form.getFieldsValue();

        const { franchiseeId, branchCompanyId } = this.state;
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
            branchCompanyId,
            submitStartTime,
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
     * 子公司-值清单
     */
    handleSubCompanyChoose = ({ record }) => {
        this.setState({
            branchCompanyId: record.id,
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
     * 子公司-清除
     */
    handleSubCompanyClear() {
        this.setState({
            branchCompanyId: null,
        });
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
        this.subCompanySearchMind.handleClear();
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

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={orderML}>
                <div className="manage-form">
                    <Form layout="inline">
                        <div className="gutter-example">
                            <Row gutter={16}>
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
                            </Row>
                            <Row gutter={16}>
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
                                    {/* 子公司 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">子公司</span>
                                            <SearchMind
                                                compKey="search-mind-sub-company"
                                                ref={ref => { this.subCompanySearchMind = ref }}
                                                fetch={(params) =>
                                                    this.props.pubFetchValueList({
                                                        branchCompanyId: !(isNaN(parseFloat(params.value))) ? params.value : '',
                                                        branchCompanyName: isNaN(parseFloat(params.value)) ? params.value : ''
                                                    }, 'findCompanyBaseInfo')
                                                }
                                                onChoosed={this.handleSubCompanyChoose}
                                                onClear={this.handleSubCompanyClear}
                                                renderChoosedInputRaw={(row) => (
                                                    <div>{row.id}</div>
                                                )}
                                                pageSize={6}
                                                columns={[
                                                    {
                                                        title: '子公司id',
                                                        dataIndex: 'id',
                                                        width: 98
                                                    }, {
                                                        title: '子公司名字',
                                                        dataIndex: 'name',
                                                        width: 140
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
                                            {getFieldDecorator('cellphone', {
                                                rules: [{
                                                    max: 10,
                                                    message: '不能输入超过10个字'
                                                }]
                                            })(
                                                <Input
                                                    maxLength={11}
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
                            </Row>
                            <Row gutter={16}>
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
            </div>
        );
    }
}

OrderManagementList.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    fetchOrderList: PropTypes.func,
    pubFetchValueList: PropTypes.func,
}

OrderManagementList.defaultProps = {
}

export default withRouter(Form.create()(OrderManagementList));
