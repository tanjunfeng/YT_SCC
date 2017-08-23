import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, DatePicker } from 'antd';

import AscadeChoice from '../ascadeChoice';
import Utils from '../../util/util';
import { supplierStatus, settlementAccount } from '../../constant/searchParams';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class SearchForm extends Component {
    constructor(props) {
        super(props);

        this.handleGetValue = this.handleGetValue.bind(this);
        this.onEnterTimeChange = this.onEnterTimeChange.bind(this);
        this.handleResetValue = this.handleResetValue.bind(this);
        this.handleDownload = this.handleDownload.bind(this);

        this.searchData = {};
        this.time = {
            minSettledDate: null,
            maxSettledDate: null
        }
        this.state = {
            rengeTime: []
        }
    }

    onEnterTimeChange(result) {
        this.setState({ rengeTime: result });
        if (result.length === 2) {
            this.time = {
                minSettledDate: result[0].valueOf(),
                maxSettledDate: result[1].valueOf()
            }
        } else {
            this.time = {
                minSettledDate: null,
                maxSettledDate: null
            }
        }
    }

    getValue() {
        const {
            companyName,
            selectValue,
            settlementAccountType,
            selectType,
            status
        } = this.props.form.getFieldsValue();

        const searchData = {
            companyName,
            minSettlementPeriod: this.balanceDateRef && this.balanceDateRef.getFieldsValue().first,
            maxSettlementPeriod: this.balanceDateRef && this.balanceDateRef.getFieldsValue().second,
            minRebateRate: this.rebateRef && this.rebateRef.getFieldsValue().first,
            maxRebateRate: this.rebateRef && this.rebateRef.getFieldsValue().second
        };

        if (selectValue) {
            searchData[selectType] = selectValue;
        }

        if (status && status !== '-1') {
            searchData.status = parseInt(status, 10);
        }

        if (settlementAccountType && settlementAccountType !== '-1') {
            searchData.settlementAccountType = parseInt(settlementAccountType, 10);
        }

        Object.assign(searchData, this.time);
        this.searchData = Utils.removeInvalid(searchData);
    }

    handleGetValue() {
        const { onSearch } = this.props;
        this.getValue()
        onSearch(this.searchData);
    }

    handleResetValue() {
        const { onReset } = this.props;
        this.searchData = {};
        this.props.form.resetFields();
        this.setState({ rengeTime: [] });
        this.balanceDateRef.resetFields();
        this.rebateRef.resetFields();
        onReset(this.searchData);
    }

    handleDownload() {
        this.getValue();
        const { onExcel } = this.props;
        onExcel(this.searchData);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {
            suplierSelect,
            type,
            suplierStatusSelect = supplierStatus
        } = this.props;
        return (
            <div className="manage-form">
                <Form layout="inline">
                    <div className="manage-form-item">
                        {/* 公司名称 */}
                        <FormItem className="manage-form-item1">
                            <div>
                                <span className="manage-form-label">公司名称</span>
                                {getFieldDecorator('companyName', {
                                })(
                                    <Input
                                        className="manage-form-companyName"
                                        placeholder="公司名称"
                                    />
                                    )}
                            </div>
                        </FormItem>
                        {/* 供应商编号 */}
                        <FormItem className="manage-form-item2">
                            <InputGroup compact size="default">
                                {getFieldDecorator('selectType', {
                                    initialValue: suplierSelect.defaultValue
                                })(
                                    <Select className="manage-form-supplierNumber">
                                        {
                                            suplierSelect.data.map((item) => (
                                                <Option
                                                    key={item.key}
                                                    value={item.key}
                                                >{item.value}</Option>
                                            ))
                                        }
                                    </Select>
                                    )}
                                {getFieldDecorator('selectValue', {
                                    rules: [{
                                        max: 40,
                                        message: '最大长度40字符'
                                    }]
                                })(
                                    <Input style={{ width: '190px' }} />
                                    )}
                            </InputGroup>
                        </FormItem>
                        {/* 供应商状态 */}
                        <FormItem className="manage-form-item2">
                            <span className="manage-form-label">供应商状态</span>
                            {getFieldDecorator('status', {
                                initialValue: suplierStatusSelect.defaultValue
                            })(
                                <Select style={{ width: '153px' }} size="default">
                                    {
                                        suplierStatusSelect.data.map((item) => (
                                            <Option
                                                key={item.key}
                                                value={item.key}
                                            >{item.value}</Option>
                                        ))
                                    }
                                </Select>
                                )}
                        </FormItem>
                    </div>
                    <div className="manage-form-item">
                        {/* 入驻时间 */}
                        <FormItem className="manage-form-item1">
                            <div>
                                <span className="manage-form-label">入驻时间</span>
                                <RangePicker
                                    style={{ width: '270px' }}
                                    className="manage-form-enterTime"
                                    showTime
                                    value={this.state.rengeTime}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder={['开始时间', '结束时间']}
                                    onChange={this.onEnterTimeChange}
                                />
                            </div>
                        </FormItem>
                        {/* 结算账期 */}
                        {
                            type !== 'Application' &&
                            <FormItem className="manage-form-item2">
                                <span className="manage-form-label">结算账期（天）</span>
                                <AscadeChoice ref={ref => { this.balanceDateRef = ref }} />
                            </FormItem>
                        }
                        {/* 结算账户 */}
                        {
                            type !== 'Application' &&
                            <FormItem className="manage-form-item3">
                                <span className="manage-form-label">结算账户</span>
                                {getFieldDecorator('settlementAccountType', {
                                    initialValue: settlementAccount.defaultValue
                                })(
                                    <Select style={{ width: '153px' }} size="default">
                                        {
                                            settlementAccount.data.map(item => (
                                                <Option
                                                    key={item.key}
                                                    value={item.key}
                                                >{item.value}</Option>
                                            ))
                                        }
                                    </Select>
                                    )}
                            </FormItem>
                        }
                        {
                            type === 'Application' &&
                            <span>
                                <FormItem className="manage-form-item2">
                                    <Button size="default" onClick={this.handleDownload}>
                                        导出供应商列表
                                    </Button>
                                </FormItem>
                                <span className="manage-form-item3">
                                    <FormItem>
                                        <Button type="primary" onClick={this.handleGetValue} size="default">
                                            搜索
                                        </Button>
                                    </FormItem>
                                    <FormItem>
                                        <Button size="default" onClick={this.handleResetValue}>
                                            重置
                                        </Button>
                                    </FormItem>
                                    <FormItem>
                                        <Button size="default" onClick={this.props.onInput}>
                                            录入供应商信息
                                        </Button>
                                    </FormItem>
                                </span>
                            </span>
                        }
                    </div>
                    {
                        type !== 'Application' &&
                        <div className="manage-form-item">
                            {/* 返利（%） */}
                            <FormItem className="manage-form-item1">
                                <span className="manage-form-label">返利（%）</span>
                                <AscadeChoice ref={ref => { this.rebateRef = ref }} />
                            </FormItem>
                            <FormItem className="manage-form-item2">
                                <Button size="default" onClick={this.handleDownload}>
                                    导出供应商列表
                                    </Button>
                            </FormItem>
                            <span className="manage-form-item3">
                                <FormItem>
                                    <Button type="primary" onClick={this.handleGetValue} size="default">
                                        搜索
                                        </Button>
                                </FormItem>
                                <FormItem>
                                    <Button size="default" onClick={this.handleResetValue}>
                                        重置
                                        </Button>
                                </FormItem>
                            </span>
                        </div>
                    }
                </Form>
            </div>
        );
    }
}

SearchForm.propTypes = {
    suplierSelect: PropTypes.objectOf(PropTypes.any),
    suplierStatusSelect: PropTypes.objectOf(PropTypes.any),
    onSearch: PropTypes.func,
    onReset: PropTypes.func,
    onExcel: PropTypes.func,
    onInput: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    type: PropTypes.objectOf(PropTypes.any)
};

export default Form.create()(SearchForm);
