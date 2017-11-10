import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Select, DatePicker, Input, Table, Button, message } from 'antd';
import SearchMind from '../../../components/searchMind';
import Util from '../../../util/util';
import {
    pubFetchValueList,
} from '../../../actions/pub';
import {
    putRefundProducts
} from '../../../actions/procurement';

const Option = Select.Option;
const { TextArea } = Input;
const columns = [{
    title: '行号',
    dataIndex: 'index',
    key: 'index',
    render: (text, record, index) => <span>{index + 1}</span>
}, {
    title: '采购单号',
    dataIndex: 'purchaseOrderNo',
    key: 'purchaseOrderNo',
}, {
    title: '商品编号',
    dataIndex: 'productCode',
    key: 'productCode',
}, {
    title: '条码',
    dataIndex: 'internationalCode',
    key: 'internationalCode',
}, {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName',
}, {
    title: '规格',
    dataIndex: 'packingSpecifications',
    key: 'packingSpecifications',
}, {
    title: '采购内装数',
    dataIndex: 'purchaseInsideNumber',
    key: 'purchaseInsideNumber',
}, {
    title: '单位',
    dataIndex: 'unitExplanation',
    key: 'unitExplanation',
}, {
    title: '税率',
    dataIndex: 'inputTaxRate',
    key: 'inputTaxRate',
}, {
    title: '采购价格（含税）',
    dataIndex: 'purchasePrice',
    key: 'purchasePrice',
}, {
    title: '可退库存',
    dataIndex: 'possibleNum',
    key: 'possibleNum',
}, {
    title: '退货数量',
    dataIndex: 'refundAmount',
    key: 'refundAmount',
}, {
    title: '退货原因',
    dataIndex: 'refundReason',
    key: 'refundReason',
}, {
    title: '退货金额(含税)',
    dataIndex: 'refundMoney',
    key: 'refundMoney',
}, {
    title: '退货成本额',
    dataIndex: 'refundCost',
    key: 'refundCost',
}, {
    title: '实际退货数量',
    dataIndex: 'realRefundAmount',
    key: 'realRefundAmount',
}, {
    title: '实际退货金额(含税)',
    dataIndex: 'realRefundMoney',
    key: 'realRefundMoney',
}];

@connect(
    state => ({
        returnLists: state.toJS().procurement.returnLists
    }),
    dispatch => bindActionCreators({
        pubFetchValueList,
        putRefundProducts
    }, dispatch)
)
class List extends PureComponent {
    static propTypes = {
        prefixCls: PropTypes.string,
        match: PropTypes.objectOf(PropTypes.any),
        pubFetchValueList: PropTypes.func,
        putRefundProducts: PropTypes.func,
        getFormData: PropTypes.func,
    }

    static defaultProps = {
        prefixCls: 'return-goods'
    }

    constructor(props) {
        super(props);

        const { match } = this.props;
        const { params } = match;

        if (params.id) {
            this.type = 'edit';
        } else {
            this.type = 'new';
        }

        this.state = {
            locDisabled: true,
            orderId: '',
            goodsRecord: null,
            brandRecord: null
        }
    }

    componentDidMount() {

    }

    onPageChange = () => {

    }

    handleIdChange = (e) => {
        const { value } = e.target;
        this.setState({
            orderId: value
        })
    }

    handleGoodsChoose = (data) => {
        const { record } = data;
        this.setState({
            goodsRecord: record
        })
    }

    handleGoodsClear = () => {
        this.setState({
            goodsRecord: null
        })
    }

    handleBrandChoose = (data) => {
        const { record } = data;
        this.setState({
            brandRecord: record
        })
    }

    handleBrandClear = () => {
        this.setState({
            brandRecord: null
        })
    }

    handleSubmitGoods = () => {
        const { orderId, goodsRecord = {}, brandRecord = {} } = this.state;
        const { id } = this.props.getFormData();

        this.props.putRefundProducts(Util.removeInvalid({
            purchaseOrderNo: orderId,
            brandId: brandRecord ? brandRecord.productBrandId : '',
            productCode: goodsRecord ? goodsRecord.productCode : '',
            logicWareHouseCode: id
        }))
    }

    render() {
        const { prefixCls, returnLists } = this.props;
        const { orderId } = this.state;
    
        const cls = classnames(
            `${prefixCls}-modify`,
            {
                [`${prefixCls}-modify-${this.type}`]: this.type
            }
        )

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
            }),
        };

        const footer = (
            <div
                className={'return-goods-table-footer'}
            >
                <Row className={'return-goods-table-footer-first'}>
                    <Col span={4}>
                        合计退货数量: 100
                    </Col>
                    <Col span={4}>
                        合计退货金额(含税): 250.00
                    </Col>
                    <Col span={4}>
                        合计退货成本额: 250.00
                    </Col>
                    <Col span={4}>
                        合计实际退货数量:
                    </Col>
                    <Col span={4}>
                        合计实际退货金额(含税):
                    </Col>
                </Row>
                <div className={'return-goods-table-footer-second'}>
                    <Button>返回</Button>
                    <Button>删除</Button>
                    <Button>取消</Button>
                    <Button>下载退货单</Button>
                    <Button>保存</Button>
                    <Button>提交</Button>
                    <Button>查看审批进度</Button>
                </div>
            </div>
        )

        return (
            <div
                className={cls}
            >
                <div
                    className={'return-goods-choose'}
                >
                    <Row>
                        <Col span={4}>
                            <span
                                className={'return-goods-choose-left'}
                            >
                                *采购单号
                            </span>
                            <span>
                                <Input
                                    type="text"
                                    style={{ maxWidth: '118px' }}
                                    placeholder="采购单号"
                                    onChange={this.handleIdChange}
                                />
                            </span>
                        </Col>
                        <Col span={4}>
                            <span
                                className={'return-goods-choose-left'}
                            >
                                商品
                            </span>
                            <span
                                className={'return-goods-choose-right'}
                            >
                                <SearchMind
                                    style={{ zIndex: 9 }}
                                    compKey="productCode"
                                    ref={ref => { this.joiningAdressMind = ref }}
                                    fetch={(params) =>
                                        this.props.pubFetchValueList(Util.removeInvalid({
                                            productName: params.value,
                                            purchaseOrderNo: orderId
                                        }), 'queryPurchaseOrderProducts').then((res) => {
                                            const dataArr = res.data.data || [];
                                            if (!dataArr || dataArr.length === 0) {
                                                message.warning('没有可用的数据');
                                            }
                                            return res;
                                        })}
                                    placeholder={'名称/编码/条码'}
                                    onChoosed={this.handleGoodsChoose}
                                    onClear={this.handleGoodsClear}
                                    disabled={!orderId}
                                    renderChoosedInputRaw={(res) => (
                                        <div>{res.productCode} - {res.productName}</div>
                                    )}
                                    rowKey="productCode"
                                    pageSize={6}
                                    columns={[
                                        {
                                            title: '商品编码',
                                            dataIndex: 'productCode',
                                            maxWidth: 98
                                        }, {
                                            title: '商品名称',
                                            dataIndex: 'productName'
                                        }
                                    ]}
                                />
                            </span>
                        </Col>
                        <Col span={4}>
                            <span
                                className={'return-goods-choose-left'}
                            >
                                品牌
                            </span>
                            <span
                                className={'return-goods-choose-right'}
                            >
                                <SearchMind
                                    style={{ zIndex: 9 }}
                                    compKey="productBrandId"
                                    ref={ref => { this.joiningAdressMind = ref }}
                                    fetch={(params) =>
                                        this.props.pubFetchValueList(Util.removeInvalid({
                                            name: params.value,
                                            purchaseOrderNo: orderId
                                        }), 'queryPurchaseOrderBrands').then((res) => {
                                            const dataArr = res.data.data || [];
                                            if (!dataArr || dataArr.length === 0) {
                                                message.warning('没有可用的数据');
                                            }
                                            return res;
                                        })}
                                    onChoosed={this.handleBrandChoose}
                                    onClear={this.handleBrandClear}
                                    renderChoosedInputRaw={(res) => (
                                        <div>{res.productBrandId} - {res.productBrandName}</div>
                                    )}
                                    placeholder={'请输入品牌'}
                                    disabled={!orderId}
                                    rowKey="productBrandId"
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
                        </Col>
                        <Col span={4}>
                            <Button disabled={!orderId} onClick={this.handleSubmitGoods}>提交</Button>
                        </Col>
                    </Row>
                </div>
                <div
                    className={'return-goods-table'}
                >
                    <Table
                        dataSource={returnLists}
                        columns={columns}
                        rowSelection={rowSelection}
                        rowKey="id"
                        pagination={false}
                        footer={
                            () => footer
                        }
                    />
                </div>
            </div>
        )
    }
}

export default withRouter(List)
