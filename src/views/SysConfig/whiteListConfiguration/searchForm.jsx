/**
 * 促销管理查询条件
 *
 * @author taoqiyu,tanjf
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, Row, Col } from 'antd';
import { withRouter } from 'react-router';
import Utils from '../../../util/util';
import { promotionStatus } from './constants';
import { SubCompanies } from '../../../container/search';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            branchCompanyId: '',
            isReleaseCouponModalVisible: false,
            grantMethod: 0
        }
        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
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
            name,
            storeId,
            storename,
            statusCode
        } = this.props.form.getFieldsValue();
        const branchCompanyId = this.state.branchCompanyId;
        let status = statusCode;
        if (statusCode === 'all') {
            status = '';
        }
        return Utils.removeInvalid({
            id,
            name,
            storeId,
            storename,
            status,
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
        // 将查询条件回传给调用页
        this.props.onPromotionSearch(this.getFormData());
    }

    handleReset() {
        this.hanldeSubCompanyClear(); // 清除子公司值清单
        this.props.form.resetFields();  // 清除当前查询条件
        this.props.onPromotionReset();  // 通知父页面已清空
    }

    handleQueryResults() {
        this.setState({ isReleaseCouponModalVisible: true, grantMethod: 0 });
    }

    handleQueryCoupons() {
        this.setState({ isReleaseCouponModalVisible: true, grantMethod: 1 });
    }

    handleSelectCancel() {
        this.setState({ isReleaseCouponModalVisible: false });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="search-box promotion">
                <Form layout="inline">
                    <div className="search-conditions">
                        <Row gutter={40}>
                            <Col span={8}>
                                <FormItem label="加盟商编号" style={{ paddingRight: 10 }}>
                                    {getFieldDecorator('id')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="加盟商名称">
                                    {getFieldDecorator('name')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem>
                                    <div className="row">
                                        <span className="sc-form-item-label search-mind-label">所属子公司</span>
                                        <SubCompanies
                                            value={this.state.branchCompanyId}
                                            onSubCompaniesChooesd={this.handleSubCompanyChoose}
                                            onSubCompaniesClear={this.hanldeSubCompanyClear}
                                        />
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={8}>
                                <FormItem label="门店编号" style={{ paddingRight: 10 }}>
                                    {getFieldDecorator('storeId')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="门店名称" style={{ paddingRight: 10 }}>
                                    {getFieldDecorator('storeName')(<Input size="default" />)}
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
                                    <Button type="primary" size="default" onClick={this.handleGoOnline}>
                                        上线
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" size="default" onClick={this.handleOffline}>
                                        下线
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
