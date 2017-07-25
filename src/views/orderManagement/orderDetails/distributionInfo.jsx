/**
 * @file distributionInfo.jsx
 * @author caoyanxuan
 *
 * 订单管理详情页-配送信息
 */

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Form, Icon, Row, Col, Select, Modal, Input, DatePicker, Button, message, Table } from 'antd';
import moment from 'moment';

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

const columns = [{
    title: '商品编码',
    dataIndex: 'commodifyNumber',
    key: 'commodifyNumber',
}, {
    title: '商品名称',
    dataIndex: 'commodifyName',
    key: 'commodifyName',
}, {
    title: '订单数量',
    dataIndex: 'number',
    key: 'number',
}, {
    title: '配送数量',
    dataIndex: 'deliveryNumber',
    key: 'deliveryNumber',
}, {
    title: '单价',
    dataIndex: 'price',
    key: 'price',
    render: (text) => (
        <span>￥{text}</span>
    )
}, {
    title: '签收数量',
    dataIndex: 'getNumber',
    key: 'getNumber',
}, {
    title: '签收差额',
    dataIndex: 'differMoney',
    key: 'differMoney',
    render: (text) => (
        <span>￥{text}</span>
    )
}];

class DistributionInformation extends PureComponent {
    constructor(props) {
        super(props);
        this.handleDistributionSave = ::this.handleDistributionSave;
        this.handleDistributionReturn = ::this.handleDistributionReturn;

        this.state = {
        }
    }

    componentDidMount() {
    }

    /**
     * 保存
     */
    handleDistributionSave() {
        confirm({
            title: '保存',
            content: '确认保存备注信息？',
            onOk: () => {
                // console.log(this.state.textAreaNote)
                this.props.form.validateFields((err) => {
                    if (!err) {
                        message.success('保存成功！');
                    }
                })
            },
            onCancel() {},
        });
    }

    /**
     * 返回
     */
    handleDistributionReturn() {

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { initialData } = this.props;
        return (
            <div>
                <div className="order-details-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="credit-card" className="detail-message-header-icon" />
                            配送汇总
                        </div>
                        <div className="detail-message-body">
                            <Form layout="inline" className="manage-form">
                                <div className="gutter-example">
                                    <Row gutter={16}>
                                        <Col className="gutter-row" span={8}>
                                            <FormItem>
                                                <div>
                                                    <span className="sc-form-item-label">
                                                        <span className="red-star">*</span>
                                                        物流商
                                                    </span>
                                                    {getFieldDecorator('logisticsProvider', {
                                                        rules: [{
                                                            validator: (rule, value, callback) => {
                                                                if (value === '全部') {
                                                                    callback('请选择物流商');
                                                                }
                                                                callback();
                                                            }
                                                        }],
                                                        initialValue: initialData.logisticsProvider ? initialData.logisticsProvider : '全部'
                                                    })(
                                                        <Select
                                                            size="default"
                                                        >
                                                            {
                                                                initialData.logisticsProviders.map(
                                                                    (item) =>
                                                                    (<Option
                                                                        key={item}
                                                                        value={item}
                                                                    >
                                                                        {item}
                                                                    </Option>)
                                                                )
                                                            }
                                                        </Select>
                                                    )}
                                                </div>
                                            </FormItem>
                                        </Col>
                                        <Col className="gutter-row" span={8}>
                                            <FormItem>
                                                <div>
                                                    <span className="sc-form-item-label">
                                                        <span className="red-star">*</span>
                                                        配送日期
                                                    </span>
                                                    {getFieldDecorator('deliveryDate', {
                                                        rules: [{
                                                            required: true,
                                                            message: '请选择配送日期!'
                                                        }],
                                                        initialValue: moment(initialData.deliveryDate, 'YYYY-MM-DD')
                                                    })(
                                                        <DatePicker
                                                            onChange={this.onChange}
                                                            className="arrival-date-picker"
                                                        />
                                                    )}
                                                </div>
                                            </FormItem>
                                        </Col>
                                        <Col className="gutter-row" span={8}>
                                            <FormItem>
                                                <div>
                                                    <span className="sc-form-item-label">
                                                        <span className="red-star">*</span>
                                                        物流单号
                                                    </span>
                                                    {getFieldDecorator('logisticsNumber', {
                                                        rules: [{
                                                            required: true,
                                                            message: '请填写物流单号!',
                                                            whitespace: true
                                                        }],
                                                        initialValue: initialData.logisticsNumber
                                                    })(
                                                        <Input
                                                            placeholder="物流单号"
                                                        />
                                                    )}
                                                </div>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className="gutter-row" span={8}>
                                            <FormItem>
                                                <div>
                                                    <span className="sc-form-item-label">
                                                        <span className="red-star">*</span>
                                                        预计达到日期
                                                    </span>
                                                    {getFieldDecorator('willArrivalDate', {
                                                        rules: [{
                                                            required: true,
                                                            message: '请选择预计达到日期!'
                                                        }],
                                                        initialValue: moment(initialData.willArrivalDate, 'YYYY-MM-DD')
                                                    })(
                                                        <DatePicker
                                                            onChange={this.onChange}
                                                            className="arrival-date-picker"
                                                        />
                                                    )}
                                                </div>
                                            </FormItem>
                                        </Col>
                                        <Col className="gutter-row" span={8}>
                                            <FormItem>
                                                <div>
                                                    <span className="sc-form-item-label">
                                                        <span className="red-star">*</span>
                                                        送货人
                                                    </span>
                                                    {getFieldDecorator('deliverier', {
                                                        rules: [{
                                                            required: true,
                                                            message: '请填写送货人!',
                                                            whitespace: true
                                                        }],
                                                        initialValue: initialData.deliverier
                                                    })(
                                                        <Input
                                                            placeholder="送货人"
                                                        />
                                                    )}
                                                </div>
                                            </FormItem>
                                        </Col>
                                        <Col className="gutter-row" span={8}>
                                            <FormItem>
                                                <div>
                                                    <span className="sc-form-item-label">
                                                        <span className="red-star">*</span>
                                                        联系方式
                                                    </span>
                                                    {getFieldDecorator('contact', {
                                                        rules: [{
                                                            required: true,
                                                            message: '请填写联系方式!',
                                                            whitespace: true
                                                        }],
                                                        initialValue: initialData.contact
                                                        
                                                    })(
                                                        <Input
                                                            placeholder="联系方式"
                                                        />
                                                    )}
                                                </div>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
                <div className="order-details-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="file-text" className="detail-message-header-icon" />
                            配送列表
                        </div>
                        <div className="detail-message-body">
                            <Table
                                dataSource={initialData.distributionInfo}
                                columns={columns}
                                pagination={false}
                                rowKey="commodifyNumber"
                            />
                        </div>
                    </div>
                </div>
                <div className="order-details-btns">
                    <Row>
                        <Col className="gutter-row" span={14} offset={10}>
                            <Button
                                size="default"
                                onClick={this.handleDistributionSave}
                                type="primary"
                            >保存</Button>
                            <Button
                                size="default"
                                onClick={this.handleDistributionReturn}
                            >返回</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

DistributionInformation.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    initialData: PropTypes.objectOf(PropTypes.any),
}

DistributionInformation.defaultProps = {
}

export default withRouter(Form.create()(DistributionInformation));
