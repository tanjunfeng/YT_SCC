import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Select, DatePicker, Row, Col } from 'antd';
import { changePriceType } from '../constants';
import { Supplier, BranchCompany, SupplierAdderss, Commodity } from '../../../../container/search';
import Utils from '../../../../util/util';
import { DATE_FORMAT, PAGE_SIZE } from '../../../../constant/index';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const formItemLayout = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 14
    }
};

class SearchFormInput extends PureComponent {
    state = {
        pageNum: 1,
        pageSize: PAGE_SIZE
    }

    componentDidMount() {
        this.handleSearch();
    }
    getQueryParams = () => {
        const {
            changeType,
            rangeTime,
            branchCompany,
            supplier,
            supplierAddr,
            commodity
        } = this.props.form.getFieldsValue();
        const queryParams = {
            ...this.state,
            changeType: parseInt(changeType, 10),
            startTime: rangeTime.length > 1 ? rangeTime[0].valueOf() : '',
            endTime: rangeTime.length > 1 ? rangeTime[1].valueOf() : '',
            branchCompanyId: branchCompany.id,
            spId: supplier.spId,
            spAdrId: supplierAddr.spAdrid,
            productId: commodity.productId
        };
        this.queryParams = Utils.removeInvalid(queryParams);
    }

    queryParams = {};

    handleSearch = () => {
        this.getQueryParams();
        this.handleQueryList();
    }

    handleReset = () => {
        this.queryParams = {};
        this.props.form.resetFields();
        this.props.form.setFieldsValue({
            supplier: { reset: true }
        });

        this.props.form.setFieldsValue({
            branchCompany: { reset: true }
        });
    }

    handleExport = () => {
        this.getQueryParams();
        const { onExcel } = this.props;
        const queryParams = {...this.queryParams};
        queryParams.pageNum = null;
        queryParams.pageSize = null;
        onExcel(Utils.removeInvalid(queryParams));
    }

    handleQueryList = () => {
        this.props.onQueryList(this.queryParams);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="manage-form" id="prize-change-search-form">
                <Form layout="inline">
                    <Row gutter={40}>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="价格类型" className="sc-form-item">
                                {getFieldDecorator('changeType', {
                                    initialValue: changePriceType.defaultValue
                                })(
                                    <Select
                                        className="sc-form-item-select price-type"
                                        size="large"
                                        onChange={this.handleChange}
                                    >
                                        {
                                            changePriceType.data.map(item => (
                                                <Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="供应商" className="sc-form-item">
                                {getFieldDecorator('supplier', {
                                    initialValue: { spId: '', spNo: '', companyName: '' }
                                })(
                                    <Supplier />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="供应商地点" className="sc-form-item">
                                {getFieldDecorator('supplierAddr', { initialValue: {
                                    providerNo: '',
                                    providerName: '',
                                    spAdrid: ''
                                }})(<SupplierAdderss disabled={this.props.form.getFieldValue('supplier').spId === ''} />)}
                            </FormItem>
                        </Col>
                    </Row>

                    <Row gutter={40}>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="子公司" className="sc-form-item">
                                {getFieldDecorator('branchCompany', {
                                    initialValue: { id: '', name: '' }
                                })(<BranchCompany />)}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="商品" className="sc-form-item">
                                {getFieldDecorator('commodity', { initialValue: {
                                    productId: '', saleName: '' }})(<Commodity />)
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="选择日期" className="sc-form-item">
                                {getFieldDecorator('rangeTime', {
                                    initialValue: []
                                })(
                                    <RangePicker
                                        className="rangeTime"
                                        format={DATE_FORMAT}
                                        placeholder={['开始时间', '结束时间']}
                                    />
                                )
                                }
                            </FormItem>
                        </Col>
                    </Row>

                    <Row gutter={40} type="flex" justify="end">
                        <Col>
                            <Button
                                type="primary"
                                onClick={this.handleSearch}
                                size="default"
                            >搜索</Button>
                            <Button
                                size="default"
                                onClick={this.handleReset}
                            >重置</Button>
                            <Button
                                onClick={this.handleExport}
                                type="primary"
                                size="default"
                            >导出Excel</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

SearchFormInput.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    onExcel: PropTypes.func,
    onQueryList: PropTypes.func
};

export default Form.create()(SearchFormInput);
