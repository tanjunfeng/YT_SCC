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
    Menu,
    Dropdown,
} from 'antd';

import {
    fecthCheckMainSupplier,
    modifyAuditVisible,
    modifyCheckReasonVisible,
    fecthGetProdPurchaseById
} from '../../../actions';
import SearchForm from '../searchForm';
import ShowForm from '../showForm';
import Cardline from '../card';
import { PAGE_SIZE } from '../../../constant';
import ChangeAudit from './changeAudit';
import CheckReason from './checkReason';


@connect(
    state => ({
        applicationData: state.toJS().supplier.applicationData,
        auditVisible: state.toJS().supplier.auditVisible,
        checkResonVisible: state.toJS().supplier.checkResonVisible,
        insertSettlementResult: state.toJS().supplier.insertSettlementResult,
        prodPurchase: state.toJS().commodity.prodPurchase,
        getProdPurchaseById: state.toJS().commodity.getProdPurchaseById
    }),
    dispatch => bindActionCreators({
        fecthCheckMainSupplier,
        modifyAuditVisible,
        modifyCheckReasonVisible,
        fecthGetProdPurchaseById
    }, dispatch)
)

class SalesMaintenance extends PureComponent {
    constructor(props) {
        super(props);

        this.handleFormSearch = this.handleFormSearch.bind(this);
        this.handleFormReset = this.handleFormReset.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        // this.handleGetList = this.handleGetList.bind(this);

        this.searchForm = {};
        this.current = 1;
        this.state = {
            index: 0,
            value: [],
            disabled: false
        }
    }

    /**
     * 加载刷新列表
     */
    componentDidMount() {
        this.props.fecthGetProdPurchaseById({
            id: 2,
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
            case 'changeAudit':
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
     * @param {Object} data 展示数据
     * @param {bool} bool 通过返回值操控请求
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
     * @param {Object} data 重置的表单
     */
    handleFormReset(data) {
        this.searchForm = data;
        this.handlePaginationChange();
    }

    /**
     *列表分页
     *
     * @param {string} goto 数据列表分页
     */
    handlePaginationChange(goto = 1) {
        this.current = goto;
        this.props.fetchProviderEnterList({
            pageNum: goto,
            pageSize: PAGE_SIZE,
            ...this.searchForm
        });
    }

    // handleGetList() {
    //     this.props.fetchProviderEnterList({
    //         pageNum: this.current,
    //         pageSize: PAGE_SIZE,
    //         ...this.searchForm
    //     });
    // }

    renderOperation(text, record, index) {
        const { status, id } = record;
        const { pathname } = this.props.location;

        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                <Menu.Item key="detail">
                    <Link to={`${pathname}/${id}`}>供应商详情</Link>
                </Menu.Item>
                {
                    status === 1 &&
                    <Menu.Item key="changeAudit">
                        <a target="_blank" rel="noopener noreferrer">入驻审核</a>
                    </Menu.Item>
                }
                {
                    status === 0 &&
                    <Menu.Item key="CheckReason">
                        <a target="_blank" rel="noopener noreferrer">修改审核</a>
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
        const { queryProdPurchases, prefixCls } = this.props;
        return (
            <div className={`${prefixCls}-min-width application`}>
                <ShowForm />
                <SearchForm
                    onSearch={this.handleFormSearch}
                    onReset={this.handleFormReset}
                    handleAdd={this.handleAdd}
                />
                <div>
                    <Cardline />
                </div>
                {
                    this.props.auditVisible &&
                    <ChangeAudit />
                }
                {
                    this.props.checkResonVisible &&
                    <CheckReason />
                }
            </div>
        );
    }
}

SalesMaintenance.propTypes = {
    fecthGetProdPurchaseById: PropTypes.func,
    fetchProviderEnterList: PropTypes.bool,
    location: PropTypes.objectOf(PropTypes.any),
    modifyAuditVisible: PropTypes.bool,
    modifyCheckReasonVisible: PropTypes.bool,
    auditVisible: PropTypes.bool,
    checkResonVisible: PropTypes.bool,
}

export default withRouter(Form.create()(SalesMaintenance));
