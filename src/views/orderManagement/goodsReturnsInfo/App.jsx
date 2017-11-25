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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { goodsReturnsColumns as columns } from '../columns';
import EditableCell from './editableCell';
import { fetchOrderDetailInfo, clearOrderDetailInfo } from '../../../actions/order';

@connect(
    state => ({
        orderDetailData: state.toJS().order.orderDetailData
    }),
    dispatch => bindActionCreators({
        fetchOrderDetailInfo, clearOrderDetailInfo
    }, dispatch)
)

class GoodsReturnsInfo extends PureComponent {
    onCellChange = record => value => {
        const goodsList = [...this.state.goodsList];
        const index = goodsList.findIndex(goods => goods.id === record.id);
        let v = value;
        if (index > -1) {
            if (v > goodsList[index].quantityLeft) {
                v = goodsList[index].quantityLeft;
            }
            goodsList[index][`sub${this.getLastSubNum(1)}`] = v;
            goodsList[index][`sub${this.getLastSubNum(2)}`] = goodsList[index].quantityLeft - v;
            this.setState({ goodsList }, () => {
                this.noticeParent();
            });
        }
    }

    /**
     * 获取单个子订单对象
     */
    getSubObject = (subIndex) => {
        const goodsList = this.state.goodsList;
        const dist = {};
        goodsList.forEach(goods => {
            Object.assign(dist, { [goods.id]: goods[`sub${subIndex}`] });
        });
        return dist;
    }

    /**
     * 回传退货数据给父组件
     */
    noticeParent = () => {
        const arr = [];
        for (let i = 1; i <= this.getLastSubNum(); i++) {
            arr.push(this.getSubObject(i));
        }
        this.props.onChange(arr);
    }

    /**
     * 渲染显示单元格，根据数量计算价格
     */
    renderReadOnlyCell = (text, record) => {
        let value = text;
        if (value === undefined) {
            // 避免出现 NaN 值
            value = record.quantityLeft;
        }
        const res = `${value}，￥${(value * record.itemPrice.salePrice).toFixed(2)}`;
        return res;
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
        const { value } = this.props;
        const { countOfItem, rawSubtotal } = value;
        columns[columns.length - 3].render = this.renderEditableCell;
        return (
            <div className="detail-message returns-orders">
                <div className="detail-message-header">
                    <Icon type="picture" className="detail-message-header-icon" />
                    商品信息
                </div>
                <div>
                    <Table
                        dataSource={this.props.orderDetailData.data.items}
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
    orderDetailData: PropTypes.objectOf(PropTypes.any),
    fetchOrderDetailInfo: PropTypes.func,
    onChange: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(GoodsReturnsInfo));
