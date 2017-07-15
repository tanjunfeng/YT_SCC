/**
 * @file App.jsx
 *
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
    supplierStatusOptions,
    supplierLevelOptions,
    supplierPlaceLevelOptions
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
            inTime: null,
            // 供应商类型
            supplierType: '-1',
        }
    }

    /**
    * DatePicker日期选取
    *
    * @param {moment} data 日期的moment对象
    * @param {string} dateString 格式化后的日期
    */
    onEnterTimeChange(date, dateString) {
        this.setState({
            rengeTime: date,
            inTime: dateString,
        });
    }

    /**
    * 获取form的值，赋给this.searchDate
    */
    getValue() {
        const {
            supplierNumber,
            supplierName,
            supplierLicense,
            supplierType,
            supplierState,
            supplierLevel,
        } = this.props.form.getFieldsValue();
        const searchData = {
            supplierNumber,
            supplierName,
            supplierLicense,
            supplierType,
            supplierState,
            supplierLevel,
            inTime: this.state.inTime
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
        const { onSearch } = this.props;
        const sState = this.searchData.supplierState;
        this.getValue();
        if (this.isPlaceTypeForSearch()) {
            // '已审核'状态调主数据，其他状态调SCM数据
            if (sState === '2') {
                // console.log('已审核状态，调主数据')
                onSearch(this.searchData);
            }
            // console.log( '调SCM数据')
            onSearch(this.searchData);
        }
    }

    /**
    * 添加/新增
    */
    handleAddValue() {
        const { onInput } = this.props;
        this.getValue();
        if (this.searchData.supplierType !== '-1') {
            // console.log('已选供应商类型')
            if (this.isPlaceTypeForAdd()) {
                onInput();
            }
        }
        message.error('请选择供应商类型！');
    }

    /**
    * 重置
    */
    handleResetValue() {
        const { onReset } = this.props;
        this.searchData = {};
        this.props.form.resetFields();
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
        const supplierTypeItems =
        supplierType > 0 ? supplierPlaceLevelOptions : supplierLevelOptions;
        return (
            <div className="manage-form">
                <Form layout="inline">
                    {/* 供应商编码 */}
                    <FormItem className="sc-form-item">
                        <div>
                            <span className="sc-form-item-label">供应商编码</span>
                            {getFieldDecorator('supplierNumber')(
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
                            {getFieldDecorator('supplierName')(
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
                            {getFieldDecorator('supplierLicense')(
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
                            {getFieldDecorator('supplierType', {
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
                        {getFieldDecorator('supplierState', {
                            initialValue: supplierStatusOptions.defaultValue
                        })(
                            <Select
                                className="sc-form-item-select"
                                size="default"
                            >
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
                    <FormItem className="sc-form-item">
                        <span className="sc-form-item-label">供应商等级</span>
                        {getFieldDecorator('supplierLevel', {
                            initialValue: supplierTypeItems.defaultValue
                        })(
                            <Select
                                className="sc-form-item-select"
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
                        {
                            this.props.isSuplierAddMenu &&
                            <FormItem>
                                <Button
                                    type="primary"
                                    size="default"
                                    onClick={this.handleAddValue}
                                >
                                    创建
                                </Button>
                            </FormItem>
                        }
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
    form: PropTypes.objectOf(PropTypes.any),
};

export default Form.create()(SearchForm);
