/**
 * 促销管理查询条件
 *
 * @author taoqiyu,tanjf
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Row, Col, DatePicker, Select } from 'antd';
import { withRouter } from 'react-router';
import Utils from '../../../util/util';
import { DATE_FORMAT, MINUTE_FORMAT } from '../../../constant';
import { BranchCompany } from '../../../container/search';
import { couponTypeStatus } from '../../coupon/constants';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class SearchForm extends PureComponent {
    componentWillReceiveProps(nextProps) {
        if (!nextProps.visible && this.props.visible) {
            this.handleReset();
            this.setState({ branchCompanyId: '' });
        }
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
            releaseDateRange,
            statusCode,
            couponType,
            storeId,
            storeName,
            branchCompany
        } = this.props.form.getFieldsValue();
        const startDate = releaseDateRange.length > 1 ? releaseDateRange[0].valueOf() : '';
        const endDate = releaseDateRange.length > 1 ? releaseDateRange[1].valueOf() : '';
        let status = statusCode;
        if (statusCode === 'all') {
            status = '';
        }
        return Utils.removeInvalid({
            id,
            promotionName,
            status,
            couponType,
            storeId,
            storeName,
            startDate,
            endDate,
            branchCompanyId: branchCompany.id
        });
    }

    handleSearch = () => {
        // 将查询条件回传给调用页
        this.props.onCouponSearch(this.getFormData());
    }

    handleReset = () => {
        this.props.form.resetFields();  // 清除当前查询条件
        this.props.onCouponReset();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="search-box release">
                <Form layout="inline">
                    <div className="search-conditions">
                        <Row gutter={40}>
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
                                <FormItem label="使用范围">
                                    {getFieldDecorator('branchCompany', {
                                        initialValue: { id: '', name: '' }
                                    })(<BranchCompany />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={16}>
                                <FormItem>
                                    <div className="release-date-range">
                                        <span className="sc-form-item-label search-mind-label">活动时间</span>
                                        {getFieldDecorator('releaseDateRange', {
                                            initialValue: [],
                                            rules: [{ required: true, message: '请选择活动时间' }]
                                        })(
                                            <RangePicker
                                                size="default"
                                                className="manage-form-enterTime"
                                                showTime={{ format: MINUTE_FORMAT }}
                                                format={`${DATE_FORMAT} ${MINUTE_FORMAT}`}
                                                placeholder={['开始时间', '结束时间']}
                                            />
                                            )}
                                    </div>
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
                        </Row>
                        <Row gutter={40} type="flex" justify="end">
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
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div >
        );
    }
}

SearchForm.propTypes = {
    onCouponSearch: PropTypes.func,
    onCouponReset: PropTypes.func,
    visible: PropTypes.bool,
    form: PropTypes.objectOf(PropTypes.any)
};

SearchForm.defaultProps = {
    prefixCls: 'ReleaseList'
}

export default withRouter(Form.create()(SearchForm));
