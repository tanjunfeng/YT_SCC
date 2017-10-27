/*
 * @Author: tanjf
 * @Description: 采购退货详情页
 * @CreateDate: 2017-10-27 11:26:16
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-10-27 11:26:16
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import {
    Table, Form, Icon, Row, Col
} from 'antd';
import {
    fetchPoRcvInit,
    fetchPoRcvDetail,
    updatePoRcvBasicinfo,
    updatePoRcvLine,
    createPoRcv
} from '../../../actions';
import Utils from '../../../util/util';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';

@connect(state => ({
    poRcvDetail: state.toJS().procurement.poRcv,
}), dispatch => bindActionCreators({
    fetchPoRcvInit,
    fetchPoRcvDetail,
    updatePoRcvLine,
    updatePoRcvBasicinfo,
    createPoRcv
}, dispatch))
class PoRcvDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            editable: false
        }
        // 收货单商品行信息
        this.columns = [
            {
                title: '行号',
                dataIndex: 'rowNo',
                key: 'rowNo',
                render: (text, record, index) => (<span>{index + 1}</span>)
            }, {
                title: '商品编码',
                dataIndex: 'productCode',
                key: 'productCode'
            }, {
                title: '商品名称',
                dataIndex: 'productName',
                key: 'productName'
            }, {
                title: '商品条码',
                dataIndex: 'internationalCode',
                key: 'internationalCode'
            }, {
                title: '规格',
                dataIndex: 'packingSpecifications',
                key: 'packingSpecifications'
            }, {
                title: '产地',
                dataIndex: 'producePlace',
                key: 'producePlace'
            }, {
                title: '采购内装数',
                dataIndex: 'purchaseInsideNumber',
                key: 'purchaseInsideNumber'
            },
            {
                title: '单位',
                dataIndex: 'unitExplanation',
                key: 'unitExplanation'
            }, {
                title: '采购数量',
                dataIndex: 'purchaseNumber',
                key: 'purchaseNumber'
            }, {
                title: '供应商出库数量',
                dataIndex: 'deliveryNumber',
                key: 'deliveryNumber'
            }, {
                title: '收货数量',
                dataIndex: 'receivedNumber',
                key: 'receivedNumber'
            }, {
                title: '采购价格(含税)',
                dataIndex:'purchasePrice',
                key:'purchasePrice'
            }, {
                title: '收货金额(含税)',
                dataIndex:'receiptPrice',
                key:'receiptPrice'
            }, 
        ];
    }

    componentDidMount() {
        const { match } = this.props;
        // 收货单id
        const poRcvId = match.params.porcvid;

        // step 1：校验采购单id 收货单id
        if (!poRcvId) {
            history.back();
        }
        // 请根据后端api进行调整
        this.props.fetchPoRcvDetail(Utils.removeInvalid({ id: poRcvId }));
    }

    /**
     * 渲染订单状态
     * @param {number} status 订单状态
     */
    renderStatus(status) {
        switch (status) {
            case 0:
                return '待下发';
            case 1:
                return '已下发';
            case 2:
                return '已收货';
            case 3:
                return '已取消';
            case 4:
                return '异常';
            default:
                return '';
        }
    }

    render() {
        const { poRcvDetail } = this.props;
        const { pmPurchaseReceipt = {}, receiptPruducts = [] } = poRcvDetail;
        return (
            <div className="po-rcv-detail">
                <Form layout="inline">
                    <div className="basic-box">
                        <div className="header">
                            <Icon type="solution" className="header-icon" />基础信息
                        </div>
                        <div className="body">
                            <Row >
                                <Col span={6}>
                                    {/* 收货单号 */}
                                    <span className="ant-form-item-label search-mind-label">收货单号</span>
                                    <span className="text">{pmPurchaseReceipt.purchaseReceiptNo}</span>
                                </Col>
                                <Col span={6}>
                                    {/* 采购单号 */}
                                    <span className="ant-form-item-label search-mind-label">采购单号</span>
                                    <span className="text">{pmPurchaseReceipt.purchaseOrderNo}</span>
                                </Col>
                                <Col span={6}>
                                    {/* 收货单状态 */}
                                    <span className="ant-form-item-label search-mind-label">收货单状态</span>
                                    <span className="text">
                                        {this.renderStatus(pmPurchaseReceipt.status)}
                                    </span>
                                </Col>
                                <Col span={6}>
                                    {/* ASN */}
                                    <span className="ant-form-item-label search-mind-label">ASN</span>
                                    <span className="text">{pmPurchaseReceipt.asn || '-'}</span>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={6}>
                                    {/* 供应商 */}
                                    <FormItem >
                                        <span className="ant-form-item-label search-mind-label">供应商</span>
                                        <span className="text">{pmPurchaseReceipt.spNo}-{pmPurchaseReceipt.spName}</span>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    {/* 供应商地点 */}
                                    <FormItem formItemLayout >
                                        <span className="ant-form-item-label search-mind-label">供应商地点</span>
                                        <span className="text">{pmPurchaseReceipt.spAdrNo}-{pmPurchaseReceipt.spAdrName}</span>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    {/* 地点类型 */}
                                    <FormItem >
                                        <span className="ant-form-item-label search-mind-label">地点类型</span>
                                        <span className="text">{pmPurchaseReceipt.adrType === 0 ? '仓库' : '门店'}</span>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    {/* 地点类型 */}
                                    <FormItem >
                                        <span className="ant-form-item-label search-mind-label">地点</span>
                                        <span className="text">{pmPurchaseReceipt.adrTypeCode}-{pmPurchaseReceipt.adrTypeName}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={6}>
                                    {/* 预计收货日期 */}
                                    <span className="ant-form-item-label search-mind-label">预计到货日期</span>
                                    <span className="text">{pmPurchaseReceipt.estimatedReceivedDate ? moment(pmPurchaseReceipt.estimatedReceivedDate).format(dateFormat) : '-'}</span>
                                </Col>
                                <Col span={6}>
                                    {/* 预计到货日期 */}
                                    <span className="ant-form-item-label search-mind-label">预计收货日期</span>
                                    <span className="text">{pmPurchaseReceipt.estimatedReceivedDate ? moment(pmPurchaseReceipt.estimatedReceivedDate).format(dateFormat) : '-'}</span>
                                </Col>
                                <Col span={6}>
                                    {/* 收货日期 */}
                                    <span className="ant-form-item-label search-mind-label">收货日期</span>
                                    <span className="text">{pmPurchaseReceipt.receivedTime ? moment(pmPurchaseReceipt.receivedTime).format(dateFormat) : '-'}</span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className="">
                        <Table
                            dataSource={receiptPruducts}
                            pagination={false}
                            columns={this.columns}
                            rowKey="id"
                            scroll={{
                                x: 1300
                            }}
                        />
                    </div>
                    <div className="total-row">
                        <Row >
                            <Col span={6}>
                                <span className="ant-form-item-label search-mind-label">合计收货数量</span>
                                <span className="text">{pmPurchaseReceipt.receiveTotalNumber}</span>
                            </Col>
                            <Col span={6}>
                                <span className="ant-form-item-label search-mind-label">合计收货金额</span>
                                <span className="text">{pmPurchaseReceipt.receiveTotalPrice}</span>
                            </Col>
                        </Row >
                    </div>
                </Form>
            </div>
        )
    }
}

PoRcvDetail.propTypes = {
    fetchPoRcvDetail: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any),
    poRcvDetail: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(PoRcvDetail));
