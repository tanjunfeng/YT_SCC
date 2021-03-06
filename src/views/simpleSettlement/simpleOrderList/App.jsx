/*
 * @Author: tanjf
 * @Description: 供应商结算
 * @CreateDate: 2017-09-06 17:54:20
 * @Last Modified by: chenghaojie
 * @Last Modified time: 2018-01-11 10:46:19
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Form, Input, Button, Row, Col,
    Select, message, DatePicker
} from 'antd';
import moment from 'moment';
import Util from '../../../util/util';
import SearchMind from '../../../components/searchMind';
import { BranchCompany, Supplier } from '../../../container/search';
import {
    accountPeriod,
} from '../../../constant/searchParams';
import { exportSimpleList } from '../../../service';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';
import { pubFetchValueList } from '../../../actions/pub';
import { DATE_FORMAT } from '../../../constant/index';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const yesterdayDate = moment().subtract(1, 'days').valueOf().toString();
const todayDate = moment().valueOf().toString();
const yesterdayrengeDate = [moment().subtract(1, 'days'), moment()];

@connect(
    state => ({
        orderListData: state.toJS().order.orderListData
    }),
    dispatch => bindActionCreators({
        modifyCauseModalVisible,
        pubFetchValueList,
    }, dispatch)
)
class SimpleOrderList extends Component {
    constructor(props) {
        super(props);
        this.onEnterTimeChange = :: this.onEnterTimeChange;
        this.handleOrderReset = :: this.handleOrderReset;
        this.handleOrderOutput = :: this.handleOrderOutput;
        this.handleSupplierChoose = :: this.handleSupplierChoose;
        this.handleAdressChoose = :: this.handleAdressChoose;
        this.handleAdressClear = :: this.handleAdressClear;
        this.handleSupplierClear = :: this.handleSupplierClear;
        this.handlePaginationChange = :: this.handlePaginationChange;
        this.getSearchData = :: this.getSearchData;
        this.joiningAdressMind = null;
        this.searchData = {};
        this.current = 1;
        this.state = {
            choose: [],
            supplierNo: null,
            supplierAddNo: null,
            rengeTime: yesterdayrengeDate,
            auditModalVisible: false,
            tableOrderNumber: null,
            time: {
                receiveDateMin: yesterdayDate,
                receiveDateMax: todayDate,
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
                receiveDateMin: start,
                receiveDateMax: end
            }
        });
    }

    /**
    * 获取表单信息,并查询列表
    */
    getSearchData() {
        const {
            settlementPeriod,
            purchaseOrderNo,
            branchCompany
        } = this.props.form.getFieldsValue();
        const { supplierNo, supplierAddNo } = this.state;
        const { receiveDateMin, receiveDateMax } = this.state.time;
        this.current = 1;
        this.searchData = {
            settlementPeriod: settlementPeriod === '-1' ? null : settlementPeriod,
            purchaseOrderNo,
            supplierNo,
            supplierAddNo,
            branchCompanyNo: branchCompany.id,
            receiveDateMin,
            receiveDateMax,
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
     * 供应商-值清单
     */
    handleSupplierChoose = ({ record }) => {
        this.setState({
            supplierNo: record.spNo,
        });
    }

    /**
     * 供应商地点-值清单
     */
    handleAdressChoose = ({ record }) => {
        this.setState({
            supplierAddNo: record.providerNo,
        });
    }

    /**
     * 供应商-清除
     */
    handleSupplierClear() {
        this.setState({
            supplierNo: null,
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
     * 重置
     */
    handleOrderReset() {
        this.setState({
            rengeTime: yesterdayrengeDate,
            time: {
                receiveDateMin: yesterdayDate,
                receiveDateMax: todayDate,
            }
        });
        this.joiningAdressMind.reset();
        this.props.form.resetFields();
        // 点击重置时清除 seachMind 引用文本
        this.props.form.setFieldsValue({
            branchCompany: { reset: true },
            supplier: { reset: true }
        });
    }

    /**
     * 导出
     */
    handleOrderOutput() {
        this.getSearchData();
        const searchData = Util.removeInvalid(this.searchData);
        searchData.page = this.current;
        // Util.exportExcel(exportSimpleList, Util.removeInvalid(searchData));
        this.props.form.validateFields((err) => {
            if (!err) {
                Util.exportExcel(exportSimpleList, Util.removeInvalid(searchData));
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" className="promotion">
                <Row className="row-bottom">
                    <Col>
                        <FormItem label="收货日期">
                            {getFieldDecorator('receiveDate', {
                                initialValue: ''
                            })(
                                <RangePicker
                                    style={{ width: '240px' }}
                                    className="manage-form-enterTime"
                                    format={DATE_FORMAT}
                                    placeholder={['开始时间', '结束时间']}
                                    onChange={this.onEnterTimeChange}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="供应商" className="itemTop">
                            {getFieldDecorator('supplier', {
                                initialValue: { spId: '', spNo: '', companyName: '' }
                            })(<Supplier />)}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="供应商地点" className="itemTop">
                            <SearchMind
                                style={{ zIndex: 9 }}
                                compKey="providerNo"
                                ref={ref => { this.joiningAdressMind = ref }}
                                fetch={(params) =>
                                    this.props.pubFetchValueList(
                                        Util.removeInvalid({
                                            condition: params.value,
                                            pageSize: params.pagination.pageSize,
                                            pageNum: params.pagination.current || 1
                                        }), 'supplierAdrSearchBox').then((res) => {
                                        const dataArr = res.data.data || [];
                                        if (!dataArr || dataArr.length === 0) {
                                            message.warning('没有可用的数据');
                                        }
                                        return res;
                                    })
                                }
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
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="账期">
                            {getFieldDecorator('settlementPeriod', {
                                initialValue: accountPeriod.defaultValue
                            })(<Select
                                size="default"
                            >
                                {
                                    accountPeriod.data.map((item) =>
                                        (<Option
                                            key={item.key}
                                            value={item.key}
                                        >
                                            {item.value}
                                        </Option>)
                                    )
                                }
                            </Select>)}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="子公司" className="itemTop">
                            {getFieldDecorator('branchCompany', {
                                initialValue: { id: '', name: '' }
                            })(<BranchCompany />)}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="采购订单">
                            {getFieldDecorator('purchaseOrderNo')(
                                <Input className="input" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="end">
                    <Col>
                        <Button
                            type="primary"
                            size="default"
                            onClick={this.handleOrderOutput}
                        >下载供应商结算数据</Button>
                        <Button
                            size="default"
                            onClick={this.handleOrderReset}
                        >重置</Button>
                    </Col>
                </Row>
            </Form >
        );
    }
}

SimpleOrderList.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    pubFetchValueList: PropTypes.func
}

SimpleOrderList.defaultProps = {
    prefixCls: 'SimpleOrderList'
}

export default withRouter(Form.create()(SimpleOrderList));
