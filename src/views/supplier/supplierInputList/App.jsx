/**
 * @file supplierInputList.jsx
 * @author tanjf
 *
 * 管理列表页面
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Table, Form, Icon, Menu, Dropdown } from 'antd';
import {
    fetchQueryManageList,
    fetchSupplierList,
    modifyAuditVisible,
    modifyAuditAdrVisible,
    modifyCheckReasonVisible,
    modifyInformationVisible,
    fetchGetProductById,
    fetchEditBeforeAfter,
} from '../../../actions';
import {
    modifyAuthVisible,
    modifyAdrVisible
} from '../../../actions/supplier';

import SearchForm from '../searchFormInput';
import { PAGE_SIZE } from '../../../constant';
import { supplierInputList } from '../../../constant/formColumns';
import Utils from '../../../util/util';
import { exportManageList } from '../../../service';
import ChangeMessage from './changeMessage';
import ChangeAudit from './changeAudit';
import ChangeAuditAdr from './changeAuditAdr';
import CheckReasonAdr from './checkReasonAdr';
import CheckReason from './checkReason';

const columns = supplierInputList;

@connect(
    state => ({
        supplier: state.toJS().supplier.data,
        informationVisible: state.toJS().supplier.informationVisible,
        queryManageList: state.toJS().supplier.queryManageList,
        checkReasonVisible: state.toJS().supplier.checkReasonVisible,
        checkReasonVisibled: state.toJS().supplier.checkReasonVisibled,
        editBeforeAfters: state.toJS().supplier.editBeforeAfter,
    }),
    dispatch => bindActionCreators({
        fetchQueryManageList,
        fetchSupplierList,
        modifyCheckReasonVisible,
        modifyAuditVisible,
        modifyAuditAdrVisible,
        modifyInformationVisible,
        fetchGetProductById,
        fetchEditBeforeAfter,
        modifyAuthVisible,
        modifyAdrVisible
    }, dispatch)
)
class SupplierInputList extends PureComponent {
    constructor(props) {
        super(props);

        this.handleSelect = this.handleSelect.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.renderOperationInput = this.renderOperationInput.bind(this);
        this.handleFormSearch = this.handleFormSearch.bind(this);
        this.handleFormReset = this.handleFormReset.bind(this);
        this.handleDownLoad = this.handleDownLoad.bind(this);
        this.handleGetList = this.handleGetList.bind(this);
        this.handleInputSupplier = this.handleInputSupplier.bind(this);

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
        // TODO 默认加条件
        this.props.fetchQueryManageList({
            pageNum: this.current,
            pageSize: PAGE_SIZE,
        });
    }

    /**
     * 供应商表单操作
     *
     * @param {Object} record 传值所有数据对象
     * @param {number} index 下标
     * @param {Object} items 方法属性
     */
    handleSelect(record, index, items) {
        const { key } = items;
        switch (key) {
            case 'ChangeAudit':
                this.props.modifyAuditVisible({ isVisible: true, record });
                break;
            case 'CheckReason':
                this.props.modifyAuthVisible({ isVisible: true, record });
                break;
            case 'ChangeMessage':
                this.props.modifyInformationVisible({ isVisible: true, record });
                break;
            default:
                break;
        }
    }

    /**
     * 地点表单操作
     *
     * @param {Object} record 传值所有数据对象
     * @param {number} index 下标
     * @param {Object} items 方法属性
     */
    handleSelects(record, index, items) {
        const { key } = items;
        switch (key) {
            case 'ChangeAuditAdr':
                this.props.modifyAuditAdrVisible({ isVisible: true, record });
                break;
            case 'CheckReasonAdr':
                this.props.modifyAdrVisible({ isVisible: true, record });
                break;
            case 'ChangeMessage':
                this.props.modifyInformationVisible({ isVisible: true, record });
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
            this.props.fetchQueryManageList({
                pageNum: 1,
                pageSize: PAGE_SIZE,
                ...this.searchForm
            });
        } else {
            // SCM数据
            this.props.fetchQueryManageList({
                pageNum: 1,
                pageSize: PAGE_SIZE,
                ...this.searchForm
            });
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
    handleInputSupplier() {
        const { pathname } = this.props.location;
        this.props.history.push(`${pathname}/add`);
    }

    /**
     * 导出
     *
     * @param {string} data 'addSupplier':供应商类型为供应商；否则为供应商地点，data为供应商编码
     */
    handleDownLoad(data) {
        Utils.exportExcel(exportManageList, data);
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
    handlePaginationChange(goto) {
        this.current = goto;
        this.props.fetchQueryManageList({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
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
    renderOperationInput(text, record, index) {
        const { status, id, providerType, auditType, spStatus } = record;
        const { pathname } = this.props.location;
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                <Menu.Item key="detail">
                    <Link to={`${pathname}/supplier/${id}`}>供应商详情</Link>
                </Menu.Item>
                {
                    // 1： 已提交状态
                    (status === 1 || spStatus === 1) && auditType === 1 &&
                    <Menu.Item key="ChangeAudit">
                        <a target="_blank" rel="noopener noreferrer">
                            供应商审核
                        </a>
                    </Menu.Item>
                }
                {
                    // 1： 已提交状态
                    (status === 1 || spStatus === 1) && auditType === 2 &&
                    <Menu.Item key="CheckReason">
                        <a target="_blank" rel="noopener noreferrer">
                            修改供应商审核
                        </a>
                    </Menu.Item>
                }
                {
                    // 3:已拒绝
                    (status === 3 || spStatus === 3) &&
                    <Menu.Item key="ChangeMessage">
                        <a target="_blank" rel="noopener noreferrer">
                            查看审核已拒绝原因
                        </a>
                    </Menu.Item>
                }
            </Menu>
        );

        const menu1 = (
            <Menu onClick={(item) => this.handleSelects(record, index, item)}>
                <Menu.Item key="AddDetail">
                    <Link to={`${pathname}/place/${id}`}>供应商地点详情</Link>
                </Menu.Item>
                {
                    // 3:已拒绝
                    status === 3 &&
                    <Menu.Item key="ChangeMessage">
                        <a target="_blank" rel="noopener noreferrer">
                            查看审核已拒绝原因
                        </a>
                    </Menu.Item>
                }
                {
                    // 模拟地点弹出框
                    /* status === 2 && */
                    // 2:已审核,3、已拒绝
                    (spStatus === 2 || spStatus === 3) && status === 1 && auditType === 1 &&
                    <Menu.Item key="ChangeAuditAdr">
                        <a target="_blank" rel="noopener noreferrer">
                            供应商地点审核
                        </a>
                    </Menu.Item>
                }
                {
                    // 1： 已提交
                    status === 1 && (spStatus === 2 || spStatus === 3) && auditType === 2 &&
                    <Menu.Item key="CheckReasonAdr">
                        <a target="_blank" rel="noopener noreferrer">
                            修改供应商地点审核
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
        const { total, pageNum } = this.props.queryManageList;
        const { queryManageList } = this.props;
        columns[columns.length - 1].render = this.renderOperationInput;
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
                                pageSize: PAGE_SIZE,
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
                <ChangeAuditAdr />
                {
                    this.props.checkReasonVisible &&
                    <CheckReason />
                }
                {
                    this.props.checkReasonVisibled &&
                    <CheckReasonAdr />
                }
            </div>
        )
    }
}

SupplierInputList.propTypes = {
    checkReasonVisible: PropTypes.func,
    checkReasonVisibled: PropTypes.func,
    modifyAuthVisible: PropTypes.func,
    queryManageList: PropTypes.objectOf(PropTypes.any),
    fetchQueryManageList: PropTypes.objectOf(PropTypes.any),
    modifyAuditVisible: PropTypes.func,
    history: PropTypes.objectOf(PropTypes.any),
    modifyAuditAdrVisible: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    modifyAdrVisible: PropTypes.func,
    modifyInformationVisible: PropTypes.func,
    informationVisible: PropTypes.bool
}

export default withRouter(Form.create()(SupplierInputList));
