/*
 * @Author: tanjf
 * @Description: 心愿单goodsTable
 * @CreateDate: 2018-01-06 16:18:39
 * @Last Modified by: tanjf
 * @Last Modified time: 2018-01-06 17:10:44
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Form, Popconfirm, Table } from 'antd';
import PropTypes from 'prop-types';

import { wishAreaColumns as columns } from '../columns';

class GoodsTable extends PureComponent {

    render() {
        return (
            <Table
                rowKey="productCode"
                /* dataSource={this.props.value.goodsList} */
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
