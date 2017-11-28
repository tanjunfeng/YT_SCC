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
import { distributionInformationColumns as columns } from '../columns';

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
            </div>
        );
    }
}

DistributionInformation.propTypes = {
    shippingDetailData: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(DistributionInformation));
