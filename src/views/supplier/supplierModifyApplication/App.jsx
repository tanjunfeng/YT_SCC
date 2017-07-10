import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Form, Table, Menu, Dropdown, Icon } from 'antd';

import { fetchSupplierEditApply, modifyAuditVisible, modifyCheckReasonVisible } from '../../../actions';
import SearchForm from '../../../components/searchForm';
import { PAGE_SIZE } from '../../../constant';
import Utils from '../../../util/util';
import { spplierModifySelectType, suplierStatusSelect } from '../../../constant/searchParams';
import { supplierModifyList } from '../../../constant/formColumns';
import { exportEditApplySupplier } from '../../../service';
import ChangeAudit from './changeAudit';
import CheckReason from './checkReason';

const columns = supplierModifyList;

@connect(
    state => ({
        modifyData: state.toJS().supplier.modifyData,
        auditVisible: state.toJS().supplier.auditVisible,
        checkReasonVisible: state.toJS().supplier.checkReasonVisible
    }),
    dispatch => bindActionCreators({
        fetchSupplierEditApply,
        modifyAuditVisible,
        modifyCheckReasonVisible
    }, dispatch)
)
class SupplierModifyApplication extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSubmit = ::this.handleSubmit;
        this.renderOperation = ::this.renderOperation;
        this.handleFormSearch = ::this.handleFormSearch;
        this.handleFormReset = ::this.handleFormReset;
        this.handlePaginationChange = ::this.handlePaginationChange;
        this.handleDownLoad = ::this.handleDownLoad;

        this.searchForm = {};
    }

    componentDidMount() {
        this.props.fetchSupplierEditApply({
            pageNum: 1,
            pageSize: PAGE_SIZE,
            ...this.searchForm
        });
    }

    handleSubmit() {}


    handleSelect(record, index, item) {
        const { key } = item;
        switch (key) {
            case 'audit':
                this.props.modifyAuditVisible({isVisible: true});
                break;
            case 'checkReason':
                this.props.modifyCheckReasonVisible({isVisible: true});
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
        this.searchForm = data;
        this.handlePaginationChange();
    }

    handleDownLoad(data) {
        Utils.exportExcel(exportEditApplySupplier, data);
    }

    handlePaginationChange(goto = 1) {
        this.props.fetchSupplierEditApply({
            pageNum: goto,
            pageSize: PAGE_SIZE,
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
                {/*{
                    status !== 1 &&
                    <Menu.Item key="audit">
                        <a target="_blank" rel="noopener noreferrer">审核</a>
                    </Menu.Item>
                }
                {
                    status !== 0 &&
                    <Menu.Item key="checkReason">
                        <a target="_blank" rel="noopener noreferrer">查看原因</a>
                    </Menu.Item>
                }*/}
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
        columns[columns.length - 1].render = this.renderOperation;
        const { data, pageNum, pageSize, total } = this.props.modifyData;

        return (
            <div className="application">
                <SearchForm
                    suplierSelect={spplierModifySelectType}
                    suplierStatusSelect={suplierStatusSelect}
                    onSearch={this.handleFormSearch}
                    onExcel={this.handleDownLoad}
                    onReset={this.handleFormReset}
                />
                <div className="application-list">
                    <Table
                        dataSource={data}
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
                </div>
                {/*{
                    this.props.auditVisible &&
                    <ChangeAudit />
                }
                {
                    this.props.checkReasonVisible &&
                    <CheckReason />
                }*/}
            </div>
        );
    }
}

SupplierModifyApplication.propTypes = {
    fetchSupplierEditApply: PropTypes.func,
    modifyAuditVisible: PropTypes.func,
    modifyCheckReasonVisible: PropTypes.func,
    location: PropTypes.objectOf(PropTypes.any),
    modifyData: PropTypes.objectOf(PropTypes.any),
    auditVisible: PropTypes.bool,
    checkReasonVisible: PropTypes.bool
}

export default withRouter(Form.create()(SupplierModifyApplication));
