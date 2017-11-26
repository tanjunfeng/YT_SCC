/**
 * @author taoqiyu
 *
 * 订单详情页-后台退货
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Icon, Row, Col, Input, Button, Select, message } from 'antd';
import moment from 'moment';
import { TIME_FORMAT } from '../../../constant/index';
import CauseModal from '../orderList/causeModal';
import GoodsReturnsInfo from '../goodsReturnsInfo';
import {
    fetchOrderDetailInfo,
    clearOrderDetailInfo,
    backstageOrderBack
} from '../../../actions/order';
import { returnReasonStatus } from '../constants';
import Utils from '../../../util/util';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

@connect(
    state => ({
        orderDetailData: state.toJS().order.orderDetailData
    }),
    dispatch => bindActionCreators({
        fetchOrderDetailInfo,
        clearOrderDetailInfo,
        backstageOrderBack
    }, dispatch)
)

class BackstageBack extends PureComponent {
    state = {
        textAreaNote: this.props.orderDetailData.description,
        requestItems: [],
        canSubmit: true
    }

    componentWillMount() {
        this.props.clearOrderDetailInfo();
    }

    componentDidMount() {
        this.props.fetchOrderDetailInfo({
            id: this.props.match.params.id
        });
    }

    /**
     * 将刷新后的categorys值，push到数组中
     * @param {Object} nextProps 刷新后的属性
     */
    componentWillReceiveProps(nextProps) {
        const { orderDetailData } = nextProps;
        this.setState({
            textAreaNote: orderDetailData.description
        });
    }

    getReturnReasonStatus = () => (
        returnReasonStatus.map((reason, index) => (
            <Option key={reason} value={String(index)}>
                {reason}
            </Option>
        ))
    )

    getFormData = (callback) => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                this.setState({ canSubmit: true });
                return;
            }
            const { returnReasonType, returnReason } = values;
            const dist = {
                orderId: this.orderId,
                returnReasonType, returnReason,
                requestItems: JSON.stringify(this.state.requestItems)
            };
            callback(Utils.removeInvalid(dist));
        });
    }

    getAmount = amount => (`￥${Number(amount).toFixed(2)}`);

    /**
     * 执行退货操作
     */
    handleSubmit = (e) => {
        this.setState({ canSubmit: false });
        e.preventDefault();
        this.getFormData(data => {
            this.props.backstageOrderBack(data).then(res => {
                if (res.code === 200) {
                    message.success('退货成功');
                } else {
                    this.setState({ canSubmit: true });
                }
            });
        });
    }

    /**
     * 退货返回商品列表
     */
    handleGoodsReturns = (requestItems) => {
        this.setState({
            requestItems
        });
    }

    orderId = this.props.match.params.id;

    render() {
        const { orderDetailData, form } = this.props;
        const { requestItems, canSubmit } = this.state;
        const getFieldDecorator = form.getFieldDecorator;
        return (
            <div>
                <div className="order-details-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />
                            原订单信息
                        </div>
                        <div className="detail-message-body">
                            <Row>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">订单编号:</span>
                                    <span>{orderDetailData.id}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">父订单编号:</span>
                                    <span>{orderDetailData.createdByOrderId}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">订单类型:</span>
                                    <span>{orderDetailData.orderTypeDesc}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">商品总金额:</span>
                                    <span>{this.getAmount(orderDetailData.rawSubtotal)}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">订单状态:</span>
                                    <span>{orderDetailData.orderStateDesc}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">支付状态:</span>
                                    <span>{orderDetailData.paymentStateDesc}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">物流状态:</span>
                                    <span>{orderDetailData.shippingStateDesc}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">运费:</span>
                                    <span>{this.getAmount(orderDetailData.shipping)}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">子公司:</span>
                                    <span>{orderDetailData.branchCompanyName}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">加盟商:</span>
                                    <span>{orderDetailData.franchiseeId}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">出货仓:</span>
                                    <span>{orderDetailData.branchCompanyArehouse}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">优惠券优惠:</span>
                                    <span>-{
                                        this.getAmount(orderDetailData.couponDiscountAmount)
                                    }</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={18}>
                                    <span className="details-info-lable">电商单据编号:</span>
                                    <span>{orderDetailData.thirdPartOrderNo}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">活动优惠:</span>
                                    <span>-{this.getAmount(orderDetailData.discount)}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={12}>
                                    <span className="details-info-lable">备注:</span>
                                    <TextArea
                                        disabled
                                        autosize={{
                                            minRows: 3,
                                            maxRows: 6
                                        }}
                                        value={this.state.textAreaNote}
                                        style={{
                                            resize: 'none'
                                        }}
                                        maxLength="250"
                                        onChange={(e) => {
                                            this.setState({
                                                textAreaNote: e.target.value
                                            })
                                        }}
                                    />
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">下单时间:</span>
                                    <span>
                                        {moment(parseInt(orderDetailData.creationTime, 10))
                                            .format(TIME_FORMAT)}
                                    </span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">实付金额:</span>
                                    <span className="red-star">{this.getAmount(orderDetailData.total)}</span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <div className="order-details-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="gift" className="detail-message-header-icon" />
                            收货信息
                        </div>
                        <div className="detail-message-body">
                            <Row>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">收货人:</span>
                                    <span>{orderDetailData.consigneeName}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">所在地区:</span>
                                    <span>{orderDetailData.province}</span>
                                    <span>{orderDetailData.city}</span>
                                    <span>{orderDetailData.district}</span>
                                </Col>
                                <Col className="gutter-row" span={10}>
                                    <span className="details-info-lable">街道地址:</span>
                                    <span>{orderDetailData.detailAddress}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">手机:</span>
                                    <span>{orderDetailData.cellphone}</span>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <span className="details-info-lable">固定电话:</span>
                                    <span>{orderDetailData.telephone}</span>
                                </Col>
                                <Col className="gutter-row" span={10}>
                                    <span className="details-info-lable">邮编:</span>
                                    <span>{orderDetailData.postcode}</span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <div className="order-details-item">
                    <GoodsReturnsInfo
                        value={{
                            orderDetailData: this.props.orderDetailData,
                            requestItems: this.state.requestItems
                        }}
                        onChange={this.handleGoodsReturns}
                    />
                </div>
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <div className="order-details-item">
                        <div className="detail-message">
                            <div className="detail-message-header">
                                <Icon type="gift" className="detail-message-header-icon" />
                                收货信息
                            </div>
                        </div>
                        <div className="detail-message-body">
                            <Row>
                                <Col className="gutter-row">
                                    <FormItem label="*退货原因">
                                        {getFieldDecorator('returnReasonType', {
                                            initialValue: '0',
                                            rules: [{
                                                pattern: /^[1-7]$/,
                                                message: '退货原因必选'
                                            }]
                                        })(
                                            <Select className="reason-select" size="default">
                                                {this.getReturnReasonStatus()}
                                            </Select>)}
                                    </FormItem>
                                    {this.props.form.getFieldValue('returnReasonType') === '7' ?
                                        <FormItem className="return-reason">
                                            {getFieldDecorator('returnReason', {
                                                initialValue: '',
                                                rules: [{
                                                    required: true,
                                                    message: '其他退货原因必填'
                                                }, {
                                                    max: 150,
                                                    message: '不能输入超过150个字'
                                                }]
                                            })(
                                                <TextArea
                                                    placeholder="其他退货原因"
                                                    autosize={{
                                                        minRows: 4,
                                                        maxRows: 6
                                                    }}
                                                />)}
                                        </FormItem>
                                        : null}
                                </Col>
                            </Row>
                            <Row>
                                <Col
                                    className="gutter-row"
                                    span={14}
                                    offset={10}
                                >
                                    <Button
                                        size="default"
                                        htmlType="submit"
                                        disabled={requestItems.length === 0 || !canSubmit}
                                        type="primary"
                                    >
                                        退货
                                </Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Form>
                <div>
                    <CauseModal />
                </div>
            </div>
        );
    }
}

BackstageBack.propTypes = {
    orderDetailData: PropTypes.objectOf(PropTypes.any),
    form: PropTypes.objectOf(PropTypes.any),
    fetchOrderDetailInfo: PropTypes.func,
    clearOrderDetailInfo: PropTypes.func,
    backstageOrderBack: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(BackstageBack));
