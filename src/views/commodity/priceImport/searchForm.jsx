/**
 * 售价导入 - 查询条件
 *
 * @author liujinyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Select, Row, Col, Input, DatePicker } from 'antd';
import { withRouter } from 'react-router';
import Util from '../../../util/util';
import { priceResult } from './constants';
import { BranchCompany, AddingGoodsByTerm } from '../../../container/search';
import { DATE_FORMAT, MINUTE_FORMAT } from '../../../constant';

const { RangePicker } = DatePicker;
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
            importsId,
            branchCompanyId,
            productId,
            pariceDateRange,
            handleResult
        } = this.props.form.getFieldsValue();
        const prRecord = productId.record;
        return Util.removeInvalid({
            importsId,
            branchCompanyId: branchCompanyId.id,
            productId: prRecord ? prRecord.productId : '',
            uploadStartDate: pariceDateRange.length > 1 ? pariceDateRange[0].valueOf() : '',
            uploadEndDate: pariceDateRange.length > 1 ? pariceDateRange[1].valueOf() : '',
            handleResult
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
        return priceResult.data.map(item => (
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
                        <FormItem label="上传ID">
                            {getFieldDecorator('importsId')(
                                <Input size="default" placeholder="请输入上传ID" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="子公司">
                            {getFieldDecorator('branchCompanyId', {
                                initialValue: { id: '', name: '' }
                            })(<BranchCompany />)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="商品">
                            {getFieldDecorator('productId', {
                                initialValue: { productId: '', productCode: '', productName: '' }
                            })(<AddingGoodsByTerm />)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="上传日期">
                            {getFieldDecorator('pariceDateRange', {
                                initialValue: []
                            })(<RangePicker
                                size="default"
                                className="manage-form-enterTime"
                                showTime={{ format: MINUTE_FORMAT }}
                                format={`${DATE_FORMAT} ${MINUTE_FORMAT}`}
                                placeholder={['开始时间', '结束时间']}
                            />)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="处理结果">
                            {getFieldDecorator('handleResult', { initialValue: priceResult.defaultValue })(
                                <Select size="default" onChange={this.statusChange}>
                                    {this.selectMap()}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
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
            </Form >
        );
    }
}

SearchForm.propTypes = {
    handlePurchaseSearch: PropTypes.func,
    handlePurchaseReset: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
};

export default withRouter(Form.create()(SearchForm));
