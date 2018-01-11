/*
 * @Author: tanjf
 * @Description: 加盟商结算
 * @CreateDate: 2017-09-06 17:53:59
 * @Last Modified by: chenghaojie
 * @Last Modified time: 2018-01-11 11:17:10
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
import { exportFranchiseeList, exportPaymentList } from '../../../service';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';
import { DATE_FORMAT } from '../../../constant/index';
import { BranchCompany, Franchisee } from '../../../container/search';

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
        modifyCauseModalVisible
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
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.getSearchData = this.getSearchData.bind(this);
        this.onChange = this.onChange.bind(this);
        this.searchData = {};
        this.current = 1;
        this.state = {
            choose: [],
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
            franchisee,
            branchCompany
        } = this.props.form.getFieldsValue();
        const { checkedList,
            completeDateStart, completeDateEnd, payDateStart,
            payDateEnd, refundDateStart, refundDateEnd } = this.state;
        this.current = 1;
        this.searchData = {
            isPayState: (checkedList.length === 1 &&
                checkedList[0] === '已付款') || checkedList.length === 2 ? 1 : 0,
            isRefound: (checkedList.length === 1 &&
                checkedList[0] === '已退款') || checkedList.length === 2 ? 1 : 0,
            orderId,
            franchiseeId: franchisee.franchiseeId,
            branchCompanyId: branchCompany.id,
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
     * 供应商地点-清除
     */
    handleAdressClear() {
        this.setState({
            supplierAddNo: null,
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
        this.props.form.resetFields();
        // 点击重置时清除 seachMind 引用文本
        this.props.form.setFieldsValue({
            branchCompany: { reset: true }
        });
        this.props.form.setFieldsValue({
            franchisee: { reset: true }
        });
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
                        <Row className="row-bottom">
                            <Col>
                                {/* 签收日期 */}
                                <FormItem label="签收日期">
                                    {getFieldDecorator('completeDate')(
                                        <RangePicker
                                            className="manage-form-enterTime"
                                            format={DATE_FORMAT}
                                            placeholder={['开始时间', '结束时间']}
                                            onChange={this.onCompleteTimeChange}
                                            id="completeDate"
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col>
                                {/* 付款日期 */}
                                <FormItem label="付款日期">
                                    {getFieldDecorator('payDate', {
                                        initialValue: ''
                                    })(
                                        <RangePicker

                                            className="manage-form-enterTime"
                                            format={DATE_FORMAT}
                                            placeholder={['开始时间', '结束时间']}
                                            onChange={this.onPayTimeChange}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col>
                                {/* 退款日期 */}
                                <FormItem label="退款日期">
                                    {getFieldDecorator('refundDate', {
                                        initialValue: ''
                                    })(
                                        <RangePicker

                                            className="manage-form-enterTime"
                                            format={DATE_FORMAT}
                                            placeholder={['开始时间', '结束时间']}
                                            onChange={this.onRefundTimeChange}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col >
                                {/* 加盟商 */}
                                <FormItem label="加盟商" className="itemTop">
                                    {getFieldDecorator('franchisee', {
                                        initialValue: { franchiseeId: '', franchiseeName: '' }
                                    })(<Franchisee />)}
                                </FormItem>
                            </Col>
                            <Col>
                                {/* 子公司 */}
                                <FormItem label="子公司" className="itemTop">
                                    {getFieldDecorator('branchCompany', {
                                        initialValue: { id: '', name: '' }
                                    })(<BranchCompany />)}
                                </FormItem>
                            </Col>
                            <Col>
                                {/* 采购订单 */}
                                <FormItem label="订单编号">
                                    {getFieldDecorator('orderId', {
                                        rules: [{
                                            max: 20,
                                            message: '请输入20位以内的订单编号'
                                        }]
                                    })(
                                        <Input
                                            className="input"
                                            placeholder="请输入订单编号"
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col>
                                {/* 已支付、已退款 */}
                                <FormItem className="franchiseeSettlement-gutter-Row">
                                    <CheckboxGroup
                                        options={plainOptions}
                                        value={this.state.checkedList}
                                        onChange={this.onChange}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex" justify="end">
                            <Col>
                                <Button
                                    type="primary"
                                    size="default"
                                    onClick={this.handleOrderOutput}
                                >下载加盟商结算数据</Button>
                                <Button
                                    size="default"
                                    onClick={this.handlePaymentOutput}
                                >下载加盟商支付数据</Button>
                                <Button
                                    size="default"
                                    onClick={this.handleOrderReset}
                                >重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        );
    }
}

FranchiseeSettlement.propTypes = {
    form: PropTypes.objectOf(PropTypes.any)
}

FranchiseeSettlement.defaultProps = {
    prefixCls: 'FranchiseeSettlement'
}

export default withRouter(Form.create()(FranchiseeSettlement));
