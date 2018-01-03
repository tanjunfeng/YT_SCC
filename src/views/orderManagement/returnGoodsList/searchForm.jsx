import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, DatePicker, Row, Col } from 'antd';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import { connect } from 'react-redux';
import Utils from '../../../util/util';
import { returnGoodsStatus, goodsReceiptStatus, returnType } from '../../../constant/salesManagement';
import { returnGoodsList } from '../../../actions';
import { BranchCompany, Franchisee } from '../../../container/search';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

@connect(
    () => ({
    }),
    dispatch => bindActionCreators({
        returnGoodsList
    }, dispatch)
)

class SearchForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    // 父组件page改变或点击确定或取消
    componentWillReceiveProps(nextProps) {
        if (this.props.upDate !== nextProps.upDate) {
            this.handleSearch()
        }
    }

    // 获取用于搜索的所有有效表单值
    getSearchParams = () => {
        const {
            branchCompany,
            franchisee,
            id,
            orderId,
            shippingState,
            createTime,
            state,
            returnRequestType
            } = this.props.form.getFieldsValue();
        const startCreateTime = createTime ? Date.parse(createTime[0].format(dateFormat)) : '';
        const endCreateTime = createTime ? Date.parse(createTime[1].format(dateFormat)) : '';
        const franchiseeId = franchisee.franchiseeId;
        const searchParams = {
            franchiseeId,
            branchCompanyId: branchCompany.id,
            id,
            orderId,
            shippingState,
            state,
            startCreateTime,
            endCreateTime,
            returnRequestType
        };

        return Utils.removeInvalid(searchParams);
    }

    // 搜索方法
    handleSearch = (e) => {
        e.preventDefault();
        // 将查询条件回传给调用页
        this.props.onPromotionSearch(this.getSearchParams());
    }

    // 重置
    handleReset = () => {
        this.props.form.resetFields();
        this.branchCompany = { id: '', name: '' }
        this.props.onPromotionReset();  // 通知父页面已清空
        // 点击重置时清除 seachMind 引用文本
        this.props.form.setFieldsValue({
            branchCompany: { reset: true }
        });
        this.props.form.setFieldsValue({
            franchisee: { reset: true }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.state;
        return (
            <div className="search-box">
                <Form
                    layout="inline"
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSearch}
                >
                    <Row gutter={40}>
                        <Col>
                            <FormItem label="退货单类型">
                                {getFieldDecorator('returnRequestType', {
                                    initialValue: data.state ? data.state : ''
                                })(
                                    <Select>
                                        {
                                            returnType.data.map((item) => (
                                                <Select.Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Select.Option>
                                            ))
                                        }
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="原订单号">
                                {getFieldDecorator('orderId', {
                                    initialValue: data.orderId
                                })(
                                    <Input size="default" placeholder="原订单号" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col>
                            {/* 子公司 */}
                            <FormItem label="分公司" className="itemTop">
                                {getFieldDecorator('branchCompany', {
                                    initialValue: { id: '', name: '' }
                                })(<BranchCompany />)}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="雅堂小超" className="itemTop">
                                {getFieldDecorator('franchisee', {
                                    initialValue: { franchiseeId: '', franchiseeName: '' }
                                })(<Franchisee />)}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="退货单号">
                                {getFieldDecorator('id', {
                                    initialValue: data.id
                                })(
                                    <Input size="default" placeholder="退货单号" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="退货单状态">
                                {getFieldDecorator('state', {
                                    initialValue: data.state ? data.state : ''
                                })(
                                    <Select size="default">
                                        {
                                            returnGoodsStatus.data.map((item) => (
                                                <Select.Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Select.Option>
                                            ))
                                        }
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="收货状态">
                                {getFieldDecorator('shippingState', {
                                    initialValue: data.shippingState ? data.shippingState : ''
                                })(
                                    <Select size="default">
                                        {
                                            goodsReceiptStatus.data.map((item) => (
                                                <Select.Option key={item.key} value={item.key}>
                                                    {item.value}
                                                </Select.Option>
                                            ))
                                        }
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col >
                            <FormItem label="退货日期">
                                {getFieldDecorator('createTime', {
                                    initialValue: data.startCreateTime ? [moment(data.startCreateTime), moment(data.endCreateTime)] : null
                                })(
                                    <RangePicker
                                        className="date-range-picker"
                                        format={dateFormat}
                                        showTime={{
                                            hideDisabledOptions: true,
                                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                        }}
                                        placeholder={['开始日期', '结束日期']}
                                        onChange={this.chooseCreateDate}
                                    />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={40} type="flex" justify="end">
                        <Col>
                            <Button type="primary" htmlType="submit">搜索</Button>
                            <Button onClick={this.handleReset}>重置</Button>
                        </Col>
                    </Row>
                </Form>
            </div >
        );
    }
}

SearchForm.propTypes = {
    onPromotionSearch: PropTypes.func,
    onPromotionReset: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    upDate: PropTypes.bool,
};

export default withRouter(Form.create()(SearchForm));
