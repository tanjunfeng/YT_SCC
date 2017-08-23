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
import { Form, Icon, Row, Col, Button, Table } from 'antd';
import moment from 'moment';
import { DATE_FORMAT } from '../../../constant/index';

const columns = [{
    title: '商品编码',
    dataIndex: 'skuId',
    key: 'skuId',
}, {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName',
}, {
    title: '订单数量',
    dataIndex: 'quantity',
    key: 'quantity',
    render: (text, record) => (
        <span>
            <span>{text}</span>
            <span>{record.unit}</span>
        </span>
    )
}, {
    title: '配送数量',
    dataIndex: 'shippedQuantity',
    key: 'shippedQuantity',
    render: (text, record) => (
        <span>
            <span>{text}</span>
            <span>{record.unit}</span>
        </span>
    )
}, {
    title: '单价',
    dataIndex: 'salePrice',
    key: 'salePrice',
    render: (text) => (
        <span>￥{text}</span>
    )
}, {
    title: '签收数量',
    dataIndex: 'completedQuantity',
    key: 'completedQuantity',
    render: (text, record) => (
        <span>
            <span>{text}</span>
            <span>{record.unit}</span>
        </span>
    )
}, {
    title: '签收差额',
    dataIndex: 'completedMulAmount',
    key: 'completedMulAmount',
    render: (text) => (
        <span>{text}元</span>
    )
}];

@connect(
    state => ({
        shippingDetailData: state.toJS().order.shippingDetailData,
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)
class DistributionInformation extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const {
            shippingMethod,
            shipOnDate,
            shippingNo,
            estimatedArrivalDate,
            deliveryer,
            deliveryerPhone,
            shippingProductDtos,
        } = this.props.shippingDetailData;
        return (
            <div>
                <div className="order-details-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="credit-card" className="detail-message-header-icon" />
                            配送汇总
                        </div>
                        <div className="detail-message-body">
                            <Row>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">物流商:</span>
                                    <span>{shippingMethod}</span>
                                </Col>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">配送日期:</span>
                                    {
                                        shipOnDate
                                        && <span>
                                            {moment(
                                                parseInt(shipOnDate, 10)
                                            ).format(DATE_FORMAT)}
                                        </span>
                                    }
                                </Col>
                                <Col className="gutter-row" span={10}>
                                    <span className="details-info-lable">物流单号:</span>
                                    <span>{shippingNo}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">预计达到日期:</span>
                                    {
                                        estimatedArrivalDate
                                        && <span>
                                            {moment(
                                                parseInt(estimatedArrivalDate, 10)
                                            ).format(DATE_FORMAT)}
                                        </span>
                                    }
                                </Col>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">送货人:</span>
                                    <span>{deliveryer}</span>
                                </Col>
                                <Col className="gutter-row" span={10}>
                                    <span className="details-info-lable">联系方式:</span>
                                    <span>{deliveryerPhone}</span>
                                </Col>
                            </Row>
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
                                dataSource={shippingProductDtos}
                                columns={columns}
                                pagination={false}
                                rowKey="skuId"
                            />
                        </div>
                    </div>
                </div>
                <div className="order-details-btns">
                    <Row>
                        <Col className="gutter-row" span={14} offset={10}>
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
    shippingDetailData: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
}

DistributionInformation.defaultProps = {
}

export default withRouter(Form.create()(DistributionInformation));
