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
    editSiteManageById,
    queryDetailById
} from '../../../actions/commodity';
import SearchForm from './searchForm';
import EditModal from './editModal';
import { sitesManageColumns } from './columns';
import { PAGE_SIZE } from '../../../constant';

const confirm = Modal.confirm
@connect(state => ({
    goodsSitesManageList: state.toJS().commodity.goodsSitesManageList,
    proSiteDetail: state.toJS().commodity.proSiteDetail
}), dispatch => bindActionCreators({
    getSitesManageList,
    removeSiteManagesByIds,
    editSiteManageById,
    queryDetailById
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
        this.queryParams.pageNum = pageIndex;
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
        const { queryDetailById } = this.props;
        queryDetailById({id: editId}).then(res => {
            console.log(res);
            if (res.success) {
                this.setState({
                    editId,
                    visible: true
                });
            }
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
     * 批量自定义删除
    */
    customDelete = () => {
        const { selectedRows } = this.state;
        const queryParams = this.queryParams
        const { removeSiteManagesByIds, getSitesManageList } = this.props;
        const ids = selectedRows.map(item => item.id);
        confirm({
            title: '',
            content: '数据删除不可恢复，确认删除选中的商品地点关系?',
            onOk() {
                removeSiteManagesByIds({ids}).then(res => {
                    if (res.success) {
                        message.success('删除成功');
                        getSitesManageList(queryParams);
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
        const { goodsSitesManageList, proSiteDetail } = this.props;
        const { data, total, pageNum } = goodsSitesManageList;
        const { selectedRows, editId, visible } = this.state;
        return (
            <div>
                <SearchForm
                    queryList={this.queryList}
                />
                <div className="sites-manage-tab">
                    <div className="table-operations">
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
                            total: total,
                            pageSize: PAGE_SIZE,
                            showQuickJumper: true,
                            onChange: this.handlePaginationChange
                        }}
                    />
                    <EditModal
                        detail={proSiteDetail}
                        editId={String(editId)}
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
    queryDetailById: PropTypes.func,
    removeSiteManagesByIds: PropTypes.func,
    goodsSitesManageList: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(SiteManage));
