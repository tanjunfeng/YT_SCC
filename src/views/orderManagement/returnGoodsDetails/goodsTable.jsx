/*
 * @Author: tanjf
 * @Description: 采购管理 - 退货详情 - 列表修改
 * @CreateDate: 2017-12-01 16:03:22
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-12-08 16:57:14
 */

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Form, Table } from 'antd';
import PropTypes from 'prop-types';
import { returnGoodsTableColums as columns } from '../columns';
import EditableCell from './editableCell';

class GoodsTable extends PureComponent {
    onCellChange = productCode => quantity => {
        const { returnQuantityList } = this.props.value;
        const index = returnQuantityList.findIndex(item => item.productCode === productCode);
        const goods = returnQuantityList[index];
        if (index > -1) {
            Object.assign(goods, {
                quantity
            });
            this.noticeChanges(returnQuantityList);
        }
    }

    /**
     * 通知父组件刷新页面
     *
     * @param {*array} items
     */
    noticeChanges = (items) => {
        const total = {
            rows: 0, // 记录行数
            quantities: 0, // 订购数量
            amount: 0, // 金额总计
            refundAmount: 0 // 退款金额
        };
        // 整理列表，把不合法的数据前置以及计算新的 total
        const returnQuantityList = this.calcTotal(items, total);
        const returnQuantity = this.CollageData();
        this.props.onChange([...returnQuantityList], [...returnQuantity], total);
    }

    /**
     * 根据 goods 和已有 total 计算新的 total
     */
    CollageData = () => {
        const { returnQuantityList } = this.props.value;
        const arr = [];
        returnQuantityList.forEach((goods) => {
            arr.push({
                id: goods.id,
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
            const { quantity, salePrice, listPrice } = goods;
            // 处理total
            let amount = 0;
            let refundAmount = 0;
            if (typeof salePrice === 'number') {
                amount = quantity * salePrice;
            }
            if (typeof listPrice === 'number') {
                refundAmount = quantity * listPrice;
            }
            Object.assign(total, {
                rows: total.rows + 1,
                quantities: total.quantities + quantity,
                amount: total.amount + amount,
                refundAmount: total.refundAmount + refundAmount
            });
        });
        return items;
    }

    renderNumber = (text, record) => (
        <EditableCell
            value={text}
            min={0}
            max={record.quantity}
            step={1}
            onChange={this.onCellChange(record.productCode)}
        />
    );

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
                dataSource={this.props.value.data.items}
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
