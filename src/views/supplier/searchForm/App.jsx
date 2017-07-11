import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, DatePicker } from 'antd';

import AscadeChoice from '../../../components/ascadeChoice';
import Utils from '../../../util/util';
import { supplierTypeOptions, supplierStatusOptions, supplierLevelOptions, supplierPlaceLevelOptions } from '../../../constant/searchParams';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends Component {
    constructor(props) {
        super(props);

        this.handleGetValue = ::this.handleGetValue;
        this.onEnterTimeChange = ::this.onEnterTimeChange;
        this.handleResetValue = ::this.handleResetValue;
        this.handleDownload = ::this.handleDownload;
        this.handleSupplierTypeChange = ::this.handleSupplierTypeChange;

        this.searchData = {};
        this.time = null;
        this.state = {
            rengeTime: null,
            supplierType: '-1',
        }
    }

    onEnterTimeChange(date, dateString) {
        this.setState({rengeTime: date});
        console.log(this.time)
        this.time = dateString;
        // if(result.length === 2) {
        //     this.time = {
        //         minSettledDate: result[0].valueOf(),
        //         maxSettledDate: result[1].valueOf()
        //     }
        // } else {
        //     this.time = {
        //         minSettledDate: null,
        //         maxSettledDate: null
        //     }
        // }
    }
    getValue() {
        const {
            companyName,
            selectValue,
            settlementAccountType,
            selectType,
            status
        } = this.props.form.getFieldsValue();

        const searchData = {companyName,
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
        console.log(searchData)
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
        this.setState({rengeTime: null});
        onReset(this.searchData);
    }

    handleDownload() {
        this.getValue();
        const { onExcel } = this.props;
        onExcel(this.searchData);
    }

    handleSupplierTypeChange(value) {
        this.setState({
            supplierType: value,
        }, () => {
            this.props.form.resetFields(['supplierLevel'])
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { supplierType } = this.state;
        const {
            suplierSelect,
            type,
        } = this.props;
        const supplierTypeItems =
        supplierType > 0 ? supplierPlaceLevelOptions : supplierLevelOptions;
        return (
            <div className="manage-form">
                <Form layout="inline">
                    <div className="manage-form-item">
                        {/* 供应商编码 */}
                        <FormItem className="manage-form-item1">
                            <div>
                                <span className="manage-form-label">供应商编码</span>
                                {getFieldDecorator('supplierNumber', {
                                })(
                                    <Input
                                        placeholder="供应商编码"
                                    />
                                )}
                            </div>
                        </FormItem>
                        {/* 供应商名称 */}
                        <FormItem className="manage-form-item1">
                            <div>
                                <span className="manage-form-label">供应商名称</span>
                                {getFieldDecorator('supplierName', {
                                })(
                                    <Input
                                        placeholder="供应商名称"
                                    />
                                )}
                            </div>
                        </FormItem>
                        {/* 供应商营业执照号 */}
                        <FormItem className="manage-form-item1">
                            <div>
                                <span className="manage-form-label">供应商营业执照号</span>
                                {getFieldDecorator('supplierLicense', {
                                })(
                                    <Input
                                        className="manage-form-supplierLicense"
                                        placeholder="供应商营业执照号"
                                    />
                                )}
                            </div>
                        </FormItem>
                        {/* 供应商类型 */}
                        <FormItem className="manage-form-item1">
                            <div>
                                <span className="manage-form-label">供应商类型</span>
                                {getFieldDecorator('supplierType', {
                                    initialValue: supplierTypeOptions.defaultValue
                                })(
                                    <Select style={{ width: '153px' }} size="default" onChange={this.handleSupplierTypeChange}>
                                        {
                                            supplierTypeOptions.data.map((item) =>
                                                (<Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Option>)
                                            )
                                        }
                                    </Select>
                                )}
                            </div>
                        </FormItem>
                        {/* 供应商状态 */}
                        <FormItem className="mmanage-form-item1">
                            <span className="manage-form-label">供应商状态</span>
                            {getFieldDecorator('status', {
                                initialValue: supplierStatusOptions.defaultValue
                            })(
                                <Select style={{ width: '153px' }} size="default">
                                    {
                                        supplierStatusOptions.data.map((item) =>
                                            (<Option key={item.key} value={item.key}>
                                                {item.value}
                                            </Option>)
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>
                        {/* 供应商等级 */}
                        <FormItem className="manage-form-item1">
                            <span className="manage-form-label">供应商等级</span>
                            {getFieldDecorator('supplierLevel', {
                                initialValue: '-1',
                            })(
                                <Select
                                    style={{ width: '153px' }}
                                    size="default"
                                    disabled={this.state.supplierType === '-1'} 
                                >
                                    {
                                        supplierTypeItems.data.map((item) =>
                                            (<Option key={item.key} value={item.key}>
                                                {item.value}
                                            </Option>)
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>
                        {/* 供应商入驻日期 */}
                        <FormItem className="manage-form-item1">
                            <div>
                                <span className="manage-form-label">供应商入驻日期</span>
                                <DatePicker
                                    style={{width: '270px'}}
                                    className="manage-form-enterTime"
                                    showToday
                                    onChange={this.onEnterTimeChange}
                                    value={this.state.rengeTime}
                                    format="YYYY-MM-DD"
                                    placeholder="入驻日期"
                                />
                            </div>
                        </FormItem>
                    </div>
                    <div className="manage-form-item">
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
                            {
                                type !== 'supplierInput' &&
                                <FormItem>
                                    <Button size="default" onClick={this.props.onInput}>
                                        创建
                                    </Button>
                                </FormItem>
                            }
                            <FormItem className="manage-form-item2">
                                <Button size="default" onClick={this.handleDownload}>
                                    导出供应商列表
                                </Button>
                            </FormItem>
                        </span>
                    </div>
                </Form>
            </div>
        );
    }
}

SearchForm.propTypes = {
    onSearch: PropTypes.func,
    onReset: PropTypes.func,
    onExcel: PropTypes.func,
    onInput: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
};

export default Form.create()(SearchForm);
