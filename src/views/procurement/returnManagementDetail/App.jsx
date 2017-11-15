/*
 * @Author: tanjf
 * @Description: 采购退货详情页
 * @CreateDate: 2017-10-27 11:26:16
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-11-15 14:52:15
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import {
    Table, Form, Icon, Row, Col, Input, Button
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
const { TextArea } = Input;

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
                    switch (text) {
                        case '0':
                            return '破损';
                        case '1':
                            return '临期';
                        case '2':
                            return '库存过剩';
                        case '3':
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
        const { pmPurchaseRefundItems = [] } = poReturn;
        let returnNum = 0;
        let returnMoney = 0;
        let returnCost = 0;
        let returnRealAmount = 0;
        let returnRealMoney = 0;
        pmPurchaseRefundItems.forEach((item) => {
            returnNum += Number(item.refundAmount)
        });
        pmPurchaseRefundItems.forEach((item) => {
            returnMoney += Number(item.refundMoney)
        });
        pmPurchaseRefundItems.forEach((item) => {
            returnCost += Number(item.refundCost)
        });
        pmPurchaseRefundItems.forEach((item) => {
            returnRealAmount += Number(item.realRefundAmount)
        });
        pmPurchaseRefundItems.forEach((item) => {
            returnRealMoney += Number(item.realRefundMoney)
        });
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
                                    <span className="text">{poReturn.spName}</span>
                                </Col>
                                <Col span={6}>
                                    {/* 供应商地点 */}
                                    <span className="ant-form-item-label search-mind-label">供应商地点</span>
                                    <span className="text">
                                        {this.renderStatus(poReturn.spAdrName)}
                                    </span>
                                </Col>
                                <Col span={6}>
                                    {/* 状态 */}
                                    <span className="ant-form-item-label search-mind-label">状态</span>
                                    <span className="text">{poReturn.status || '-'}</span>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={6}>
                                    {/* 退货地点类型 */}
                                    <FormItem >
                                        <span className="ant-form-item-label search-mind-label" style={{width: 90}}>退货地点类型</span>
                                        <span className="text">{poReturn.adrType}</span>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    {/* 退货地点 */}
                                    <FormItem formItemLayout >
                                        <span className="ant-form-item-label search-mind-label">退货地点</span>
                                        <span className="text">{poReturn.refundAdr}</span>
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
                                        <span className="text">{poReturn.refundTime ? moment(poReturn.refundTime).format(dateFormat) : '-'}</span>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    {/* 货币类型 */}
                                    <span className="ant-form-item-label search-mind-label">货币类型</span>
                                    <span className="text">{poReturn.currencyCode || '-'}</span>
                                </Col>
                                <Col className="pay-col" span={24}>
                                    {/* 备注 */}
                                    <FormItem>
                                        <div style={{display: 'flex'}}>
                                            <div className="sc-form-item-label" style={{textAlign: 'right', width: 123}}>备注: </div>
                                            <TextArea
                                                autosize={{ minRows: 4, maxRows: 6 }}
                                                value={this.state.remark}
                                                style={{resize: 'none' }}
                                                maxLength="250"
                                                onChange={(e) => {
                                                    this.setState({
                                                        remark: e.target.value
                                                    })
                                                }}
                                            />
                                        </div>
                                    </FormItem>
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
                                <Col span={6}>
                                    {/* 审核人 */}
                                    <span className="ant-form-item-label search-mind-label">审核人</span>
                                    <span className="text">{poReturn.auditUserId || '-'}</span>
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
                            <Col span={6}>
                                <span className="ant-form-item-label search-mind-label">合计退货数量:</span>
                                <span className="text">{returnNum}</span>
                            </Col>
                            <Col span={4}>
                                <span className="ant-form-item-label search-mind-label">合计退货金额(含税):</span>
                                <span className="text">{returnMoney}</span>
                            </Col>
                            <Col span={4}>
                                <span className="ant-form-item-label search-mind-label">合计退货成本额:</span>
                                <span className="text">{returnCost}</span>
                            </Col>
                            <Col span={4}>
                                <span className="ant-form-item-label search-mind-label">实际退货数量:</span>
                                <span className="text">{returnRealAmount}</span>
                            </Col>
                            <Col span={6}>
                                <span className="ant-form-item-label search-mind-label">实际退货金额(含税);</span>
                                <span className="text">{returnRealMoney}</span>
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
