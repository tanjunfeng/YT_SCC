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
        this.handleQueryList(this.queryParams);
    }

    /**
     * 查询商品地点关系列表
     */
    handleQueryList = queryParams => {
        this.queryParams = queryParams;
        this.props.getSitesManageList(this.queryParams);
    }

    /**
     * 刷新数据
     */
    handRefresh = () => {
        this.props.getSitesManageList(this.queryParams);
    }

    /**
     * 编辑商品地点关系
    */
    handleEdit = editId => {
        this.props.queryDetailById({id: editId}).then(res => {
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
        const ids = selectedRows.map(item => item.id);
        const _self = this;
        const removeSiteManages = this.props.removeSiteManagesByIds;
        confirm({
            title: '',
            content: '数据删除不可恢复，是否确定删除选中的商品地点关系?',
            onOk() {
                removeSiteManages({ids}).then(res => {
                    if (res.success) {
                        message.success('删除成功');
                        _self.handRefresh()
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
                    queryList={this.handleQueryList}
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
                            total,
                            pageSize: PAGE_SIZE,
                            showQuickJumper: true,
                            onChange: this.handlePaginationChange
                        }}
                    />
                    <EditModal
                        detail={proSiteDetail}
                        editId={String(editId)}
                        visible={visible}
                        refresh={this.handRefresh}
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
<<<<<<< HEAD
    removeSiteManagesByIds: PropTypes.func,
    goodsSitesManageList: PropTypes.objectOf(PropTypes.any),
    proSiteDetail: PropTypes.objectOf(PropTypes.any)
=======
    proSiteDetail: PropTypes.objectOf(PropTypes.any),
    goodsSitesManageList: PropTypes.objectOf(PropTypes.any)
>>>>>>> 91fdfb3d6744f4c193ed756a734e067bf07c182c
};

export default withRouter(Form.create()(SiteManage));
