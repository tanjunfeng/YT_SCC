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
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import {
    Row,
    Col,
    Icon,
    Table
} from 'antd';

import { fetchPoMngList } from '../../../actions';

@connect(state => ({
    ReportPoList: state.toJS().procurement.ReportPoList
}), dispatch => bindActionCreators({
}, dispatch))
class Report extends PureComponent {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '行号',
            dataIndex: 'rowNo',
            key: 'rowNo',
            render: (text, record, index) => { return (<span>{index + 1}</span>) },
            width: 60
        },
        {
            title: '商品编码',
            dataIndex: 'materialCd',
            key: 'materialCd',
            width: 70
        },
        {
            title: '商品名称',
            dataIndex: 'materialName',
            key: 'materialName',
            className: "left"
        },
        {
            title: '规格',
            dataIndex: 'spec',
            key: 'spec',
            width: 70
        },
        {
            title: '产地',
            dataIndex: 'madeIn',
            key: 'madeIn',
            className: "left"
        }, {
            title: '采购内装数',
            dataIndex: 'poInnerAmount',
            key: 'poInnerAmount',
            width: 80,
            className: "right"
        },
        {
            title: '单位',
            dataIndex: 'unit',
            key: 'unit',
            width: 50
        },
        {
            title: '订货数量',
            dataIndex: 'poQuantity',
            key: 'poQuatity',
            width: 70,
            className: "right"

        },
        {
            title: '订货价格',
            dataIndex: 'poPrice',
            key: 'poPrice',
            width: 70,
            className: "right"
        },
        {
            title: '订货金额',
            dataIndex: 'amount',
            key: 'amount',
            width: 100,
            className: "right"
        }
        ]
    }
    render() {
        let poDetail = this.props.data || {};
        let lines = poDetail.lines;
        return (
            <div className="print-box">
                <div className="head">
                    <Row type="flex" justify="end" >
                        {/*这里放置根据采购单号生成的条形码 */}
                        <div ><Icon type="barcode" style={{ fontSize: 30 }} /></div>
                    </Row>
                    <Row type="flex" justify="center" >
                        <div><h1 style={{ marginBottom: 20, marginTop: 20 }}>雅堂小超采购订单</h1></div>
                    </Row>
                    <Row type="flex" justify="start">
                        <Col span={6}><label>采购单号：</label><span className="field">{poDetail.poNo}</span></Col>
                        <Col span={11}><label>供应商：</label><span className="field">{poDetail.supplierLocCd}-{poDetail.supplierLocName}</span></Col>
                        <Col span={4}><label>采购单类型：</label><span className="field">{poDetail.poTypeName}</span></Col>
                        <Col span={3}><label>创建人：</label><span className="field">{poDetail.createdByName}</span></Col>
                    </Row>
                    <Row type="flex" justify="start">
                        <Col span={6}><label>收货单位：</label><span className="field">{poDetail.addressCd}-{poDetail.address}</span></Col>
                        <Col span={11}><label>收货地址：</label><span className="field">{poDetail.rcvAddress}</span></Col>
                        <Col span={4}><label>联系方式：</label><span className="field">{poDetail.tel}</span></Col>
                        <Col span={3}><label>货币：</label><span className="field">{poDetail.currencyName}</span></Col>
                    </Row>
                    <Row type="flex" justify="start">
                        <Col span={6}><label>大类：</label><span className="field">{poDetail.bigCLassName}</span></Col>
                        <Col span={11}><label>收货日期：</label ><span className="field">{poDetail.estDeliveryDate}</span></Col>
                    </Row>
                </div>
                <div style={{ height: 10 }}></div>
                <div className="material">
                    <div className="lines">
                        <Table dataSource={lines} pagination={false} columns={this.columns} bordered rowKey="id" />
                    </div>
                    <div className="lines-footer">
                        <Row type="flex" justify="start">
                            <Col span={6}><label>合计数量：</label><span className="field">{poDetail.totalQuantity}</span></Col>
                            <Col span={6}><label>合计金额：</label><span className="field">{poDetail.totalAmount}</span></Col>
                            <Col span={12}><label>合计金额（大写）：<span className="field">{poDetail.totalAmountInWord}</span></label></Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}


export default Report;