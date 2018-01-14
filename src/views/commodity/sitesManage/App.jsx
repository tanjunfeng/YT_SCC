import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Form,
    Table,
    Button,
    Modal,
    message
} from 'antd';
import {
    getSitesManageList,
    removeSiteManagesByIds,
    removeSiteManages,
    editSiteManageById
} from '../../../actions/commodity';
import SearchForm from './searchForm';
import EditModal from './editModal';
import { sitesManageColumns } from './columns';
import { PAGE_SIZE } from '../../../constant';

const confirm = Modal.confirm

@connect(state => ({
    goodsSitesManageList: state.toJS().commodity.goodsSitesManageList,
}), dispatch => bindActionCreators({
    getSitesManageList,
    removeSiteManagesByIds,
    removeSiteManages,
    editSiteManageById
}, dispatch))
class SiteManage extends PureComponent {
    state = {
        selectedRows: [],
        editId: '',
        visible: false
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
                <a onClick={() => { this.handleEdit(record.id) }}>编辑</a>
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
        this.queryParams = queryParams;
        this.props.getSitesManageList(this.queryParams);
    }

    /**
     * 编辑商品地点关系
    */
    handleEdit = editId => {
        this.setState({
            editId,
            visible: true
        });
    }

    /**
     * 关闭编辑弹窗
    */
    closeModal = () => {
        this.setState({
            visible: false
        });
    }

    /**
     * 选择全部记录
    */
    deleteAll = () => {
        confirm({
            title: '',
            content: '数据删除不可恢复，确认删除全部商品地点关系?',
            onOk() {
                this.props.removeSiteManages().then(res => {
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
        const { selectedRows } = this.state;
        /**
         * ToDo: id替换为实际字段
         */
        const selectedIds = selectedRows.map(item => item.id);
        confirm({
            title: '',
            content: '数据删除不可恢复，确认删除选中的商品地点关系?',
            onOk() {
                this.props.removeSiteManagesByIds(selectedIds).then(res => {
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
        const { goodsSitesManageList } = this.props;
        const { data, total, pageNum } = goodsSitesManageList;
        const { selectedRows, editId, visible } = this.state;
        return (
            <div>
                <SearchForm
                    queryList={this.queryList}
                />
                <div className="sites-manage-tab">
                    <div className="table-operations">
                        <Button onClick={this.deleteAll}>全部删除</Button>
                        <Button
                            disabled={selectedRows.length === 0}
                            onClick={this.customDelete}
                        >批量删除</Button>
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
                    <EditModal
                        editId={editId}
                        visible={visible}
                        closeModal={this.closeModal}
                        editSiteRelation={this.props.editSiteManageById}
                    />
                </div>
            </div>
        );
    }
}

SiteManage.propTypes = {
    getSitesManageList: PropTypes.func,
    editSiteManageById: PropTypes.func,
    removeSiteManagesByIds: PropTypes.func,
    removeSiteManages: PropTypes.func,
    goodsSitesManageList: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(SiteManage));
