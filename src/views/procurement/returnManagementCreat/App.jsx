/*
 * @Author: tanjf
 * @Description: 采购退货新建编辑页
 * @CreateDate: 2017-10-27 11:26:16
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-10-31 16:27:36
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import {
    Table, Form, Icon, Row, Col, Input, Button, message, Select, DatePicker
} from 'antd';
import {
    returnLocationType,
    currencyType
} from '../../../constant/searchParams';
import {
    fetchReturnPoRcvDetail,
    updatePoRcvBasicinfo,
    updatePoRcvLine,
    createPoRcv
} from '../../../actions/procurement';
import { pubFetchValueList } from '../../../actions/pub';
import SearchMind from '../../../components/searchMind';
import Util from '../../../util/util';
import { exportReturnProPdf } from '../../../service';

const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;

@connect(state => ({
    poReturn: state.toJS().procurement.poReturn,
}), dispatch => bindActionCreators({
    fetchReturnPoRcvDetail,
    updatePoRcvLine,
    updatePoRcvBasicinfo,
    createPoRcv,
    pubFetchValueList
}, dispatch))
class ReturnManagementCreat extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            editable: false,
            // 控制DatePicker的value
            rengeTime: null,
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
        this.props.fetchReturnPoRcvDetail(Util.removeInvalid({ id }));
    }

    /**
    * DatePicker日期选取
    *
    * @param {moment} data 日期的moment对象
    * @param {string} dateString 格式化后的日期
    */
    onEnterTimeChange = (date) => {
        this.setState({
            rengeTime: date
        });
    }

    goBack = () => {
        this.props.history.replace('/returnManagementList');
    }

    // 供货供应商-值清单
    handleSupplyChoose = ({ record }) => {
        this.setState({
            stopBuyDisabled: false,
            supplierId: record.spAdrid
        })
    }

    // 供货供应商值清单-清除
    handleSupplyClear = () => {
        this.setState({
            stopBuyDisabled: true,
            supplierId: ''
        });
    }

    /**
     * 下载pdf
     */
    handleDownPDF = () => {
        const { match } = this.props;
        // 退货单id
        const id = match.params.id;
        Util.exportExcel(
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
        const { match } = this.props;
        const { poReturn } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="po-return-detail">
                <Form layout="inline">
                    <div className="basic-box">
                        <div className="header">
                            <Icon type="solution" className="header-icon" />基础信息
                        </div>
                        <div className="body" style={{padding: '10px'}}>
                            <Row >
                                <Col span={8}>
                                    {/* 退货单号 */}
                                    <span className="ant-form-item-label search-mind-label">退货单号</span>
                                    <span className="text">{poReturn.purchaseRefundNo}</span>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 供应商 */}
                                    <FormItem className="">
                                        <div>
                                            <span className="sc-form-item-label" style={{verticalAlign: 'top'}}>*供应商</span>
                                            <span className="value-list-input">
                                                <SearchMind
                                                    style={{ zIndex: 101 }}
                                                    compKey="search-mind-supply"
                                                    ref={ref => { this.supplySearchMind = ref }}
                                                    fetch={(params) =>
                                                        this.props.pubFetchValueList({
                                                            condition: params.value,
                                                            pageSize: params.pagination.pageSize,
                                                            pageNum: params.pagination.current || 1
                                                        }, 'supplierAdrSearchBox')
                                                    }
                                                    onChoosed={this.handleSupplyChoose}
                                                    onClear={this.handleSupplyClear}
                                                    renderChoosedInputRaw={(datas) => (
                                                        <div>{datas.providerNo} -
                                                            {datas.providerName}</div>
                                                    )}
                                                    rowKey="spAdrid"
                                                    pageSize={5}
                                                    columns={[
                                                        {
                                                            title: '地点编码',
                                                            dataIndex: 'providerNo',
                                                            width: 98,
                                                        }, {
                                                            title: '地点名称',
                                                            dataIndex: 'providerName',
                                                            width: 140
                                                        }
                                                    ]}
                                                />
                                            </span>
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 供应商地点 */}
                                    <FormItem>
                                        <span className="sc-form-item-label" style={{verticalAlign: 'top'}}>*供应商地点</span>
                                        <span>
                                            <SearchMind
                                                style={{ zIndex: 9 }}
                                                compKey="providerNo"
                                                ref={ref => { this.joiningAdressMind = ref }}
                                                fetch={(params) =>
                                                this.props.pubFetchValueList(Util.removeInvalid({
                                                    condition: params.value,
                                                    pageSize: params.pagination.pageSize,
                                                    pageNum: params.pagination.current || 1
                                                }), 'supplierAdrSearchBox').then((res) => {
                                                    const dataArr = res.data.data || [];
                                                    if (!dataArr || dataArr.length === 0) {
                                                        message.warning('没有可用的数据');
                                                    }
                                                    return res;
                                                })}
                                                onChoosed={this.handleAdressChoose}
                                                onClear={this.handleAdressClear}
                                                renderChoosedInputRaw={(res) => (
                                                    <div>{res.providerNo} - {res.providerName}</div>
                                                )}
                                                pageSize={6}
                                                columns={[
                                                    {
                                                        title: '供应商地点编码',
                                                        dataIndex: 'providerNo',
                                                        maxWidth: 98
                                                    }, {
                                                        title: '供应商地点名称',
                                                        dataIndex: 'providerName'
                                                    }
                                                ]}
                                            />
                                        </span>
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    {/* 状态 */}
                                    <span className="ant-form-item-label search-mind-label">状态</span>
                                    <span className="text">{match.params.id === 'returnManagementCreat' ? '制单' : '修改'}</span>
                                </Col>
                                <Col span={8}>
                                    {/* 退货地点类型 */}
                                    <FormItem >
                                        <div>
                                            <span className="sc-form-item-label">退货地点类型</span>
                                            {getFieldDecorator('providerType', {
                                                initialValue: returnLocationType.defaultValue,
                                                rules: [{
                                                    required: true,
                                                    message: '请选择退货地点类型'}],
                                            })(
                                                <Select
                                                    className="sc-form-item-select"
                                                    size="default"
                                                >
                                                    {
                                                        returnLocationType.data.map((item) =>
                                                            (<Option key={item.key} value={item.key}>
                                                                {item.value}
                                                            </Option>)
                                                        )
                                                    }
                                                </Select>
                                                )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    {/* 退货地点 */}
                                    <FormItem>
                                        <span className="sc-form-item-label" style={{verticalAlign: 'top'}}>*退货地点</span>
                                        <span>
                                            <SearchMind
                                                style={{ zIndex: 9 }}
                                                compKey="providerNo"
                                                ref={ref => { this.joiningAdressMind = ref }}
                                                fetch={(params) =>
                                                this.props.pubFetchValueList(Util.removeInvalid({
                                                    condition: params.value,
                                                    pageSize: params.pagination.pageSize,
                                                    pageNum: params.pagination.current || 1
                                                }), 'supplierAdrSearchBox').then((res) => {
                                                    const dataArr = res.data.data || [];
                                                    if (!dataArr || dataArr.length === 0) {
                                                        message.warning('没有可用的数据');
                                                    }
                                                    return res;
                                                })}
                                                onChoosed={this.handleAdressChoose}
                                                onClear={this.handleAdressClear}
                                                renderChoosedInputRaw={(res) => (
                                                    <div>{res.providerNo} - {res.providerName}</div>
                                                )}
                                                pageSize={6}
                                                columns={[
                                                    {
                                                        title: '供应商地点编码',
                                                        dataIndex: 'providerNo',
                                                        maxWidth: 98
                                                    }, {
                                                        title: '供应商地点名称',
                                                        dataIndex: 'providerName'
                                                    }
                                                ]}
                                            />
                                        </span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row >
                                <Col className="pay-col" span={8}>
                                    {/* 退货日期早于 */}
                                    <FormItem>
                                        <div>
                                            <span className="sc-form-item-label">退货日期早于:</span>
                                            {getFieldDecorator('payDate', {
                                                initialValue: moment(new Date(), dateFormat),
                                                rules: [{
                                                    required: true,
                                                    message: '请填写日期'}],
                                            })(
                                                <DatePicker
                                                    placeholder="日期"
                                                />
                                            )}
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    {/* 退货日期 */}
                                    <FormItem >
                                        <span className="ant-form-item-label search-mind-label">退货日期</span>
                                        <span className="text">{moment(new Date()).format(dateFormat) ? moment(new Date()).format(dateFormat) : '-'}</span>
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    {/* 货币类型 */}
                                    <FormItem >
                                        <div>
                                            <span className="sc-form-item-label">货币类型</span>
                                            {getFieldDecorator('currencyType', {
                                                initialValue: currencyType.defaultValue
                                            })(
                                                <Select
                                                    className="sc-form-item-select"
                                                    size="default"
                                                >
                                                    {
                                                        currencyType.data.map((item) =>
                                                            (<Option key={item.key} value={item.key}>
                                                                {item.value}
                                                            </Option>)
                                                        )
                                                    }
                                                </Select>
                                                )}
                                        </div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row >
                                <Col className="pay-col" span={24}>
                                    {/* 备注 */}
                                    <FormItem>
                                        <div style={{display: 'flex'}}>
                                            <div className="sc-form-item-label" style={{textAlign: 'right'}}>备注: </div>
                                            <TextArea
                                                autosize={{ minRows: 4, maxRows: 6 }}
                                                value={this.state.remark}
                                                style={{resize: 'none', width: 300}}
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
                                        <span className="text">{moment(new Date()).format(dateFormat) ? moment(new Date()).format(dateFormat) : '-'}</span>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    {/* 审核人 */}
                                    <span className="ant-form-item-label search-mind-label" style={{lineHeight: '42px'}}>审核人</span>
                                    <span className="text" style={{verticalAlign: 'sub'}}>{poReturn.auditUserId || '-'}</span>
                                </Col>
                                <Col span={6}>
                                    {/* 审核日期 */}
                                    <FormItem >
                                        <span className="ant-form-item-label search-mind-label">审核日期</span>
                                        <span className="text">{moment(new Date()).format(dateFormat) ? moment(new Date()).format(dateFormat) : '-'}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div>
                        <span>
                            {/* 采购单号 */}
                            <span className="ant-form-item-label search-mind-label">*采购单号</span>
                            <FormItem
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 8 }}
                            >
                                {getFieldDecorator('purchaseOrderNo', {
                                    rules: [{ required: true, message: '请输入采购单号！' }],
                                })(
                                    <Input style={{minWidth: 150}} />
                                )}
                            </FormItem>
                        </span>
                        <span className="gutter-row">
                            {/* 商品 */}
                            <FormItem>
                                <span className="sc-form-item-label" style={{verticalAlign: 'top'}}>商品</span>
                                <span>
                                    <SearchMind
                                        style={{ zIndex: 9 }}
                                        compKey="providerNo"
                                        ref={ref => { this.joiningAdressMind = ref }}
                                        fetch={(params) =>
                                        this.props.pubFetchValueList(Util.removeInvalid({
                                            condition: params.value,
                                            pageSize: params.pagination.pageSize,
                                            pageNum: params.pagination.current || 1
                                        }), 'supplierAdrSearchBox').then((res) => {
                                            const dataArr = res.data.data || [];
                                            if (!dataArr || dataArr.length === 0) {
                                                message.warning('没有可用的数据');
                                            }
                                            return res;
                                        })}
                                        onChoosed={this.handleAdressChoose}
                                        onClear={this.handleAdressClear}
                                        renderChoosedInputRaw={(res) => (
                                            <div>{res.providerNo} - {res.providerName}</div>
                                        )}
                                        pageSize={6}
                                        columns={[
                                            {
                                                title: '商品编码',
                                                dataIndex: 'providerNo',
                                                maxWidth: 98
                                            }, {
                                                title: '商品名称',
                                                dataIndex: 'providerName'
                                            }
                                        ]}
                                    />
                                </span>
                            </FormItem>
                        </span>
                        <span className="gutter-row">
                            {/* 品牌 */}
                            <FormItem>
                                <span className="sc-form-item-label" style={{verticalAlign: 'top'}}>品牌</span>
                                <span>
                                    <SearchMind
                                        style={{ zIndex: 9 }}
                                        compKey="productBrandId"
                                        ref={ref => { this.joiningAdressMind = ref }}
                                        fetch={(params) =>
                                        this.props.pubFetchValueList(Util.removeInvalid({
                                            condition: params.value,
                                            pageSize: params.pagination.pageSize,
                                            pageNum: params.pagination.current || 1
                                        }), 'queryPurchaseOrderBrands').then((res) => {
                                            const dataArr = res.data.data || [];
                                            if (!dataArr || dataArr.length === 0) {
                                                message.warning('没有可用的数据');
                                            }
                                            return res;
                                        })}
                                        onChoosed={this.handleAdressChoose}
                                        onClear={this.handleAdressClear}
                                        renderChoosedInputRaw={(res) => (
                                            <div>{res.productBrandId} - {res.productBrandName}</div>
                                        )}
                                        pageSize={6}
                                        columns={[
                                            {
                                                title: '品牌编码',
                                                dataIndex: 'productBrandId',
                                                maxWidth: 98
                                            }, {
                                                title: '品牌名称',
                                                dataIndex: 'productBrandName'
                                            }
                                        ]}
                                    />
                                </span>
                            </FormItem>
                        </span>
                        <Button type="primary" style={{verticalAlign: 'sub'}}>添加</Button>
                        <Button
                            className="return-delete"
                            type="danger"
                            style={{float: 'right', marginTop: '4px'}}
                        >
                            删除
                        </Button>
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
                                <span className="text">{poReturn.refundAmount}</span>
                            </Col>
                            <Col span={4}>
                                <span className="ant-form-item-label search-mind-label">合计退货金额(含税):</span>
                                <span className="text">{poReturn.refundMoney}</span>
                            </Col>
                            <Col span={4}>
                                <span className="ant-form-item-label search-mind-label">合计退货成本额:</span>
                                <span className="text">{poReturn.refundCost}</span>
                            </Col>
                            <Col span={4}>
                                <span className="ant-form-item-label search-mind-label">实际退货数量:</span>
                                <span className="text">{poReturn.realRefundAmount}</span>
                            </Col>
                            <Col span={6}>
                                <span className="ant-form-item-label search-mind-label">实际退货金额(含税);</span>
                                <span className="text">{poReturn.realRefundMoney}</span>
                            </Col>
                        </Row >
                    </div>
                    <Row gutter={40} type="flex" justify="end">
                        <Col className="ant-col-16 ant-col-offset-6 gutter-row" style={{ textAlign: 'right'}}>
                            <FormItem>
                                <Button size="default" type="default" onClick={this.goBack}>
                                    返回
                                </Button>
                            </FormItem>
                            <FormItem>
                                <Button size="default" type="danger" onClick={this.handleDelete}>
                                    删除
                                </Button>
                            </FormItem>
                            <FormItem>
                                <Button size="default" type="default" onClick={this.handleCancel}>
                                    取消
                                </Button>
                            </FormItem>
                            <FormItem>
                                <Button size="default" type="primary" onClick={this.handleDownPDF}>
                                    下载退货单
                                </Button>
                            </FormItem>
                            <FormItem>
                                <Button size="default" type="primary" onClick={this.handleSave}>
                                    保存
                                </Button>
                            </FormItem>
                            <FormItem>
                                <Button size="default" type="primary" onClick={this.handleSubmit}>
                                    提交
                                </Button>
                            </FormItem>
                            <FormItem>
                                <Button size="default" type="primary" onClick={this.handleApprovalProgress}>
                                    查看审批进度
                                </Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

ReturnManagementCreat.propTypes = {
    fetchReturnPoRcvDetail: PropTypes.func,
    pubFetchValueList: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any),
    form: PropTypes.objectOf(PropTypes.any),
    poReturn: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(ReturnManagementCreat));
