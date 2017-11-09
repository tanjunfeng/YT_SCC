/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 采购管理 - 直营店下单 - 商品列表渲染
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Form, Popconfirm, Table } from 'antd';
import PropTypes from 'prop-types';
import { directSalesgoodsColumns as columns } from '../columns';
import EditableCell from './editableCell';

class GoodsTable extends PureComponent {
    componentWillReceiveProps(nextProps) {
        const { goodsAddOn } = nextProps.value;
        // 当传入商品有变化时，添加到商品列表
        if (goodsAddOn !== null && this.props.value.goodsAddOn !== goodsAddOn) {
            this.appendToList(goodsAddOn);
        }
    }

    onCellChange = productCode => quantity => {
        const goodsList = this.props.value.goodsList;
        const index = goodsList.findIndex(item => item.productCode === productCode);
        const goods = goodsList[index];
        if (index > -1) {
            Object.assign(goods, {
                quantity
            });
            this.noticeChanges(goodsList, index);
        }
    }

    onDelete = productCode => {
        this.noticeChanges(this.props.value.goodsList.filter(
            item => item.productCode !== productCode));
    }

    /**
     * 通知父组件刷新页面
     *
     * @param {*array} goodsList
     * @param {*number} dataIndex 单元格修改时的索引值
     */
    noticeChanges = (goodsList, dataIndex = -1) => {
        this.checkMultiple(goodsList); // 检查当前数量是否合法
        const total = {
            dataIndex, // 单个商品修改的索引
            rows: 0, // 记录行数
            quantities: 0, // 订购数量
            amount: 0   // 金额总计
        };
        goodsList.forEach(goods => {
            let amount = 0;
            if (typeof goods.salePrice === 'number') {
                amount = goods.quantity * goods.salePrice;
            }
            Object.assign(total, {
                rows: total.rows + 1,
                quantities: total.quantities + goods.quantity,
                amount: total.amount + amount
            });
        });
        this.props.onChange([...goodsList], total);
    }


    /**
     * 检查行状态
     */
    checkGoodsStatus = (goods, errors) => {
        let isValid = true;
        if (!goods.enough) {
            errors.push('库存不足');
            isValid = false;
        }
        if (!goods.isMultiple) {
            errors.push('非起订量整数倍');
            isValid = false;
        }
        return isValid;
    }

    /**
     * 添加单个商品并校验状态，并判断商品是否应该移动到第一行
     */
    appendToList = goods => {
        const goodsList = this.props.value.goodsList;
        const index = goodsList.findIndex(
            item => item.productCode === goods.productCode);
        // 该商品不在列表中，则新增
        if (index === -1) {
            goodsList.unshift(goods);
        }
        this.noticeChanges(goodsList);
    }

    /**
     * 检查是否整箱销售，若是，则判断当前数量是否是内装数量的整数倍
     *
     * @returns {*object} goodsList 商品列表
     */
    checkMultiple = goodsList => {
        goodsList.forEach(goods => {
            const { quantity, salesInsideNumber, sellFullCase } = goods;
            let isMultiple = true;
            // 不按整箱销售时，判断当前所填数量是否是内装数量的整数倍
            if (sellFullCase === 0 && quantity % salesInsideNumber > 0) {
                isMultiple = false;
            }
            Object.assign(goods, { isMultiple });
        });
    }

    renderNumber = (text, record) => {
        const { minNumber, salesInsideNumber } = record;
        // 填入的数量是否是内装数量的整数倍
        const errors = [];
        this.checkGoodsStatus(record, errors);
        return (
            <EditableCell
                value={text}
                min={minNumber}
                step={salesInsideNumber}
                error={errors.join(', ')}
                onChange={this.onCellChange(record.productCode)}
            />);
    }

    /**
     * 计算金额小计
     */
    renderSubTotal = (text, record) => {
        if (record.salePrice === null) {
            return '-';
        }
        return (record.salePrice * record.quantity).toFixed(2);
    }

    renderOperations = (text, record) => (
        <Popconfirm title="确定删除商品？" onConfirm={() => this.onDelete(record.productCode)}>
            <a href="#">删除</a>
        </Popconfirm>)

    renderColumns = () => {
        columns[columns.length - 4].render = this.renderNumber;
        columns[columns.length - 2].render = this.renderSubTotal;
        columns[columns.length - 1].render = this.renderOperations;
    }

    render() {
        this.renderColumns();
        return (
            <Table
                rowKey="productCode"
                dataSource={this.props.value.goodsList}
                columns={columns}
                scroll={{
                    x: 1400,
                    y: 500
                }}
                bordered
            />
        );
    }
}

GoodsTable.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(GoodsTable));
