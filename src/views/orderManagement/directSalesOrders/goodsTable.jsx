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

import Utils from '../../../util/util';
import { directSalesgoodsColumns as columns } from '../columns';
import EditableCell from './editableCell';

class GoodsTable extends PureComponent {
    componentWillReceiveProps(nextProps) {
        const { goodsAddOn, importList } = nextProps.value;
        // 当传入商品有变化时，添加到商品列表
        if (goodsAddOn !== null && this.props.value.goodsAddOn !== goodsAddOn) {
            this.appendToList(goodsAddOn);
        }
        // 当excel导入商品变化时，添加到商品列表
        if (importList.length > 0 && this.props.value.importList.length === 0) {
            const goodsList = Utils.merge(
                this.props.value.goodsList,
                importList,
                'productCode');
            this.noticeChanges(goodsList);
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
        const total = {
            dataIndex, // 单个商品修改的索引
            rows: 0, // 记录行数
            quantities: 0, // 订购数量
            amount: 0 // 金额总计
        };
        // 整理列表，把不合法的数据前置以及计算新的 total
        const newGoodList = this.sortOut(goodsList, total);
        this.props.onChange([...newGoodList], total);
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
            errors.push(`非内装数${goods.salesInsideNumber}的整数倍`);
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
     * 校验销售内装数
     */
    validateSalesInsideNumber = (goods) => {
        const { quantity, salesInsideNumber, sellFullCase } = goods;
        let isMultiple = true;
        // 不按整箱销售时，判断当前所填数量是否是内装数量的整数倍
        if (sellFullCase === 0 && quantity % salesInsideNumber > 0) {
            isMultiple = false;
        }
        Object.assign(goods, { isMultiple });
    }

    /**
     * 根据 goods 和已有 total 计算新的 total
     */
    calcTotal = (goods, total) => {
        const { quantity, salePrice } = goods;
        // 处理total
        let amount = 0;
        if (typeof salePrice === 'number') {
            amount = quantity * salePrice;
        }
        Object.assign(total, {
            rows: total.rows + 1,
            quantities: total.quantities + quantity,
            amount: total.amount + amount
        });
    }

    /**
     * 整理列表顺序，将不合法的数据前置，合法的后置
     *
     * @returns {*object} goodsList 商品列表
     */
    sortOut = (goodsList, total) => {
        const frontList = [];
        const backList = [];
        goodsList.forEach(goods => {
            this.validateSalesInsideNumber(goods);
            // 整理顺序，将不合法的前置，合法的后置
            if (!goods.isMultiple || !goods.enough) {
                frontList.push(goods);
            } else {
                backList.push(goods);
            }
            this.calcTotal(goods, total);
        });
        return frontList.concat(backList)
    }

    renderNumber = (text, record) => {
        const { minNumber, sellFullCase, salesInsideNumber } = record;
        // https://solution.yatang.cn/jira/browse/GA-1024
        const step = sellFullCase === 0 ? salesInsideNumber : 1;
        // 填入的数量是否是内装数量的整数倍
        const errors = [];
        this.checkGoodsStatus(record, errors);
        return (
            <EditableCell
                value={text}
                min={minNumber}
                step={step}
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
                loading={this.props.value.loading}
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
