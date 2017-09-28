/**
 * 促销管理 - 参与数据查询表单
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, DatePicker, Row, Col } from 'antd';
import { withRouter } from 'react-router';
import Util from '../../../util/util';
import { SubCompanies } from '../../../container/search';
import { DATE_FORMAT, MINUTE_FORMAT } from '../../../constant';
import { participate } from '../constants';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class SearchForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            branchCompanyId: ''
        };
        this.getStatus = this.getStatus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.getSearchCondition = this.getSearchCondition.bind(this);
        this.getStatusFromCode = this.getStatusFromCode.bind(this);
        this.handleExport = this.handleExport.bind(this);
        this.handleSubCompanyClear = this.handleSubCompanyClear.bind(this);
        this.handleSubCompanyChoose = this.handleSubCompanyChoose.bind(this);
    }

    getStatus(stateName) {
        const keys = Object.keys(participate[stateName]);
        return keys.map((key) => (
            <Option key={key} value={key}>
                {participate[stateName][key]}
            </Option>
        ));
    }

    getStatusFromCode(statusCode) {
        if (statusCode === 'ALL') {
            return '';
        }
        return statusCode;
    }

    getSearchCondition() {
        const {
            orderId,
            promotionName,
            participateTimeRange,
            orderState,
            paymentState,
            shippingStateCode,
            franchiseeId,
            storeId
        } = this.props.form.getFieldsValue();
        const { match } = this.props;
        return Util.removeInvalid({
            promoId: match.params.id,
            orderId,
            storeId,
            promotionName,
            orderState: this.getStatusFromCode(orderState),
            paymentState: this.getStatusFromCode(paymentState),
            shippingState: this.getStatusFromCode(shippingStateCode),
            recordTimeStart: participateTimeRange.length > 1 ? participateTimeRange[0].valueOf() : '',
            recordTimeEnd: participateTimeRange.length > 1 ? participateTimeRange[1].valueOf() : '',
            franchiseeId,
            branchCompanyId: this.state.branchCompanyId
        });
    }

    /**
     * 子公司-清除
     */
    handleSubCompanyClear() {
        this.setState({
            branchCompanyId: ''
        });
    }

    /**
     * 子公司-值清单
     */
    handleSubCompanyChoose(branchCompanyId) {
        this.setState({ branchCompanyId });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.onParticipateSearch(this.getSearchCondition());
    }

    handleReset() {
        this.handleSubCompanyClear(); // 清除子公司值清单
        this.props.form.resetFields();  // 清除当前查询条件
        this.props.onParticipateReset();  // 通知父页面已清空
    }

    handleExport() {
        this.props.onParticipateExport(this.getSearchCondition());   // 通知父组件导出数据
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="search-box participate">
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <div className="search-conditions">
                        <Row gutter={40}>
                            <Col span={8}>
                                <FormItem label="订单编号" style={{ paddingRight: 10 }}>
                                    {getFieldDecorator('orderId')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="订单状态">
                                    {getFieldDecorator('orderState', {
                                        initialValue: 'ALL'
                                    })(
                                        <Select style={{ width: '153px' }} size="default">
                                            {this.getStatus('orderState')}
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="支付状态">
                                    {getFieldDecorator('paymentState', {
                                        initialValue: 'ALL'
                                    })(
                                        <Select style={{ width: '153px' }} size="default">
                                            {this.getStatus('paymentState')}
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={8}>
                                <FormItem label="门店编号">
                                    {getFieldDecorator('storeId')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="加盟商编号">
                                    {getFieldDecorator('franchiseeId')(<Input size="default" />)}
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
                                            onSubCompaniesClear={this.handleSubCompanyClear}
                                        />
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={8}>
                                <FormItem label="领取时间">
                                    {getFieldDecorator('participateTimeRange', {
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
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="使用时间">
                                    {getFieldDecorator('recordTime', {
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
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={40} type="flex" justify="end">
                            <Col>
                                <FormItem>
                                    <Button type="primary" size="default" htmlType="submit">
                                        查询
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button size="default" onClick={this.handleExport}>
                                        导出
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
    onParticipateSearch: PropTypes.func,
    onParticipateReset: PropTypes.func,
    onParticipateExport: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    match: PropTypes.objectOf(PropTypes.any)
};

SearchForm.defaultProps = {
    prefixCls: 'ParticipateList'
}

export default withRouter(Form.create()(SearchForm));
