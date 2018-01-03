/**
 * @file App.jsx
 * @author shijinhua,caoyanxuan
 *
 * 公共searchForm
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Row, Col, Select, DatePicker, message } from 'antd';

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

class SearchForm extends PureComponent {
    constructor(props) {
        super(props);
        // 存储form中取到的值
        this.searchData = {};
        this.state = {
            // 控制DatePicker的value
            rangeTime: null,
            // DatePicker选取后返回的格式化后的日期
            settledDate: null,
            // 供应商类型
            supplierType: '0',
            pageNum: 1
        }
    }

    /**
    * DatePicker日期选取
    *
    * @param {moment} data 日期的moment对象
    * @param {string} dateString 格式化后的日期
    */
    onEnterTimeChange = (date) => {
        this.setState({
            rangeTime: date,
            settledDate: date ? date._d * 1 : null,
        });
    }

    /**
    * 获取form的值，赋给this.searchDate
    */
    getValue() {
        const { supplierType } = this.state;
        let { grade, gradeAdr } = this.props.form.getFieldsValue();
        const {
            providerName,
            providerNo,
            registLicenceNumber,
            providerType,
            status
        } = this.props.form.getFieldsValue();
        if (grade === '0' || gradeAdr === '0') {
            grade = null;
            gradeAdr = null;
        }
        const searchData = {
            providerName,
            providerNo,
            registLicenceNumber,
            providerType: providerType === '0' ? null : providerType,
            status: status === '-1' ? null : status,
            grade: supplierType === '1' ? grade : gradeAdr,
            settledDate: this.state.settledDate,
            rangeTime: this.state.rangeTime
        };
        this.searchData = Utils.removeInvalid(searchData);
    }

    /**
    * 供应商类型为"供应商地点"时，供应商编码为必选项
    */
    isPlaceTypeForSearch = () => {
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
    isPlaceTypeForAdd = () => {
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
    handleGetValue = () => {
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
    handleAddValue = () => {
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
    handleResetValue = () => {
        this.state.pageNum = 1;
        const { onReset } = this.props;
        this.searchData = {};
        this.props.form.resetFields();
        this.setState({
            supplierType: 0,
        });
        this.setState({ rangeTime: null, settledDate: null });
        onReset(this.searchData);
    }

    /**
    * 导出Excel
    */
    handleDownload = () => {
        this.getValue();
        const { onExcel } = this.props;
        onExcel(this.searchData);
    }

    /**
    * 供应商类型select
    * @param {string} value select当前项的key值
    */
    handleSupplierTypeChange = (value) => {
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
            <div className="search-form-list-manage">
                <Form layout="inline">
                    <Row gutter={40}>
                        {/* 供应商编码 */}
                        <Col>
                            <FormItem label="供应商编码">
                                {getFieldDecorator('providerNo')(
                                    <Input
                                        placeholder="供应商编码"
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 供应商名称 */}
                            <FormItem label="供应商名称">
                                {getFieldDecorator('providerName')(
                                    <Input
                                        placeholder="供应商名称"
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 供应商营业执照号 */}
                            <FormItem label="供应商营业执照号">
                                {getFieldDecorator('registLicenceNumber')(
                                    <Input
                                        placeholder="供应商营业执照号"
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 供应商类型 */}
                            <FormItem label="供应商类型">
                                {getFieldDecorator('providerType', {
                                    initialValue: supplierTypeOptions.defaultValue
                                })(
                                    <Select
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
                                    </Select>)}
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 供应商状态 */}
                            <FormItem label="供应商状态">
                                {getFieldDecorator('status', {
                                    initialValue: supplierStatusOptionss.defaultValue
                                })(
                                    <Select
                                        size="default"
                                    >
                                        {
                                            supplierStatusOptionss.data.map((item) =>
                                                (<Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Option>)
                                            )
                                        }
                                    </Select>)}
                            </FormItem>
                        </Col>
                        {
                            supplierType === '1' ?
                                <Col>
                                    <FormItem label="供应商等级">
                                        {getFieldDecorator('grade', {
                                            initialValue: supplierLevelOptions.defaultValue
                                        })(
                                            <Select
                                                disabled={this.state.supplierType === '-1'}

                                                size="default"
                                            >
                                                {
                                                    supplierLevelOptions.data.map((item) =>
                                                        (<Option key={item.key} value={item.key}>
                                                            {item.value}
                                                        </Option>)
                                                    )
                                                }
                                            </Select>)}
                                    </FormItem>
                                </Col> : null
                        }
                        {
                            supplierType === '2' ?
                                <Col>
                                    <FormItem label="供应商地点等级">
                                        {getFieldDecorator('gradeAdr', {
                                            initialValue: supplierPlaceLevelOptions.defaultValue
                                        })(
                                            <Select
                                                disabled={this.state.handleUsed}

                                                size="default"
                                            >
                                                {
                                                    supplierPlaceLevelOptions.data.map((item) =>
                                                        (<Option key={item.key} value={item.key}>
                                                            {item.value}
                                                        </Option>)
                                                    )
                                                }
                                            </Select>)}
                                    </FormItem>
                                </Col> : null
                        }
                        <Col>
                            {/* 供应商入驻日期 */}
                            <FormItem label="供应商入驻日期">
                                <DatePicker
                                    showToday
                                    onChange={this.onEnterTimeChange}
                                    value={this.state.rangeTime}
                                    format="YYYY/MM/DD"
                                    placeholder="入驻日期"
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={40} type="flex" justify="end">
                        <Col>
                            <Button
                                type="primary"
                                onClick={this.handleGetValue}
                                size="default"
                            >
                                搜索
                            </Button>
                            {
                                this.props.isSuplierAddMenu ?
                                    <Button
                                        type="primary"
                                        size="default"
                                        onClick={this.handleAddValue}
                                    >
                                            创建
                                    </Button>
                                    : null
                            }
                            <Button size="default" onClick={this.handleResetValue}>
                                重置
                            </Button>
                            <Button size="default" onClick={this.handleDownload}>
                                导出供应商列表
                            </Button>
                        </Col>
                    </Row>
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
