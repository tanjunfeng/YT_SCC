/*
 * @Author: tanjf
 * @Description: 供应商结算
 * @CreateDate: 2017-09-06 17:54:20
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-11-21 14:26:16
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
import {
    accountPeriod,
} from '../../../constant/searchParams';
import { exportSimpleList } from '../../../service';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';
import { pubFetchValueList } from '../../../actions/pub';
import { DATE_FORMAT } from '../../../constant/index';

const FormItem = Form.Item;
const Option = Select.Option;
const orderML = 'order-management';
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
        this.onEnterTimeChange = ::this.onEnterTimeChange;
        this.handleOrderReset = ::this.handleOrderReset;
        this.handleOrderOutput = ::this.handleOrderOutput;
        this.handleSupplierChoose = ::this.handleSupplierChoose;
        this.handleAdressChoose = ::this.handleAdressChoose;
        this.handleSubCompanyChoose = ::this.handleSubCompanyChoose;
        this.handleSubCompanyClear = ::this.handleSubCompanyClear;
        this.handleAdressClear = ::this.handleAdressClear;
        this.handleSupplierClear = ::this.handleSupplierClear;
        this.handlePaginationChange = ::this.handlePaginationChange;
        this.getSearchData = ::this.getSearchData;
        this.joiningSupplierMind = null;
        this.joiningAdressMind = null;
        this.subCompanySearchMind = null;
        this.searchData = {};
        this.current = 1;
        this.state = {
            choose: [],
            supplierNo: null,
            branchCompanyNo: null,
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
        } = this.props.form.getFieldsValue();

        const { supplierNo, supplierAddNo, branchCompanyNo } = this.state;
        const { receiveDateMin, receiveDateMax } = this.state.time;
        this.current = 1;
        this.searchData = {
            settlementPeriod: settlementPeriod === '-1' ? null : settlementPeriod,
            purchaseOrderNo,
            supplierNo,
            supplierAddNo,
            branchCompanyNo,
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
     * 子公司-值清单
     */
    handleSubCompanyChoose = ({ record }) => {
        this.setState({
            branchCompanyNo: record.id,
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
     * 子公司-清除
     */
    handleSubCompanyClear() {
        this.setState({
            branchCompanyNo: null,
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
        this.joiningSupplierMind.handleClear();
        this.joiningAdressMind.handleClear();
        this.subCompanySearchMind.handleClear();
        this.props.form.resetFields();
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
        const { prefixCls } = this.props;
        return (
            <div className={orderML}>
                <div className="manage-form">
                    <Form layout="inline">
                        <div className="gutter-example">
                            <Row gutter={16}>
                                <Col className="gutter-row simpleOrderList-errPlace" span={8}>
                                    {/* 订单日期 */}
                                    <FormItem>
                                        <div className="simpleOrderList-errPlace">
                                            <span className="sc-form-item-label">收货日期</span>
                                            {getFieldDecorator('receiveDate', {
                                                initialValue: '',
                                                rules: [{ required: true, message: '请选择收货日期' }]
                                            })(
                                                <RangePicker
                                                    style={{ width: '240px' }}
                                                    className="manage-form-enterTime"
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
                                                compKey="spNo"
                                                ref={ref => { this.joiningSupplierMind = ref }}
                                                onChoosed={this.handleSupplierChoose}
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
                                                compKey="providerNo"
                                                ref={ref => { this.joiningAdressMind = ref }}
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
                                            {getFieldDecorator('settlementPeriod', {
                                                initialValue: accountPeriod.defaultValue,
                                                rules: [{ required: true, message: '请选择账期' }]
                                            })(
                                                <Select
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
                                                compKey="id"
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
                                                    <div>{row.id} - {row.name}</div>
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
                                    {/* 采购订单 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">采购订单</span>
                                            {getFieldDecorator('purchaseOrderNo')(
                                                <Input
                                                    className="input"
                                                    placeholder="采购订单号"
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
    pubFetchValueList: PropTypes.func,
    prefixCls: PropTypes.string,
}

SimpleOrderList.defaultProps = {
    prefixCls: 'SimpleOrderList'
}

export default withRouter(Form.create()(SimpleOrderList));
