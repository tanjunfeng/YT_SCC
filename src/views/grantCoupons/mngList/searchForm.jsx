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
import { promotionStatus } from '../constants';
import { SubCompanies } from '../../../container/search';
import ReleaseCouponModal from '../release';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            branchCompanyId: '',
            isReleaseCouponModalVisible: false
        }
        this.getStatus = this.getStatus.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.getFormData = this.getFormData.bind(this);
        this.handleSubCompanyChoose = this.handleSubCompanyChoose.bind(this);
        this.hanldeSubCompaniesClear = this.hanldeSubCompaniesClear.bind(this);
        this.handleQueryResults = this.handleQueryResults.bind(this);
        this.handleQueryCoupons = this.handleQueryCoupons.bind(this);
        this.handleSelectOk = this.handleSelectOk.bind(this);
        this.handleSelectCancel = this.handleSelectCancel.bind(this);
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
            storeId,
            storeName
        } = this.props.form.getFieldsValue();
        const startDate = promotionDateRange ? promotionDateRange[0].valueOf() : '';
        const endDate = promotionDateRange ? promotionDateRange[1].valueOf() : '';
        const branchCompanyId = this.state.branchCompanyId;
        let status = statusCode;
        if (statusCode === 'all') {
            status = '';
        }
        return Utils.removeInvalid({
            id,
            promotionName,
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
        this.props.onPromotionSearch(this.getFormData());
    }

    handleQueryResults() {
        this.setState({ isReleaseCouponModalVisible: true });
    }

    handleQueryCoupons() {
        this.setState({ isReleaseCouponModalVisible: true });
    }

    handleSelectOk(promotionIds) {
        console.log(promotionIds);
        this.setState({ isReleaseCouponModalVisible: false });
    }

    handleSelectCancel() {
        this.setState({ isReleaseCouponModalVisible: false });
    }

    handleReset() {
        this.hanldeSubCompaniesClear(); // 清除子公司值清单
        this.props.form.resetFields();  // 清除当前查询条件
        this.props.onPromotionReset();  // 通知父页面已清空
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
                                    {getFieldDecorator('promotionName')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem>
                                    <div className="row">
                                        <span className="sc-form-item-label search-mind-label">
                                            所属公司
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
                                <FormItem label="门店编号" style={{ paddingRight: 10 }}>
                                    {getFieldDecorator('storeId')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="门店名称">
                                    {getFieldDecorator('storeName')(<Input size="default" />)}
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
                                    <Button type="primary" size="default" onClick={this.handleQueryResults}>
                                        查询结果发券
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" size="default" onClick={this.handleQueryCoupons}>
                                        发券
                                    </Button>
                                </FormItem>
                            </Col>
                        </Row>
                        <ReleaseCouponModal
                            visible={this.state.isReleaseCouponModalVisible}
                            onReleaseCouponModalOk={this.handleSelectOk}
                            onReleaseCouponModalCancel={this.handleSelectCancel}
                        />
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
};

SearchForm.defaultProps = {
    prefixCls: 'PromotionList'
}

export default withRouter(Form.create()(SearchForm));
