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
        appending: false,
        error: false
    }

    onCellChange = (productCode, dataIndex) => value => {
        const goodsList = [...this.state.goodsList];
        const goodsChanged = goodsList.find(item => item.productCode === productCode);
        if (goodsChanged) {
            goodsChanged[dataIndex] = value;
            this.checkStore(this.checkMultiple(goodsChanged));
        }
    }

    onDelete = (productCode) => {
        const goodsList = [...this.state.goodsList];
        this.setState({ goodsList: goodsList.filter(item => item.productCode !== productCode) });
    }

    getRow = (goodsInfo) => {
        const {
            productId,
            productCode,
            internationalCodes,
            productName,
            unitExplanation,
            salePrice,
            packingSpecifications,
            minNumber,  // 起订数量
            minUnit,    // 最小销售单位
            fullCaseUnit,   // 整箱单位
            salesInsideNumber,  // 销售内装数
            sellFullCase    // 是否整箱销售，１:按整箱销售，0:不按整箱销售
        } = goodsInfo;
        const record = {
            productId,
            productCode,
            internationalCode: internationalCodes[0].internationalCode,
            productName,
            productSpecifications: `${packingSpecifications} / ${unitExplanation}`,
            salePrice,
            sellFullCase,
            salesInsideNumber,
            packingSpecifications: sellFullCase === 0 ? '-' : `${salesInsideNumber}${fullCaseUnit} / ${minUnit}`,
            count: minNumber,
            minNumber,
            minNumberSpecifications: sellFullCase === 0 ? `${minNumber}${fullCaseUnit}` : `${minNumber}${minUnit}`, // 起订数量显示单位
            enough: true,    // 是否库存充足，默认充足
            isMultiple: true    // 是否是销售内装数的整数倍，默认是整数倍
        };
        return record;
    }

    /**
     * 检查库存
     *
     * @param {*object} goods 商品信息
     */
    checkStore = (goods) => {
        this.setState({ appending: true });
        this.props.updateGoodsInfo({
            productId: goods.productId,
            quantity: goods.count,
            branchCompanyId: this.state.branchCompanyId,
            deliveryWarehouseCode: this.state.deliveryWarehouseCode
        }).then(res => {
            // 库存不足
            if (!res.data.enough) {
                Object.assign(goods, {
                    enough: false
                });
                this.shouldGoogsMoveToTop(goods);
            }
        }).finally(() => {
            this.setState({ appending: false });
        });
    }

    shouldGoogsMoveToTop = (goods) => {
        const goodsList = [...this.state.goodsList];
        const index = goodsList.findIndex(
            item => item.productCode === goods.productCode);
        goodsList.splice(index, 1);
        goodsList.unshift(goods);
        message.info('库存不足的商品已被移动到顶部');
        this.setState({ goodsList });
    }

    /**
     * 检查是否整箱销售，若是，则判断当前数量是否是内装数量的整数倍
     *
     * @returns {*object}
     */
    checkMultiple = (goods) => {
        const distGoods = { ...goods };
        const { count, minNumber, sellFullCase } = distGoods;
        // 整箱销售时，判断当前数量是否是内装数量的整数倍
        let isMultiple = true;
        if (sellFullCase === 0 && count % minNumber > 0) {
            isMultiple = false;
        }
        Object.assign(distGoods, { isMultiple });
        return distGoods;
    }

    handleStoresChange = (record) => {
        const { branchCompanyId, deliveryWarehouseCode } = record;
        this.setState({ branchCompanyId, deliveryWarehouseCode });
        this.handleClear();
    }

    handleGoodsFormChange = (goodsInfo) => {
        const goodsList = [...this.state.goodsList];
        this.setState({ appending: true });
        if (typeof goodsInfo === 'object' && goodsInfo.productCode) {
            // 判断此商品是否已存在
            const existIndex = goodsList.findIndex(
                e => e.productCode === goodsInfo.productCode
            );
            if (existIndex === -1) {
                // 不存在时添加这条商品
                const goods = this.getRow(goodsInfo);
                this.checkStore(goods);
                goodsList.unshift(goods);
                this.setState({ appending: false, goodsList });
            } else {
                // 已存在时删除这条商品并移动到第一条，需保留已填入的数量
                const count = goodsList[existIndex].count;
                const goods = goodsList[existIndex];
                goodsList.splice(existIndex, 1);
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

    renderNumber = (text, record) => {
        const { minNumber, enough, isMultiple } = record;
        // 填入的数量是否是内装数量的整数倍
        const step = minNumber;
        const errors = [];
        if (!enough) {
            errors.push('库存不足');
        }
        if (!isMultiple) {
            errors.push('不是整数倍');
        }
        return (
            <EditableCell
                value={text}
                min={minNumber}
                step={step}
                error={errors.join(', ')}
                onChange={this.onCellChange(record.productCode, 'count')}
            />);
    }

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
