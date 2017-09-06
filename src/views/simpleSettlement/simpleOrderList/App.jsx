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
    Select, Icon, Menu, Dropdown,
    message, Modal, DatePicker
} from 'antd';
import moment from 'moment';
import Util from '../../../util/util';
import SearchMind from '../../../components/searchMind';
import {
    payStatusOptions,
    logisticsStatusOptions
} from '../../../constant/searchParams';
import { exportOrderList } from '../../../service';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';
import { fetchOrderList, modifyBatchApproval, modifyResendOrder, modifyApprovalOrder } from '../../../actions/order';
import { pubFetchValueList } from '../../../actions/pub';
import { DATE_FORMAT, PAGE_SIZE } from '../../../constant/index';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
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
        modifyCauseModalVisible,
        fetchOrderList,
        pubFetchValueList,
    }, dispatch)
)
class SimpleOrderList extends Component {
    constructor(props) {
        super(props);
        this.onEnterTimeChange = ::this.onEnterTimeChange;
        this.handleOrderBatchReview = ::this.handleOrderBatchReview;
        this.handleOrderBatchCancel = ::this.handleOrderBatchCancel;
        this.handleOrderSearch = ::this.handleOrderSearch;
        this.handleOrderReset = ::this.handleOrderReset;
        this.handleOrderOutput = ::this.handleOrderOutput;
        this.handleJoiningChoose = ::this.handleJoiningChoose;
        this.handleSubCompanyChoose = ::this.handleSubCompanyChoose;
        this.handleJoiningClear = ::this.handleJoiningClear;
        this.handleSubCompanyClear = ::this.handleSubCompanyClear;
        this.handlePaginationChange = ::this.handlePaginationChange;
        this.orderTypeSelect = ::this.orderTypeSelect;
        this.getSearchData = ::this.getSearchData;
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
            ...Util.removeInvalid(searchData)
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
            ...Util.removeInvalid(searchData)
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
        this.subCompanySearchMind.handleClear();
        this.props.form.resetFields();
    }

    /**
     * 导出
     */
    handleOrderOutput() {
        const searchData = this.searchData;
        searchData.page = this.current;
        Util.exportExcel(exportOrderList, Util.removeInvalid(searchData));
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
                        }).catch(err => {
                            message.success(err.message);
                        })
                    },
                    onCancel() { }
                });
                break;
            case 'tableCancel':
                this.props.modifyCauseModalVisible({ isShow: true, id });
                break;
            case 'tableRetransfer':
                modifyResendOrder({
                    id: record.id
                }).then(res => {
                    this.getSearchData();
                    message.success(res.message);
                }).catch(err => {
                    message.success(err.message);
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

    render() {
        const { getFieldDecorator } = this.props.form;
        const { prefixCls } = this.props;
        return (
            <div className={orderML}>
                <div className="manage-form">
                    <Form layout="inline">
                        <div className="gutter-example">
                            <Row gutter={16}>
                                <Col className="gutter-row" span={8}>
                                    {/* 订单日期 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">收货日期</span>
                                            {getFieldDecorator('zxxzs', {
                                                rules: [{ required: true, message: '请选择收货日期' }]
                                            })(
                                                <RangePicker
                                                    style={{ width: '240px' }}
                                                    className="manage-form-enterTime"
                                                    value={this.state.rengeTime}
                                                    format={DATE_FORMAT}
                                                    placeholder={['开始时间', '结束时间']}
                                                    onChange={this.onEnterTimeChange}
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 供应商 */}
                                    <FormItem>
                                        <span className="sc-form-item-label">供应商</span>
                                        <span className={`${prefixCls}-data-pic`}>
                                            <SearchMind
                                                style={{ zIndex: 9 }}
                                                compKey="search-mind-key1"
                                                ref={ref => { this.searchMind1 = ref }}
                                                onChoosed={this.handleSupplyChoose}
                                                onClear={this.handleSupplierClear}
                                                fetch={(params) => this.props.pubFetchValueList({
                                                    condition: params.value,
                                                    pageSize: params.pagination.pageSize,
                                                    pageNum: params.pagination.current || 1
                                                }, 'supplierSearchBox')}
                                                renderChoosedInputRaw={(row) => (
                                                    <div>{row.spNo} - {row.companyName}</div>
                                                )}
                                                pageSize={6}
                                                columns={[
                                                    {
                                                        title: '供应商编码',
                                                        dataIndex: 'spNo',
                                                        width: 98
                                                    }, {
                                                        title: '供应商名称',
                                                        dataIndex: 'companyName'
                                                    }
                                                ]}
                                            />
                                        </span>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 供应商地点 */}
                                    <FormItem>
                                        <span className="sc-form-item-label">供应商地点</span>
                                        <span className={`${prefixCls}-data-pic`}>
                                            <SearchMind
                                                style={{ zIndex: 9 }}
                                                compKey="search-mind-key2"
                                                ref={ref => { this.searchMind2 = ref }}
                                                fetch={(params) =>
                                                this.props.pubFetchValueList(Util.removeInvalid({
                                                    condition: params.value,
                                                    pageSize: params.pagination.pageSize,
                                                    pageNum: params.pagination.current || 1
                                                }), 'supplierAdrSearchBox').then((res) => {
                                                    const dataArr = res.data.data || [];
                                                    if (!dataArr || dataArr.length === 0) {
                                                        message.warning('没有可用的数据');
                                                    }
                                                    return res;
                                                })}
                                                onChoosed={this.handleAdressChoose}
                                                onClear={this.handleAdressClear}
                                                renderChoosedInputRaw={(res) => (
                                                    <div>{res.providerNo} - {res.providerName}</div>
                                                )}
                                                pageSize={6}
                                                columns={[
                                                    {
                                                        title: '供应商地点编码',
                                                        dataIndex: 'providerNo',
                                                        width: 98
                                                    }, {
                                                        title: '供应商地点名称',
                                                        dataIndex: 'providerName'
                                                    }
                                                ]}
                                            />
                                        </span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col className="gutter-row" span={8} style={{paddingRight: 8}}>
                                    {/* 账期 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">账期</span>
                                            {getFieldDecorator('paymentState', {
                                                initialValue: payStatusOptions.defaultValue,
                                                rules: [{ required: true, message: '请选择账期' }]
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
                                <Col className="gutter-row" span={8} style={{paddingRight: 8, paddingLeft: 8}}>
                                    {/* 子公司 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">子公司</span>
                                            <SearchMind
                                                style={{ zIndex: 8 }}
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
                                                        dataIndex: 'name'
                                                    }
                                                ]}
                                            />
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8} style={{paddingRight: 8, paddingLeft: 8}}>
                                    {/* 收货人电话 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">收货人电话</span>
                                            {getFieldDecorator('cellphone')(
                                                <Input
                                                    maxLength={11}
                                                    className="input"
                                                    placeholder="收货人电话"
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={8}>
                                <Col className="gutter-row" span={8} offset={16}>
                                    <FormItem>
                                        <Button
                                            size="default"
                                            onClick={this.handleOrderOutput}
                                        >下载供应商结算数据</Button>
                                    </FormItem>
                                    <FormItem>
                                        <Button
                                            size="default"
                                            onClick={this.handleOrderReset}
                                        >重置</Button>
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

SimpleOrderList.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    modifyCauseModalVisible: PropTypes.func,
    fetchOrderList: PropTypes.func,
    pubFetchValueList: PropTypes.func,
    prefixCls: PropTypes.string,
}

SimpleOrderList.defaultProps = {
    prefixCls: 'SimpleOrderList'
}

export default withRouter(Form.create()(SimpleOrderList));
