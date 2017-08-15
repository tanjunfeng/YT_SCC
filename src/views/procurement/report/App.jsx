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
import { DATE_FORMAT } from '../../../constant/index';
import moment from 'moment';
import { poType } from '../../../constant/procurement';
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
        return (
            <div className="print-container">
                <div className="content">
                    <div className="head">
                        <Row type="flex" justify="center">
                            <Col span={6}>
                            </Col>
                            <Col span={12}>
                                <div className="tc">
                                    <h1 style={{ marginBottom: 20, marginTop: 20 }}>雅堂小超采购订单</h1>
                                </div>
                            </Col>
                            <Col span={6}>
                                {/*这里放置根据采购单号生成的条形码 */}
                                <div className="bar">
                                    <img alt="条形码" src={data.barCodeUrl} />
                                </div>
                            </Col>
                        </Row>
                        <Row type="flex" justify="start">
                            <Col span={6}>
                                <label>采购单号：</label>
                                <span className="field">{data.purchaseOrderNo}</span>
                            </Col>
                            <Col span={11}>
                                <label>供应商：</label>
                                <span className="field">{data.spNo}-{data.spName}</span>
                            </Col>
                            <Col span={4}>
                                <label>采购单类型：</label>
                                <span className="field">{purchaseOrder}</span>
                            </Col>
                            <Col span={3}>
                                <label>创建人：</label>
                                <span className="field">{data.createUserName}</span>
                            </Col>
                        </Row>
                        <Row type="flex" justify="start">
                            <Col span={6}>
                                <label>收货单位：</label>
                                <span className="field">{data.adrTypeCode}-{data.adrTypeName}</span>
                            </Col>
                            <Col span={11}>
                                <label>收货地址：</label>
                                <span className="field">{data.adrName}</span>
                            </Col>
                            <Col span={4}>
                                <label>联系方式：</label>
                                <span className="field">{data.phone}</span>
                            </Col>
                            <Col span={3}>
                                <label>货币：</label>
                                <span className="field">{data.currencyCode}</span>
                            </Col>
                        </Row>
                        <Row type="flex" justify="start">
                            <Col span={6}>
                                <label>大类：</label>
                                <span className="field">{data.secondCategoryName}</span>
                            </Col>
                            <Col span={11}>
                                <label>收货日期：</label>
                                <span className="field">{moment(new Date(data.estimatedDeliveryDate)).format(DATE_FORMAT)}</span>
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
                                    <label>合计数量：
                                        <span className="field">{data.totalNumber}</span>
                                    </label>
                                    <label>合计金额：
                                        <span className="field">{data.totalAmount}</span>
                                    </label>
                                </Col>
                                <Col span={16} className="tr">
                                    <label>合计金额（大写）：
                                        <span className="field">{data.numberToCN}</span>
                                    </label>
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
