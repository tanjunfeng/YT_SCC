/**
 * 发放优惠券
 *
 * @author taoqiyu,tanjf
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, Row, Col } from 'antd';
import { withRouter } from 'react-router';
import Utils from '../../../util/util';
import { promotionStatus } from '../constants';
import { BranchCompany } from '../../../container/search';
import ReleaseCouponModal from '../release';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends PureComponent {
    state = {
        isReleaseCouponModalVisible: false,
        grantMethod: 0 // 发券策略
    }

    getStatus = () => {
        const keys = Object.keys(promotionStatus);
        return keys.map((key) => (
            <Option key={key} value={key}>
                {promotionStatus[key]}
            </Option>
        ));
    }

    getFormData = () => {
        const {
            franchiseeId,
            franchinessController,
            storeId,
            storeName,
            branchCompany
        } = this.props.form.getFieldsValue();
        return Utils.removeInvalid({
            franchiseeId,
            franchinessController,
            storeId,
            storeName,
            branchCompanyId: branchCompany.id
        });
    }

    handleSearch = () => {
        // 将查询条件回传给调用页
        this.props.onPromotionSearch(this.getFormData());
    }

    handleQueryResults = () => {
        this.setState({ isReleaseCouponModalVisible: true, grantMethod: 0 });
    }

    handleQueryCoupons = () => {
        this.setState({ isReleaseCouponModalVisible: true, grantMethod: 1 });
    }

    handleSelectOk = (coupons) => {
        this.setState({ isReleaseCouponModalVisible: false });
        switch (this.state.grantMethod) {
            case 0:
                // 通知查询结果发券
                this.props.onPromotionReleaseAll(coupons);
                break;
            case 1:
                // 通知发券
                this.props.onPromotionReleasChecked(coupons);
                break;
            default:
                break;
        }
    }

    handleSelectCancel = () => {
        this.setState({ isReleaseCouponModalVisible: false });
    }

    handleReset = () => {
        this.props.form.resetFields(); // 清除当前查询条件
        this.props.onPromotionReset(); // 通知父页面已清空
        // 点击重置时清除 seachMind 引用文本
        this.props.form.setFieldsValue({
            branchCompany: { reset: true }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" className="grant-coupons">
                <Row className="row-bottom">
                    <Col>
                        <FormItem label="加盟商编号">
                            {getFieldDecorator('franchiseeId')(<Input size="default" />)}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="加盟商名称">
                            {getFieldDecorator('franchinessController')(<Input size="default" />)}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="所属子公司" className="itemTop">
                            {getFieldDecorator('branchCompany', {
                                initialValue: { id: '', name: '' }
                            })(<BranchCompany />)}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="门店编号">
                            {getFieldDecorator('storeId')(<Input size="default" />)}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="门店名称">
                            {getFieldDecorator('storeName')(<Input size="default" />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="end">
                    <Col>
                        <Button type="primary" size="default" onClick={this.handleSearch}>
                            查询
                        </Button>
                        <Button size="default" onClick={this.handleReset}>
                            重置
                        </Button>
                        <Button type="primary" size="default" onClick={this.handleQueryResults}>
                            查询结果发券
                        </Button>
                        <Button type="primary" size="default" disabled={this.props.isGrantDisabled} onClick={this.handleQueryCoupons}>
                            发券
                        </Button>
                    </Col>
                </Row>
                <ReleaseCouponModal
                    visible={this.state.isReleaseCouponModalVisible}
                    onReleaseCouponModalOk={this.handleSelectOk}
                    onReleaseCouponModalCancel={this.handleSelectCancel}
                />
            </Form>
        );
    }
}

SearchForm.propTypes = {
    onPromotionSearch: PropTypes.func,
    onPromotionReset: PropTypes.func,
    onPromotionReleaseAll: PropTypes.func,
    onPromotionReleasChecked: PropTypes.func,
    isGrantDisabled: PropTypes.bool,
    form: PropTypes.objectOf(PropTypes.any)
};

SearchForm.defaultProps = {
    prefixCls: 'PromotionList'
}

export default withRouter(Form.create()(SearchForm));
