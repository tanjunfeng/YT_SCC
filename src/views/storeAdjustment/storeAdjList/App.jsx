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
import Utils from '../../../util/util';
import SearchMind from '../../../components/searchMind';
import {
    StoreStatus,
    adjustmentType,
} from '../../../constant/searchParams';
import { exportStoreAdList } from '../../../service';
import { pubFetchValueList } from '../../../actions/pub';
import { storeAdList } from '../../../actions/storeAdjustList'
import { DATE_FORMAT, PAGE_SIZE } from '../../../constant/index';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const columns = [{
    title: '单据编号',
    dataIndex: 'id',
    key: 'id',
}, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
        switch (text) {
            case 0:
                return '制单';
            case 1:
                return '生效';
            default:
                return '';
        }
    }
}, {
    title: '调整地点',
    dataIndex: 'warehouseName',
    key: 'warehouseName',
}, {
    title: '调整数量合计',
    dataIndex: 'totalQuantity',
    key: 'totalQuantity',
}, {
    title: '调整成本额合计',
    dataIndex: 'totalAdjustmentCost',
    key: 'totalAdjustmentCost',
}, {
    title: '外部单据号',
    dataIndex: 'externalBillNo',
    key: 'externalBillNo',
}, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
}];

@connect(
    state => ({
        storeAdjustData: state.toJS().storeAdjustList.storeAdjustData,
    }),
    dispatch => bindActionCreators({
        storeAdList,
        pubFetchValueList,
    }, dispatch)
)
class StoreAdjList extends Component {
    constructor(props) {
        super(props);
        this.onEnterTimeChange = :: this.onEnterTimeChange;
        this.onEnterTime = :: this.onEnterTime;
        this.renderOperation = :: this.renderOperation;
        this.handleOrderSearch = :: this.handleOrderSearch;
        this.handleOrderReset = :: this.handleOrderReset;
        this.handleOrderOutput = :: this.handleOrderOutput;
        this.handleJoiningChoose = :: this.handleJoiningChoose;
        this.handleSubCompanyChoose = :: this.handleSubCompanyChoose;
        this.handleJoiningClear = :: this.handleJoiningClear;
        this.handleSubCompanyClear = :: this.handleSubCompanyClear;
        this.handlePaginationChange = :: this.handlePaginationChange;
        this.getSearchData = :: this.getSearchData;
        this.joiningSearchMind = null;
        this.subCompanySearchMind = null;
        this.searchData = {};
        this.current = 1;
        this.state = {
            supplierInfo: null,
            productId: null,
            warehouseCode: null,
            rengeTime: null,
            settledDate: null,
            setTime: null,
            Time: {
                adjustmentStartTime: null,
                adjustmentEndTime: null,
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
        let start = '';
        let end = '';
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
            Time: {
                adjustmentStartTime: start,
                adjustmentEndTime: end
            }
        });
    }
    /**
  * 调整日期
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
            id,
            Status,
            Type,
            externalBillNo,
        } = this.props.form.getFieldsValue();

        const { productId, warehouseCode } = this.state;
        const { adjustmentStartTime, adjustmentEndTime } = this.state.Time;
        this.current = 1;
        this.searchData = {
            id,
            status: Status,
            adjustmentTime: this.state.settledDate,
            type: Type,
            warehouseCode,
            productId,
            externalBillNo,
            adjustmentStartTime,
            adjustmentEndTime,
            pageSize: PAGE_SIZE,
        }
        const searchData = this.searchData;
        searchData.pageNum = 1;
        this.props.storeAdList({
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
        searchData.pageNum = goto;
        this.props.storeAdList({
            ...Utils.removeInvalid(searchData)
        })
    }

    /**
     * 调整仓库-值清单
     */
    handleJoiningChoose = ({ record }) => {
        this.setState({
            warehouseCode: record.warehouseCode,
        });
    }

    /**
     * 商品-值清单
     */
    handleSubCompanyChoose = ({ record }) => {
        this.setState({
            productId: record.productId,
        });
    }

    /**
     * 调整仓库-清除
     */
    handleJoiningClear() {
        this.setState({
            warehouseCode: null,
        });
    }

    /**
     * 商品-清除
     */
    handleSubCompanyClear() {
        this.setState({
            productId: null,
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
            rengeTime: null,
            setTime: null,
            settledDate: null,
            Time: {
                submitStartTime: null,
                submitEndTime: null,
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
        Utils.exportExcel(exportStoreAdList, Utils.removeInvalid(searchData));
    }

    /**
     * 表单操作
     * @param {Object} text 当前行的值
     * @param {object} record 单行数据
     */
    renderOperation(text, record) {
        const { id } = record;
        const pathname = window.location.pathname;
        return (
            <Link to={`${pathname}/itemDetail/${id}`}>查看详情</Link>
        )
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { storeAdjustData } = this.props;
        const { data } = storeAdjustData;
        columns[columns.length - 1].render = this.renderOperation;
        return (
            <div className="store-adj-list">
                <Form>
                    <Row>
                        <Col>
                            {/* 单据编号 */}
                            <FormItem label="单据编号">
                                {getFieldDecorator('id', {
                                    rules: [{ max: 10, message: '不能输入超过10个字' }]
                                })(
                                    <Input
                                        placeholder="单据编号"
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 状态 */}
                            <FormItem label="状态">
                                {getFieldDecorator('Status', {
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
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 调整日期 */}
                            <FormItem label="调整日期">
                                <DatePicker
                                    value={this.state.setTime}
                                    placeholder={'调整日期'}
                                    onChange={this.onEnterTime}
                                />
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 调整类型 */}
                            <FormItem label="调整类型">
                                {getFieldDecorator('Type', {
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
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 调整仓库 */}
                            <FormItem label="调整库存" className="labelTop">
                                <SearchMind
                                    rowKey="franchiseeId"
                                    compKey="search-mind-joining"
                                    ref={ref => { this.joiningSearchMind = ref }}
                                    fetch={(params) =>
                                        this.props.pubFetchValueList({
                                            param: params.value,
                                            pageNum: params.pagination.current || 1,
                                            pageSize: params.pagination.pageSize
                                        }, 'getWarehouseLogic')
                                    }
                                    onChoosed={this.handleJoiningChoose}
                                    onClear={this.handleJoiningClear}
                                    renderChoosedInputRaw={(row) => (
                                        <div>
                                            {row.warehouseCode} - {row.warehouseName}
                                        </div>
                                    )}
                                    columns={[
                                        {
                                            title: '仓库编码',
                                            dataIndex: 'warehouseCode',
                                            width: 150,
                                        }, {
                                            title: '仓库名称',
                                            dataIndex: 'warehouseName',
                                            width: 200,
                                        }
                                    ]}
                                />
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 商品 */}
                            <FormItem label="商品" className="labelTop">
                                <SearchMind
                                    compKey="search-mind-sub-company"
                                    ref={ref => { this.subCompanySearchMind = ref }}
                                    fetch={(params) =>
                                        this.props.pubFetchValueList({
                                            teamText: params.value,
                                            pageNum: params.pagination.current || 1,
                                            pageSize: params.pagination.pageSize
                                        }, 'queryProductForSelect')
                                    }
                                    onChoosed={this.handleSubCompanyChoose}
                                    onClear={this.handleSubCompanyClear}
                                    renderChoosedInputRaw={(row) => (
                                        <div>{row.saleName}</div>
                                    )}
                                    columns={[
                                        {
                                            title: '商品id',
                                            dataIndex: 'productId',
                                            width: 150,
                                        }, {
                                            title: '商品名字',
                                            dataIndex: 'saleName',
                                            width: 200,
                                        }
                                    ]}
                                />
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 外部单据号 */}
                            <FormItem label="外部单据号">
                                {getFieldDecorator('externalBillNo')(
                                    <Input
                                        placeholder="外部单据号"
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 调整日期 */}
                            <FormItem label="调整日期">
                                <RangePicker
                                    style={{ width: '240px' }}
                                    value={this.state.rengeTime}
                                    format={DATE_FORMAT}
                                    placeholder={['开始时间', '结束时间']}
                                    onChange={this.onEnterTimeChange}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16} type="flex" justify="end">
                        <Col>
                            <Button
                                size="default"
                                type="primary"
                                onClick={this.handleOrderSearch}
                            >查询</Button>
                            <Button
                                size="default"
                                onClick={this.handleOrderReset}
                            >重置</Button>
                        </Col>
                    </Row>
                </Form>
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                        current: storeAdjustData.pageNum,
                        total: storeAdjustData.total,
                        pageSize: storeAdjustData.pageSize,
                        showQuickJumper: true,
                        onChange: this.handlePaginationChange
                    }}
                />
            </div>
        );
    }
}

StoreAdjList.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    storeAdjustData: PropTypes.objectOf(PropTypes.any),
    storeAdList: PropTypes.func,
    pubFetchValueList: PropTypes.func,
}

export default withRouter(Form.create()(StoreAdjList));
