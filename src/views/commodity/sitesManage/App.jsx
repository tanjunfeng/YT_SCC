import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Form,
    Table
    // message
} from 'antd';
import { pubFetchValueList } from '../../../actions/pub';
import { getSitesManageList } from '../../../actions/commodity';
import SearchForm from './searchForm';
import { sitesManageColumns } from './columns';
import { PAGE_SIZE } from '../../../constant';

@connect(state => ({
    goodsSitesManageList: state.toJS().commodity.goodsSitesManageList,
}), dispatch => bindActionCreators({
    pubFetchValueList,
    getSitesManageList
}, dispatch))
class SiteManage extends PureComponent {
    state = {
        selectedRows: []
    }

    componentDidMount() {
        // rowSelection object indicates the need for row selection
        /**
         * 选择删除行
         */
        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRows
                });
            }
        };

        const operation = {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <a onClick={ () => {this.handleEdit (record.id)} }>编辑</a>
            ),
        };
        sitesManageColumns.push(operation);
    }
    
     /**
     * 分页查询商品地点关系列表
     */
    handlePaginationChange = pageIndex => {
        this.queryParams.pageIndex = pageIndex;
        this.queryList(this.queryParams);
    }

    /**
     * 查询商品地点关系列表
     */
    queryList = queryParams => {
        const { getSitesManageList } = this.props;
        this.queryParams = queryParams;
        getSitesManageList(this.queryParams);

    }
    /**
     * 编辑商品地点关系
    */
    handleEdit = id => {
        alert(id);
    }

    handleCategorysChange = val => {
        console.log(val);
    }
    /**
     * goodsSitesManageList: 列表,
     * getSitesManageList: 获取列表方法
     */
    render() {
        const { pubFetchValueList, goodsSitesManageList } = this.props;
        const { data, total, pageNum } = goodsSitesManageList;
        const { selectedRows } = this.state;
        /**
         * ToDo: id替换为实际字段
         */
        const selectedIds = selectedRows.map(item => item.id);
        return (
            <div>
                <SearchForm
                    pubFetchValueList={ pubFetchValueList }
                    queryList={ this.queryList }
                    selectedIds={selectedIds}
                />
                <Table
                    rowKey={record => record.id}
                    rowSelection={this.rowSelection}
                    dataSource={data}
                    columns={sitesManageColumns}
                    pagination={{
                        current: pageNum,
                        total,
                        pageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.handlePaginationChange
                    }}
                />
            </div>
        );
    }
}

export default withRouter(Form.create()(SiteManage));
