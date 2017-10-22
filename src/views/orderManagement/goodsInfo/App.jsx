/**
 * @file orderInfo.jsx
 * @author taoqiyu
 *
 * 商品列表
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Form, Icon, Table, Button } from 'antd';
import { goodsColumns as columns } from '../columns';
import EditableCell from './editableCell';

class GoodsInfo extends PureComponent {
    constructor(props) {
        super(props);
        if (props.canBeSplit) {
            columns.push({ title: '子订单1', dataIndex: 'sub1' }, { title: '子订单2', dataIndex: 'sub2' });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.canBeSplit) {
            // 数据被初始化的时候，则初始化表格列并通知父组件刷新 state
            if (!this.props.goodsList && nextProps.goodsList && nextProps.goodsList.length > 0) {
                const goodsList = [...nextProps.goodsList];
                goodsList.forEach(goods => {
                    Object.assign(goods, {
                        sub1: goods.quantity,
                        sub2: 0
                    });
                });
                this.props.onChange(goodsList);
            } else {
                this.renderColumns();
            }
        }
    }

    onCellChange = record => value => {
        const goodsList = [...this.props.goodsList];
        const index = goodsList.findIndex(goods => goods.id === record.id);
        if (index > -1) {
            goodsList[index].sub2 = value;
            goodsList[index].sub1 = record.quantity - value;
            this.props.onChange(goodsList);
        }
    }

    renderColumns = () => {
        columns[columns.length - 2].render = this.renderSubCell;
        columns[columns.length - 1].render = this.renderTableCell;
    }

    renderSubCell = (text, record) => {
        let value = text;
        if (value === undefined) {
            value = record.quantity;
        }
        const value = text || record.quantity;
        const res = `${value}，￥${text * record.itemPrice.salePrice}`;
        return res;
    }

    renderTableCell = (text, record) => {
        const value = text || 0;
        const res = (<div>
            <EditableCell
                value={value}
                min={0}
                step={1}
                max={record.quantity}
                onChange={this.onCellChange(record)}
            />
            <span className="sub-total">￥{(value) * record.itemPrice.salePrice}</span>
        </div>);
        return res;
    }

    render() {
        const { value, goodsList } = this.props;
        const { countOfItem, amount } = value;
        const tableFooter = () =>
            (<div>
                <span className="table-footer-item">
                    <span>共</span>
                    <span className="red-number">{countOfItem}</span>
                    <span>件商品</span>
                </span>
                <span className="table-footer-item">
                    <span>总金额： ￥</span>
                    <span className="red-number">{amount}</span>
                </span>
            </div>);
        return (
            <div className="detail-message add-sub-orders">
                <div className="detail-message-header">
                    <Icon type="picture" className="detail-message-header-icon" />
                    商品信息
                    {this.props.canBeSplit ?
                        <Button type="primary" onClick={this.addSubOrders}>添加子订单</Button>
                        : null
                    }
                </div>
                <Table
                    dataSource={goodsList}
                    columns={columns}
                    pagination={false}
                    rowKey="id"
                    footer={tableFooter}
                    scroll={{ x: 1440 }}
                    bordered
                />
            </div>
        );
    }
}

GoodsInfo.propTypes = {
    value: PropTypes.objectOf(PropTypes.any),
    goodsList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    onChange: PropTypes.func,
    canBeSplit: PropTypes.bool
}

export default withRouter(Form.create()(GoodsInfo));
