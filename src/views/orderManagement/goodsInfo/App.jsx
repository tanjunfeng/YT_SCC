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

class GoodsInfo extends PureComponent {
    render() {
        const { value } = this.props;
        const tableFooter = () =>
            (<div>
                <span className="table-footer-item">
                    <span>共</span>
                    <span className="red-number">{value.countOfItem}</span>
                    <span>件商品</span>
                </span>
                <span className="table-footer-item">
                    <span>总金额： ￥</span>
                    <span className="red-number">{value.amount}</span>
                </span>
            </div>)
        return (
            <div className="detail-message">
                <div className="detail-message-header">
                    <Icon type="picture" className="detail-message-header-icon" />
                    商品信息
                    <Button type="primary" style={{ float: 'right' }} onClick={this.addSubOrders}>添加子订单</Button>
                </div>
                <Table
                    dataSource={value.items}
                    columns={columns}
                    pagination={false}
                    rowKey="id"
                    footer={tableFooter}
                />
            </div>
        );
    }
}

GoodsInfo.propTypes = {
    value: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(GoodsInfo));
