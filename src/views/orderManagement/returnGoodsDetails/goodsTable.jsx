/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 采购管理 - 直营店下单 - 商品列表渲染
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Form, Table } from 'antd';
import PropTypes from 'prop-types';
import { exchangeTableColums as columns } from '../columns';
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
            amount: 0   // 金额总计
        };
        goodsList.forEach(goods => {
            let amount = 0;
            if (typeof goods.quantity === 'number') {
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
     * 添加单个商品并校验状态，并判断商品是否应该移动到第一行
     */
    appendToList = () => {
        this.noticeChanges();
    }

    renderNumber = (text, record) => {
        const { quantity } = record;
        return (
            <EditableCell
                value={text}
                min={0}
                max={quantity}
                step={1}
                onChange={this.onCellChange(record.productCode)}
            />);
    }

    renderColumns = () => {
        columns[columns.length - 4].render = this.renderNumber;
    }

    render() {
        this.renderColumns();
        return (
            <Table
                rowKey="productCode"
                dataSource={this.props.value.items}
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
