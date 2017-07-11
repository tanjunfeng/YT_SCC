/**
 * @file list.jsx
 * @author shijh
 *
 * 管理列表页面
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Table, Form, Icon, Menu, Dropdown, Modal } from 'antd';

import { fetchSupplierList, modifyInformationVisible, modifySupplierFrozen, modifyCollaboration } from '../../../actions';
import SearchForm from '../searchForm';
import { PAGE_SIZE } from '../../../constant';
import { spplierSelectType } from '../../../constant/searchParams';
import { supplierManageColumns } from '../../../constant/formColumns';
import Utils from '../../../util/util';
import { exportSupplierList } from '../../../service';
import ChangeMessage from './changeMessage';

const confirm = Modal.confirm;


const columns = supplierManageColumns;

@connect(
    state => ({
        supplier: state.toJS().supplier.data,
        informationVisible: state.toJS().supplier.informationVisible,
    }),
    dispatch => bindActionCreators({
        fetchSupplierList,
        modifyInformationVisible,
        modifySupplierFrozen,
        modifyCollaboration
    }, dispatch)
)
class SupplierInputList extends PureComponent {
    constructor(props) {
        super(props);

        this.handleSelect = ::this.handleSelect;
        this.handlePaginationChange = ::this.handlePaginationChange;
        this.renderOperation = ::this.renderOperation;
        this.handleFormSearch = ::this.handleFormSearch;
        this.handleFormReset = ::this.handleFormReset;
        this.handleDownLoad = ::this.handleDownLoad;
        this.handleGetList = ::this.handleGetList;

        this.searchForm = {};
        this.current = 1;
    }

    componentDidMount() {
        this.props.fetchSupplierList({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            ...this.searchForm
        });
    }

    handleSelect(record, index, items) {
        const { id } = record;
        const { key } = items;
        switch (key) {
            case 'changeMessage':
                this.props.modifyInformationVisible({isVisible: true, record});
                break;
            case 'frozen':
                confirm({
                    title: '你确认要冻结该供应商？',
                    onOk: () => {
                        this.props.modifySupplierFrozen({
                            isFrozen: true,
                            index,
                            id,
                            status: 3
                        }).then(() => {
                            this.handleGetList();
                        })
                    },
                    onCancel() {},
                });
                break;
            case 'unFrozen':
                confirm({
                    title: '你确认要对供应商解除冻结？',
                    onOk: () => {
                        this.props.modifySupplierFrozen({
                            isFrozen: false,
                            index, id,
                            status: 2
                        }).then(() => {
                            this.handleGetList();
                        })
                    },
                    onCancel() {},
                });
                break;
            case 'closeCollaboration':
                confirm({
                    title: '你确认要对供应商终止合作？',
                    onOk: () => {
                        this.props.modifyCollaboration({
                            isCloseCollaboration: true,
                            index,
                            id,
                            status: 4
                        }).then(() => {
                            this.handleGetList();
                        })
                    },
                    onCancel() {},
                });
                break;
            case 'reOpenCollaboration':
                confirm({
                    title: '你确认要对供应商重启合作？',
                    onOk: () => {
                        this.props.modifyCollaboration({
                            isCloseCollaboration: false,
                            index,
                            id,
                            status: 2
                        }).then(() => {
                            this.handleGetList();
                        })
                    },
                    onCancel() {},
                });
                break;
            default:

                break;
        }
    }

    handleFormSearch(data) {
        this.searchForm = data;
        this.handlePaginationChange();
    }

    handleFormReset(data) {
        this.searchForm = {};
        this.handlePaginationChange();
    }

    handleDownLoad(data) {
        Utils.exportExcel(exportSupplierList, data);
    }

    handleGetList() {
        this.props.fetchSupplierList({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            ...this.searchForm
        });
    }

    handlePaginationChange(goto = 1) {
        this.current = goto;
        this.props.fetchSupplierList({
            pageSize: PAGE_SIZE,
            pageNum: goto,
            ...this.searchForm
        });
    }

    renderOperation(text, record, index) {
        const { status, id } = record;
        const { pathname } = this.props.location;

        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                <Menu.Item key="detail">
                    <Link to={`${pathname}/${id}`}>供应商详情</Link>
                </Menu.Item>
                <Menu.Item key="changeMessage">
                    <a target="_blank" rel="noopener noreferrer">修改合作信息</a>
                </Menu.Item>
                {
                    status !== 3 && status !== 4 &&
                    <Menu.Item key="frozen">
                        <a target="_blank" rel="noopener noreferrer">冻结</a>
                    </Menu.Item>
                }
                {
                    status === 3 &&
                    <Menu.Item key="unFrozen">
                        <a target="_blank" rel="noopener noreferrer">解除冻结</a>
                    </Menu.Item>
                }
                {
                    status !== 4 &&
                    <Menu.Item key="closeCollaboration">
                        <a target="_blank" rel="noopener noreferrer">终止合作</a>
                    </Menu.Item>
                }
                {
                    status === 4 &&
                    <Menu.Item key="reOpenCollaboration">
                        <a target="_blank" rel="noopener noreferrer">重启合作</a>
                    </Menu.Item>
                }
            </Menu>
        );

        return (
            <Dropdown overlay={menu} placement="bottomCenter">
                <a className="ant-dropdown-link">
                    表单操作 <Icon type="down" />
                </a>
            </Dropdown>
        )
    }

    render() {
        columns[columns.length - 1].render = this.renderOperation;
        const { data, total, pageNum, pageSize } = this.props.supplier;

        return (
            <div className="manage">
                <SearchForm
                    suplierSelect={spplierSelectType}
                    onSearch={this.handleFormSearch}
                    onReset={this.handleFormReset}
                    onExcel={this.handleDownLoad}
                />
                <div className="manage-list">
                    <Table
                        dataSource={data}
                        columns={columns}
                        rowKey="id"
                        scroll={{ x: 1300 }}
                        pagination={{
                            current: pageNum,
                            total,
                            pageSize,
                            showQuickJumper: true,
                            onChange: this.handlePaginationChange
                        }}
                    />
                </div>
                {
                    this.props.informationVisible &&
                    <ChangeMessage
                        getList={this.handleGetList}
                    />
                }
            </div>
        )
    }
}

SupplierInputList.propTypes = {
    fetchSupplierList: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    supplier: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    modifyInformationVisible: PropTypes.func,
    modifySupplierFrozen: PropTypes.func,
    modifyCollaboration: PropTypes.func,
    informationVisible: PropTypes.bool

}

export default withRouter(Form.create()(SupplierInputList));
