/**
 * 促销管理 - 下单打折查询条件
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Select, Row, Col } from 'antd';
import { withRouter } from 'react-router';
import Util from '../../../util/util';
import { purchaseStatus } from '../constants';
import { Supplier, SupplierAdderss, AddingGoodsByTerm } from '../../../container/search';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.getFormData = this.getFormData.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }

    getFormData() {
        console.log(this.props.form.getFieldsValue())
        const {
            zt,
            gys,
            gysdd,
            sp,
        } = this.props.form.getFieldsValue();
        return Util.removeInvalid({
            zt,
            gys: gys.spId,
            gysdd: gysdd.providerNo,
            sp: sp.id
        });
    }

    handleSearch() {
        // 通知父页面执行搜索
        this.props.handlePurchaseSearch(this.getFormData());
    }

    handleReset() {
        this.props.form.resetFields(); // 清除当前查询条件
        this.props.handlePurchaseReset(); // 通知查询条件已清除
        // 点击重置时清除 seachMind 引用文本
        this.props.form.setFieldsValue({
            branchCompany: { reset: true }
        });
    }

    handleCreate() {
        const { pathname } = this.props.location;
        this.props.history.push(`${pathname}/create`);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" className="purchase">
                <Row gutter={40}>
                    <Col span={8}>
                        <FormItem label="状态">
                            {getFieldDecorator('zt', { initialValue: purchaseStatus.defaultValue })(
                                <Select size="default" onChange={this.statusChange}>
                                    {
                                        purchaseStatus.data.map((item) => (
                                            <Option key={item.key} value={item.key}>
                                                {item.value}
                                            </Option>))
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="供应商">
                            {getFieldDecorator('gys', {
                                initialValue: { id: '', name: '' }
                            })(<Supplier />)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="供应商地点">
                            {getFieldDecorator('gysdd', {
                                initialValue: { id: '', name: '' }
                            })(<SupplierAdderss />)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="商品">
                            {getFieldDecorator('sp', {
                                initialValue: { id: '', name: '' }
                            })(<AddingGoodsByTerm />)}
                        </FormItem>
                    </Col>
                    {/* <Col span={16}>
                        <FormItem label="活动时间">
                            {getFieldDecorator('promotionDateRange', {
                                initialValue: []
                            })(<RangePicker
                                size="default"
                                className="manage-form-enterTime"
                                showTime={{ format: MINUTE_FORMAT }}
                                format={`${DATE_FORMAT} ${MINUTE_FORMAT}`}
                                placeholder={['开始时间', '结束时间']}
                            />)}
                        </FormItem>
                    </Col> */}
                </Row>
                <Row gutter={40} type="flex" justify="end">
                    <Col>
                        <Button type="primary" size="default" onClick={this.handleSearch}>
                            查询
                        </Button>
                        <Button size="default" onClick={this.handleReset}>
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm.propTypes = {
    handlePurchaseSearch: PropTypes.func,
    handlePurchaseReset: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(SearchForm));
