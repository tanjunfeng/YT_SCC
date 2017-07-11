/**
 * @file supplierInputList.jsx
 * @author shijh,tanjf
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

import {
    fetchSupplierList,
    modifyInformationVisible,
    modifySupplierFrozen,
    modifyCollaboration
} from '../../../actions';
import SearchForm from '../searchForm';
import { PAGE_SIZE } from '../../../constant';
import { spplierSelectType } from '../../../constant/searchParams';
import { supplierInputList } from '../../../constant/formColumns';
import Utils from '../../../util/util';
import { exportSupplierList } from '../../../service';
import ChangeMessage from './changeMessage';

const confirm = Modal.confirm;
const columns = supplierInputList;

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

        this.handleSelect = this.handleSelect.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.renderOperation = this.renderOperation.bind(this);
        this.handleFormSearch = this.handleFormSearch.bind(this);
        this.handleFormReset = this.handleFormReset.bind(this);
        this.handleDownLoad = this.handleDownLoad.bind(this);
        this.handleGetList = this.handleGetList.bind(this);

        this.searchForm = {};
        this.current = 1;
        this.state = {
            ModalText: '银行信息不全，请重新补全。',
            visible: false,
        }
    }

    componentDidMount() {
        this.props.fetchSupplierList({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            ...this.searchForm
        });
    }

    handleSelect(record, index, items) {
        const { key } = items;
        switch (key) {
            case 'checkReason':
                this.props.modifyInformationVisible({isVisible: true, record});
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
                {
                    <Menu.Item key="audit">
                        <a target="_blank" rel="noopener noreferrer">
                            查看供应商详情
                        </a>
                    </Menu.Item>
                }
                {
                    <Menu.Item key="modifySupInfor">
                        <a target="_blank" rel="noopener noreferrer">
                            修改供应商信息
                        </a>
                    </Menu.Item>
                }
                {
                    <Menu.Item key="addAddress">
                        <a target="_blank" rel="noopener noreferrer">
                            新增供应商地点信息
                        </a>
                    </Menu.Item>
                }
            </Menu>
        );

        const menu1 = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                <Menu.Item key="AddDetail">
                    <Link to={`${pathname}/${id}`}>供应商地点详情</Link>
                </Menu.Item>
                {
                    <Menu.Item key="auditAdd">
                        <a target="_blank" rel="noopener noreferrer">
                            查看供应商地点详情
                        </a>
                    </Menu.Item>
                }
                {
                    <Menu.Item key="modifySupAddInfor">
                        <a target="_blank" rel="noopener noreferrer">
                            修改供应商地点信息
                        </a>
                    </Menu.Item>
                }
                {
                    <Menu.Item key="checkReason">
                        <a target="_blank" rel="noopener noreferrer">
                            查看审核已拒绝原因
                        </a>
                    </Menu.Item>
                }
            </Menu>
        );

        return (
            <Dropdown
                overlay={status === 6 ? menu : menu1}
                placement="bottomCenter"
            >
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
                <Form>
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
                </Form>
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
