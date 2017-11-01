import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Input, Form, Select, DatePicker, Row, Col, Icon } from 'antd';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import { connect } from 'react-redux';
import Utils from '../../util/util';
import { returnGoodsType, returnGoodsStatus, goodsReceiptStatus } from '../../constant/salesManagement';
import { returnGoodsList, returnGoodsListFormData } from '../../actions';
import { PAGE_SIZE } from '../../constant';


const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

@connect(
    state => ({
        data: state.toJS().pageParameters.returnGoodsParams
    }),
    dispatch => bindActionCreators({
        returnGoodsList,
        returnGoodsListFormData
    }, dispatch)
)


class ReturGoodsForm extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { returnGoodsList, data } = this.props
        returnGoodsList(data)
    }

    // 获取用于搜索的所有有效表单值
    getSearchParams = () => {
        const {
            branchCompanyId,
            franchiseeId,
            id,
            orderId,
            shippingState,
            createTime,
            state
            } = this.props.form.getFieldsValue();

        const startCreateTime = createTime ? Date.parse(createTime[0].format(dateFormat)) : '';
        const endCreateTime = createTime ? Date.parse(createTime[1].format(dateFormat)) : '';
        const searchParams = {
            branchCompanyId: branchCompanyId,
            franchiseeId: franchiseeId,
            id: id,
            orderId: orderId,
            shippingState: shippingState,
            state: state,
            startCreateTime,
            endCreateTime
        };

        return Utils.removeInvalid(searchParams);
    }

    //搜索方法
    requestSearch = (nextPage) => {
        const { returnGoodsListFormData, returnGoodsList, page } = this.props;
        const seachParams = this.getSearchParams();
        let data = {
            pageSize: PAGE_SIZE,
            pageNum: nextPage ? nextPage : page,
            ...seachParams
        }
        returnGoodsListFormData(data)
        returnGoodsList(data)
    }


    //搜索

    handleSearch = (e) => {
        e.preventDefault();
        this.requestSearch()
    }


    //重置
    handleReset = () => {
        this.props.form.resetFields();
    }

    //父组件page改变
    componentWillReceiveProps(nextProps) {
        if (this.props.page !== nextProps.page) {
            this.requestSearch(nextProps.page)
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.props
        return (
            <div className="search-box">
                <Form
                    layout="inline"
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSearch}
                >
                    <Row gutter={40}>
                        <Col span={8}>
                            <FormItem label='原订单号'>
                                {getFieldDecorator(`orderId`, {
                                    initialValue: data.orderId
                                })(
                                    <Input size="default" placeholder="原订单号" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='子公司'>
                                {getFieldDecorator(`branchCompanyId`, {
                                    initialValue: data.branchCompanyId
                                })(
                                    <Input size="default" placeholder="子公司名称" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='雅堂小超'>
                                {getFieldDecorator(`franchiseeId`, {
                                    initialValue: data.franchiseeId
                                })(
                                    <Input size="default" placeholder="雅堂小超名称" />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={40}>
                        <Col span={8}>
                            <FormItem label='退货单号'>
                                {getFieldDecorator(`id`, {
                                    initialValue: data.id
                                })(
                                    <Input size="default" placeholder="退货单号" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="退货单状态">
                                {getFieldDecorator('state', {
                                    initialValue: data.state ? data.state : ''
                                })(
                                    <Select style={{ width: '153px' }} size="default">
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
                        <Col span={8}>
                            <FormItem label="收货状态">
                                {getFieldDecorator('shippingState', {
                                    initialValue: data.shippingState ? data.shippingState : ''
                                })(
                                    <Select style={{ width: '153px' }} size="default">
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
                    </Row>
                    <Row gutter={40}>
                        <Col span={8}>
                            <FormItem >
                                <div className="row middle">
                                    <span className="ant-form-item-label search-mind-label">退货日期</span>
                                    {getFieldDecorator('createTime', {
                                        initialValue: data.startCreateTime ? [moment(data.startCreateTime), moment(data.endCreateTime)] : null
                                    })(
                                        <RangePicker
                                            className="date-range-picker"
                                            style={{ width: 250 }}
                                            format={dateFormat}
                                            showTime={{
                                                hideDisabledOptions: true,
                                                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                            }}
                                            placeholder={['开始日期', '结束日期']}
                                            onChange={this.chooseCreateDate}
                                        />
                                        )}
                                </div>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={40}>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit">搜索</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                        </Col>
                    </Row>
                </Form>
            </div >
        );
    }
}

ReturGoodsForm.propTypes = {
    onSearch: PropTypes.func,
    onReset: PropTypes.func,
    data: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(ReturGoodsForm));
