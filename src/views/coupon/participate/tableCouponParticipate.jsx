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

class TableCouponParticipate extends PureComponent {
    // 通知父组件页面发生跳转
    onPaginate = (pageNum) => {
        this.props.onChange(pageNum);
    }

    render() {
        const {
            data, columns, pageNum, pageSize,
            total, current, rowKey, rowSelection
        } = this.props.value;
        return (
            <Table
                dataSource={data}
                columns={columns}
                rowKey={rowKey}
                rowSelection={rowSelection}
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

TableCouponParticipate.propTypes = {
    value: PropTypes.objectOf(PropTypes.any),
    columns: PropTypes.arrayOf(PropTypes.any),
    data: PropTypes.arrayOf(PropTypes.any),
    onChange: PropTypes.func,
    rowSelection: PropTypes.objectOf(PropTypes.any),
    rowKey: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    current: PropTypes.number
}

export default withRouter(Form.create()(TableCouponParticipate));
