/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 采购管理 - 直营店下单
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Form, message, Popconfirm, Table } from 'antd';

import { goodsColumns as columns } from '../columns';
import StoresForm from './storesForm';
import GoodsForm from './goodsForm';
import EditableCell from './editableCell';

class DirectSalesOrders extends PureComponent {
    constructor(props) {
        super(props);
        columns[columns.length - 4].render = this.renderNumber;
        columns[columns.length - 1].render = this.renderOperations;
    }

    state = {
        goodsFormConditions: {
            branchCompanyId: '',
            deliveryWarehouseCode: ''
        },
        goodsList: [],
        appending: false
    }

    onCellChange = (productCode, dataIndex) => value => {
        const goodsList = [...this.state.goodsList];
        const target = goodsList.find(item => item.productCode === productCode);
        if (target) {
            target[dataIndex] = value;
            this.setState({ goodsList });
        }
    }

    onDelete = (productCode) => {
        const goodsList = [...this.state.goodsList];
        this.setState({ goodsList: goodsList.filter(item => item.productCode !== productCode) });
    }

    getRow = (goodsInfo, acount) => {
        const {
            productCode,
            internationalCodes,
            productName,
            unitExplanation,
            salePrice,
            amount,
            minNuber
            } = goodsInfo;
        return {
            productCode,
            internationalCode: internationalCodes[0].internationalCode,
            productName,
            unitExplanation,
            salePrice,
            amount,
            acount: acount || 1,
            minNuber
        };
    }

    handleStoresChange = (record) => {
        this.setState({
            goodsFormConditions: {
                branchCompanyId: record.branchCompanyId,
                deliveryWarehouseCode: record.deliveryWarehouseCode
            }
        });
        this.handleClear();
    }

    handleGoodsFormChange = (goodsInfo) => {
        const goodsList = this.state.goodsList;
        this.setState({ appending: true });
        if (typeof goodsInfo === 'object' && goodsInfo.productCode) {
            // 判断此商品是否已存在
            const existGoodsIndex = goodsList.findIndex(
                e => e.productCode === goodsInfo.productCode
            );
            if (existGoodsIndex === -1) {
                goodsList.unshift(this.getRow(goodsInfo));
                this.setState({ appending: false });
            } else {
                // 不存在时删除这条商品并移动到第一条，需保留已填入的数量
                const acount = goodsList[existGoodsIndex].acount;
                goodsList.splice(existGoodsIndex, 1);
                message.info('已存在此商品');
                goodsList.unshift(this.getRow(goodsInfo, acount));
                this.setState({ appending: false });
            }
        }
    }

    handleClear = () => {
        this.setState({
            goodsList: []
        });
    }

    renderNumber = (text, record) => (
        <EditableCell
            value={text}
            onChange={this.onCellChange(record.productCode, 'acount')}
        />)

    renderOperations = (text, record) => (
        <Popconfirm title="确定删除商品？" onConfirm={() => this.onDelete(record.productCode)}>
            <a href="#">删除</a>
        </Popconfirm>)

    render() {
        return (
            <div className="direct-sales-orders">
                <StoresForm
                    onChange={this.handleStoresChange}
                />
                <GoodsForm
                    value={this.state.goodsFormConditions}
                    onChange={this.handleGoodsFormChange}
                />
                <Table
                    dataSource={this.state.goodsList}
                    columns={columns}
                    rowKey="productCode"
                    scroll={{
                        x: 1400,
                        y: 500
                    }}
                    bordered
                />
            </div>
        );
    }
}

export default withRouter(Form.create()(DirectSalesOrders));
