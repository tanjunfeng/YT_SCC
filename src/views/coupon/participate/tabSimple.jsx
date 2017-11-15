/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 优惠券 - 参与数据，简单表格页的抽离
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Table, Form } from 'antd';

class TableSimple extends PureComponent {
    // 通知父组件页面发生跳转
    onPaginate = (pageNum) => {
        this.onChange(pageNum);
    }

    render() {
        const { dataSource, columns, pageNum, pageSize, total, current } = this.props;
        return (
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey="orderId"
                scroll={{
                    x: 1400
                }}
                bordered
                pagination={{
                    current,
                    pageNum,
                    pageSize,
                    total,
                    showQuickJumper: true,
                    onChange: this.onPaginate
                }}
            />
        );
    }
}

TableSimple.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.any),
    dataSource: PropTypes.arrayOf(PropTypes.any),
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    current: PropTypes.number
}

export default withRouter(Form.create()(TableSimple));
