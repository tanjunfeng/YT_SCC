/**
 * @file App.jsx
 * @author twh
 *
 * 打印报表
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Row,
    Col,
    Table,
    Button
} from 'antd';
import moment from 'moment';
import { DATE_FORMAT } from '../../../constant/index';
import { poType, businessModeType } from '../../../constant/procurement';
import { printColumns } from '../columns';

@connect(state => ({
    ReportPoList: state.toJS().procurement.ReportPoList
}), dispatch => bindActionCreators({
}, dispatch))

class Report extends PureComponent {
    handleDownPDF = (number) => {
        const { onDownPDF } = this.props;
        if (onDownPDF) {
            onDownPDF(number);
        }
    }

    render() {
        const { data = {} } = this.props;
        let purchaseOrder = '';
        poType.data.forEach((item) => {
            if (+item.key === data.purchaseOrderType) {
                purchaseOrder = item.value;
            }
        });
        let businessType = '';
        businessModeType.data.forEach((item) => {
            if (+item.key === data.businessMode) {
                businessType = item.value;
            }
        })
        return (
            <div className="print-container">
                <div className="content">
                    <div className="head">
                        <Row type="flex" justify="center">
                            <Col span={6} />
                            <Col span={12}>
                                <div className="tc">
                                    <h1 style={{ marginBottom: 20, marginTop: 20 }}>雅堂小超采购订单</h1>
                                </div>
                            </Col>
                            <Col span={6}>
                                {/* 这里放置根据采购单号生成的条形码 */}
                                { (data.barCodeUrl) &&
                                    <div className="bar">
                                        <img alt="条形码" src={data.barCodeUrl} />
                                    </div>
                                }
                            </Col>
                        </Row>
                        <Row type="flex" justify="start">
                            <Col span={6}>
                                <div className="label">采购单号：</div>
                                <span className="field">{data.purchaseOrderNo}</span>
                            </Col>
                            <Col span={11}>
                                <div className="label">供应商：</div>
                                <span className="field">{data.spAdrNo}-{data.spAdrName}</span>
                            </Col>
                            <Col span={3}>
                                <div className="label">经营模式：</div>
                                <span className="field">{businessType}</span>
                            </Col>
                            <Col span={4}>
                                <div className="label">采购单类型：</div>
                                <span className="field">{purchaseOrder}</span>
                            </Col>
                        </Row>
                        <Row type="flex" justify="start">
                            <Col span={6}>
                                <div className="label">收货单位：</div>
                                <span className="field">{data.adrTypeCode}-{data.adrTypeName}</span>
                            </Col>
                            <Col span={11}>
                                <div className="label">收货地址：</div>
                                <span className="field">{data.adrName}</span>
                            </Col>
                            <Col span={4}>
                                <div className="label">联系方式：</div>
                                <span className="field">{data.phone}</span>
                            </Col>
                            <Col span={3}>
                                <div className="label">货币：</div>
                                <span className="field">{data.currencyCode}</span>
                            </Col>
                        </Row>
                        <Row type="flex" justify="start">
                            <Col span={6}>
                                <div className="label">大类：</div>
                                <span className="field">{data.secondCategoryName}</span>
                            </Col>
                            <Col span={11}>
                                <div className="label">收货日期：</div>
                                <span className="field">{moment(new Date(data.estimatedDeliveryDate)).format(DATE_FORMAT)}</span>
                            </Col>
                            <Col span={3}>
                                <div className="label">创建人：</div>
                                <span className="field">{data.createUserName}</span>
                            </Col>
                        </Row>
                    </div>
                    <div style={{ height: 10 }} />
                    <div className="material">
                        <div className="lines">
                            <Table dataSource={data.pmPurchaseOrderItems} pagination={false} columns={printColumns} bordered rowKey="id" />
                        </div>
                        <div className="lines-footer">
                            <Row type="flex" justify="start">
                                <Col span={8} className="left">
                                    <div className="label">合计数量：
                                        <span className="field">{data.totalNumber}</span>
                                    </div>
                                    <div className="label">合计金额：
                                        <span className="field">{data.totalAmount}</span>
                                    </div>
                                </Col>
                                <Col span={16} className="tr">
                                    <div className="label">合计金额（大写）：
                                        <span className="field">{data.numberToCN}</span>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <div className="actions">
                    <Row type="flex" justify="end">
                        <Col span={4} style={{ textAlign: 'right' }}>
                            <Button size="default" onClick={() => this.handleDownPDF(data.purchaseOrderNo)}>
                                下载PDF
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
Report.propTypes = {
    onDownPDF: PropTypes.func,
    data: PropTypes.objectOf(PropTypes.any)
}

export default Report;
