/**
 * 促销管理查询条件
 *
 * @author taoqiyu,tanjf
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, Row, Col } from 'antd';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Utils from '../../../../util/util';
import { promotionStatus } from '.././constants';
import { BranchCompany } from '../../../../container/search';
import { pubFetchValueList } from '../../../../actions/pub';
import { PAGE_SIZE } from '../../../../constant';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({
        data: state.toJS().queryWhiteList.data,
    }),
    dispatch => bindActionCreators({
        pubFetchValueList,
    }, dispatch)
)

class SearchForm extends PureComponent {
    state = {
        branchCompanyId: '',
        isReleaseCouponModalVisible: false,
        grantMethod: 0,
        warehouseVisible: false,
        companyVisible: false,
        supplyChoose: {},
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
            franchinessName,
            storeId,
            storeName,
            scPurchaseFlag,
            branchCompany
        } = this.props.form.getFieldsValue();
        let status = scPurchaseFlag;
        const pageSize = PAGE_SIZE;
        if (scPurchaseFlag === 'all') {
            status = '';
        }
        return Utils.removeInvalid({
            franchiseeId,
            franchinessName,
            storeId,
            storeName,
            scPurchaseFlag: status,
            branchCompanyId: branchCompany.id,
            pageSize,
            pageNo: 1,
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

    handleGoOnline = () => {
        this.props.onModalClick();
    }

    handleOffline = () => {
        this.props.onModalOfflineClick();
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
                                    {getFieldDecorator('franchiseeId')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="加盟商名称">
                                    {getFieldDecorator('franchinessName')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="所属子公司">
                                    {getFieldDecorator('branchCompany', {
                                        initialValue: { id: '', name: '' }
                                    })(<BranchCompany />)}
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
                                    {getFieldDecorator('scPurchaseFlag', {
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
                                    <Button
                                        type="primary"
                                        size="default"
                                        onClick={this.handleGoOnline}
                                        disabled={this.props.value.selectListlength}
                                    >
                                        上线
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button
                                        type="primary"
                                        size="default"
                                        onClick={this.handleOffline}
                                        disabled={this.props.value.selectListlength}
                                    >
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
    onModalClick: PropTypes.func,
    onModalOfflineClick: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    value: PropTypes.objectOf(PropTypes.any),
};

SearchForm.defaultProps = {
    prefixCls: 'whiteListConfiguration'
}

export default withRouter(Form.create()(SearchForm));
