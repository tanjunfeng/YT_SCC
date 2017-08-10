/**
 * @file App.jsx
 * @author twh
 *
 * 采购单列表页面
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

import { fetchPoMngList, changePoMngSelectedRows, deletePoByIds } from '../../../actions';
import SearchForm from '../../../components/poSearchForm';
import { PAGE_SIZE } from '../../../constant';
import { poStatusCodes } from '../../../constant/procurement';
import { poMngListColumns } from '../columns';
import Utils from '../../../util/util';

const confirm = Modal.confirm;
const columns = poMngListColumns;

@connect(state => ({
    poList: state.toJS().procurement.poList,
    selectedPoMngRows: state.toJS().procurement.selectedPoMngRows
}), dispatch => bindActionCreators({
    fetchPoMngList,
    changePoMngSelectedRows,
    deletePoByIds
}, dispatch))


class PoMngList extends PureComponent {
    constructor(props) {
        super(props);
        this.searchParams = {};
        this.selectedRowData = {};
        // 初始页号
        this.current = 1;
        this.state = {
            auditingVisible: false,
            deleteListData: []
        }
    }

    componentDidMount() {
        this.queryPoList();
    }

  /**
   * 查询采购单管理列表
   * @param {*} params 
   */
    queryPoList = (params) => {
        this.props.fetchPoMngList({
            ...params
        });
    }

    // 审核未通过弹窗
    showAuditingModal = () => {
        this.setState({
            auditingVisible: true
        });
    }

    // 隐藏弹出框
    handleAuditingCancel = () => {
        this.setState({
            auditingVisible: false
        });
    }


    /**
     * 点击查询按钮回调
     * @param {object}  res
     */
    applySearch = (res) => {
        this.searchParams = res;
        this.queryPoList(this.searchParams);
    }
  /**
   * 点击删除按钮回调
   * @param {*} res
   */
    applyDelete = () => {
        // 校验选中项是否可删除
        // const { selectedRowKeys, selectedRows } = this.props.selectedPoMngRows;
        // 没有选择删除对象
        // if (!selectedRowKeys || (selectedRowKeys && selectedRowKeys.length === 0)) {
        //     message.error('请选择需要删除的采购单');
        //     return;
        // }
        
        // 删除选中项并刷新采购单列表
        Modal.confirm({
            title: '你确认要删除选中采购单？',
            onOk: () => {
                this.props.deletePoByIds({
                    // selectedRowKeys
                }).then(() => {
                    message.success('删除成功');
                    // 点击查询后清空选中列表
                    // this.props.changePoMngSelectedRows({
                    //     selectedRowKeys: [],
                    //     selectedRows: []
                    // });
                    // 刷新采购单列表
                    this.queryPoList();
                })
            },
            onCancel() { },
        });
    }

    // 重置回调
    applyReset = () => {
        this.searchParams = {};
    }

    /**
     * 点击翻页
     * @param {string}    pageNumber
     */
    onPaginate = (pageNumber) => {
        this.current = pageNumber
        this.queryPoList({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            ...this.searchParams
        });
    }

    // table列表详情操作
    renderActions = (text, record) => {
        this.selectedRowData = record;

        const { status, ipurchaseOrderNo, id } = record;
        const deleteCode = 0;
        // const submitCode = 1;
        const auditingCode = 2;
        const refuseCOde = 3;
        const { pathname } = this.props.location;
        const detailLink = `${pathname}/podetail/${ipurchaseOrderNo}`;
        const menu = (
            <Menu>
                <Menu.Item key="detail">
                    <Link to={detailLink}>详情</Link>
                    <Link to={`${pathname}/${purchaseOrderNo}`}>采购单详情</Link>
                </Menu.Item>

                {status === deleteCode && <Menu.Item key="delete">
                    <Link to={detailLink}>修改</Link>
                    <Link to=''>删除</Link>
                    </Menu.Item>
                }
                {status === refuseCOde && <Menu.Item key="rejected">
                    <span onClick={this.showAuditingModal}>查看审核未通过</span>
                </Menu.Item>
                }

                {status === auditingCode && <Menu.Item key="receive">
                    <Link to={`${pathname}/podetail/${id}`}>收货</Link>
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

        const { poList = {} } = this.props;
        const { data = [], total, pageNum } = poList;

        const { pathname } = this.props.location;
        const { auditingVisible } = this.state;
        const { failedReason = '', auditTime, auditUserId, ipurchaseOrderNo} = this.selectedRowData;

        // const { selectedPoMngRows } = this.props;   

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(selectedRows);
                // this.props.changePoMngSelectedRows({
                //     selectedRowKeys,
                //     selectedRows
                // });
            },
        };
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
                        dataSource={data01}
                        columns={columns}
                        rowKey="purchaseOrderNo"
                        scroll={{
                            x: 1300
                        }}
                        pagination={{
                            current: pageNum,
                            total,
                            PAGE_SIZE,
                            showQuickJumper: true,
                            onChange: this.onPaginate
                        }}
                    />
                </div>
                {
                    <Modal
                        title="平台审核未通过原因"
                        visible={auditingVisible}
                        onCancel={this.handleAuditingCancel}
                        footer={[
                            <Button type="primary"><Link to={`${pathname}/podetail/${ipurchaseOrderNo}`}>立即修改</Link></Button>
                        ]}
                    >
                        {
                            <ul>
                                <li>审核时间: {auditTime}</li>
                                <li>审核者: {auditUserId}</li>
                                <li>失败原因: {failedReason}</li>
                            </ul>
                        }
                    </Modal>
                }
            </div>
        )
    }
}

PoMngList.propTypes = {
    fetchPoMngList: PropTypes.func,
    poList: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    deletePoByIds: PropTypes.func
}

export default withRouter(Form.create()(PoMngList));
