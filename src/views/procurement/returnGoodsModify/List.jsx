/**
 * @file List.jsx
 * @author shijh
 *
 * 退货单列表
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { is, fromJS } from 'immutable';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Row, Col, Select, DatePicker, Input,
    Table, Button, message, InputNumber,
    Modal
} from 'antd';
import SearchMind from '../../../components/searchMind';
import Util from '../../../util/util';

import {
    exportReturnProPdf, createRefundWithItems,
    updateRefundWithItems, deleteBatchRefundOrder,
    cancel
} from '../../../service';

const confirm = Modal.confirm;
const Option = Select.Option;
const { TextArea } = Input;

const reason = {0: '破损', 1: '临期', 2: '过剩', 3: '其他'}

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
    key: 'refundAmount'
}, {
    title: '退货原因',
    dataIndex: 'refundReason',
    key: 'refundReason'
}, {
    title: '退货金额(含税)',
    dataIndex: 'refundMoney',
    key: 'refundMoney',
    render: (text, record) => {
        const { purchasePrice, refundAmount } = record;
        const result = purchasePrice * refundAmount;

        return result.toFixed(2);
    }
}, {
    title: '退货成本额',
    dataIndex: 'refundCost',
    key: 'refundCost',
    render: (text, record) => {
        const { avCost, refundAmount } = record;
        const result = avCost * refundAmount;

        return result.toFixed(2);

    }
}, {
    title: '实际退货数量',
    dataIndex: 'realRefundAmount',
    key: 'realRefundAmount',
}, {
    title: '实际退货金额(含税)',
    dataIndex: 'realRefundMoney',
    key: 'realRefundMoney',
    render: (text, record) => {
        const { purchasePrice, realRefundAmount } = record;
        if (!text) {
            const result = purchasePrice * realRefundAmount;
            return result.toFixed(2);
        }
        return text;
    }
}];

// 原数据
let originLists = [];

let current = {};

// 默认选择其他
function parseReason(lists) {
    return lists.map((item) => {
        const newItem = item;
        const { refundReason } = item;
        newItem.refundReason = refundReason || '3';
        return newItem;
    })
}

function parseLists(lists) {
    // 退货数量大于了库存
    const overrun = [];
    // 库存数量为0
    const zero = [];
    // 退货数量
    const amount = [];

    const newList = lists.filter((item, index) => {
        if (item.possibleNum === 0) {
            zero.push(index + 1);
            return false;
        }

        if (item.possibleNum < item.refundAmount) {
            overrun.push(index + 1);
            return false;
        }

        if (!item.refundAmount) {
            amount.push(index + 1);
            return false;
        }

        return true;
    })

    return {
        newList,
        overrun,
        zero,
        amount
    }
}

function getNewLists(lists, cLists, orderId) {
    const ids = [];
    const newLists = [];
    const nLists = JSON.parse(JSON.stringify(cLists));

    // 可退货不为0的数组
    const returnAble = nLists.filter((item) => {
        // if (item.possibleNum > 0) {
        ids.push(`${item.productCode}-${item.purchaseOrderNo}`);
        return true;
        // }
        // return false;
    })

    for (let j = 0; j < lists.length; j++) {
        const curr = lists[j];
        const index = ids.indexOf(`${curr.productCode}-${curr.purchaseOrderNo}`);
        if (index > -1) {
            newLists.unshift(curr)
            ids.splice(index, 1);
            returnAble.splice(index, 1);
        } else {
            newLists.push(curr);
        }
    }

    return returnAble.concat(newLists)
}

class List extends Component {
    static propTypes = {
        prefixCls: PropTypes.string,
        match: PropTypes.objectOf(PropTypes.any),
        pubFetchValueList: PropTypes.func,
        putRefundProducts: PropTypes.func,
        getFormData: PropTypes.func,
        returnLists: PropTypes.arrayOf(PropTypes.any),
        onShowModal: PropTypes.func,
        clearList: PropTypes.func,
    }

    static defaultProps = {
        prefixCls: 'return-goods'
    }

    constructor(props) {
        super(props);

        const { returnLists } = this.props;

        this.state = {
            locDisabled: true,
            orderId: '',
            goodsRecord: null,
            brandRecord: null,
            lists: returnLists,
            // 退货数
            count: 0,
            // 退货金额（含税）
            money: 0,
            // 合计退货成本额
            cost: 0,
            // 合计实际退货数量
            actualCount: 0,
            // 合计实际退货金额
            actualMoneyCount: 0,
            // 选中元素
            selectedRowKeys: []
        }
    }

    componentDidMount() {
        this.calculation();
    }

    componentWillReceiveProps(nextProps) {
        const { returnLists, defaultValue, type } = nextProps;

        if (!is(fromJS(returnLists), fromJS(current))) {
            const { lists, orderId } = this.state;
            current = returnLists;

            const newLists = getNewLists(lists, current, orderId);
          
            this.setState({
                lists: newLists
            }, () => {
                this.calculation()
            })
        }

        if (type === 'edit' && originLists.length === 0 && defaultValue.length) {
            this.setState({
                lists: defaultValue
            }, () => {
                this.calculation()
            })
            originLists = defaultValue;
        }
    }

    componentWillUnmount() {
        // 解决返回后数据没有被清除问题
        originLists = [];
        current = [];
    }

    onPageChange = () => {

    }

    calculation = () => {
        const { lists } = this.state;

        const res = {
            // 退货数
            count: 0,
            // 退货金额（含税）
            money: 0,
            // 合计退货成本额
            cost: 0,
            // 合计实际退货数量
            actualCount: 0,
            // 合计实际退货金额
            actualMoneyCount: 0
        };

        for (let i = 0; i < lists.length; i++) {
            const { refundAmount, purchasePrice, realRefundAmount, avCost } = lists[i];
            res.count += refundAmount;
            res.money += refundAmount * purchasePrice;
            res.cost += refundAmount * avCost;
            res.actualCount += realRefundAmount;
            res.actualMoneyCount += realRefundAmount * purchasePrice;

        }

        this.setState({
            ...res
        })
    }

    handleEdit = (no, code, type, value) => {
        const { lists } = this.state;

        lists.forEach((item) => {
            const { purchaseOrderNo, productCode } = item;
            if (purchaseOrderNo === no && productCode === code) {
                item[type] = value;
                return item;
            }
            return item;
        })

        this.setState({
            lists
        }, () => {
            if (type === 'refundAmount' || type === 'realRefundAmount') {
                this.calculation()
            }
        })
    }

    numberRender = (text, record) => {
        const { purchaseOrderNo, productCode } = record;
        return (
            <InputNumber
                defaultValue={text || 0}
                style={{maxWidth: '60px'}}
                min={0}
                max={record.possibleNum}
                onChange={(v) => this.handleEdit(purchaseOrderNo, productCode, 'refundAmount', v)}
            />
        )
    }

    typeRender = (text, record) => {
        const keys = Object.keys(reason);
        const { purchaseOrderNo, productCode } = record;
        return (
            <Select
                defaultValue={reason[text] || '其他'}
                onChange={(v) => this.handleTypeChange(v, purchaseOrderNo, productCode)}
            >
                {keys.map((item) => {
                    return <Option key={reason[item]}>{reason[item]}</Option>
                })}
            </Select>
        )
    }

    /**
     * 修改拒绝原因
     */
    handleTypeChange = (v, purchaseOrderNo, productCode) => {
        const values = Object.values(reason);
        const keys = Object.keys(reason);
        const i = values.indexOf(v);

        this.handleEdit(purchaseOrderNo, productCode, 'refundReason', keys[i]);
    }

    actualNumberRender = (text, record, index) => {
        const { purchaseOrderNo, productCode } = record;

        return text || 0;

        // return (
        //     <InputNumber
        //         defaultValue={text || 0}
        //         style={{maxWidth: '60px'}}
        //         min={0}
        //         max={record.refundAmount}
        //         onChange={(v) => this.handleEdit(purchaseOrderNo, productCode, 'realRefundAmount', v)}
        //     />
        // )
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
        const result = this.props.getFormData();
        if (!result) {
            return;
        }
        const { refundAdrCode } = result;

        this.props.putRefundProducts(Util.removeInvalid({
            purchaseOrderNo: orderId,
            brandId: brandRecord ? brandRecord.productBrandId : '',
            productCode: goodsRecord ? goodsRecord.productCode : '',
            logicWareHouseCode: refundAdrCode
        }))
    }

    handleDelete = () => {
        const { selectedRowKeys, lists } = this.state;
        const results = lists.filter((item) => {
            return selectedRowKeys.indexOf(`${item.purchaseOrderNo}-${item.productCode}`) === -1;
        })

        this.setState({
            lists: results,
            selectedRowKeys: []
        }, () => {
            this.calculation();
            // 需要清空历史数据
            this.props.clearList();
            current = [];
        })
    }

    handleType = (e) => {
        const type = e.target.getAttribute('data-type');
        const {
            id, purchaseRefundNo,
            adrType, refundAdrCode
        } = this.props.getFormData();

        switch (type) {
            case 'back':
                this.props.history.push('/returnManagementList');
                break;
            case 'delete':
                confirm({
                    title: '确认',
                    content: '是否确认删除？',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        deleteBatchRefundOrder({
                            pmRefundOrderIds: id
                        }).then(() => {
                            message.success('删除成功');
                            this.props.history.push('/returnManagementList');
                        })
                    },
                    onCancel: () => { }
                });
                break;
            case 'cancel':
                confirm({
                    title: '确认',
                    content: '是否确认取消？',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        cancel({
                            id,
                            purchaseRefundNo,
                            adrType,
                            refundAdrCode
                        }).then(() => {
                            message.success('取消订单成功');
                            this.props.history.push('/returnManagementList');
                        })
                    },
                    onCancel: () => { }
                });
                break;
            case 'download':
                Util.exportExcel(exportReturnProPdf, {id})
                break;
            case 'save':
                this.saveOrSubmit(0)
                break;
            case 'submit':
                this.saveOrSubmit(1)
                break;
            case 'progress':
                this.props.onShowModal(id)
                break;
            default:
                break;
        }
    }

    saveOrSubmit = (status) => {
        const {
            lists
        } = this.state;

        const {
            type
        } = this.props;

        const { newList, overrun, zero, amount } = parseLists(lists);
        const isEdit = type === 'edit';
        const tip = isEdit ? '修改成功' : '新增成功';

        if (overrun.length) {
            Modal.error({
                title: '数据错误',
                content: `序号：${overrun.join('、')} 数据中存在退货数大于退货数，无法提交`,
            });
            return;
        }

        if (amount.length) {
            Modal.error({
                title: '数据错误',
                content: `序号：${amount.join('、')} 退货数为0, 无法提交`,
            });
            return;
        }

        if (zero.length) {
            confirm({
                title: '数据错误',
                content: `序号：${zero.join('、')} 可退货数为0的商品将过滤掉，是否继续`,
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    if (!newList.length) {
                        message.error('失败：没有可用商品信息');
                        return;
                    }

                    this.submit(newList, status).then((res) => {
                        message.success(tip);
                        this.props.history.push('/returnManagementList');
                    })
                },
                onCancel: () => { }
            });
            return;
        }

        if (!newList.length) {
            message.error('失败：没有可用商品信息');
            return;
        }

        this.submit(newList, status).then((res) => {
            message.success(tip)
            this.props.history.push('/returnManagementList');
        });
    }

    submit = (lists, status) => {
        const {
            count, money, cost,
            actualCount, actualMoneyCount
        } = this.state;
        const {
            type
        } = this.props;
        const submit = this.props.getFormData();
        const postService = type === 'edit' ? updateRefundWithItems : createRefundWithItems;

        submit.pmPurchaseRefundItems = parseReason(lists);
        submit.status = status;

        // 退货数
        submit.totalRefundAmount = count;
        // 退货金额（含税）
        submit.totalRefundMoney = money;
        // 合计退货成本额
        submit.totalRefundCost = cost;
        // 合计实际退货数量
        submit.totalRealRefundAmount = actualCount;
        // 合计实际退货金额
        submit.totalRealRefundMoney = actualMoneyCount;

        return postService(submit)
    }

    clearList = () => {
        this.setState({
            lists: []
        }, () => {
            this.calculation();
            current = [];
            // originLists = [];
            this.props.clearList()
            // this.props.clearReturnInfo();
        })
    }

    getValue() {
        return this.state.lists;
    }

    handleFetchGoods = (params) => {
        const result = this.props.getFormData();
        const { orderId } = this.state;
        if (!result) {
            return;
        }
        const { refundAdrCode, spAdrNo } = result;
        return this.props.pubFetchValueList(Util.removeInvalid({
            productName: params.value,
            purchaseOrderNo: orderId,
            spAdrNo: spAdrNo,
            logicWareHouseCode: refundAdrCode
        }), 'queryPurchaseOrderProducts').then((res) => {
            const dataArr = res.data.data || [];
            if (!dataArr || dataArr.length === 0) {
                message.warning('没有可用的数据');
            }
            return res;
        })
    }

    handleFetchBrand = (params) => {
        const result = this.props.getFormData();
        const { orderId } = this.state;
        if (!result) {
            return;
        }
        const { refundAdrCode, spAdrNo } = result;
        return this.props.pubFetchValueList(Util.removeInvalid({
            name: params.value,
            purchaseOrderNo: orderId,
            spAdrNo: spAdrNo,
            logicWareHouseCode: refundAdrCode
        }), 'queryPurchaseOrderBrands').then((res) => {
            const dataArr = res.data.data || [];
            if (!dataArr || dataArr.length === 0) {
                message.warning('没有可用的数据');
            }
            return res;
        })
    }

    render() {
        const { prefixCls, returnLists, type, status } = this.props;
        const {
            orderId, count, money, cost,
            actualCount, actualMoneyCount,
            selectedRowKeys
        } = this.state;
        const isEdit = type === 'edit';

        columns[11].render = this.numberRender;
        columns[12].render = this.typeRender;
        columns[15].render = this.actualNumberRender;

        const cls = classnames(
            `${prefixCls}-modify`,
            {
                [`${prefixCls}-modify-${type}`]: type
            }
        )

        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys
                })
            },
            getCheckboxProps: record => ({
            }),
        };

        // 0:制单;1:已提交;2:已审核;3:已拒绝;4:待退货;5:已退货;6:已取消;7:取消失败;8:异常
        const footer = (
            <div
                className={'return-goods-table-footer'}
            >
                <Row className={'return-goods-table-footer-first'}>
                    <Col span={4}>
                        合计退货数量: {count}
                    </Col>
                    <Col span={4}>
                        合计退货金额(含税): {money.toFixed(2)}
                    </Col>
                    <Col span={4}>
                        合计退货成本额: {cost.toFixed(2)}
                    </Col>
                    <Col span={4}>
                        合计实际退货数量: {actualCount}
                    </Col>
                    <Col span={4}>
                        合计实际退货金额(含税): {actualMoneyCount.toFixed(2)}
                    </Col>
                </Row>
                <div className={'return-goods-table-footer-second'}>
                    <Button data-type="back" onClick={this.handleType}>返回</Button>
                    { isEdit && <Button data-type="delete" onClick={this.handleType}>删除</Button> }
                    { isEdit && (status === 2 || status === 4) && <Button data-type="cancel" onClick={this.handleType}>取消</Button> }
                    { isEdit && <Button data-type="download" onClick={this.handleType}>下载退货单</Button> }
                    {
                        (!isEdit || status === 0 || status === 1 || status === 3)
                        && <Button data-type="save" onClick={this.handleType}>保存</Button>
                    }
                    {
                        (!isEdit || status === 0 || status === 1 || status === 3)
                        && <Button data-type="submit" onClick={this.handleType}>提交</Button>
                    }
                    {
                        isEdit && status === 1 && <Button data-type="progress" onClick={this.handleType}>查看审批进度</Button>
                    }
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
                        <div className={"return-goods-choose-wrap"}>
                            <Col span={6}>
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
                            <Col span={6}>
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
                                        fetch={this.handleFetchGoods}
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
                            <Col span={6}>
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
                                        fetch={this.handleFetchBrand}
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
                            <Col span={6}>
                                <Button disabled={!orderId} onClick={this.handleSubmitGoods}>添加</Button>
                            </Col>
                        </div>
                        <Button
                            className={'return-goods-table'}
                            disabled={!selectedRowKeys.length}
                            onClick={this.handleDelete}
                            style={{
                                float: 'right',
                                marginRight: '20px'
                            }}
                        >
                            删除
                        </Button>
                    </Row>
                </div>
                <div
                    className={'return-goods-table'}
                >
                    <Table
                        dataSource={this.state.lists}
                        columns={columns}
                        selectedRowKeys={selectedRowKeys}
                        rowSelection={rowSelection}
                        rowKey={(record) => `${record.purchaseOrderNo}-${record.productCode}`}
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

export default List;
