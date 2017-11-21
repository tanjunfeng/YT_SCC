/**
 * 促销管理查询条件
 *
 * @author taoqiyu,tanjf
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, DatePicker, Row, Col } from 'antd';
import { withRouter } from 'react-router';
import Utils from '../../../util/util';
import { MINUTE_FORMAT, DATE_FORMAT } from '../../../constant';
import { promotionStatus, couponTypeStatus } from '../constants';
import { BranchCompany } from '../../../container/search';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class SearchForm extends PureComponent {
    getPromotionStatus = () => {
        const keys = Object.keys(promotionStatus);
        return keys.map(key => (
            <Option key={key} value={key}>
                {promotionStatus[key]}
            </Option>
        ));
    }

    getCouponTypeStatus = () => {
        const keys = Object.keys(couponTypeStatus);
        return keys.map(key => (
            <Option key={key} value={key}>
                {couponTypeStatus[key]}
            </Option>
        ));
    }

    getFormData = () => {
        const {
            id,
            promotionName,
            promotionDateRange,
            statusCode,
            branchCompany,
            couponType
        } = this.props.form.getFieldsValue();
        const startDate = promotionDateRange ? promotionDateRange[0].valueOf() : '';
        const endDate = promotionDateRange ? promotionDateRange[1].valueOf() : '';
        let status = statusCode;
        if (statusCode === 'all') {
            status = '';
        }
        return Utils.removeInvalid({
            id,
            promotionName,
            status,
            couponType,
            startDate,
            endDate,
            branchCompanyId: branchCompany.id
        });
    }

    handleSearch = () => {
        // 将查询条件回传给调用页
        this.props.onPromotionSearch(this.getFormData());
    }

    handleReset = () => {
        this.props.form.resetFields();  // 清除当前查询条件
        this.props.onPromotionReset();  // 通知父页面已清空
    }

    handleCreate = () => {
        const { pathname } = this.props.location;
        this.props.history.push(`${pathname}/create`);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="search-box promotion">
                <Form layout="inline">
                    <div className="search-conditions">
                        <Row>
                            <Col span={8}>
                                <FormItem label="券ID" style={{ paddingRight: 10 }}>
                                    {getFieldDecorator('id')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="券名称">
                                    {getFieldDecorator('promotionName')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="使用区域">
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
                                    })(
                                        <Select style={{ width: '153px' }} size="default">
                                            {this.getPromotionStatus()}
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                {/* 类型 */}
                                <FormItem label="类型">
                                    {getFieldDecorator('couponType', {
                                        initialValue: ''
                                    })(
                                        <Select style={{ width: '153px' }} size="default">
                                            {this.getCouponTypeStatus()}
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col>
                                <FormItem>
                                    <div className="promotion-date-range">
                                        <span className="sc-form-item-label search-mind-label">有效日期</span>
                                        {getFieldDecorator('promotionDateRange', {
                                            initialValue: '',
                                            rules: [{ required: true, message: '请选择有效日期' }]
                                        })(
                                            <RangePicker
                                                style={{ width: '250px' }}
                                                className="manage-form-enterTime"
                                                showTime={{ format: MINUTE_FORMAT }}
                                                format={`${DATE_FORMAT} ${MINUTE_FORMAT}`}
                                                placeholder={['开始时间', '结束时间']}
                                            />
                                            )}
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex" justify="end">
                            <Col>
                                <FormItem>
                                    <Button type="primary" size="default" onClick={this.handleSearch}>
                                        查询
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button size="default" onClick={this.handleReset}>
                                        重置
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button size="default" onClick={this.handleCreate}>
                                        新增
                                    </Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div >
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
