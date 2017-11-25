/**
 * @file orderInfo.jsx
 * @author taoqiyu
 *
 * 商品列表
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Form, Icon, Table } from 'antd';
import { goodsReturnsColumns as columns } from '../columns';
import EditableCell from './editableCell';

class GoodsReturnsInfo extends PureComponent {
    onCellChange = record => value => {
        const requestItems = [...this.props.value.requestItems];
        const index = requestItems.findIndex(goods => goods.productId === record.productId);
        const obj = {
            productId: record.productId,
            returnQuantity: value
        }
        // 当且仅当不存在商品且数量大于 0 时，才添加此条退货单
        if (index === -1 && value > 0) {
            requestItems.push(obj);
        }
        // 找到这个商品并且退货数量大于 0 时，修改退货数量
        if (index > -1 && value > 0) {
            Object.assign(requestItems[index], obj);
        }
        // 找到这个商品，但退货数量为 0 时，删除此条货物
        if (index > -1 && value === 0) {
            requestItems.splice(index, 1);
        }
        this.props.onChange(requestItems);
    }

    /**
     * 渲染可编辑单元格
     */
    renderEditableCell = (val = 0, record) => (
        <EditableCell
            value={val}
            min={0}
            step={1}
            max={record.quantity}
            formatter={text => Math.floor(text)}
            parser={text => Math.floor(text)}
            onChange={this.onCellChange(record)}
        />);

    render() {
        const { countOfItem, rawSubtotal, items = [] } = this.props.value.orderDetailData;
        columns[columns.length - 3].render = this.renderEditableCell;
        return (
            <div className="detail-message returns-orders">
                <div className="detail-message-header">
                    <Icon type="picture" className="detail-message-header-icon" />
                    商品信息
                </div>
                <div>
                    <Table
                        dataSource={items}
                        columns={columns}
                        pagination={false}
                        rowKey="id"
                        scroll={{ x: 1440 }}
                        bordered
                    />
                </div>
                <div className="table-statistics" style={{ textAlign: 'right' }}>
                    <span className="table-statistics-item">
                        <span>共</span>
                        <span className="red">{countOfItem}</span>
                        <span>件商品</span>
                    </span>
                    <span className="table-statistics-item">
                        <span>总金额： ￥</span>
                        <span className="red">{Number(rawSubtotal).toFixed(2)}</span>
                    </span>
                </div>
            </div>
        );
    }
}

GoodsReturnsInfo.propTypes = {
    value: PropTypes.objectOf(PropTypes.any),
    onChange: PropTypes.func
}

export default withRouter(Form.create()(GoodsReturnsInfo));
