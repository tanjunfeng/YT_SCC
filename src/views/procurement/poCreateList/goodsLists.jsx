import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    Table, Icon, Dropdown, Menu
} from 'antd';
import EditableCell from './EditableCell';

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
                        onChange={value => this.props.applyPriceChange(record, index, value)}
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
                        onChange={value => this.props.applyQuantityChange(record, index, value)}
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
            <Menu onClick={(item) => this.props.onActionMenuSelect(record, index, item)}>
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
    applyPriceChange: PropTypes.func,
    applyQuantityChange: PropTypes.func,
    onActionMenuSelect: PropTypes.func
}
export default GoodsLists;
