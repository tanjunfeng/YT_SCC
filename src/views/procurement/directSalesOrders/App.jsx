/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 采购管理 - 直营店下单
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Form, message, Popconfirm, Table } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { goodsColumns as columns } from '../columns';
import StoresForm from './storesForm';
import GoodsForm from './goodsForm';
import EditableCell from './editableCell';
import {
    updateGoodsInfo
} from '../../../actions/procurement';

@connect(() => ({}), dispatch => bindActionCreators({
    updateGoodsInfo
}, dispatch))

class DirectSalesOrders extends PureComponent {
    state = {
        branchCompanyId: '',
        deliveryWarehouseCode: '',
        goodsList: [],
        appending: false
    }

    onCellChange = (productCode, dataIndex) => value => {
        const goodsList = [...this.state.goodsList];
        const goodsChanged = goodsList.find(item => item.productCode === productCode);
        if (goodsChanged) {
            goodsChanged[dataIndex] = value;
            this.checkStore(goodsChanged);
        }
    }

    onDelete = (productCode) => {
        const goodsList = [...this.state.goodsList];
        this.setState({ goodsList: goodsList.filter(item => item.productCode !== productCode) });
    }

    getRow = (goodsInfo, count) => {
        const {
            productId,
            productCode,
            internationalCodes,
            productName,
            unitExplanation,
            salePrice,
            packingSpecifications,
            minNumber,
            minUnit,    // 最小销售单位
            fullCaseUnit,   // 整箱单位
            salesInsideNumber,  // 销售内装数
            sellFullCase    // 是否整箱销售
        } = goodsInfo;
        return {
            productId,
            productCode,
            internationalCode: internationalCodes[0].internationalCode,
            productName,
            productSpecifications: `${packingSpecifications} / ${unitExplanation}`,
            salePrice,
            sellFullCase,
            salesInsideNumber,
            packingSpecifications: sellFullCase === 0 ? '-' : `${salesInsideNumber} / ${minUnit} * ${fullCaseUnit}`,
            count: count || salesInsideNumber,
            minNumber,
            enough: true    // 是否库存充足
        };
    }

    /**
     * 检查库存
     *
     * @param {*object} goods 商品信息
     */
    checkStore = (goods) => {
        const goodsList = [...this.state.goodsList];
        this.setState({ appending: true });
        this.props.updateGoodsInfo({
            productId: goods.productId,
            quantity: goods.count,
            branchCompanyId: this.state.branchCompanyId,
            deliveryWarehouseCode: this.state.deliveryWarehouseCode
        }).then(res => {
            // 库存不足
            if (!res.data.enough) {
                const index = goodsList.findIndex(
                    item => item.productCode === goods.productCode);
                goodsList.splice(index, 1);
                Object.assign(goods, {
                    enough: false
                });
                goodsList.unshift(goods);
            }
            this.setState({ appending: false, goodsList });
        });
    }

    handleStoresChange = (record) => {
        const { branchCompanyId, deliveryWarehouseCode } = record;
        this.setState({ branchCompanyId, deliveryWarehouseCode });
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
                // 不存在时添加这条商品
                const goods = this.getRow(goodsInfo);
                goodsList.unshift(goods);
                this.checkStore(goods);
                this.setState({ appending: false, goodsList });
            } else {
                // 已存在时删除这条商品并移动到第一条，需保留已填入的数量
                const count = goodsList[existGoodsIndex].count;
                const goods = this.getRow(goodsInfo, count);
                goodsList.splice(existGoodsIndex, 1);
                message.info(`已存在此商品，当前数量：${count}`);
                goodsList.unshift(goods);
                this.checkStore(goods);
                this.setState({ appending: false, goodsList });
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
            record={record}
            onChange={this.onCellChange(record.productCode, 'count')}
        />)

    renderOperations = (text, record) => (
        <Popconfirm title="确定删除商品？" onConfirm={() => this.onDelete(record.productCode)}>
            <a href="#">删除</a>
        </Popconfirm>)

    render() {
        columns[columns.length - 4].render = this.renderNumber;
        columns[columns.length - 1].render = this.renderOperations;
        const { branchCompanyId, deliveryWarehouseCode } = this.state;
        return (
            <div className="direct-sales-orders">
                <StoresForm
                    onChange={this.handleStoresChange}
                />
                <GoodsForm
                    value={{ branchCompanyId, deliveryWarehouseCode }}
                    onChange={this.handleGoodsFormChange}
                />
                <Table
                    rowKey="productCode"
                    dataSource={this.state.goodsList}
                    columns={columns}
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

DirectSalesOrders.propTypes = {
    updateGoodsInfo: PropTypes.func
};

export default withRouter(Form.create()(DirectSalesOrders));
