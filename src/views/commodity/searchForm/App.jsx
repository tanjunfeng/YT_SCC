/**
 * @file App.jsx
 *
 * @author tanjf
 *
 * searchForm
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, message, Icon } from 'antd';

import Utils from '../../../util/util';
import {
    mainSupplierOptions,
    initiateModeOptions,
} from '../../../constant/searchParams';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends Component {
    constructor(props) {
        super(props);

        this.handleAddValue = ::this.handleAddValue;
        this.handleResetValue = ::this.handleResetValue;
        this.getValue = ::this.getValue;

        // 存储form中取到的值
        this.searchData = {};
        this.state = {
            // 供应商类型
            supplierType: '-1',
        }
    }

    /**
    * 获取form的值，赋给this.searchDate
    */
    getValue() {
        const {
            supplierNumber,
            supplier,
            addressNumber,
            address,
            supplierType,
            mainSupplier,
        } = this.props.form.getFieldsValue();
        const searchData = {
            supplierNumber,
            supplier,
            addressNumber,
            address,
            supplierType,
            mainSupplier,
            inTime: this.state.inTime
        };
        this.searchData = Utils.removeInvalid(searchData);
    }

    /**
     * 搜索
     * @param {Object} data 展示数据
     * @param {bool} bool 通过返回值操控请求
     */
    handleFormSearch(data, bool) {
        this.searchForm = data;
        if (bool) {
            // 主数据
            // console.log('主数据')
            this.handlePaginationChange();
        } else {
            // SCM数据
            // console.log('SCM数据')
            this.handlePaginationChange();
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
        this.setState({rengeTime: null});
        onReset(this.searchData);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="manage-form">
                <div style={{fontSize: 16, fontWeight: 900}}>
                    <Icon type="desktop" className="css-appstore" />&nbsp;商品信息
                </div>
                <Form layout="inline" style={{paddingLeft: 22}}>
                    {/* 供应商 */}
                    <FormItem className="sc-form-item">
                        <div className="tjf-css-inputLine">
                            <span className="sc-form-item-label">供应商</span>
                            {getFieldDecorator('supplierNumber')(
                                <Input
                                    className="sc-form-item-input"
                                />
                            )}
                            {getFieldDecorator('supplier')(
                                <Input
                                    className="sc-form-item-input"
                                />
                            )}
                        </div>
                    </FormItem>
                    {/* 地点 */}
                    <FormItem className="sc-form-item">
                        <div className="tjf-css-inputLine">
                            <span className="sc-form-item-label">供应商</span>
                            {getFieldDecorator('addressNumber')(
                                <Input
                                    className="sc-form-item-input"
                                />
                            )}
                            {getFieldDecorator('address')(
                                <Input
                                    className="sc-form-item-input"
                                />
                            )}
                        </div>
                    </FormItem>
                    {/* 子公司 */}
                    <FormItem className="sc-form-item">
                        <div className="tjf-css-inputLine">
                            <span className="sc-form-item-label">子公司</span>
                            {getFieldDecorator('companyNumber')(
                                <Input
                                    className="sc-form-item-input"
                                />
                            )}
                            {getFieldDecorator('company')(
                                <Input
                                    className="sc-form-item-input"
                                />
                            )}
                        </div>
                    </FormItem>
                    {/* 启用状态 */}
                    <FormItem className="sc-form-item">
                        <div className="tjf-css-supplierType">
                            <span className="sc-form-item-label">启用状态</span>
                            {getFieldDecorator('supplierType', {
                                initialValue: initiateModeOptions.defaultValue
                            })(
                                <Select
                                    className="sc-form-item-select"
                                    size="default"
                                    onChange={this.handleSupplierTypeChange}
                                >
                                    {
                                        initiateModeOptions.data.map((item) =>
                                            (<Option key={item.key} value={item.key}>
                                                {item.value}
                                            </Option>)
                                        )
                                    }
                                </Select>
                            )}
                        </div>
                    </FormItem>
                    {/* 主供应商 */}
                    <FormItem className="sc-form-item">
                        <div className="tjf-css-supplierType">
                            <span className="sc-form-item-label">主供应商</span>
                            {getFieldDecorator('mainSupplier', {
                                initialValue: mainSupplierOptions.defaultValue
                            })(
                                <Select
                                    className="sc-form-item-select"
                                    size="default"
                                >
                                    {
                                        mainSupplierOptions.data.map((item) =>
                                            (<Option key={item.key} value={item.key}>
                                                {item.value}
                                            </Option>)
                                        )
                                    }
                                </Select>
                            )}
                        </div>
                    </FormItem>
                    <div className="sc-form-button-group">
                        <FormItem>
                            <Button type="primary" size="default" onClick={this.searchForm}>
                                查询
                            </Button>
                        </FormItem>
                        <FormItem>
                            <Button size="default" onClick={this.handleResetValue}>
                                重置
                            </Button>
                        </FormItem>
                        <FormItem>
                            <Button
                                size="default"
                                onClick={this.handleAddValue}
                            >
                                新增
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
    prefixCls: PropTypes.string,
    isSuplierAddMenu: PropTypes.bool,
    form: PropTypes.objectOf(PropTypes.any),
};

export default Form.create()(SearchForm);
