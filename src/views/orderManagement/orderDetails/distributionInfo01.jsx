/**
 * @file distributionInfo.jsx
 * @author caoyanxuan
 *
 * 订单管理详情页-配送信息
 */

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Form, Icon, Row, Col, Select, Modal, InputNumber,
    DatePicker, Button, message, Table, Input,
} from 'antd';
import moment from 'moment';
import { modifyDistributionColumns } from '../../../actions/modify/modifyDistributionColumns';
import { DATE_FORMAT } from '../../../constant/index';

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

@connect(
    state => ({
        // ToDo：查询调接口时，需要走redux拿数据
    }),
    dispatch => bindActionCreators({
        modifyDistributionColumns
    }, dispatch)
)
class DistributionInformation extends PureComponent {
    constructor(props) {
        super(props);
        this.handleDistributionSave = ::this.handleDistributionSave;
        this.onDeliveryDateChange = ::this.onDeliveryDateChange;
        this.onWillArrivalDateChange = ::this.onWillArrivalDateChange;
        this.state = {
            deliveryDate: props.initialData.deliveryDate,
            willArrivalDate: props.initialData.willArrivalDate,
        }
        this.columns = [{
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
            render: (text) => (
                <span>
                    <span>{text}</span>
                    <span>{props.initialData.unit}</span>
                </span>
            )
        }, {
            title: '配送数量',
            dataIndex: 'deliveryNumber',
            key: 'deliveryNumber',
            render: (text, record, index) => (
                <span>
                    <InputNumber
                        value={text}
                        min={0}
                        max={record.number}
                        onChange={(value) => {
                            props.modifyDistributionColumns(index, value, 'deliveryNumber');
                        }}
                    />
                    <span>{}</span>
                </span>
            )
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
            render: (text, record, index) => (
                <span>
                    <InputNumber
                        value={text}
                        min={0}
                        max={record.deliveryNumber}
                        onChange={(value) => {
                            props.modifyDistributionColumns(index, value, 'getNumber');
                        }}
                    />
                    <span>{}</span>
                </span>
            )
        }, {
            title: '签收差额',
            dataIndex: 'differMoney',
            key: 'differMoney',
            render: (text) => (
                <span>{text}元</span>
            )
        }];
    }

    componentDidMount() {
    }

    /**
     * 配送日期
     * @param {moment} date moment对象
     */
    onDeliveryDateChange(date) {
        this.setState({
            deliveryDate: date === null ? null : String(date.valueOf())
        })
    }

    /**
     * 预期到达日期
     * @param {moment} date moment对象
     */
    onWillArrivalDateChange(date) {
        this.setState({
            willArrivalDate: date === null ? null : String(date.valueOf())
        })
    }

    /**
     * 保存
     */
    handleDistributionSave() {
        // const {
        //     logisticsProvider,
        //     logisticsNumber,
        //     deliverier,
        //     contact
        // } = this.props.form.getFieldsValue();
        confirm({
            title: '保存',
            content: '确认保存备注信息？',
            onOk: () => {
                this.props.form.validateFields((err) => {
                    if (!err) {
                        // ToDo：带数据发请求，提交表单

                        // 日期（时间戳）
                        message.success('保存成功！');
                    }
                })
            },
            onCancel() {},
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { initialData } = this.props;
        const deliveryDate = moment(parseInt(initialData.deliveryDate, 10)).format(DATE_FORMAT);
        const willArrivalDate
        = moment(parseInt(initialData.willArrivalDate, 10)).format(DATE_FORMAT);
        return (
            <div>
                <div className="order-details-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="credit-card" className="detail-message-header-icon" />
                            配送汇总
                        </div>
                        <div>
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
                                                        initialValue: initialData.logisticsProvider
                                                        ? initialData.logisticsProvider
                                                        : '全部'
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
                                                    <DatePicker
                                                        defaultValue={moment(deliveryDate, DATE_FORMAT)}
                                                        onChange={this.onDeliveryDateChange}
                                                    />
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
                                                        initialValue: moment(willArrivalDate, DATE_FORMAT)
                                                    })(
                                                        <DatePicker
                                                            onChange={this.onWillArrivalDateChange}
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
                        <div>
                            <Table
                                dataSource={initialData.distributionInfo}
                                columns={this.columns}
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
                            >
                                保存
                            </Button>
                            <Button
                                size="default"
                                onClick={() => {
                                    this.props.history.goBack();
                                }}
                            >
                                返回
                            </Button>
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
    history: PropTypes.objectOf(PropTypes.any),
    modifyDistributionColumns: PropTypes.func,
}

DistributionInformation.defaultProps = {
}

export default withRouter(Form.create()(DistributionInformation));
