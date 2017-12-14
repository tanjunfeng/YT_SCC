import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Table, Icon, Dropdown, Menu, Modal, message,
} from 'antd';
import EditableCell from './EditableCell';

import {
    getMaterialMap,
    initPoDetail,
    createPo,
    ModifyPo,
    auditPo,
    queryPoDetail,
    updatePoBasicinfo,
    addPoLines,
    updatePoLine,
    deletePoLine,
    fetchNewPmPurchaseOrderItem,
} from '../../../actions/procurement';

@connect(state => ({
    po: state.toJS().procurement.po || {},
    newPcOdData: state.toJS().procurement.newPcOdData || {},
    // 回显数据
    basicInfo: state.toJS().procurement.po.basicInfo || {},
    poLines: state.toJS().procurement.po.poLines || [],
    // 用户信息
    data: state.toJS().user.data || {}
}), dispatch => bindActionCreators({
    getMaterialMap,
    initPoDetail,
    createPo,
    ModifyPo,
    auditPo,
    queryPoDetail,
    updatePoBasicinfo,
    addPoLines,
    updatePoLine,
    deletePoLine,
    fetchNewPmPurchaseOrderItem,
}, dispatch))

class GoodsLists extends PureComponent {
    constructor(props) {
        super(props)
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
                key: 'purchasePrice',
                render: (text, record, index) =>
                    (<EditableCell
                        value={this.props.purchaseOrderType === '1' ? 0 : text}
                        max={text}
                        editable={this.props.purchaseOrderType === '2'}
                        step={record.purchaseInsideNumber}
                        purchaseInsideNumber={null}
                        onChange={value => this.applyPriceChange(record, index, value)}
                    />)
            },
            {
                title: '采购数量',
                dataIndex: 'purchaseNumber',
                key: 'purchaseNumber',
                render: (text, record, index) =>
                    (<EditableCell
                        value={text}
                        editable={true}
                        step={record.purchaseInsideNumber}
                        purchaseInsideNumber={record.purchaseInsideNumber}
                        onChange={value => this.applyQuantityChange(record, index, value)}
                    />)
            },
            {
                title: '采购金额（含税）',
                dataIndex: 'totalAmount',
                key: 'totalAmount',
                render: (text) => {
                    if (this.props.purchaseOrderType === '1') {
                        return 0
                    }
                    return text
                }
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
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: this.renderActions
            }
        ];
    }

    /**
     * 表单操作
     * @param {*} record 行数据
     * @param {*} index 行下标
     * @param {*} items 行项
     */
    onActionMenuSelect = (record, index, items) => {
        const { key } = items;
        switch (key) {
            case 'delete':
                Modal.confirm({
                    title: '你确认要删除该商品？',
                    onOk: () => {
                        // 新添加商品(未存数据库),物理删除
                        this.props.deletePoLine(record);
                        this.props.updatePoLine(record);
                        message.success('删除成功');
                    },
                    onCancel() {
                    },
                });
                break;
            default:
                break;
        }
    }

    /**
     * 商品行采购数量变化回调，做如下处理
     *  1.更新store中该行信息（校验结果，采购数量，采购金额）
     *  2.计算采购总数量、采购总金额并更新store
     * result:{value:输入值,isValidate:检验结果 true/false}
     */
    applyQuantityChange = (records, index, result) => {
        const record = records;
        const { value, isValidate } = result;
        record.purchasePrice = this.props.purchaseOrderType === '1' ? 0 : record.purchasePrice;
        // 更新store中采购单商品
        if (record) {
            // 未输入采购数量，则清空store中采购数量，采购金额
            if (!value) {
                record.purchaseNumber = null;
                record.totalAmount = null;
                this.props.updatePoLine(record);
            } else {
                // 保存输入数据和校验状态 给submit用
                record.purchaseNumber = value;
                // 计算采购金额（含税）
                record.totalAmount = Math.round(value * record.purchasePrice * 100) / 100;
                // 校验状态
                record.isValidate = isValidate;
                this.props.updatePoLine(record);

                // 输入采购数量合法，更新store
                if (!isValidate) {
                    message.error('采购数量必须为采购内装数的整数倍');
                }
            }
        }
    }
    /**
     * 商品行价格变化回调，做如下处理
     *  1.更新store中该行信息（校验结果，采购价格，采购金额）
     *  2.计算采购总金额并更新store
     * result:{value:输入值,isValidate:检验结果 true/false}
     */
    applyPriceChange = (records, index, result) => {
        const record = records;
        const { value, isValidate } = result;
        // 更新store中采购单商品
        if (record) {
            // 未输入采购价格，则清空store中采购数量，采购金额
            if (!value) {
                record.purchasePrice = null;
                record.totalAmount = null;
                this.props.updatePoLine(record);
            } else {
                // 保存输入数据和校验状态 给submit用
                record.purchasePrice = value;
                // 计算采购金额（含税）
                record.totalAmount = Math.round(value * record.purchaseNumber * 100) / 100;
                // 校验状态
                record.isValidate = isValidate;
                this.props.updatePoLine(record);
            }
        }
    }

    /**
     * 可用库存
     */
    columnsChoose = () => {
        const { basicInfo } = this.props;
        if (basicInfo.adrType === 0 && (basicInfo.status === 0 || basicInfo.status === 3)) {
            return this.columnsOther
        }
        return this.columns
    }
    /**
     * 表单操作
     * @param {*} text 行值
     * @param {*} record 行数据
     * @param {*} index 行下标
     */
    renderActions = (text, record, index) => {
        const menu = (
            <Menu onClick={(item) => this.onActionMenuSelect(record, index, item)}>
                <Menu.Item key="delete">
                    <a target="_blank" rel="noopener noreferrer">删除</a>
                </Menu.Item>
            </Menu>
        )
        return (
            <Dropdown overlay={menu} placement="bottomCenter">
                <a className="ant-dropdown-link">
                    表单操作
                    <Icon type="down" />
                </a>
            </Dropdown>
        )
    }
    render() {
        return (
            <div className="poLines area-list">
                <Table
                    dataSource={this.props.poLines.filter((record) => (
                        !record.deleteFlg
                    )
                    )}
                    pagination={false}
                    columns={this.columns}
                    rowKey="productCode"
                    scroll={{
                        x: 1300
                    }}
                />
            </div>
        )
    }
}
GoodsLists.propTypes = {
    basicInfo: PropTypes.objectOf(PropTypes.any),
    poLines: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    purchaseOrderType: PropTypes.string,
    deletePoLine: PropTypes.func,
    updatePoLine: PropTypes.func,
}
export default GoodsLists;
