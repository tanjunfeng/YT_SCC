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
        this.onActionMenuSelect = ::this.onActionMenuSelect;
        this.onPaginate = ::this.onPaginate;
        this.renderActions = ::this.renderActions;
        this.applySearch = ::this.applySearch;
        this.applyReset = ::this.applyReset;
        this.applyDelete =::this.applyDelete;
        this.queryPoList =::this.queryPoList;
        this.handleRejectedModalOk =::this.handleRejectedModalOk;
        // 初始采购单查询参数
        this.searchParams = {};
        // 初始页号
        this.current = 1;
    }

    componentDidMount() {
        console.log("componentDidMount");
        this.queryPoList();
    }

  /**
   * 查询采购单管理列表
   * @param {*} params 
   */
    queryPoList(params) {
        let tmp = params || {};
        let allParams = Object.assign({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
        }, allParams, this.searchParams, tmp);
        this.props.fetchPoMngList(allParams);
    }

    handleRejectedModalOk = (e) => {
        console.log(e);
        // this.setState({
        //   visible: false,
        // });
    }
    onActionMenuSelect(record, index, items) {
        const { id } = record;
        const { key } = items;
        // 采购单id  是否换成采购单号？？？？
        let ids = [record.id];
        switch (key) {
            case "delete":
                Modal.confirm({
                    title: '你确认要删除该采购单？',
                    onOk: () => {
                        this.props.deletePoByIds({
                            ids
                        }).then(() => {
                            message.success('删除成功');
                            this.queryPoList();
                        })
                    },
                    onCancel() { },
                });
                break;
            case "rejected":
                Modal.info({
                    title: '审核拒绝详情',
                    content: (
                        <div>
                            <div>审核时间:</div>
                            <div>审核者:</div>
                            <div>审核内容: <p>这里是审核拒绝原因内容</p></div>
                        </div>
                    ),
                    onOk() { },
                });
                break;
            default:
                break;
        }
    }

    /**
     * 点击查询按钮回调
     * @param {*} res 
     */
    applySearch(res) {
        this.searchParams = res;
        console.log("got params", res);
        this.queryPoList();
        // 点击查询后清空选中列表
        this.props.changePoMngSelectedRows({
            selectedRowKeys: [],
            selectedRows: []
        });
    }

    /**
     * 点击重置按钮回调
     * @param {*}  res
     */
    applyReset(res) {
        // 清空查询条件
        this.searchParams = {};
    }
  /**
   * 点击删除按钮回调
   * @param {*} res
   */
    applyDelete(res) {
        // 校验选中项是否可删除
        const { selectedRowKeys, selectedRows } = this.props.selectedPoMngRows;
        // 没有选择删除对象
        if (!selectedRowKeys || (selectedRowKeys && selectedRowKeys.length === 0)) {
            message.error('请选择需要删除的采购单');
            return;
        }
        // 删除选中项并刷新采购单列表
        Modal.confirm({
            title: '你确认要删除选中采购单？',
            onOk: () => {
            this.props.deletePoByIds({
                selectedRowKeys
            }).then(() => {
                message.success('删除成功');
                // 点击查询后清空选中列表
                this.props.changePoMngSelectedRows({
                    selectedRowKeys: [],
                    selectedRows: []
                });
                // 刷新采购单列表
                this.queryPoList();
            })
            },
            onCancel() { },
        });
    }

    /**
     * 点击翻页
     * @param {*} pageNumber
     * @param {*} pageSize
     */
    onPaginate(pageNumber, pageSize) {
        this.current = pageNumber
        this.queryPoList();
    }

    renderActions(text, record, index) {
        const { statusCd, purchaseOrderNo } = record;
        const { pathname } = this.props.location;
        const menu = (
            <Menu onClick={(item) => this.onActionMenuSelect(record, index, item)}>
                <Menu.Item key="detail">
                    <Link to={`${pathname}/${purchaseOrderNo}`}>采购单详情</Link>
                </Menu.Item>

                {statusCd === poStatusCodes.draft && <Menu.Item key="delete">
                    <a target="_blank" rel="noopener noreferrer">删除</a>
                </Menu.Item>
                }
                {statusCd === poStatusCodes.rejected && <Menu.Item key="rejected">
                    <a target="_blank" rel="noopener noreferrer">查看拒绝原因</a>
                </Menu.Item>
                }

                {statusCd === poStatusCodes.approved && <Menu.Item key="receive">
                    <a target="_blank" rel="noopener noreferrer">收货</a>
                </Menu.Item>
                }

            </Menu>
        );

        return (
            <Dropdown overlay={menu} placement="bottomCenter">
                <a className="ant-dropdown-link">
                表单操作
                <Icon type="down" />
                </a>
            </Dropdown>
        )
    }

    render() {
        const data01 = [{purchaseOrderNo: 1}, {purchaseOrderNo: 13, statusName: 0}, {purchaseOrderNo: 20}]
        columns[columns.length - 1].render = this.renderActions;
        const { data, total, pageNum, pageSize } = this.props.poList;
        const { selectedPoMngRows } = this.props;

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.props.changePoMngSelectedRows({
                    selectedRowKeys,
                    selectedRows
                });
            },

            // 选中行
            selectedRowKeys: selectedPoMngRows.selectedRowKeys,
            getCheckboxProps: (record) => ({
                disabled: record.statusCd !== poStatusCodes.draft,
            })
        };

        return (
            <div className="po-mng-list">
                <SearchForm
                    auth={{ delete: true, new: true, print: false, downPDF: true }}
                    onSearch={this.applySearch}
                    onReset={this.applyReset}
                    onDelete={this.applyDelete}
                />
                <div>
                    <Table
                        rowSelection={rowSelection}
                        dataSource={data01}
                        columns={columns}
                        rowKey="id"
                        scroll={{
                            x: 1300
                        }}
                        pagination={{
                            current: pageNum,
                            total,
                            pageSize,
                            showQuickJumper: true,
                            onChange: this.onPaginate
                        }}
                    />
                </div>
            </div>
        )
    }
}

PoMngList.propTypes = {
    fetchPoMngList: PropTypes.func,

}

export default withRouter(Form.create()(PoMngList));
