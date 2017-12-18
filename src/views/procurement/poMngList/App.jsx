/**
 * @file App.jsx
 * @author zhangbaihua
 *
 * 采购管理 - 采购单管理列表
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import {
    Table,
    Form,
    Icon,
    Menu,
    Dropdown,
    Modal,
    message,
    Button
} from 'antd';
import {
    processImageBusi,
    clearprocessImageBusi,
    queryCommentHisBusi
} from '../../../actions/process';

import { fetchPoMngList, changePoMngSelectedRows, deletePoByIds } from '../../../actions';
import SearchForm from '../../../components/poSearchForm';
import { PAGE_SIZE } from '../../../constant';
import { poMngListColumns } from '../columns';
import FlowImage from '../../../components/flowImage';
import ApproModal from '../../../components/approModal'

const columns = poMngListColumns;

@connect(state => ({
    poInfo: state.toJS().procurement.poInfo,
    selectedPoMngRows: state.toJS().procurement.selectedPoMngRows,
    processDefinitions: state.toJS().procurement.processDefinitions,
    processImageBusiData: state.toJS().process.processImageBusiData,
    commentHisBusiList: state.toJS().process.commentHisByBusi,
}), dispatch => bindActionCreators({
    fetchPoMngList,
    changePoMngSelectedRows,
    deletePoByIds,
    processImageBusi,
    clearprocessImageBusi,
    queryCommentHisBusi,
}, dispatch))
class PoMngList extends PureComponent {
    constructor(props) {
        super(props);
        this.searchParams = {};
        this.selectedRowData = {};
        this.deleteListData = [];
        // 初始页号
        this.current = 1;
        this.state = {
            auditingVisible: false,
            deleteListData: [],
            purchaseListRows: [],
            failedReason: '',
            approvalProgress: false,
            isVisibleModal: false,
        }
    }

    componentDidMount() {
        this.queryPoList();
    }

    /**
     * 点击翻页
     * @param {pageNumber}    pageNumber
     */
    onPaginate = (pageNumber) => {
        this.current = pageNumber
        this.queryPoList({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            ...this.searchParams
        });
    }

    /**
     * 查询采购单管理列表
     * @param {*} params
     */
    queryPoList = (params) => {
        this.props.fetchPoMngList({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            ...params
        });
    }

    // 审核未通过弹窗
    showAuditingModal = (record) => {
        this.setState({
            auditingVisible: true,
            failedReason: record.failedReason
        });
    }

    // 隐藏弹出框
    handleAuditingCancel = () => {
        this.setState({
            auditingVisible: false
        });
    }

    // 查看审批进度
    showApprovalProgress = (record) => {
        this.setState({
            approvalProgress: true,
        }, () => (
            this.props.processImageBusi({id: record.id, processType: 'CG' })
        ));
    }

    // 查看审批意见
    showApprovalComments = (record) => {
        this.setState({
            isVisibleModal: true
        }, () => (
            this.props.queryCommentHisBusi({id: record.id, processType: 'CG' })
        ));
    }
    /**
     * 点击查询按钮回调
     * @param {object}  res
     */
    applySearch = (res) => {
        this.current = 1;
        this.searchParams = res;
        this.queryPoList(this.searchParams);
    }
    /**
     * 点击删除按钮回调
     * @param {*} res
     */
    applyDelete = () => {
        if (this.deleteListData.length === 0) {
            message.error('请选择需要删除的采购单');
            return;
        }
        // 删除选中项并刷新采购单列表
        Modal.confirm({
            title: '删除的采购单不能恢复，你确认要删除选中采购单？',
            onOk: () => {
                this.props.deletePoByIds({
                    pmPurchaseOrderIds: this.deleteListData.join()
                }).then(() => {
                    message.success('删除成功');
                    this.deleteListData = [];

                    // 刷新采购单列表
                    this.current = 1;
                    this.queryPoList();
                })
            },
            onCancel() { },
        });
    }

    // 单条制单数据删除
    singleRowsDelete = (record) => {
        this.deleteListData = [];
        this.deleteListData.push(record.id);
        this.applyDelete();
    }

    // 重置回调
    applyReset = () => {
        this.searchParams = {};
        this.current = 1;
    }

    handleModalOk = () => {
        this.setState({
            isVisibleModal: false,
        });
    }
    handleModalCancel = () => {
        this.setState({
            isVisibleModal: false,
        });
    }

    closeCanvas = () => {
        this.props.clearprocessImageBusi();
    }

    // table列表详情操作
    renderActions = (text, record) => {
        const { status, id } = record;
        const deleteCode = 0;
        const submitCode = 1;
        const AuditCode = 2;
        const refuseCode = 3;
        const { pathname } = this.props.location;
        const menu = (
            <Menu>
                <Menu.Item key="detail">
                    <Link target="_blank" to={`${pathname}/detail/${id}`}>详情</Link>
                </Menu.Item>
                {(status === deleteCode || status === refuseCode) &&
                    <Menu.Item key="modify">
                        <Link to={`${pathname}/edit/${id}`}>修改</Link>
                    </Menu.Item>
                }
                {status === deleteCode &&
                    <Menu.Item key="delete">
                        <span onClick={() => this.singleRowsDelete(record)}>删除</span>
                    </Menu.Item>
                }
                {/* {status === refuseCode && <Menu.Item key="rejected">
                    <span onClick={() => this.showAuditingModal(record)}>查看审核未通过</span>
                </Menu.Item>
                } */}
                {status === submitCode && <Menu.Item key="approvalProgress">
                    <span onClick={() => this.showApprovalProgress(record)}>查看审批进度</span>
                </Menu.Item>
                }
                {(status === submitCode || status === AuditCode || status === refuseCode) && <Menu.Item key="approvalComments">
                    <span onClick={() => this.showApprovalComments(record)}>查看审批意见</span>
                </Menu.Item>
                }
            </Menu>
        );

        return (
            <Dropdown overlay={menu} placement="bottomCenter">
                <span>
                    采购单详情
                    <Icon type="down" />
                </span>
            </Dropdown>
        )
    }

    render() {
        columns[columns.length - 1].render = this.renderActions;
        const { poInfo = {} } = this.props;
        const { data = [], total, pageNum } = poInfo;
        const { auditingVisible } = this.state;
        const rowSelection = {
            getCheckboxProps: record => ({
                disabled: record.status !== 0
            }),
            onSelect: (record, selected) => {
                if (selected) {
                    this.deleteListData.push(record.id);
                } else {
                    const currentIndex = this.deleteListData.indexOf(record.id);
                    this.deleteListData.splice(currentIndex, 1);
                }
            },
            onSelectAll: (selected, selectedRows) => {
                if (selected) {
                    selectedRows.forEach((select) => {
                        if (this.deleteListData.indexOf(select.id) === -1) {
                            this.deleteListData.push(select.id);
                        }
                    });
                } else {
                    this.deleteListData = [];
                }
            }
        }
        return (
            <div className="po-mng-list">
                <SearchForm
                    auth={{ delete: true, new: true, print: false }}
                    onSearch={this.applySearch}
                    onReset={this.applyReset}
                    onDelete={this.applyDelete}
                />
                <div>
                    <Table
                        rowSelection={rowSelection}
                        dataSource={data}
                        columns={columns}
                        rowKey="id"
                        scroll={{
                            x: 1300
                        }}
                        pagination={{
                            current: pageNum,
                            total,
                            pageNum: this.current,
                            pageSize: PAGE_SIZE,
                            showQuickJumper: true,
                            onChange: this.onPaginate
                        }}
                    />
                </div>
                <ApproModal
                    visible={this.state.isVisibleModal}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}
                    approvalList={this.props.commentHisBusiList}
                />
                <FlowImage data={this.props.processImageBusiData} closeCanvas={this.closeCanvas} >
                    <Button type="primary" shape="circle" icon="close" className="closeBtn" onClick={this.closeCanvas} />
                </FlowImage>
                {
                    <Modal
                        title="平台审核未通过原因"
                        visible={auditingVisible}
                        onCancel={this.handleAuditingCancel}
                        footer={[
                            <Button type="primary" onClick={this.handleAuditingCancel}>返回</Button>
                        ]}
                    >
                        {this.state.failedReason}
                    </Modal>
                }
            </div>
        )
    }
}

PoMngList.propTypes = {
    fetchPoMngList: PropTypes.func,
    poInfo: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    deletePoByIds: PropTypes.func,
    processImageBusi: PropTypes.func,
    clearprocessImageBusi: PropTypes.func,
    queryCommentHisBusi: PropTypes.func,
    processImageBusiData: PropTypes.string,
    commentHisBusiList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
}

export default withRouter(Form.create()(PoMngList));
