/*
 * @Author: tanjf
 * @Description: 采购退货详情页
 * @CreateDate: 2017-10-27 11:26:16
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-11-21 11:33:22
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import {
    Table, Form, Icon, Row, Col, Button
} from 'antd';
import {
    fetchReturnPoRcvDetail,
    updatePoRcvBasicinfo,
    updatePoRcvLine,
    createPoRcv
} from '../../../actions/procurement';
import Utils from '../../../util/util';
import { exportReturnProPdf } from '../../../service';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';

@connect(state => ({
    poReturn: state.toJS().procurement.poReturn,
}), dispatch => bindActionCreators({
    fetchReturnPoRcvDetail,
    updatePoRcvLine,
    updatePoRcvBasicinfo,
    createPoRcv
}, dispatch))
class ReturnManagementDetail extends PureComponent {
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
                title: '采购单号',
                dataIndex: 'purchaseOrderNo',
                key: 'purchaseOrderNo'
            }, {
                title: '商品编号',
                dataIndex: 'productCode',
                key: 'productCode'
            }, {
                title: '商品条码',
                dataIndex: 'internationalCode',
                key: 'internationalCode'
            }, {
                title: '商品名称',
                dataIndex: 'productName',
                key: 'productName'
            }, {
                title: '规格',
                dataIndex: 'packingSpecifications',
                key: 'packingSpecifications'
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
                title: '税率',
                dataIndex: 'inputTaxRate',
                key: 'inputTaxRate'
            }, {
                title: '采购价格(含税)',
                dataIndex: 'purchasePrice',
                key: 'purchasePrice'
            }, {
                title: '可退库存',
                dataIndex: 'possibleNum',
                key: 'possibleNum'
            }, {
                title: '退货数量',
                dataIndex: 'refundAmount',
                key: 'refundAmount'
            }, {
                title: '原因',
                dataIndex: 'refundReason',
                key: 'refundReason',
                render: (text) => {
                    switch (parseInt(text, 10)) {
                        case 0:
                            return '破损';
                        case 1:
                            return '临期';
                        case 2:
                            return '库存过剩';
                        case 3:
                            return '其他';
                        default:
                            return text;
                    }
                }
            }, {
                title: '退货金额(含税)',
                dataIndex: 'refundMoney',
                key: 'refundMoney'
            }, {
                title: '退货成本额',
                dataIndex: 'refundCost',
                key: 'refundCost'
            }, {
                title: '实际退货数量',
                dataIndex: 'realRefundAmount',
                key: 'realRefundAmount'
            }, {
                title: '实际金额(含税)',
                dataIndex: 'realRefundMoney',
                key: 'realRefundMoney'
            }
        ];
    }

    componentDidMount() {
        const { match } = this.props;
        // 退货单id
        const id = match.params.id;

        // step 1：校验退购单id
        if (!id) {
            history.back();
        }
        // 请根据后端api进行调整
        this.props.fetchReturnPoRcvDetail(Utils.removeInvalid({ id }));
    }

    goBack = () => {
        this.props.history.goBack();
    }

    /**
     * 下载pdf
     */
    handleDownPDF = () => {
        const { match } = this.props;
        // 退货单id
        const id = match.params.id;
        Utils.exportExcel(
            exportReturnProPdf,
            {id}
        );
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
        const { poReturn = {} } = this.props;
        const status = () => {
            switch (poReturn.status) {
                case 0:
                    return '制单';
                case 1:
                    return '已提交';
                case 2:
                    return '已审核';
                case 3:
                    return '已拒绝';
                case 4:
                    return '待退货';
                case 5:
                    return '已退货';
                case 6:
                    return '已取消';
                case 7:
                    return '取消失败';
                case 8:
                    return '异常';
                default:
                    return '';
            }
        }
        const adrType = () => {
            switch (poReturn.adrType) {
                case 0:
                    return '仓库';
                case 1:
                    return '门店';
                default:
                    return '';
            }
        }

        return (
            <div className="po-return-detail">
                <Form layout="inline">
                    <div className="basic-box">
                        <div className="header">
                            <Icon type="solution" className="header-icon" />基础信息
                        </div>
                        <div className="body">
                            <Row >
                                <Col span={6}>
                                    {/* 退货单号 */}
                                    <span className="ant-form-item-label search-mind-label" style={{width: 90}}>退货单号</span>
                                    <span className="text">{poReturn.purchaseRefundNo}</span>
                                </Col>
                                <Col span={6}>
                                    {/* 供应商 */}
                                    <span className="ant-form-item-label search-mind-label">供应商</span>
                                    <span className="text">{poReturn.spNo} - {poReturn.spName}</span>
                                </Col>
                                <Col span={6}>
                                    {/* 供应商地点 */}
                                    <span className="ant-form-item-label search-mind-label">供应商地点</span>
                                    <span className="text">
                                        {poReturn.spAdrNo} - {poReturn.spAdrName}
                                    </span>
                                </Col>
                                <Col span={6}>
                                    {/* 状态 */}
                                    <span className="ant-form-item-label search-mind-label">状态</span>
                                    <span className="text">{status() || '-'}</span>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={6}>
                                    {/* 退货地点类型 */}
                                    <FormItem >
                                        <span className="ant-form-item-label search-mind-label" style={{width: 90}}>退货地点类型</span>
                                        <span className="text">{adrType()}</span>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    {/* 退货地点 */}
                                    <FormItem formItemLayout >
                                        <span className="ant-form-item-label search-mind-label">退货地点</span>
                                        <span className="text">{poReturn.refundAdrCode} - {poReturn.refundAdrName}</span>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    {/* 退货日期早于 */}
                                    <FormItem >
                                        <span className="ant-form-item-label search-mind-label">退货日期早于</span>
                                        <span className="text">{poReturn.refundTimeEarly ? moment(poReturn.refundTimeEarly).format(dateFormat) : '-'}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={6}>
                                    {/* 退货日期 */}
                                    <FormItem >
                                        <span className="ant-form-item-label search-mind-label" style={{width: 90}}>退货日期</span>
                                        <span className="text" style={{verticalAlign: 'middle'}}>{poReturn.refundTime ? moment(poReturn.refundTime).format(dateFormat) : '-'}</span>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    {/* 货币类型 */}
                                    <span className="ant-form-item-label search-mind-label" style={{height: 42, lineHeight: '42px'}}>货币类型</span>
                                    <span className="text" style={{verticalAlign: 'middle', lineHeight: '42px'}}>{poReturn.currencyCode || '-'}</span>
                                </Col>
                                <Col span={6}>
                                    {/* 备注 */}
                                    <span className="ant-form-item-label search-mind-label" style={{height: 42, lineHeight: '42px'}}>备注</span>
                                    <span className="text" style={{verticalAlign: 'middle', lineHeight: '42px'}}>{poReturn.remark || '-'}</span>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={6}>
                                    {/* 创建人 */}
                                    <span className="ant-form-item-label search-mind-label">创建人</span>
                                    <span className="text">{poReturn.createUserId || '-'}</span>
                                </Col>
                                <Col span={6}>
                                    {/* 创建日期 */}
                                    <FormItem >
                                        <span className="ant-form-item-label search-mind-label">创建日期</span>
                                        <span className="text">{poReturn.createTime ? moment(poReturn.createTime).format(dateFormat) : '-'}</span>
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ height: '42px', lineHeight: '42px'}}>
                                    {/* 审核人 */}
                                    <span className="ant-form-item-label search-mind-label">审核人</span>
                                    <span className="text" style={{verticalAlign: 'middle'}}>{poReturn.auditUserId || '-'}</span>
                                </Col>
                                <Col span={6}>
                                    {/* 审核日期 */}
                                    <FormItem >
                                        <span className="ant-form-item-label search-mind-label">审核日期</span>
                                        <span className="text">{poReturn.auditTime ? moment(poReturn.auditTime).format(dateFormat) : '-'}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className="">
                        <Table
                            dataSource={poReturn.pmPurchaseRefundItems}
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
                            <Col span={5}>
                                <span className="ant-form-item-label search-mind-label">合计退货数量</span>
                                <span className="text">{poReturn.totalRefundAmount || 0}</span>
                            </Col>
                            <Col span={5}>
                                <span className="ant-form-item-label search-mind-label">合计退货金额(含税)</span>
                                <span className="text">{poReturn.totalRefundMoney || 0}</span>
                            </Col>
                            <Col span={4}>
                                <span className="ant-form-item-label search-mind-label">合计退货成本额</span>
                                <span className="text">{poReturn.totalRefundCost || 0}</span>
                            </Col>
                            <Col span={4}>
                                <span className="ant-form-item-label search-mind-label">实际退货数量</span>
                                <span className="text">{poReturn.totalRealRefundAmount || 0}</span>
                            </Col>
                            <Col span={6}>
                                <span className="ant-form-item-label search-mind-label">实际退货金额(含税)</span>
                                <span className="text">{poReturn.totalRealRefundMoney || 0}</span>
                            </Col>
                        </Row >
                    </div>
                    <Row gutter={40} type="flex" justify="end">
                        <Col className="ant-col-10 ant-col-offset-10 gutter-row" style={{ textAlign: 'right'}}>
                            <FormItem>
                                <Button size="default" type="default" onClick={this.goBack}>
                                    返回
                                </Button>
                            </FormItem>
                            <FormItem>
                                <Button size="default" type="primary" onClick={this.handleDownPDF}>
                                    下载PDF
                                </Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

ReturnManagementDetail.propTypes = {
    fetchReturnPoRcvDetail: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any),
    poReturn: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(ReturnManagementDetail));
