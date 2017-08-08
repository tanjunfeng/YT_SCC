/**
 * @file App.jsx
 * @author twh
 *
 * 采购收货单新建，显示界面
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import EditableCell from './EditableCell';
import moment from 'moment';
import {
    Table,
    Form,
    Input,
    Icon,
    Modal,
    Row,
    Col,
    Button,
    message
} from 'antd';
import {
    fetchPoRcvInit,
    fetchPoRcvDetail,
    updatePoRcvBasicinfo,
    updatePoRcvLine,
    createPoRcv
} from '../../../actions';
import Utils from '../../../util/util';

const confirm = Modal.confirm;
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
    state = {
        editable: false
    }
    constructor(props) {
        super(props);
        let that = this;
        // 收货单商品行信息
        this.columns = [
            {
                title: '行号',
                dataIndex: 'rowNo',
                key: 'rowNo',
                render: (text, record, index) => { return (<span>{index + 1}</span>) }
            },
            {
                title: '商品编码',
                dataIndex: 'productCode',
                key: 'productCode',

            },
            {
                title: '商品名称',
                dataIndex: 'productName',
                key: 'productName',
            },
            {
                title: '规格',
                dataIndex: 'packingSpecifications',
                key: 'packingSpecifications',
            },
            {
                title: '产地',
                dataIndex: 'producePlace',
                key: 'producePlace',
            }, {
                title: '采购内装数',
                dataIndex: 'purchaseInsideNumber',
                key: 'purchaseInsideNumber',
            },
            {
                title: '单位',
                dataIndex: 'unitExplanation',
                key: 'unitExplanation'
            },

            {
                title: '采购数量',
                dataIndex: 'purchaseNumber',
                key: 'purchaseNumber'

            },
            {
                title: '供应商出库数量',
                dataIndex: 'deliveryNumber',
                key: 'deliveryNumber'
            }
            ,
            {
                title: '收货数量',
                dataIndex: 'receivedNumber',
                key: 'receivedNumber'
            }
        ];
    }

    componentDidMount() {
        let that = this;
        const { match } = this.props;
        // 收货单id
        let poRcvId = match.params.porcvid;

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
                break;
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { poLines } = this.props;
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
                                    <span className="ant-form-item-label"><label>收货单号</label> </span>
                                    <span className="text">{pmPurchaseReceipt.purchaseReceiptNo}</span>
                                </Col>
                                <Col span={6}>
                                    {/* 采购单号 */}
                                    <span className="ant-form-item-label"><label>采购单号</label> </span>
                                    <span className="text">{pmPurchaseReceipt.purchaseOrderId}</span>
                                </Col>
                                <Col span={6}>
                                    {/* 收货单状态 */}
                                    <span className="ant-form-item-label"><label>收货单状态</label> </span>
                                    <span className="text">
                                        {this.renderStatus(pmPurchaseReceipt.status)}
                                    </span>
                                </Col>
                                <Col span={6}>
                                    {/* ASN */}
                                    <span className="ant-form-item-label"><label>ASN</label> </span>
                                    <span className="text">{pmPurchaseReceipt.asn}</span>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={6}>
                                    {/* 供应商 */}
                                    <FormItem  >
                                        <span className="ant-form-item-label"><label>供应商编号</label> </span>
                                        <span className="text">{pmPurchaseReceipt.spNo}-{pmPurchaseReceipt.spName}</span>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    {/* 供应商地点 */}
                                    <FormItem formItemLayout >
                                        <span className="ant-form-item-label"><label>供应商地点</label> </span>
                                        <span className="text">{pmPurchaseReceipt.spAdrNo}-{pmPurchaseReceipt.spAdrName}</span>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    {/* 地点类型 */}
                                    <FormItem >
                                        <span className="ant-form-item-label"><label>地点类型</label> </span>
                                        <span className="text">{pmPurchaseReceipt.adrType === 0 ? '仓库' : '门店'}</span>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    {/* 地点类型 */}
                                    <FormItem >
                                        <span className="ant-form-item-label"><label>仓库编码</label> </span>
                                        <span className="text">{pmPurchaseReceipt.adrTypeCode}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={6}>
                                    {/* 地点类型 */}
                                    <FormItem >
                                        <span className="ant-form-item-label"><label>仓库名称</label> </span>
                                        <span className="text">{pmPurchaseReceipt.adrTypeName}</span>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    {/* 预计收货日期 */}
                                    <span className="ant-form-item-label"><label>预计到货日期</label> </span>
                                    <span className="text">{moment(pmPurchaseReceipt.estimatedReceivedDate).format(dateFormat)}</span>
                                </Col>
                                <Col span={6}>
                                    {/* 预计到货日期 */}
                                    <span className="ant-form-item-label"><label>预计收货日期</label> </span>
                                    <span className="text">{moment(pmPurchaseReceipt.estimatedReceivedDate).format(dateFormat)}</span>
                                </Col>
                                <Col span={6}>
                                    {/* 收货日期 */}
                                    <span className="ant-form-item-label"><label>收货日期</label> </span>
                                    <span className="text">{moment(pmPurchaseReceipt.receivedTime).format(dateFormat)}</span>
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
                </Form>
            </div>
        )
    }
}

PoRcvDetail.propTypes = {
    fetchPoRcvDetail: PropTypes.func,
}

export default withRouter(Form.create()(PoRcvDetail));
