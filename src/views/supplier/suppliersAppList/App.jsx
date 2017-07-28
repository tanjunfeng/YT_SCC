/**
 * @file app.jsx
 * @author Tan junfeng
 *
 * 供应商入驻申请列表
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import {
    Icon,
    Form,
    Table,
    Menu,
    Dropdown,
    message
} from 'antd';

import {
    fetchProviderEnterList,
    fetchQuerySettledList,
    fetchQueryManageList,
    modifyAuditVisible,
    modifyCheckReasonVisible
} from '../../../actions';
import SearchForm from '../searchForm';
import { PAGE_SIZE } from '../../../constant';
import Utils from '../../../util/util';
import { suppliersAppList } from '../../../constant/formColumns';
import { exportSupplierEnterList } from '../../../service';
import ChangeAudit from './changeAudit';
import CheckReason from './checkReason';

const columns = suppliersAppList;

@connect(
    state => ({
        applicationData: state.toJS().supplier.data,
        auditVisible: state.toJS().supplier.auditVisible,
        checkResonVisible: state.toJS().supplier.checkResonVisible,
        insertSettlementResult: state.toJS().supplier.insertSettlementResult,
        querySettledList: state.toJS().supplier.querySettledList,
    }),
    dispatch => bindActionCreators({
        modifyAuditVisible,
        modifyCheckReasonVisible,
        fetchQuerySettledList,
        fetchProviderEnterList,
        modifyAuditVisible,
        fetchQueryManageList,
        modifyCheckReasonVisible
    }, dispatch)
)
class SuppliersAppList extends PureComponent {
    constructor(props) {
        super(props);

        this.renderOperation = this.renderOperation.bind(this);
        this.handleFormSearch = this.handleFormSearch.bind(this);
        this.handleFormReset = this.handleFormReset.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.handleDownLoad = this.handleDownLoad.bind(this);
        this.handleInputSupplier = this.handleInputSupplier.bind(this);
        // this.handleGetList = this.handleGetList.bind(this);

        this.searchForm = {};
        this.current = 1;
    }

    /**
     * 加载刷新列表
     */
    componentDidMount() {
        this.props.fetchQuerySettledList({
            pageNum: this.current,
            pageSize: PAGE_SIZE,
            ...this.searchForm
        });
    }

    /**
     * 表单操作弹出层
     *
     * @param {string} text 文本内容
     * @param {Object} record 模态框状态
     * @param {string} index 下标
     */
    handleSelect(record, index, item) {
        const { key } = item;
        switch (key) {
            case 'ChangeAudit':
                this.props.modifyAuditVisible({isVisible: true, record});
                break;
            case 'CheckReason':
                this.props.modifyCheckReasonVisible({isVisible: true, record});
                break;
            default:
                break;
        }
    }

    /**
     * 搜索
     */
    handleFormSearch(data, bool) {
        console.log(data)
        this.searchForm = data;
        if (bool) {
            // 主数据
            // console.log('主数据')
            this.props.fetchQueryManageList({
                pageNum: this.current,
                pageSize: PAGE_SIZE,
                ...this.searchForm
            });
        } else {
            // SCM数据
            // console.log('SCM数据')
            this.props.fetchQueryManageList({
                pageNum: this.current,
                pageSize: PAGE_SIZE,
                ...this.searchForm
            });
        }
    }

    /**
     * 重置
     */
    handleFormReset(data) {
        this.searchForm = data;
        this.handlePaginationChange();
    }

    /**
     * 创建
     *
     * @param {string} data 'addSupplier':供应商类型为供应商；否则为供应商地点，data为供应商编码
     */
    handleInputSupplier(data) {
        message.success(data)
        const { history } = this.props;
        history.push('/applicationList/supplier/add');
    }

    /**
     * 导出
     */
    handleDownLoad(data) {
        Utils.exportExcel(exportSupplierEnterList, data);
    }

    /**
     *列表分页
     *
     * @param {string} goto 数据列表分页
     */
    handlePaginationChange(goto = 1) {
        this.current = goto;
        this.props.getSupplierSettledList({
            pageNum: goto,
            pageSize: PAGE_SIZE,
            ...this.searchForm
        });
    }

    renderOperation(text, record, index) {
        const { status, id, providerType } = record;
        const { pathname } = this.props.location;
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                {
                    providerType === 1 ?
                        <Menu.Item key="detail">
                            <Link to={`${pathname}/supplier/${id}`}>供应商详情</Link>
                        </Menu.Item>
                        :
                        <Menu.Item key="AddDetail">
                            <Link to={`${pathname}/place/${id}`}>供应商地点详情</Link>
                        </Menu.Item>
                }
                {
                    providerType === 1 && status === 4 &&
                    <Menu.Item key="addAddress">
                        <Link to={`${pathname}/add/${id}`}>新增供应商地点信息</Link>
                    </Menu.Item>
                }
                {
                    providerType === 1 ?
                        <Menu.Item key="modifySupInfor">
                            <Link to={`${pathname}/add/${id}`}>修改供应商信息</Link>
                        </Menu.Item>
                        :
                        <Menu.Item key="modifySupAddInfor">
                            <Link to={`${pathname}/add/${id}`}>
                                修改供应商地点信息
                            </Link>
                        </Menu.Item>
                }
                {
                    status === 3 &&
                    <Menu.Item key="CheckReason">
                        <a target="_blank" rel="noopener noreferrer">查看原因</a>
                    </Menu.Item>
                }
            </Menu>
        )
        return (
            <Dropdown overlay={menu} placement="bottomCenter" record>
                <a className="ant-dropdown-link">
                    表单操作 <Icon type="down" />
                </a>
            </Dropdown>
        )
    }

    render() {
        const { data, pageNum, pageSize, total } = this.props.applicationData;
        const { querySettledList } = this.props;
        columns[columns.length - 1].render = this.renderOperation;
        return (
            <div className="application tjf-css-min-width">
                <SearchForm
                    isSuplierAddMenu
                    onSearch={this.handleFormSearch}
                    onInput={this.handleInputSupplier}
                    onReset={this.handleFormReset}
                    onExcel={this.handleDownLoad}
                />
                <div className="application-list">
                    <Table
                        dataSource={querySettledList.data}
                        columns={columns}
                        rowKey="id"
                        pagination={{
                            total,
                            pageSize,
                            current: pageNum,
                            showQuickJumper: true,
                            onChange: this.handlePaginationChange
                        }}
                    />
                    <ChangeAudit />
                    <CheckReason />
                </div>
            </div>
        );
    }
}

SuppliersAppList.propTypes = {
    fetchQueryManageList: PropTypes.objectOf(PropTypes.any),
    querySettledList: PropTypes.objectOf(PropTypes.any),
    fetchQuerySettledList: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
    getSupplierSettledList: PropTypes.bool,
    location: PropTypes.objectOf(PropTypes.any),
    modifyAuditVisible: PropTypes.bool,
    modifyCheckReasonVisible: PropTypes.bool,
    applicationData: PropTypes.objectOf(PropTypes.any),
    auditVisible: PropTypes.bool,
    checkResonVisible: PropTypes.bool,
}

export default withRouter(Form.create()(SuppliersAppList));
