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
import { Form, Icon, Row, Col, Button, Table, Modal } from 'antd';
import moment from 'moment';

import Utils from '../../../util/util';
import { DATE_FORMAT } from '../../../constant/index';
import EditableCell from './editableCell';
import { distributionInformationColumns as columns } from '../columns';

@connect(
    state => ({
        shippingDetailData: state.toJS().order.shippingDetailData,
        flowChartData: state.toJS().process.flowChartData
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)
class DistributionInformation extends PureComponent {
    state = {
        visible: false
    }
    /**
     * 签收数量编辑列
     */
    onCellChange = id => completedQuantity => {
        const goodsList = this.props.value;
        const index = goodsList.findIndex(item => item.id === id);
        const goods = goodsList[index];
        Object.assign(goods, {
            completedQuantity
        });
        this.props.onChange(goodsList);
    }

    /**
     * 签收差数
     */
    getLeftQuantity = (text, record) => (
        record.quantity - record.completedQuantity
    )

    /**
     * 凭证查看
     */
    handleVoucher = () => {
        this.showModal();
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = () => {
        this.setState({
            visible: false,
        });
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    /**
     * 确认签收通知父组件请求
     */
    handleReceipt = () => {
        this.props.onReceipt();
    }

    /**
     * 签收差额
     */
    calculationDiff = (text, record) => (
        ((record.quantity * record.completedQuantity) * record.salePrice).toFixed(2)
    )

    renderQuantity = (text, record) => (
        <EditableCell
            value={text}
            min={record.completedQuantity}
            max={record.quantity}
            onChange={this.onCellChange(record.id)}
        />
    )

    renderColumns = () => {
        // 剩余数量计算
        columns[7].render = this.renderQuantity;
        columns[8].render = this.getLeftQuantity;
        columns[9].render = this.calculationDiff;
    }

    render() {
        const { shippingDetailData, value } = this.props;
        const { data } = shippingDetailData;
        const {
            shippingMethod,
            shipOnDate,
            shippingNo,
            estimatedArrivalDate,
            deliveryer,
            deliveryerPhone,
            shippingStateDesc,
            shippingModes,
            distributionName,
            singedCertImg
        } = data;
        if (shippingStateDesc === '已签收待确认') {
            this.renderColumns();
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
                                        ? <span>
                                            {moment(
                                                parseInt(estimatedArrivalDate, 10)
                                            ).format(DATE_FORMAT)}
                                        </span>
                                        : <span>
                                            -
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
                                    <span>{shippingStateDesc}</span>
                                </Col>
                                {
                                    singedCertImg ?
                                        <Col className="gutter-row" span={7}>
                                            <span className="details-info-lable">签收凭证:</span>
                                            <span>供应商已签收凭证</span>
                                            <a onClick={this.handleVoucher}> 查看 </a>
                                        </Col> :
                                        <Col className="gutter-row" span={7}>
                                            <span className="details-info-lable">签收凭证:</span>
                                            <span>供应商未签收</span>
                                        </Col>
                                }
                                <Col className="gutter-row" span={10}>
                                    <span className="details-info-lable">配送方式:</span>
                                    <span>{shippingModes === 'unified' ? '统配' : '直送'}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="gutter-row" span={7}>
                                    <span className="details-info-lable">配送方:</span>
                                    <span>{distributionName}</span>
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
                                dataSource={value}
                                columns={columns}
                                pagination={false}
                                rowKey="id"
                            />
                        </div>
                    </div>
                </div>
                {
                    shippingStateDesc === '已签收待确认' &&
                    <Row type="flex" justify="end">
                        <Col>
                            <Button type="primary" size="default" onClick={this.handleReceipt}>
                                确认签收
                            </Button>
                        </Col>
                    </Row>
                }
                {
                    this.state.visible &&
                    <Modal
                        visible={this.state.visible}
                        footer={null}
                        destroyOnClose
                        maskClosable
                        closable={false}
                        wrapClassName="img-visible-class"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <img src={singedCertImg} alt="凭证图片" />
                    </Modal>
                }
            </div>
        );
    }
}

DistributionInformation.propTypes = {
    onChange: PropTypes.func,
    onReceipt: PropTypes.func,
    shippingDetailData: PropTypes.objectOf(PropTypes.any),
    value: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
}

export default withRouter(Form.create()(DistributionInformation));
