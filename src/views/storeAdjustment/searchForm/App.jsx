/**
 * @file App.jsx
 * @author shijinhua,caoyanxuan
 *
 * 公共searchForm
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, DatePicker } from 'antd';

import Utils from '../../../util/util';
import {
    supplierStore,
    adjustmentType,
    // supplierTypeOptions,
    // supplierStatusOptions,
} from '../../../constant/searchParams';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class SearchForm extends Component {
    constructor(props) {
        super(props);

        // 存储form中取到的值
        this.searchData = {};
        this.state = {
            // 控制DatePicker的value
            rengeTime: null,
            // DatePicker选取后返回的格式化后的日期
            inTime: null,
            // 控制调整日期的value
            adjustmentTime: '',
            // RangePiker选取后返回的格式化日期
            formatAdjTime: null
        }
    }

    /**
    * DatePicker日期选取
    *
    * @param {moment} date       日期的moment对象
    * @param {string} dateString 格式化后的日期
    */
    onEnterTimeChange = (date, dateString) => {
        this.setState({
            rengeTime: date,
            inTime: dateString,
        });
    }


    onEnterAdjumentTime = (date, dateString) => {
        this.setState({
            adjustmentTime: date,
            formatAdjTime: dateString,
        });
    }

    /**
    * 获取form的值，赋给this.searchDate
    */
    getValue() {
        const {
            supplierNumber,
            rengeTime,
            supplierTy,
            Founder,
            supplierNum,
            supplierType,
            commodity,
            ExternalDocNumber,
        } = this.props.form.getFieldsValue();
        const searchData = {
            Founder,
            commodity,
            rengeTime,
            supplierNum,
            supplierNumber,
            ExternalDocNumber,
            inTime: this.state.inTime,
            formatAdjTime: this.state.formatAdjTime,
            supplierTy: adjustmentType.data[parseInt(supplierTy, 10) + 1].value,
            supplierType: supplierStore.data[parseInt(supplierType, 10) + 1].value,
        };
        this.searchData = Utils.removeInvalid(searchData);
    }

    /**
    * 供应商类型为"供应商地点"时，供应商编码为必选项
    */
    // isPlaceTypeForSearch() {
    //     const { supplierNumber, supplierType } = this.searchData;
    //     if (supplierType === '1' && !supplierNumber) {
    //         message.error('请输入供应商编码！');
    //         return false;
    //     }
    //     return true;
    // }

    /**
    * 1.供应商类型为"供应商地点"时，供应商编码为必选项;
    * 2.如果供应商类型为供应商地点，当供应商状态为已提交或已审核才通过
    */
    // isPlaceTypeForAdd() {
    //     const { supplierNumber, supplierType, supplierState } = this.searchData;
    //     if (supplierType === '1' && !supplierNumber) {
    //         message.error('请输入供应商编码！');
    //         return false;
    //     } else if (supplierType === '1'
    //         && supplierNumber
    //         && !(supplierState === '1' || supplierState === '2')
    //     ) {
    //         message.error('供应商尚未提交审核，不能创建供应商地点！');
    //         return false;
    //     }
    //     return true;
    // }

    /**
    * 查询/搜索
    */
    handleGetValue = () => {
        this.getValue();
        const { onSearch } = this.props;
        onSearch(this.searchData);
        console.log(this.searchData);
    }

    /**
    * 重置
    */
    handleResetValue = () => {
        // const { onReset } = this.props;
        this.searchData = {};
        this.props.form.resetFields();
        this.setState({
            rengeTime: null,
            adjustmentTime: '',
            formatAdjTime: null,
            inTime: null

        });
        console.log(this.state);
    }

    // /**
    // * 导出Excel
    // */
    // handleDownload = () => {
    //     this.getValue();
    //     const { onExcel } = this.props;
    //     onExcel(this.searchData);
    // }


    render() {
        const { getFieldDecorator } = this.props.form;
        // const supplierStatusOptionss =
        // this.props.isSuplierInputList ? secondSupplierStatusOptions
        // : firstSupplierStatusOptions;
        return (
            <div className="manage-form-content">
                <Form layout="inline">
                    {/* 单据编号 */}
                    <FormItem className="sc-form-item">
                        <div>
                            <span className="sc-form-item-label">单据编号</span>
                            {getFieldDecorator('supplierNumber')(
                                <Input
                                    className="sc-form-item-input"
                                    maxLength="10"
                                    placeholder="单据编号"
                                />
                            )}
                        </div>
                    </FormItem>
                    {/* 状态 */}
                    <FormItem className="sc-form-item">
                        <div>
                            <span className="sc-form-item-label">状态</span>
                            {getFieldDecorator('supplierType', {
                                initialValue: supplierStore.defaultValue
                            })(
                                <Select
                                    className="sc-form-item-select"
                                    size="default"
                                    onChange={this.handleSupplierTypeChange}
                                >
                                    {
                                        supplierStore.data.map((item) =>
                                            (<Option key={item.key} value={item.key}>
                                                {item.value}
                                            </Option>)
                                        )
                                    }
                                </Select>
                            )}
                        </div>
                    </FormItem>
                    {/* 创建日期 */}
                    <FormItem className="sc-form-item">
                        <div>
                            <span className="sc-form-item-label">创建日期</span>
                            <DatePicker
                                className="sc-form-item-date-picker"
                                showToday
                                onChange={this.onEnterTimeChange}
                                value={this.state.rengeTime}
                                format="YYYY/MM/DD"
                                placeholder="创建日期"
                            />
                        </div>
                    </FormItem>
                    {/* 调整类型 */}
                    <FormItem className="sc-form-item">
                        <div>
                            <span className="sc-form-item-label">调整类型</span>
                            {getFieldDecorator('supplierTy', {
                                initialValue: adjustmentType.defaultValue
                            })(
                                <Select
                                    className="sc-form-item-select"
                                    size="default"
                                    onChange={this.handleSupplierTypeChange}
                                >
                                    {
                                        adjustmentType.data.map((item) =>
                                            (<Option key={item.key} value={item.key}>
                                                {item.value}
                                            </Option>)
                                        )
                                    }
                                </Select>
                            )}
                        </div>
                    </FormItem>
                    {/* 调整仓库 */}
                    <FormItem className="sc-form-item">
                        <div>
                            <span className="sc-form-item-label">调整仓库</span>
                            {getFieldDecorator('supplierNum')(
                                <Input
                                    className="sc-form-item-input"
                                    placeholder="调整仓库"
                                />
                            )}
                        </div>
                    </FormItem>
                    {/* 创建人 */}
                    <FormItem className="sc-form-item">
                        <div>
                            <span className="sc-form-item-label">创建人</span>
                            {getFieldDecorator('Founder')(
                                <Input
                                    className="sc-form-item-input-license sc-form-item-input"
                                    placeholder="创建人"
                                />
                            )}
                        </div>
                    </FormItem>
                    {/* 商品 */}
                    <FormItem className="sc-form-item">
                        <div>
                            <span className="sc-form-item-label">商品</span>
                            {getFieldDecorator('commodity')(
                                <Input
                                    className="sc-form-item-input"
                                    placeholder="商品"
                                />
                            )}
                        </div>
                    </FormItem>
                    {/* 外部单据号 */}
                    <FormItem className="sc-form-item">
                        <div>
                            <span className="sc-form-item-label">外部单据号</span>
                            {getFieldDecorator('ExternalDocNumber')(
                                <Input
                                    className="sc-form-item-input"
                                    placeholder="外部单据号"
                                />
                            )}
                        </div>
                    </FormItem>
                    {/* 调整日期 */}
                    <FormItem className="sc-form-item">
                        <div>
                            <span className="sc-form-item-label">调整日期</span>
                            <RangePicker
                                className="sc-form-item-date-picker"
                                showToday
                                format="YYYY/MM/DD"
                                value={this.state.adjustmentTime}
                                onChange={this.onEnterAdjumentTime}
                                placeholder={['开始日期', '结束日期']}
                            />
                        </div>
                        <span className="sc-form-item-label">供应商状态</span>
                        {getFieldDecorator('supplierState', {
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
                    <div className="sc-form-button-group">
                        <FormItem>
                            <Button
                                type="primary"
                                onClick={this.handleGetValue}
                                size="default"
                            >查询
                            </Button>
                        </FormItem>
                        <FormItem>
                            <Button size="default" onClick={this.handleResetValue}>
                                重置
                            </Button>
                        </FormItem>
                        {/* <FormItem>
                            <Button size="default" onClick={this.handleDownload}>
                                导出
                            </Button>
                        </FormItem> */}
                    </div>
                </Form>
            </div>
        );
    }
}

SearchForm.propTypes = {
    onSearch: PropTypes.func,
    // onReset: PropTypes.func,
    // onExcel: PropTypes.func,
    // onInput: PropTypes.func,
    // isSuplierAddMenu: PropTypes.bool,
    form: PropTypes.objectOf(PropTypes.any),
};

export default Form.create()(SearchForm);
