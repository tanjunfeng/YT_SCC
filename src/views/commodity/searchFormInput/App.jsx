/**
 * @file App.jsx
 * @author shijinhua,caoyanxuan
 *
 * 公共searchForm
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, DatePicker, message } from 'antd';

import Utils from '../../../util/util';
import {
    supplierTypeOptions,
    firstSupplierStatusOptions,
    secondSupplierStatusOptions,
    supplierLevelOptions,
    supplierPlaceLevelOptions,
} from '../../../constant/searchParams';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends Component {
    constructor(props) {
        super(props);

        this.handleGetValue = ::this.handleGetValue;
        this.onEnterTimeChange = ::this.onEnterTimeChange;
        this.isPlaceTypeForSearch = ::this.isPlaceTypeForSearch;
        this.isPlaceTypeForAdd = ::this.isPlaceTypeForAdd;
        this.handleAddValue = ::this.handleAddValue;
        this.handleResetValue = ::this.handleResetValue;
        this.handleDownload = ::this.handleDownload;
        this.handleSupplierTypeChange = ::this.handleSupplierTypeChange;

        // 存储form中取到的值
        this.searchData = {};
        this.state = {
            // 控制DatePicker的value
            rengeTime: null,
            // DatePicker选取后返回的格式化后的日期
            settledDate: null,
            // 供应商类型
            supplierType: '0',
        }
    }

    /**
    * DatePicker日期选取
    *
    * @param {moment} data 日期的moment对象
    * @param {string} dateString 格式化后的日期
    */
    onEnterTimeChange(date) {
        this.setState({
            rengeTime: date,
            settledDate: date._d*1,
        });
    }

    /**
    * 获取form的值，赋给this.searchDate
    */
    getValue() {
        const {
            providerName,
            providerNo,
            registLicenceNumber,
            providerType,
            status,
            grade,
        } = this.props.form.getFieldsValue();
        const searchData = {
            providerName,
            providerNo,
            registLicenceNumber,
            providerType: providerType === '0' ? null : providerType,
            status: status === '0' ? null : status,
            grade: grade === '0' ? null : grade,
            settledDate: this.state.settledDate
        };
        this.searchData = Utils.removeInvalid(searchData);
    }

    /**
    * 供应商类型为"供应商地点"时，供应商编码为必选项
    */
    isPlaceTypeForSearch() {
        const { supplierNumber, supplierType } = this.searchData;
        if (supplierType === '1' && !supplierNumber) {
            message.error('请输入供应商编码！');
            return false;
        }
        return true;
    }

    /**
    * 1.供应商类型为"供应商地点"时，供应商编码为必选项;
    * 2.如果供应商类型为供应商地点，当供应商状态为已提交或已审核才通过
    */
    isPlaceTypeForAdd() {
        const { supplierNumber, supplierType, supplierState } = this.searchData;
        if (supplierType === '1' && !supplierNumber) {
            message.error('请输入供应商编码！');
            return false;
        } else if (supplierType === '1'
            && supplierNumber
            && !(supplierState === '1' || supplierState === '2')
        ) {
            message.error('供应商尚未提交审核，不能创建供应商地点！');
            return false;
        }
        return true;
    }

    /**
    * 查询/搜索
    */
    handleGetValue() {
        this.getValue();
        const { onSearch } = this.props;
        const { supplierState } = this.searchData;
        if (this.isPlaceTypeForSearch()) {
            // '已审核'状态调主数据，其他状态调SCM数据
            if (supplierState === '2') {
                // 已审核状态，调主数据
                onSearch(this.searchData, true);
            } else {
                // 调SCM数据
                onSearch(this.searchData, false);
            }
        }
    }

    /**
    * 添加/新增/创建
    */
    handleAddValue() {
        const { onInput } = this.props;
        this.getValue();
        if (this.searchData.supplierType !== '-1') {
            // 已选供应商类型
            if (this.isPlaceTypeForAdd()) {
                // 状态为供应商，不传供应商编码
                if (this.searchData.supplierType === '0') {
                    onInput('addSupplier');
                } else {
                    onInput(this.searchData.supplierNumber);
                }
            }
        } else {
            message.error('请选择供应商类型！');
        }
    }

    /**
    * 重置
    */
    handleResetValue() {
        const { onReset } = this.props;
        this.searchData = {};
        this.props.form.resetFields();
        this.setState({
            supplierType: 0,
        });
        this.setState({rengeTime: null});
        onReset(this.searchData);
    }

    /**
    * 导出Excel
    */
    handleDownload() {
        this.getValue();
        const { onExcel } = this.props;
        onExcel(this.searchData);
    }

    /**
    * 供应商类型select
    * @param {string} value select当前项的key值
    */
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
        const supplierStatusOptionss =
        this.props.isSuplierInputList ? secondSupplierStatusOptions
        : firstSupplierStatusOptions;
        return (
            <div className="manage-form">
                <Form layout="inline">
                    {/* 供应商编码 */}
                    <FormItem className="sc-form-item">
                        <div>
                            <span className="sc-form-item-label">供应商编码</span>
                            {getFieldDecorator('providerNo')(
                                <Input
                                    className="sc-form-item-input"
                                    placeholder="供应商编码"
                                />
                            )}
                        </div>
                    </FormItem>
                    {/* 供应商名称 */}
                    <FormItem className="sc-form-item">
                        <div>
                            <span className="sc-form-item-label">供应商名称</span>
                            {getFieldDecorator('providerName')(
                                <Input
                                    className="sc-form-item-input"
                                    placeholder="供应商名称"
                                />
                            )}
                        </div>
                    </FormItem>
                    {/* 供应商营业执照号 */}
                    <FormItem className="sc-form-item">
                        <div>
                            <span className="sc-form-item-label">供应商营业执照号</span>
                            {getFieldDecorator('registLicenceNumber')(
                                <Input
                                    className="sc-form-item-input-license sc-form-item-input"
                                    placeholder="供应商营业执照号"
                                />
                            )}
                        </div>
                    </FormItem>
                    {/* 供应商类型 */}
                    <FormItem className="sc-form-item">
                        <div>
                            <span className="sc-form-item-label">供应商类型</span>
                            {getFieldDecorator('providerType', {
                                initialValue: supplierTypeOptions.defaultValue
                            })(
                                <Select
                                    className="sc-form-item-select"
                                    size="default"
                                    onChange={this.handleSupplierTypeChange}
                                >
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
                    <FormItem className="sc-form-item">
                        <span className="sc-form-item-label">供应商状态</span>
                        {getFieldDecorator('status', {
                            initialValue: supplierStatusOptionss.defaultValue
                        })(
                            <Select
                                className="sc-form-item-select"
                                size="default"
                            >
                                {
                                    supplierStatusOptionss.data.map((item) =>
                                        (<Option key={item.key} value={item.key}>
                                            {item.value}
                                        </Option>)
                                    )
                                }
                            </Select>
                        )}
                    </FormItem>
                    {
                        supplierType === '1' &&
                        <FormItem className="sc-form-item">
                            <span className="sc-form-item-label">供应商等级</span>
                            {getFieldDecorator('grade', {
                                initialValue: supplierLevelOptions.defaultValue
                            })(
                                <Select
                                    disabled={this.state.supplierType === '-1'}
                                    className="sc-form-item-select"
                                    size="default"
                                >
                                    {
                                        supplierLevelOptions.data.map((item) =>
                                            (<Option key={item.key} value={item.key}>
                                                {item.value}
                                            </Option>)
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>
                    }
                    {
                        supplierType === '2' &&
                        <FormItem className="sc-form-item">
                            <span className="sc-form-item-label">供应商地点等级</span>
                            {getFieldDecorator('grade', {
                                initialValue: supplierPlaceLevelOptions.defaultValue
                            })(
                                <Select
                                    disabled={this.state.handleUsed}
                                    className="sc-form-item-select"
                                    size="default"
                                >
                                    {
                                        supplierPlaceLevelOptions.data.map((item) =>
                                            (<Option key={item.key} value={item.key}>
                                                {item.value}
                                            </Option>)
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>
                    }
                    {/* 供应商入驻日期 */}
                    <FormItem className="sc-form-item">
                        <div>
                            <span className="sc-form-item-label">供应商入驻日期</span>
                            <DatePicker
                                className="sc-form-item-date-picker"
                                showToday
                                onChange={this.onEnterTimeChange}
                                value={this.state.rengeTime}
                                format="YYYY/MM/DD"
                                placeholder="入驻日期"
                            />
                        </div>
                    </FormItem>
                    <div className="sc-form-button-group">
                        <FormItem>
                            <Button
                                type="primary"
                                onClick={this.handleGetValue}
                                size="default"
                            >
                                搜索
                            </Button>
                        </FormItem>
                        <FormItem>
                            <Button size="default" onClick={this.handleResetValue}>
                                重置
                            </Button>
                        </FormItem>
                        <FormItem>
                            <Button size="default" onClick={this.handleDownload}>
                                导出供应商列表
                            </Button>
                        </FormItem>
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
    isSuplierAddMenu: PropTypes.bool,
    isSuplierInputList: PropTypes.bool,
    form: PropTypes.objectOf(PropTypes.any),
};

export default Form.create()(SearchForm);
