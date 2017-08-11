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
    Icon,
    Table,
    Button
} from 'antd';

import { fetchPoMngList } from '../../../actions';
import { poMngListColumns } from '../columns';

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
        return (
            <div className="print-container">
                <div className="content">
                    <div className="head">
                        <Row type="flex" justify="end" >
                            {/*这里放置根据采购单号生成的条形码 */}
                            <div >
                                <img alt='条形码' src={data.barCodeUrl} />
                                <Icon type="barcode" style={{ fontSize: 30 }} />
                            </div>
                        </Row>
                        <Row type="flex" justify="center" >
                            <div><h1 style={{ marginBottom: 20, marginTop: 20 }}>雅堂小超采购订单</h1></div>
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
                                <span className="field">{data.purchaseOrderType}</span>
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
                                <span className="field">{data.estimatedDeliveryDate}</span>
                            </Col>
                        </Row>
                    </div>
                    <div style={{ height: 10 }} />
                    <div className="material">
                        <div className="lines">
                            <Table dataSource={data.pmPurchaseOrderItems} pagination={false} columns={poMngListColumns} bordered rowKey="id" />
                        </div>
                        <div className="lines-footer">
                            <Row type="flex" justify="start">
                                <Col span={6}>
                                    <label>合计数量：</label>
                                    <span className="field">{data.totalNumber}</span>
                                </Col>
                                <Col span={6}>
                                    <label>合计金额：</label>
                                    <span className="field">{data.totalAmount}</span>
                                </Col>
                                <Col span={12}>
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
