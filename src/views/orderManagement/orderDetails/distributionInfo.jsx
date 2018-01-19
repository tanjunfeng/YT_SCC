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
import { Form, Icon, Row, Col, Table, Input, Button } from 'antd';
import { DATE_FORMAT } from '../../../constant/index';
import { distributionInformationColumns as columns } from '../columns';
import FlowImage from '../../../components/flowImage';
import Utils from '../../../util/util';

const { TextArea } = Input;

@connect(
    state => ({
        shippingDetailData: state.toJS().order.shippingDetailData,
        flowChartData: state.toJS().process.flowChartData
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)
class DistributionInformation extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            flowChartData: null
        }
    }

    closeCanvas = () => {
        this.setState({flowChartData: null})
    }

    showCanvas = () => {
        const data = this.props.shippingDetailData.singedCertImg;
        this.setState({flowChartData: data})
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
            shippingState,
            shippingModes,
            distributionName,
        } = this.props.shippingDetailData;
        const shipping = {
            '': '',
            unified: '统配',
            provider: '直送'
        }
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
                                            {Utils.getDate(shipOnDate)}
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
                                            {Utils.getDate(estimatedArrivalDate)}
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
                            <Row>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">物流状态:</span>
                                    <span>{shippingState}</span>
                                </Col>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">签收凭证:</span>
                                    <span>
                                        <span>供应商已签收&nbsp;&nbsp;</span>
                                        <a onClick={this.showCanvas}>查看</a>
                                    </span>
                                </Col>
                                <Col className="gutter-row" span={10}>
                                    <span className="details-info-lable">配送方式:</span>
                                    <span>{shipping[shippingModes]}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">配送方:</span>
                                    <span>{distributionName}</span>
                                </Col>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">备注:</span>
                                    <TextArea
                                        autosize={{ minRows: 3, maxRows: 6 }}
                                        value={''}
                                        style={{ resize: 'none' }}
                                        maxLength="250"
                                        onChange={(e) => {
                                            this.setState({
                                                textAreaNote: e.target.value
                                            })
                                        }}
                                    />
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
                <FlowImage data={this.state.flowChartData} closeCanvas={this.closeCanvas} >
                    <Button type="primary" shape="circle" icon="close" className="closeBtn" onClick={this.closeCanvas} />
                </FlowImage>
            </div>
        );
    }
}

DistributionInformation.propTypes = {
    shippingDetailData: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(DistributionInformation));
