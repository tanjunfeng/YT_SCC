/**
 * 促销管理 - 下单打折查询条件
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, DatePicker, Row, Col } from 'antd';
import { withRouter } from 'react-router';
import Util from '../../../util/util';
import { DATE_FORMAT, MINUTE_FORMAT } from '../../../constant';
import { promotionStatus } from '../constants';
import { BranchCompany } from '../../../container/search';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class SearchForm extends PureComponent {
    constructor(props) {
        super(props);
        this.getStatus = this.getStatus.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.getFormData = this.getFormData.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }

    getStatus() {
        const keys = Object.keys(promotionStatus);
        return keys.map((key) => (
            <Option key={key} value={key}>
                {promotionStatus[key]}
            </Option>
        ));
    }

    getFormData() {
        const {
            id,
            promotionName,
            promotionDateRange,
            statusCode,
            branchCompany
        } = this.props.form.getFieldsValue();
        let status = statusCode;
        if (statusCode === 'all') {
            status = '';
        }
        return Util.removeInvalid({
            id,
            promotionName,
            status,
            startDate: promotionDateRange.length > 1 ? promotionDateRange[0].valueOf() : '',
            endDate: promotionDateRange.length > 1 ? promotionDateRange[1].valueOf() : '',
            branchCompanyId: branchCompany.id
        });
    }

    handleSearch() {
        // 通知父页面执行搜索
        this.props.onPromotionSearch(this.getFormData());
    }

    handleReset() {
        this.props.form.resetFields(); // 清除当前查询条件
        this.props.onPromotionReset(); // 通知查询条件已清除
        // 点击重置时清除 seachMind 引用文本
        this.props.form.setFieldsValue({
            branchCompany: { reset: true }
        });
    }

    handleCreate() {
        const { pathname } = this.props.location;
        const win = window.open(`${pathname}/create`, '_blank');
        win.focus();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" className="promotion">
                <Row gutter={40}>
                    <Col span={8}>
                        <FormItem label="活动ID">
                            {getFieldDecorator('id')(<Input size="default" />)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="活动名称">
                            {getFieldDecorator('promotionName')(<Input size="default" />)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="使用范围">
                            {getFieldDecorator('branchCompany', {
                                initialValue: { id: '', name: '' }
                            })(<BranchCompany />)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        {/* 状态 */}
                        <FormItem label="状态">
                            {getFieldDecorator('statusCode', {
                                initialValue: 'all'
                            })(<Select size="default">
                                {this.getStatus()}
                            </Select>)}
                        </FormItem>
                    </Col>
                    <Col span={16}>
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
                        <Button size="default" onClick={this.handleCreate}>
                            新增
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm.propTypes = {
    onPromotionSearch: PropTypes.func,
    onPromotionReset: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any)
};

SearchForm.defaultProps = {
    prefixCls: 'PromotionList'
}

export default withRouter(Form.create()(SearchForm));
