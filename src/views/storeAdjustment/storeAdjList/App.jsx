/**
 * @file App.jsx
 * @author wtt
 *
 * 库存调整列表
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Form, Input, Button, Row, Col,
    Select, Table, DatePicker
} from 'antd';
import moment from 'moment';
import Utils from '../../../util/util';
import SearchMind from '../../../components/searchMind';
import {
    StoreStatus,
    adjustmentType,
} from '../../../constant/searchParams';
import { exportStoreAdList } from '../../../service';
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

const columns = [{
    title: '单据编号',
    dataIndex: 'adjustmentNo',
    key: 'adjustmentNo',
}, {
    title: '调整地点',
    dataIndex: 'adjustAddr',
    key: 'adjustAddr',
}, {
    title: '调整数量合计',
    dataIndex: 'totalQuantity',
    key: 'totalQuantity',
}, {
    title: '调整成本合计',
    dataIndex: 'totalAdjustmentCost',
    key: 'totalAdjustmentCost',
}, {
    title: '外部单据号',
    dataIndex: 'externalBillNo',
    key: 'externalBillNo',
}, {
    title: '创建人',
    dataIndex: 'createUser',
    key: 'createUser',
}, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
}, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
}];

@connect(
    state => ({
        orderListData: state.toJS().order.orderListData,
    }),
    dispatch => bindActionCreators({
        fetchOrderList,
        pubFetchValueList,
    }, dispatch)
)
class StoreAdjList extends Component {
    constructor(props) {
        super(props);
        this.onEnterTimeChange = ::this.onEnterTimeChange;
        this.onEnterTime = ::this.onEnterTime;
        this.renderOperation = ::this.renderOperation;
        this.handleOrderSearch = ::this.handleOrderSearch;
        this.handleOrderReset = ::this.handleOrderReset;
        this.handleOrderOutput = ::this.handleOrderOutput;
        this.handleJoiningChoose = ::this.handleJoiningChoose;
        this.handleSubCompanyChoose = ::this.handleSubCompanyChoose;
        this.handleJoiningClear = ::this.handleJoiningClear;
        this.handleSubCompanyClear = ::this.handleSubCompanyClear;
        this.handlePaginationChange = ::this.handlePaginationChange;
        this.getSearchData = ::this.getSearchData;
        this.joiningSearchMind = null;
        this.subCompanySearchMind = null;
        this.searchData = {};
        this.current = 1;
        this.state = {
            franchiseeId: null,
            branchCompanyId: null,
            rengeTime: yesterdayrengeDate,
            settledDate: null,
            setTime: null,
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
     * 调整日期
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
    * 创建日期
    *
    * @param {moment} data 日期的moment对象
    * @param {string} dateString 格式化后的日期
    */
    onEnterTime(date) {
        this.setState({
            setTime: date,
            settledDate: date ? date._d * 1 : null,
        });
    }

    /**
    * 获取表单信息,并查询列表
    */
    getSearchData() {
        const {
            adjustmentNo,
            status,
            type,
            createUser,
            externalBillNo,
        } = this.props.form.getFieldsValue();

        const { franchiseeId, branchCompanyId } = this.state;
        const { submitStartTime, submitEndTime } = this.state.time;
        this.current = 1;
        this.searchData = {
            adjustmentNo,
            statustype: status === -1 ? null : status,
            type: type === 'ALL' ? null : type,
            createUser,
            externalBillNo,
            submitStartTime,
            submitEndTime,
            franchiseeId,
            branchCompanyId,
            pageSize: PAGE_SIZE,
            settledDate: this.state.settledDate
        }
        const searchData = this.searchData;
        searchData.page = 1;
        this.props.fetchOrderList({
            ...Utils.removeInvalid(searchData)
        })
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
            setTime: null,
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
        Utils.exportExcel(exportStoreAdList, Utils.removeInvalid(searchData));
    }

    /**
     * 表单操作
     * @param {Object} text 当前行的值
     * @param {object} record 单行数据
     */
    renderOperation(text, record) {
        const { adjustmentNo } = record;
        const pathname = window.location.pathname;
        return (
            <Link to={`${pathname}/orderDetails/${adjustmentNo}`}>订单详情</Link>
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
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    {/* 单据编号 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">单据编号</span>
                                            {getFieldDecorator('adjustmentNo')(
                                                <Input
                                                    className="input"
                                                    placeholder="单据编号"
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 状态 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">状态</span>
                                            {getFieldDecorator('status', {
                                                initialValue: StoreStatus.defaultValue
                                            })(
                                                <Select
                                                    size="default"
                                                >
                                                    {
                                                        StoreStatus.data.map((item) =>
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
                                    {/* 创建日期 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">创建日期</span>
                                            <DatePicker
                                                value={this.state.setTime}
                                                placeholder={'创建日期'}
                                                onChange={this.onEnterTime}
                                            />
                                        </div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    {/* 调整类型 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">调整类型</span>
                                            {getFieldDecorator('type', {
                                                initialValue: adjustmentType.defaultValue
                                            })(
                                                <Select
                                                    size="default"
                                                >
                                                    {
                                                        adjustmentType.data.map((item) =>
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
                                    {/* 调整仓库 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">调整仓库</span>
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
                                                        width: 150,
                                                    }, {
                                                        title: '加盟商名字',
                                                        dataIndex: 'franchiseeName',
                                                        width: 200,
                                                    }
                                                ]}
                                            />
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 创建人 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">创建人</span>
                                            {getFieldDecorator('createUser')(
                                                <Input
                                                    maxLength={11}
                                                    className="input"
                                                    placeholder="创建人"
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    {/* 商品 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">商品</span>
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
                                                        title: '商品id',
                                                        dataIndex: 'id',
                                                        width: 150,
                                                    }, {
                                                        title: '商品名字',
                                                        dataIndex: 'name',
                                                        width: 200,
                                                    }
                                                ]}
                                            />
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 外部单据号 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">外部单据号</span>
                                            {getFieldDecorator('externalBillNo')(
                                                <Input
                                                    maxLength={11}
                                                    className="input"
                                                    placeholder="外部单据号"
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 调整日期 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">调整日期</span>
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
                                <Col className="gutter-row" span={8} offset={16}>
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
                        dataSource={orderListData.data}
                        columns={columns}
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
            </div>
        );
    }
}

StoreAdjList.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    orderListData: PropTypes.objectOf(PropTypes.any),
    fetchOrderList: PropTypes.func,
    pubFetchValueList: PropTypes.func,
}

export default withRouter(Form.create()(StoreAdjList));
