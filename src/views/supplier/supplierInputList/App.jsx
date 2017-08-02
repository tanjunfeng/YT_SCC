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
import { Table, Form, Icon, Menu, Dropdown, message } from 'antd';
import {
    fetchQueryManageList,
    fetchSupplierList,
    modifyAuditVisible,
    modifyCheckReasonVisible,
    modifyInformationVisible,
    fetchGetProductById,
    fetchEditBeforeAfter
} from '../../../actions';

import SearchForm from '../searchForm';
import { PAGE_SIZE } from '../../../constant';
import { supplierInputList } from '../../../constant/formColumns';
import Utils from '../../../util/util';
import { exportSupplierList } from '../../../service';
import ChangeMessage from './changeMessage';
import ChangeAudit from './changeAudit';
// import ChangeAdrAudit from './changeAdrAudit';
import CheckReson from './checkReason';


const columns = supplierInputList;

@connect(
    state => ({
        supplier: state.toJS().supplier.data,
        informationVisible: state.toJS().supplier.informationVisible,
        queryManageList: state.toJS().supplier.queryManageList,
        checkResonVisible: state.toJS().supplier.checkResonVisible,
    }),
    dispatch => bindActionCreators({
        fetchQueryManageList,
        fetchSupplierList,
        modifyCheckReasonVisible,
        modifyAuditVisible,
        modifyInformationVisible,
        fetchGetProductById,
        fetchEditBeforeAfter
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
        this.handleInputSupplier = ::this.handleInputSupplier;

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
            providerType: 1,
            status: 0
        });
    }

    /**
     * 表单操作
     *
     * @param {Object} record 传值所有数据对象
     * @param {number} index 下标
     * @param {Object} items 方法属性
     */
    handleSelect(record, index, items) {
        const { key } = items;
        this.props.fetchEditBeforeAfter({
            spId: String(record.id)
            // spId: 'xprov139'
        })
        .then(() => {
            switch (key) {
                case 'ChangeAudit':
                    this.props.modifyAuditVisible({isVisible: true, record});
                    break;
                case 'ChangeAdrAudit':
                    this.props.modifyAuditVisible({isVisible: true, record});
                    break;
                case 'CheckReson':
                    this.props.modifyCheckReasonVisible({isVisible: true, record});
                    break;
                case 'ChangeMessage':
                    this.props.modifyInformationVisible({isVisible: true, record});
                    break;
                default:
                    break;
            }
        });
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
            this.handlePaginationChange(this.current);
        } else {
            // SCM数据
            // console.log('SCM数据')
            this.handlePaginationChange(this.current);
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
        const { pathname } = this.props.location;
        const { history } = this.props;
        history.push(`${pathname}/add`);
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
    handlePaginationChange(goto) {
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
                    status === 2 &&
                    <Menu.Item key="ChangeAudit">
                        <a target="_blank" rel="noopener noreferrer">
                            供应商审核
                        </a>
                    </Menu.Item>
                }
                {
                    status === 2 &&
                    <Menu.Item key="CheckReson">
                        <a target="_blank" rel="noopener noreferrer">
                            修改供应商审核
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
                    status === 1 && status === 3 && status === 4 &&
                    <Menu.Item key="modifySupAddInfor">
                        <Link to={`${pathname}/edit/${id}`}>
                            修改供应商地点信息
                        </Link>
                    </Menu.Item>
                }
                {
                    status === 4 &&
                    <Menu.Item key="ChangeMessage">
                        <a target="_blank" rel="noopener noreferrer">
                            查看审核已拒绝原因
                        </a>
                    </Menu.Item>
                }
                {
                    status === 2 &&
                    <Menu.Item key="ChangeAdrAudit">
                        <a target="_blank" rel="noopener noreferrer">
                            供应商地点审核
                        </a>
                    </Menu.Item>
                }
                {
                    status === 2 &&
                    <Menu.Item key="CheckReson">
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
        const { data, total, pageNum, pageSize } = this.props.queryManageList;
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
                {
                    this.props.checkResonVisible &&
                    <CheckReson />
                }
            </div>
        )
    }
}

SupplierInputList.propTypes = {
    fetchEditBeforeAfter: PropTypes.func,
    queryManageList: PropTypes.objectOf(PropTypes.any),
    fetchQueryManageList: PropTypes.objectOf(PropTypes.any),
    modifyAuditVisible: PropTypes.func,
    history: PropTypes.objectOf(PropTypes.any),
    supplier: PropTypes.objectOf(PropTypes.any),
    location: PropTypes.objectOf(PropTypes.any),
    modifyCheckReasonVisible: PropTypes.func,
    modifyInformationVisible: PropTypes.func,
    informationVisible: PropTypes.bool
}

export default withRouter(Form.create()(SupplierInputList));
