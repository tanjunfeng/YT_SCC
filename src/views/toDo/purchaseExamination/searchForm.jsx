/**
 * 进价审核 - 查询条件
 *
 * @author liujinyu
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
        this.selectMap = this.selectMap.bind(this);
    }

    /**
     * 获取表单数据
     */
    getFormData() {
        const {
            status,
            spId,
            spAdrId,
            productId,
        } = this.props.form.getFieldsValue();
        const prRecord = productId.record;
        return Util.removeInvalid({
            status,
            spId: spId.spId,
            spAdrId: spAdrId.providerNo,
            productId: prRecord ? prRecord.productId : ''
        });
    }

    /**
     * 点击搜索的回调
     */
    handleSearch() {
        // 通知父页面执行搜索
        this.props.handlePurchaseSearch(this.getFormData());
    }

    /**
     * 点击重置的回调
     */
    handleReset() {
        this.props.form.resetFields(); // 清除当前查询条件
        this.props.handlePurchaseReset(); // 通知查询条件已清除
    }

    /**
     * 遍历select框选项
     */
    selectMap() {
        return purchaseStatus.data.map(item => (
            <Option key={item.key} value={item.key}>
                {item.value}
            </Option>))
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" className="purchase">
                <Row gutter={40}>
                    <Col span={8}>
                        <FormItem label="状态">
                            {getFieldDecorator('status', { initialValue: purchaseStatus.defaultValue })(
                                <Select size="default" onChange={this.statusChange}>
                                    {this.selectMap()}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="供应商">
                            {getFieldDecorator('spId', {
                                initialValue: { spId: '', spNo: '', companyName: '' }
                            })(<Supplier />)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="供应商地点">
                            {getFieldDecorator('spAdrId', {
                                initialValue: { providerNo: '', providerName: '' }
                            })(<SupplierAdderss />)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="商品">
                            {getFieldDecorator('productId', {
                                initialValue: { productId: '', productCode: '', productName: '' }
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
};

export default withRouter(Form.create()(SearchForm));
