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

import { directSalesgoodsColumns as columns } from '../columns';

class GoodsTable extends PureComponent {

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
    value: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(GoodsTable));
