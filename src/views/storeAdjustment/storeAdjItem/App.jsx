
/**
 * 库存列表查询结果
 *
 * @author zhangbaihua
 * @class StoreAdjItem
 * @extends {Compoment}
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Pagination } from 'antd';
import { Link } from 'react-router-dom';
// import { stcokColumns } from '../../../constant/formColumns';

// 库存调整查询标题
const stcokColumns = [{
    title: '单据编号',
    dataIndex: 'supplierNumber',
}, {
    title: '调整地点',
    dataIndex: 'stockAddress',
}, {
    title: '调整数量合计',
    dataIndex: 'stockNumber',
}, {
    title: '调整成本合计',
    dataIndex: 'costTotal',
}, {
    title: '外部单据号',
    dataIndex: 'outSupplierNum',
}, {
    title: '创建人',
    dataIndex: 'creator',
}, {
    title: '状态',
    dataIndex: 'stockStatus',
}, {
    title: '操作',
    dataIndex: 'operation',
    render: (text, record, index) => (<Link to={`storeAdjList/${index}`}>{text}</Link>)
}];

class StoreAdjItem extends Component {
    static propTypes = {
        searchDateList: PropTypes.objectOf(PropTypes.any),
        onChangePagination: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };
    }

    handlePaginationChange = (pageNum) => {
        this.props.onChangePagination(pageNum);
    };
    render() {
        const { data, pageSize, total, pageNum } = this.props.searchDateList;
        return (
            <div className="storeAdjItem-wrap">
                <Table
                    columns={stcokColumns}
                    dataSource={data}
                    // rowKey="id"
                    pagination={{
                        current: pageNum,
                        total,
                        pageSize,
                        showQuickJumper: true
                    }}
                />
            </div>
        );
    }
}

export default StoreAdjItem;
