/**
 * 促销管理查询条件
 *
 * @author taoqiyu,tanjf
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Row, Col, DatePicker } from 'antd';
import { withRouter } from 'react-router';
import Utils from '../../../util/util';
import { DATE_FORMAT, MINUTE_FORMAT } from '../../../constant';
import { SubCompanies } from '../../../container/search';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class SearchForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            branchCompanyId: ''
        }
        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.getFormData = this.getFormData.bind(this);
        this.handleSubCompanyChoose = this.handleSubCompanyChoose.bind(this);
        this.hanldeSubCompaniesClear = this.hanldeSubCompaniesClear.bind(this);
    }

    getFormData() {
        const {
            id,
            releaseName,
            releaseDateRange,
            statusCode,
            storeId,
            storeName
        } = this.props.form.getFieldsValue();
        const startDate = releaseDateRange ? releaseDateRange[0].valueOf() : '';
        const endDate = releaseDateRange ? releaseDateRange[1].valueOf() : '';
        const branchCompanyId = this.state.branchCompanyId;
        let status = statusCode;
        if (statusCode === 'all') {
            status = '';
        }
        return Utils.removeInvalid({
            id,
            releaseName,
            status,
            storeId,
            storeName,
            startDate,
            endDate,
            branchCompanyId
        });
    }

    handleSubCompanyChoose(branchCompanyId) {
        this.setState({ branchCompanyId });
    }

    hanldeSubCompaniesClear() {
        this.setState({ branchCompanyId: '' });
    }

    handleSearch() {
        // 将查询条件回传给调用页
        this.props.onReleaseSearch(this.getFormData());
    }

    handleReset() {
        this.hanldeSubCompaniesClear(); // 清除子公司值清单
        this.props.form.resetFields();  // 清除当前查询条件
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
                                    {getFieldDecorator('releaseName')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem>
                                    <div className="row">
                                        <span className="sc-form-item-label search-mind-label">
                                            使用范围
                                        </span>
                                        <SubCompanies
                                            value={this.state.branchCompanyId}
                                            onSubCompaniesChooesd={this.handleSubCompanyChoose}
                                            onSubCompaniesClear={this.hanldeSubCompaniesClear}
                                        />
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={8}>
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
    onReleaseSearch: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any)
};

SearchForm.defaultProps = {
    prefixCls: 'ReleaseList'
}

export default withRouter(Form.create()(SearchForm));
