/**
 * 促销管理查询条件
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
        this.state = {
            branchCompanyId: ''
        }
        this.getStatus = this.getStatus.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.getFormData = this.getFormData.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleSubCompanyChoose = this.handleSubCompanyChoose.bind(this);
        this.hanldeSubCompanyClear = this.hanldeSubCompanyClear.bind(this);
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
        const branchCompanyId = branchCompany.id;
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
            branchCompanyId
        });
    }

    handleSubCompanyChoose(branchCompanyId) {
        this.setState({ branchCompanyId });
    }

    hanldeSubCompanyClear() {
        this.setState({ branchCompanyId: '' });
    }

    handleSearch() {
        // 通知父页面执行搜索
        this.props.onPromotionSearch(this.getFormData());
    }

    handleReset() {
        this.hanldeSubCompanyClear(); // 清除子公司值清单
        this.props.form.resetFields();  // 清除当前查询条件
        this.props.onPromotionReset();  // 通知查询条件已清除
    }

    handleCreate() {
        const { pathname } = this.props.location;
        this.props.history.push(`${pathname}/create`);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="search-box promotion">
                <Form layout="inline">
                    <div className="search-conditions">
                        <Row gutter={40}>
                            <Col span={8}>
                                <FormItem label="活动ID" style={{ paddingRight: 10 }}>
                                    {getFieldDecorator('id')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="活动名称">
                                    {getFieldDecorator('promotionName')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="所属公司">
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
                                            {this.getStatus()}
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem>
                                    <div className="promotion-date-range">
                                        <span className="sc-form-item-label search-mind-label">活动时间</span>
                                        {getFieldDecorator('promotionDateRange', {
                                            initialValue: []
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
