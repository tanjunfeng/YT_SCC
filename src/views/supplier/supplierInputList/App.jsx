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
import { Table, Form, Icon, Menu, Dropdown, message } from 'antd';

import {
    fetchProviderEnterList,
    fetchQueryManageList,
    fetchSupplierList,
    modifyInformationVisible,
    modifySupplierFrozen,
    modifyCollaboration
} from '../../../actions';
import {
    getSupplierManageList
} from '../../../actions/supplier';

import SearchForm from '../searchForm';
import { PAGE_SIZE } from '../../../constant';
import { supplierInputList } from '../../../constant/formColumns';
import Utils from '../../../util/util';
import { exportSupplierList } from '../../../service';
import ChangeMessage from './changeMessage';
import ChangeAudit from './changeAudit';
import CheckReason from './checkReason';


const columns = supplierInputList;

@connect(
    state => ({
        supplier: state.toJS().supplier.data,
        informationVisible: state.toJS().supplier.informationVisible,
        queryManageList: state.toJS().supplier.queryManageList,
    }),
    dispatch => bindActionCreators({
        getSupplierManageList,
        fetchProviderEnterList,
        fetchQueryManageList,
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

    /**
     * 加载刷新列表
     */
    componentDidMount() {
        this.props.fetchProviderEnterList({
            pageNum: this.current,
            pageSize: PAGE_SIZE,
            ...this.searchForm
        })
        this.props.fetchQueryManageList();
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

    /**
     * 搜索
     *
     * @param {Object} data 搜索的数据
     * @param {bool} bool true：调主数据；false：调SCM数据
     */
    handleFormSearch(data, bool) {
        this.searchForm = data;
        if (bool) {
            // 主数据
            // console.log('主数据')
            this.handlePaginationChange();
        } else {
            // SCM数据
            // console.log('SCM数据')
            this.handlePaginationChange();
        }
    }

    /**
     * 重置
     */
    handleFormReset() {
        this.searchForm = {};
    }

    /**
     * 创建
     *
     * @param {string} data 'addSupplier':供应商类型为供应商；否则为供应商地点，data为供应商编码
     */
    handleInputSupplier(data) {
        message.success(data)
        const { history } = this.props;
        history.push('/applicationList/add');
    }

    /**
     * 导出
     *
     * @param {string} data 'addSupplier':供应商类型为供应商；否则为供应商地点，data为供应商编码
     */
    handleDownLoad(data) {
        Utils.exportExcel(exportSupplierList, data);
    }

    /**
     * 数据列表查询
     */
    handleGetList() {
        this.props.fetchQueryManageList({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            ...this.searchForm
        });
    }

    /**
     * 列表分页
     *
     * @param {string} goto 数据列表分页
     */
    handlePaginationChange(goto = 1) {
        this.current = goto;
        this.props.fetchQueryManageList({
            pageSize: PAGE_SIZE,
            pageNum: goto,
            ...this.searchForm
        });
    }

    /**
     * 列表页操作下拉菜单
     *
     * @param {string} text 文本内容
     * @param {Object} record 模态框状态
     * @param {string} index 下标
     *
     * return 列表页操作下拉菜单
     */
    renderOperation(text, record, index) {
        const { status, id, providerType } = record;
        const { pathname } = this.props.location;

        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                <Menu.Item key="detail">
                    <Link to={`${pathname}/supplier/${id}`}>供应商详情</Link>
                </Menu.Item>
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
                    <Link to={`${pathname}/place/${id}`}>供应商地点详情</Link>
                </Menu.Item>
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
                overlay={providerType === 1 ? menu : menu1}
                placement="bottomCenter"
            >
                <a className="ant-dropdown-link">
                    表单操作 <Icon type="down" />
                </a>
            </Dropdown>
        )
    }

    render() {
        const { data, total, pageNum, pageSize } = this.props.supplier;
        const { queryManageList } = this.props;
        columns[columns.length - 1].render = this.renderOperation;
        return (
            <div className="manage">
                <SearchForm
                    isSuplierAddMenu
                    isSuplierInputList
                    onSearch={this.handleFormSearch}
                    onReset={this.handleFormReset}
                    onInput={this.handleInputSupplier}
                    onExcel={this.handleDownLoad}
                />
                <Form>
                    <div className="manage-list">
                        <Table
                            dataSource={queryManageList.data}
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
                        <ChangeMessage getList={this.handleGetList} />
                    }
                </Form>
                <ChangeAudit />
                <CheckReason />
            </div>
        )
    }
}

SupplierInputList.propTypes = {
    fetchProviderEnterList: PropTypes.objectOf(PropTypes.any),
    queryManageList: PropTypes.objectOf(PropTypes.any),
    fetchQueryManageList: PropTypes.objectOf(PropTypes.any),
    fetchSupplierList: PropTypes.func,
    history: PropTypes.objectOf(PropTypes.any),
    supplier: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    modifyInformationVisible: PropTypes.func,
    informationVisible: PropTypes.bool
}

export default withRouter(Form.create()(SupplierInputList));
