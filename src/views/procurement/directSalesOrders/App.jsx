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
        const goodsChanged = goodsList.find(item => item.productCode === productCode);
        if (goodsChanged) {
            goodsChanged[dataIndex] = value;
            this.setState({ goodsList });
            this.props.updateGoodsInfo({
                productId: goodsChanged.productId,
                quantity: goodsChanged.count,
                ...this.state.goodsFormConditions
            });
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
            minNuber,
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
            packingSpecifications: sellFullCase === 0 ? '-' : `${salesInsideNumber} / ${minUnit} * ${fullCaseUnit}`,
            count: count || 1,
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
                const count = goodsList[existGoodsIndex].count;
                goodsList.splice(existGoodsIndex, 1);
                message.info(`已存在此商品，当前数量：${count}`);
                goodsList.unshift(this.getRow(goodsInfo, count));
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
            onChange={this.onCellChange(record.productCode, 'count')}
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

DirectSalesOrders.propTypes = {
    updateGoodsInfo: PropTypes.func
};

export default withRouter(Form.create()(DirectSalesOrders));
