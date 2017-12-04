/*
 * @Author: tanjf
 * @Description: 采购管理 - 换货详情 - 列表修改
 * @CreateDate: 2017-12-01 16:03:11
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-12-01 16:04:32
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Form, Table } from 'antd';
import PropTypes from 'prop-types';
import { exchangeGoodsDetailColumns as columns } from '../columns';
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
        const items = this.props.value.items;
        const index = items.findIndex(item => item.productCode === productCode);
        const goods = items[index];
        if (index > -1) {
            Object.assign(goods, {
                quantity
            });
            this.noticeChanges(items, index, goods);
        }
    }

    /**
     * 通知父组件刷新页面
     *
     * @param {*array} items
     * @param {*number} dataIndex 单元格修改时的索引值
     */
    noticeChanges = (items, dataIndex = -1) => {
        const total = {
            dataIndex, // 单个商品修改的索引
            rows: 0, // 记录行数
            quantities: 0, // 订购数量
            amount: 0 // 金额总计
        };
        // 整理列表，把不合法的数据前置以及计算新的 total
        const newGoodList = this.calcTotal(items, total);
        const returnQuantity = this.CollageData(items, dataIndex);
        this.props.onChange([...newGoodList], [...returnQuantity], total);
    }

    /**
     * 检查行状态
     */
    checkGoodsStatus = () => {
        const isValid = false;
        return isValid;
    }

    /**
     * 添加单个商品并校验状态，并判断商品是否应该移动到第一行
     */
    appendToList = goods => {
        const items = this.props.value.items;
        const index = items.findIndex(
            item => item.productCode === goods.productCode);
        // 该商品不在列表中，则新增
        if (index === -1) {
            items.unshift(goods);
        }
        this.noticeChanges(items);
    }

    /**
     * 校验销售内装数
     */
    validateSalesInsideNumber = (goods) => {
        const { quantity, actualReturnQuantity, sellFullCase } = goods;
        let isMultiple = true;
        // 不按整箱销售时，判断当前所填数量是否是实收数量的整数倍
        if (sellFullCase === 0 && quantity % actualReturnQuantity > 0) {
            isMultiple = false;
        }
        Object.assign(goods, { isMultiple });
    }

    /**
     * 根据 goods 和已有 total 计算新的 total
     */
    CollageData = (items) => {
        const arr = [];
        items.forEach((goods) => {
            arr.push({
                id: goods.internationalCodes[0].id,
                returnQuantity: goods.quantity
            })
        });
        return arr;
    }

    /**
     * 根据 goods 和已有 total 计算新的 total
     */
    calcTotal = (items, total) => {
        items.forEach(goods => {
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
        });
        return items;
    }

    renderNumber = (text, record) => {
        const { actualReturnQuantity, minNumber, sellFullCase, salesInsideNumber } = record;
        // https://solution.yatang.cn/jira/browse/GA-1024
        const step = sellFullCase === 0 ? salesInsideNumber : 1;
        // 填入的数量是否是内装数量的整数倍
        const errors = [];
        this.checkGoodsStatus(record, errors);
        return (
            <EditableCell
                value={text}
                min={minNumber}
                max={actualReturnQuantity}
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

    renderColumns = () => {
        columns[columns.length - 4].render = this.renderNumber;
        columns[columns.length - 2].render = this.renderSubTotal;
    }

    render() {
        this.renderColumns();
        return (
            <Table
                rowKey="productCode"
                dataSource={this.props.value.items}
                columns={columns}
                scroll={{
                    x: 1400
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
