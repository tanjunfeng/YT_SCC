/*
 * @Author: tanjf
 * @Description: 加盟商结算
 * @CreateDate: 2017-09-06 17:53:59
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-09-19 17:58:49
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Form, Input, Button, Row, Col, Checkbox, DatePicker
} from 'antd';
import moment from 'moment';
import Util from '../../../util/util';
import SearchMind from '../../../components/searchMind';
import { exportFranchiseeList, exportPaymentList } from '../../../service';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';
import { pubFetchValueList } from '../../../actions/pub';
import { DATE_FORMAT } from '../../../constant/index';

const FormItem = Form.Item;
const orderML = 'order-management';
const { RangePicker } = DatePicker;
const yesterdayDate = moment().subtract(1, 'days').valueOf().toString();
const todayDate = moment().valueOf().toString();
const yesterdayrengeDate = [moment().subtract(1, 'days'), moment()];
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['已付款', '已退款'];
const defaultCheckedList = ['已付款'];

@connect(
    state => ({
        orderListData: state.toJS().order.orderListData
    }),
    dispatch => bindActionCreators({
        modifyCauseModalVisible,
        pubFetchValueList,
    }, dispatch)
)
class FranchiseeSettlement extends Component {
    constructor(props) {
        super(props);
        this.onCompleteTimeChange = this.onCompleteTimeChange.bind(this);
        this.onPayTimeChange = this.onPayTimeChange.bind(this);
        this.onRefundTimeChange = this.onRefundTimeChange.bind(this);
        this.handleOrderReset = this.handleOrderReset.bind(this);
        this.handlePaymentOutput = this.handlePaymentOutput.bind(this);
        this.handleOrderOutput = this.handleOrderOutput.bind(this);
        this.handleJoiningChoose = this.handleJoiningChoose.bind(this);
        this.handleJoiningClear = this.handleJoiningClear.bind(this);
        this.handleSubCompanyChoose = this.handleSubCompanyChoose.bind(this);
        this.handleSubCompanyClear = this.handleSubCompanyClear.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.getSearchData = this.getSearchData.bind(this);
        this.onChange = this.onChange.bind(this);
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
            isChecked: true,
            value1: 1,
            value2: 0,
            completeDateStart: '',
            completeDateEnd: '',
            payDateStart: '',
            payDateEnd: '',
            refundDateStart: '',
            refundDateEnd: '',
            checkedList: defaultCheckedList,
            indeterminate: true,
            checkAll: false,
            mustData: true,
            isPay: '1',
            isRef: '0'
        }
    }

    componentDidMount() {
        this.getSearchData();
    }

    /**
     * 签收日期选择
     * @param {array} result [moment, moment]
     */
    onCompleteTimeChange(result) {
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
            completeDateStart: start,
            completeDateEnd: end
        });
    }
    /**
     * 付款日期选择
     * @param {array} result [moment, moment]
     */
    onPayTimeChange(result) {
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
            payDateStart: start,
            payDateEnd: end
        });
    }
    /**
     * 退款日期选择
     * @param {array} result [moment, moment]
     */
    onRefundTimeChange(result) {
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
            refundDateStart: start,
            refundDateEnd: end
        });
    }

    onChange = (checkedList) => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
            checkAll: checkedList.length === plainOptions.length,
        });
    }

    /**
    * 获取表单信息,并查询列表
    */
    getSearchData() {
        const {
            orderId,
        } = this.props.form.getFieldsValue();
        const { franchiseeId, branchCompanyId, checkedList,
            completeDateStart, completeDateEnd, payDateStart,
            payDateEnd, refundDateStart, refundDateEnd } = this.state;
        this.current = 1;
        this.searchData = {
            isPayState: (checkedList.length === 1 &&
                checkedList[0] === '已付款') || checkedList.length === 2 ? 1 : 0,
            isRefound: (checkedList.length === 1 &&
                checkedList[0] === '已退款') || checkedList.length === 2 ? 1 : 0,
            orderId,
            franchiseeId,
            branchCompanyId,
            completeDateStart,
            completeDateEnd,
            payDateStart,
            payDateEnd,
            refundDateStart,
            refundDateEnd,
            page: this.current,
            pageSize: 2000,
        }
        const searchData = Util.removeInvalid(this.searchData);
        searchData.page = 1;
    }

    /**
     * 分页查询
     * @param {number} goto 跳转页码
     */
    handlePaginationChange(goto) {
        this.current = goto;
        const searchData = this.searchData;
        searchData.page = goto;
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
     * 供应商地点-清除
     */
    handleAdressClear() {
        this.setState({
            supplierAddNo: null,
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
     * 重置
     */
    handleOrderReset() {
        this.setState({
            rengeTime: yesterdayrengeDate,
            completeDateStart: '',
            completeDateEnd: '',
            payDateStart: '',
            payDateEnd: '',
            refundDateStart: '',
            refundDateEnd: '',
        });
        this.joiningSearchMind.handleClear();
        this.subCompanySearchMind.handleClear();
        this.props.form.resetFields();
    }

    /**
     * 下载加盟商结算数据
     */
    handleOrderOutput() {
        const {
            completeDate,
        } = this.props.form.getFieldsValue();
        if (!completeDate) {
            this.props.form.setFields({
                completeDate: {
                    errors: [new Error('请选择签收日期')],
                },
            });
        }
        if (completeDate) {
            this.getSearchData();
            const searchData = Util.removeInvalid(this.searchData);
            searchData.page = this.current;
            this.props.form.validateFields((err) => {
                if (!err) {
                    Util.exportExcel(exportFranchiseeList, Util.removeInvalid(searchData));
                }
            })
            this.props.form.setFields({
                completeDate: {}
            });
        }
    }

    /**
     * 下载加盟商支付数据
     */
    handlePaymentOutput() {
        const {
            payDate,
            refundDate
        } = this.props.form.getFieldsValue();
        if (!payDate && !refundDate) {
            this.props.form.setFields({
                payDate: {
                    errors: [new Error('请选择付款日期(或)')],
                },
                refundDate: {
                    errors: [new Error('请选择退款日期(或)')],
                },
            });
        }
        if (payDate || refundDate) {
            this.getSearchData();
            const searchData = Util.removeInvalid(this.searchData);
            searchData.page = this.current;
            this.props.form.validateFields((err) => {
                if (!err) {
                    Util.exportExcel(exportPaymentList, Util.removeInvalid(searchData));
                }
            })
            this.props.form.setFields({
                payDate: {},
                refundDate: {},
            });
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={orderML}>
                <div className="manage-form">
                    <Form layout="inline">
                        <div className="gutter-example">
                            <Row gutter={24}>
                                <Col className="gutter-row franchiseeSettlement-errPlace" span={8}>
                                    {/* 签收日期 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">签收日期</span>
                                            {getFieldDecorator('completeDate')(
                                                <RangePicker
                                                    style={{ width: '240px' }}
                                                    className="manage-form-enterTime"
                                                    format={DATE_FORMAT}
                                                    placeholder={['开始时间', '结束时间']}
                                                    onChange={this.onCompleteTimeChange}
                                                    id="completeDate"
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row franchiseeSettlement-errPlace" span={8}>
                                    {/* 付款日期 */}
                                    <FormItem>
                                        <div className="franchiseeSettlement-errPlace">
                                            <span className="sc-form-item-label">付款日期</span>
                                            {getFieldDecorator('payDate', {
                                                initialValue: ''
                                            })(
                                                <RangePicker
                                                    style={{ width: '240px' }}
                                                    className="manage-form-enterTime"
                                                    format={DATE_FORMAT}
                                                    placeholder={['开始时间', '结束时间']}
                                                    onChange={this.onPayTimeChange}
                                                />
                                                )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row franchiseeSettlement-errPlace" span={8}>
                                    {/* 退款日期 */}
                                    <FormItem>
                                        <div className="franchiseeSettlement-errPlace">
                                            <span className="sc-form-item-label">退款日期</span>
                                            {getFieldDecorator('refundDate', {
                                                initialValue: ''
                                            })(
                                                <RangePicker
                                                    style={{ width: '240px' }}
                                                    className="manage-form-enterTime"
                                                    format={DATE_FORMAT}
                                                    placeholder={['开始时间', '结束时间']}
                                                    onChange={this.onRefundTimeChange}
                                                />
                                                )}
                                        </div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24}>
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
                                <Col className="gutter-row  franchiseeSettlement-gutter-Row" span={8}>
                                    {/* 子公司 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">子公司</span>
                                            <SearchMind
                                                style={{ zIndex: 8 }}
                                                compKey="spId"
                                                ref={ref => { this.subCompanySearchMind = ref }}
                                                fetch={(params) =>
                                                    this.props.pubFetchValueList({
                                                        branchCompanyId:
                                                        !(isNaN(parseFloat(params.value))) ?
                                                            params.value : '',
                                                        branchCompanyName:
                                                        isNaN(parseFloat(params.value)) ?
                                                            params.value : ''
                                                    }, 'findCompanyBaseInfo')
                                                }
                                                onChoosed={this.handleSubCompanyChoose}
                                                onClear={this.handleSubCompanyClear}
                                                renderChoosedInputRaw={(row) => (
                                                    <div>{row.id} - {row.name}</div>
                                                )}
                                                pageSize={6}
                                                columns={[
                                                    {
                                                        title: '子公司id',
                                                        dataIndex: 'id',
                                                        width: 100,
                                                    }, {
                                                        title: '子公司名字',
                                                        dataIndex: 'name',
                                                    }
                                                ]}
                                            />
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row franchiseeSettlement-gutter-row" span={8}>
                                    {/* 已支付、已退款 */}
                                    <CheckboxGroup
                                        options={plainOptions}
                                        value={this.state.checkedList}
                                        onChange={this.onChange}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col
                                    className="gutter-row"
                                    span={8}
                                    style={{ paddingRight: 8, paddingLeft: 8 }}
                                >
                                    {/* 采购订单 */}
                                    <FormItem>
                                        <div>
                                            <span
                                                className="sc-form-item-label"
                                                style={{ marginLeft: 5 }}
                                            >订单编号</span>
                                            {getFieldDecorator('orderId')(
                                                <Input
                                                    maxLength={20}
                                                    className="input"
                                                    placeholder="请输入订单编号"
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8} offset={8}>
                                    <FormItem>
                                        <Button
                                            size="default"
                                            onClick={this.handleOrderOutput}
                                        >下载加盟商结算数据</Button>
                                    </FormItem>
                                    <FormItem>
                                        <Button
                                            size="default"
                                            onClick={this.handlePaymentOutput}
                                        >下载加盟商支付数据</Button>
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

FranchiseeSettlement.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    pubFetchValueList: PropTypes.func,
}

FranchiseeSettlement.defaultProps = {
    prefixCls: 'FranchiseeSettlement'
}

export default withRouter(Form.create()(FranchiseeSettlement));
