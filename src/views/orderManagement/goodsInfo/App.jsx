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
        // 若被通知可拆单，则显示子订单
        if (props.canBeSplit) {
            columns.push({
                title: '子订单1',
                dataIndex: 'sub1',
                render: (text, record) => (
                    `${record.quantity}，￥${record.quantity * record.itemPrice.salePrice}`
                )
            }, { title: '子订单2', dataIndex: 'sub2' });
        }
    }

    state = {
        goodsList: []
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value.items && nextProps.value.items.length > 0) {
            const goodsList = [];
            nextProps.value.items.forEach(item => {
                goodsList.push({ [item.id]: item.quantity }, { [item.id]: 0 });
            });
            this.setState({ goodsList });
        }
    }

    onCellChange = (value) => {
        const goodsList = { ...this.state.goodsList };
    }

    renderTableCell = (text = 5, record) => (
        <div>
            <EditableCell
                value={text}
                min={0}
                step={1}
                max={record.quantity}
                onChange={this.onCellChange}
            />
            <span>￥{text * record.itemPrice.salePrice}</span>
        </div>
    );

    render() {
        const { value } = this.props;
        const { countOfItem, amount, items } = value;
        columns[columns.length - 1].render = this.renderTableCell;
        columns[columns.length - 1].width = 180;
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
                    dataSource={items}
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
    canBeSplit: PropTypes.bool
}

export default withRouter(Form.create()(GoodsInfo));
