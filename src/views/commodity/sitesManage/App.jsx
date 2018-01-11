import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Form,
    Table,
    Button,
    Modal,
    message
} from 'antd';
import { pubFetchValueList } from '../../../actions/pub';
import { 
    getSitesManageList,
    removeSiteManagesByIds,
    removeSiteManages
} from '../../../actions/commodity';
import SearchForm from './searchForm';
import { sitesManageColumns } from './columns';
import { PAGE_SIZE } from '../../../constant';
const confirm = Modal.confirm

@connect(state => ({
    goodsSitesManageList: state.toJS().commodity.goodsSitesManageList,
}), dispatch => bindActionCreators({
    pubFetchValueList,
    getSitesManageList,
    removeSiteManagesByIds,
    removeSiteManages
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

    /**
     * 选择商品分类
    */
    handleCategorysChange = val => {
        console.log(val);
    }

    /**
     * 选择全部记录
    */
    deleteAll = () => {
        const { removeSiteManages } = this.props;
        confirm({
            title: '',
            content: '数据删除不可恢复，确认删除全部商品地点关系?',
            onOk() {
                removeSiteManages().then(res => {
                    console.log(res)
                    if (res.success) {
                        message.success('删除成功');
                    } else {
                        message.error('删除失败');
                    }
                });
            },
            onCancel() {}
        });
    }

    /**
     * 批量自定义删除
    */
    customDelete = () => {
        const { removeSiteManagesByIds } = this.props;
        const { selectedRows } = this.state;
        /**
         * ToDo: id替换为实际字段
         */
        const selectedIds = selectedRows.map(item => item.id);
        confirm({
            title: '',
            content: '数据删除不可恢复，确认删除选中的商品地点关系?',
            onOk() {
                removeSiteManagesByIds(selectedIds).then(res => {
                    if (res.success) {
                        message.success('删除成功');
                    } else {
                        message.error('删除失败');
                    }
                });
            },
            onCancel() {}
        });
    }

    /**
     * goodsSitesManageList: 列表,
     * getSitesManageList: 获取列表方法
     */
    render() {
        const { pubFetchValueList, goodsSitesManageList } = this.props;
        const { data, total, pageNum } = goodsSitesManageList;
        const { selectedRows } = this.state;
        return (
            <div>
                <SearchForm
                    pubFetchValueList={ pubFetchValueList }
                    queryList={ this.queryList }
                />
                <div className="sites-manage-tab">
                    <div className="table-operations">
                        <Button onClick={this.deleteAll}>全部删除</Button>
                        <Button  disabled={selectedRows.length === 0} onClick={this.customDelete}>批量删除</Button>
                    </div>
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
            </div>
        );
    }
}

export default withRouter(Form.create()(SiteManage));
