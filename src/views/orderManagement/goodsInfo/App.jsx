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
import { goodsColumns as columns } from '../columns';
import EditableCell from './editableCell';
import { fetchOrderDetailInfo, clearOrderDetailInfo } from '../../../actions/order';

@connect(
    () => ({}),
    dispatch => bindActionCreators({
        fetchOrderDetailInfo, clearOrderDetailInfo
    }, dispatch)
)

class GoodsInfo extends PureComponent {
    state = {
        goodsList: []
    }

    componentDidMount() {
        this.props.fetchOrderDetailInfo({
            id: this.props.match.params.id
        }).then(res => {
            const goodsList = [...res.data.items];
            goodsList.forEach(goods => {
                Object.assign(goods, {
                    sub1: goods.quantity,
                    sub2: 0,
                    quantityLeft: goods.quantity
                });
            });
            this.setState({ goodsList });
        });
    }

    componentWillReceiveProps(nextPros) {
        if (this.props.canBeSplit === undefined && nextPros.canBeSplit) {
            columns.push(
                { title: '子订单1', dataIndex: 'sub1' },
                { title: '子订单2', dataIndex: 'sub2' }
            );
            this.renderColumns();
        }
    }

    onCellChange = record => value => {
        const goodsList = [...this.state.goodsList];
        const index = goodsList.findIndex(goods => goods.id === record.id);
        let v = value;
        if (index > -1) {
            if (v > goodsList[index].quantityLeft) {
                v = goodsList[index].quantityLeft;
            } else if (v < 0) {
                v = 0;
            }
            goodsList[index][`sub${this.getLastSubNum(1)}`] = v;
            goodsList[index][`sub${this.getLastSubNum(2)}`] = goodsList[index].quantityLeft - v;
            this.setState({ goodsList });
            this.noticeParent();
            this.forceUpdate();
        }
    }

    /**
     * 获取最后 n 列的索引
     *
     * 不传值则取最后一列
     */
    getLastSubNum = (lastIndexOf = 1) => (
        +(columns[columns.length - lastIndexOf].dataIndex.substr(3))
    );

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
     * 回传子订单数据给父组件
     */
    noticeParent = () => {
        const arr = [];
        for (let i = 1; i <= this.getLastSubNum(); i++) {
            arr.push(this.getSubObject(i));
        }
        this.props.onChange(arr);
    }

    addSubOrders = () => {
        const goodsList = [...this.state.goodsList];
        const subNum = this.getLastSubNum() + 1;
        columns.push({ title: `子订单${subNum}`, dataIndex: `sub${subNum}` });
        goodsList.forEach(goods => {
            const quantityUsed = goods[`sub${subNum - 2}`];  // 倒数第二列的数量应该算作占用库存
            Object.assign(goods, {
                [`sub${subNum}`]: 0,
                quantityLeft: goods.quantityLeft - quantityUsed
            });
        });
        this.renderColumns();
        this.setState({ goodsList });
    }

    /**
     * 渲染可编辑单元格
     */
    renderEditableCell = (text, record) => {
        let value = text;
        if (value === undefined) {
            value = 0;
        }
        const res = (<div>
            <EditableCell
                value={value}
                min={0}
                step={1}
                max={record.quantityLeft}
                onChange={this.onCellChange(record)}
            />
            <span className="sub-total">￥{(value) * record.itemPrice.salePrice}</span>
        </div>);
        return res;
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
        const res = `${value}，￥${value * record.itemPrice.salePrice}`;
        return res;
    }

    renderColumns = () => {
        columns[columns.length - 2].render = this.renderReadOnlyCell;
        columns[columns.length - 1].render = this.renderEditableCell;
    }

    render() {
        const { value } = this.props;
        const { countOfItem, amount } = value;
        return (
            <div className="detail-message add-sub-orders">
                <div className="detail-message-header">
                    <Icon type="picture" className="detail-message-header-icon" />
                    商品信息
                </div>
                <div>
                    <Table
                        dataSource={this.state.goodsList}
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
                        <span className="red">{amount}</span>
                    </span>
                </div>
            </div>
        );
    }
}

GoodsInfo.propTypes = {
    value: PropTypes.objectOf(PropTypes.any),
    canBeSplit: PropTypes.bool,
    fetchOrderDetailInfo: PropTypes.func,
    onChange: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(GoodsInfo));
