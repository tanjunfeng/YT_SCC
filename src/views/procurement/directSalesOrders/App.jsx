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
        const goods = goodsList.find(item => item.productCode === productCode);
        if (goods) {
            goods[dataIndex] = value;
            this.shouldGoogsMoveToTop(goods);
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
            available,  // 是否在本区域销售
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
            available,
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
        this.checkStore(record).then(goods => {
            this.checkMultiple(goods);
            return goods;
        });
    }

    /**
     * 检查库存
     *
     * @param {*object} goods 商品信息
     */
    checkStore = (goods) => (
        new Promise((resolve, reject) => {
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
                }
                resolve(goods);
            }).catch(err => {
                reject(err);
            });
        })
    )

    checkGoodsStatus = (goods, errors) => {
        if (!goods.enough) {
            errors.push('库存不足');
            return false;
        }
        if (!goods.available) {
            errors.push('不在销售区域');
            return false;
        }
        if (!goods.isMultiple) {
            errors.push('非起订量整数倍');
            return false;
        }
        return true;
    }

    /**
     * 校验商品状态，并判断商品是否应该移动到第一行
     */
    shouldGoogsMoveToTop = (record) => {
        this.setState({ appending: true });
        this.checkMultiple(record)
        this.checkStore(record).then(goods => {
            const goodsList = [...this.state.goodsList];
            const index = goodsList.findIndex(
                item => item.productCode === goods.productCode);
            const isValid = this.checkGoodsStatus(goods);
            // 该商品不在列表中，则新增
            if (index === -1) {
                goodsList.unshift(goods);
            } else if (index > 0 && !isValid) {
                goodsList.splice(index, 1);
                goodsList.unshift(goods);
                message.info('该商品已被移动到顶部');
            }
            this.setState({ appending: false, goodsList });
        });
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
    }

    handleStoresChange = (record) => {
        const { branchCompanyId, deliveryWarehouseCode } = record;
        this.setState({ branchCompanyId, deliveryWarehouseCode });
        this.handleClear();
    }

    handleGoodsFormChange = (goodsInfo) => {
        const goodsList = [...this.state.goodsList];
        if (typeof goodsInfo === 'object' && goodsInfo.productCode) {
            // 判断此商品是否已存在
            const index = goodsList.findIndex(
                e => e.productCode === goodsInfo.productCode
            );
            if (index === -1) {
                // 不存在时添加这条商品
                this.shouldGoogsMoveToTop(this.getRow(goodsInfo));
            } else {
                // 已存在时删除这条商品并移动到第一条
                this.shouldGoogsMoveToTop(goodsList[index]);
            }
        }
    }

    handleClear = () => {
        this.setState({
            goodsList: []
        });
    }

    renderNumber = (text, record) => {
        const { minNumber } = record;
        // 填入的数量是否是内装数量的整数倍
        const step = minNumber;
        const errors = [];
        this.checkGoodsStatus(record, errors);
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
