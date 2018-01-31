/**
 * @file App.jsx
 * @author chenghaojie
 *
 * 采购单编辑页面
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import {
    Table, Form, Icon, Row,
    Col, Button, Affix,
} from 'antd';

import Utils from '../../../util/util';
import {
    initPoDetail,
    queryPoDetail,
} from '../../../actions/procurement';
import { pubFetchValueList } from '../../../actions/pub';
import { exportProcurementPdf } from '../../../service';
import { renderPayType, renderPayCondition, renderPeriod, purchaseOrderType,
    businessMode, purchaseOrderState, purchaseOrderAdrType, supplierOrderStatus} from '../constants'

const FormItem = Form.Item;

@connect(state => ({
    po: state.toJS().procurement.po || {},
    // 回显数据
    basicInfo: state.toJS().procurement.po.basicInfo || {},
    poLines: state.toJS().procurement.po.poLines || [],
}), dispatch => bindActionCreators({
    initPoDetail,
    queryPoDetail,
    pubFetchValueList,
}, dispatch))

class PoDetail extends PureComponent {
    constructor(props) {
        super(props);
        // 采购单商品行信息
        this.columns = [
            {
                title: '行号',
                dataIndex: 'rowNo',
                key: 'rowNo',
                render: (text, record, index) => index + 1
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
                title: '商品条码',
                dataIndex: 'internationalCode',
                key: 'internationalCode',
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
                title: '税率(%)',
                dataIndex: 'inputTaxRate',
                key: 'inputTaxRate'
            },
            {
                title: '采购价格（含税）',
                dataIndex: 'purchasePrice',
                key: 'purchasePrice'
            },
            {
                title: '采购数量',
                dataIndex: 'purchaseNumber',
                key: 'purchaseNumber',
            },
            {
                title: '采购金额（含税）',
                dataIndex: 'totalAmount',
                key: 'totalAmount'
            },
            {
                title: '已收货数量',
                dataIndex: 'receivedNumber',
                key: 'receivedNumber'
            },
            {
                title: '是否有效',
                dataIndex: 'isValid',
                key: 'isValid',
                render: (text) => {
                    switch (text) {
                        case 0:
                            return '无效';
                        default:
                            return '有效';
                    }
                }
            }
        ];
    }

    componentDidMount() {
        const that = this;
        const { match } = this.props;
        // 采购单id
        const poId = match.params.purchaseOrderNo;
        // 1.采购单id存在，查询采购单详情
        // 2.设置界面状态，操作按钮状态
        that.props.queryPoDetail({
            id: poId
        })
    }

    componentWillUnmount() {
        this.props.initPoDetail({
            basicInfo: {},
            poLines: []
        })
    }

    /**
     * 根据状态渲染对应的页面
     */
    getBaiscInfoElements = () => {
        const { basicInfo } = this.props;

        // 回显预期送货日期
        const estimatedDeliveryDate = basicInfo.estimatedDeliveryDate ? moment(basicInfo.estimatedDeliveryDate).format('YYYY-MM-DD') : null

        // 回显创建日期
        const createTime = basicInfo.createTime ? moment(basicInfo.createTime).format('YYYY-MM-DD') : null

        // 回显审核日期
        const auditTime = basicInfo.auditTime ? moment(basicInfo.auditTime).format('YYYY-MM-DD') : null
        // 只读
        return (
            <div className="basic-box">
                <div className="header">
                    <Icon type="solution" className="header-icon" />基础信息
                </div>
                <div className="body">
                    <Row >
                        <Col span={8}>
                            {/* 采购单号 */}
                            <FormItem label="采购单号">
                                <span>{basicInfo.purchaseOrderNo}</span>
                            </FormItem>
                        </Col>
                        <Col span={3}>
                            {/* 经营模式 */}
                            <FormItem label="经营模式">
                                <span>{businessMode(basicInfo.businessMode)}</span>
                            </FormItem>
                        </Col>
                        <Col span={5}>
                            {/* 采购单类型 */}
                            <FormItem label="采购单类型">
                                <span>{
                                    purchaseOrderType(basicInfo.purchaseOrderType)
                                }</span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 状态 */}
                            <FormItem label="状态">
                                <span>{purchaseOrderState(basicInfo.status)}</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={8}>
                            {/* 供应商 */}
                            <FormItem label="供应商">
                                <span>
                                    {basicInfo.spNo}
                                    -{basicInfo.spName}
                                </span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 供应商地点 */}
                            <FormItem label="供应商地点">
                                <span>
                                    {basicInfo.spAdrNo}
                                    -{basicInfo.spAdrName}
                                </span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 预计送货日期 */}
                            <FormItem label="预计送货日期">
                                <span>{estimatedDeliveryDate}</span>

                            </FormItem>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={8}>
                            {/* 地点类型 */}
                            <FormItem label="地点类型">
                                <span>{purchaseOrderAdrType(basicInfo.adrType)}</span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 地点 */}
                            <FormItem label="地点">
                                <span>
                                    {basicInfo.adrTypeCode}
                                    -{basicInfo.adrTypeName}
                                </span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 大类 */}
                            <FormItem label="大类">
                                <span>{basicInfo.secondCategoryName}</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={8}>
                            {/* 账期 */}
                            <FormItem label="账期">
                                <span>
                                    {renderPeriod(basicInfo.settlementPeriod)}
                                </span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 付款方式 */}
                            <FormItem label="付款方式">
                                <span>{renderPayType(basicInfo.payType)}</span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 货币类型 */}
                            <FormItem label="货币类型">
                                <span>{basicInfo.currencyCode}</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={8}>
                            {/* 付款条件 */}
                            <FormItem label="付款条件">
                                <span>
                                    {renderPayCondition(basicInfo.payCondition)}
                                </span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 供应商接单状态 */}
                            <FormItem label="供应商接单状态">
                                <span>
                                    {supplierOrderStatus(basicInfo.spAcceptStatus)}
                                </span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={8}>
                            {/* 创建者 */}
                            <FormItem label="创建者">
                                <span>{basicInfo.createUserName}</span>
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            {/* 创建日期 */}
                            <FormItem label="创建日期">
                                <span>{createTime}</span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {/* 审核人 */}
                            <FormItem label="审核人">
                                <span>{basicInfo.auditUserName}</span>
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            {/* 审核日期 */}
                            <FormItem label="审核日期">
                                <span>{auditTime}</span>
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }

    /**
     * 下载pdf
     */
    handleDownPDF = () => {
        Utils.exportExcel(
            exportProcurementPdf,
            { purchaseOrderNo: this.props.basicInfo.purchaseOrderNo }
        );
    }

    render() {
        const {poLines, basicInfo} = this.props;
        const baiscInfoElements = this.getBaiscInfoElements();
        return (
            <div className="po-detail">
                <Form layout="inline">
                    {baiscInfoElements}
                    <div className="poLines area-list">
                        <Table
                            dataSource={poLines.filter((record) =>
                                !record.deleteFlg
                            )}
                            pagination={false}
                            columns={this.columns}
                            rowKey="productCode"
                            scroll={{
                                x: 1300
                            }}
                        />
                    </div>
                    <div>
                        <Row type="flex">
                            <Col span={8}>
                                <div>
                                    <span>合计数量:</span>
                                    <span style={{ color: '#F00' }}>{basicInfo.totalNumber}</span>
                                </div>

                            </Col>
                            <Col span={8}>
                                <div>
                                    <span>合计金额:</span>
                                    <span style={{ color: '#F00' }}>{basicInfo.totalAmount}</span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Affix offsetBottom={0}>
                        <div className="actions">
                            <Row gutter={40} type="flex" justify="end" >
                                <Col>
                                    <FormItem>
                                        <Button size="default" onClick={this.handleDownPDF}>
                                            下载PDF
                                        </Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                    </Affix>
                </Form>
            </div>
        )
    }
}

PoDetail.propTypes = {
    match: PropTypes.objectOf(PropTypes.any),
    basicInfo: PropTypes.objectOf(PropTypes.any),
    poLines: PropTypes.objectOf(PropTypes.any),
    initPoDetail: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(PoDetail));
