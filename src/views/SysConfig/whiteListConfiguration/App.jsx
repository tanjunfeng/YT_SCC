/*
 * @Author: tanjf
 * @Description: 促销管理 - 优惠券列表
 * @CreateDate: 2017-09-20 14:09:43
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-10-13 16:51:29
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Table, Form, Icon, Menu, Dropdown } from 'antd';
import {
    clearCouponsList,
    updatePromotionStatus
} from '../../../actions/promotion';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { couponList as columns } from './columns';
import { queryWhitelist } from '../../../actions/whiteListConfiguration';

@connect(state => ({
    data: state.toJS().queryWhiteList.data
}), dispatch => bindActionCreators({
    queryWhitelist,
    clearCouponsList,
    updatePromotionStatus,
}, dispatch))

class WhiteListConfiguration extends PureComponent {
    constructor(props) {
        super(props);
        this.param = {};
        this.state = {
            storeIds: [],
            current: 1,
            modalXXXvisible: false,
            modalYYYvisible: false,
        };
        this.handlePromotionSearch = this.handlePromotionSearch.bind(this);
        this.handlePromotionReset = this.handlePromotionReset.bind(this);
        this.renderOperations = this.renderOperations.bind(this);
        this.query = this.query.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentWillMount() {
        this.props.clearCouponsList();
    }

    componentDidMount() {
        this.handlePromotionReset();
        this.query();
    }

    componentWillUnmount() {
        this.props.clearCouponsList();
    }

    /**
     * 分页页码改变的回调
     */
    onPaginate = (pageNum) => {
        Object.assign(this.param, { pageNum, current: pageNum });
        this.query();
    }

    /**
     * table复选框
     */
    onSelectChange(storeIds) {
        this.setState({ storeIds });
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

    query() {
        this.props.queryWhitelist(this.param).then((data) => {
            const { pageNum, pageSize } = data.data;
            Object.assign(this.param, { pageNum, pageSize });
        });
    }

    handlePromotionSearch(param) {
        this.handlePromotionReset();
        this.param = {
            current: 1,
            ...param
        };
        this.query();
    }

    handlePromotionReset() {
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        };
    }

    handleSelect(record, index, item) {
        switch (item.key) {
            case 'Offline':
                this.setState({
                    modalYYYvisible: true
                });
                break;
            case 'Online':
                this.setState({
                    modalXXXvisible: true
                });
                break;
            default:
                break;
        }
    }

    renderOperations = (text, record, index) => {
        const { scPurchaseFlag } = record;
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                {
                    // 上线
                    (scPurchaseFlag === 1) ?
                        <Menu.Item key="Offline">
                            <a target="_blank" rel="noopener noreferrer">
                                下线
                        </a>
                        </Menu.Item>
                        : null
                }
                {
                    // 下线
                    (scPurchaseFlag !== 1) ?
                        <Menu.Item key="Online">
                            <a target="_blank" rel="noopener noreferrer">
                                上线
                        </a>
                        </Menu.Item>
                        : null
                }
            </Menu>
        );

        return (
            <Dropdown
                overlay={menu}
                placement="bottomCenter"
            >
                <a className="ant-dropdown-link">
                    表单操作 <Icon type="down" />
                </a>
            </Dropdown>
        )
    }

    handleModalXXXChange = (params) => {

    }

    render() {
        const { data, total, pageNum, pageSize } = this.props.data;
        const { modalXXXvisible, modalYYYvisible } = this.state;
        const rowSelection = {
            selectedRowKeys: this.state.storeIds,
            onChange: this.onSelectChange
        };
        columns[columns.length - 1].render = this.renderOperations;
        return (
            <div>
                <SearchForm
                    onPromotionSearch={this.handlePromotionSearch}
                    onPromotionReset={this.handlePromotionReset}
                    value={{modalXXXvisible, modalYYYvisible}}
                    onModalXXXChange={this.handleModalXXXChange}
                />
                <Table
                    rowSelection={rowSelection}
                    dataSource={data}
                    columns={columns}
                    rowKey="franchiseeId"
                    scroll={{
                        x: 1600
                    }}
                    bordered
                    pagination={{
                        current: this.param.current,
                        pageNum,
                        pageSize,
                        total,
                        showQuickJumper: true,
                        onChange: this.onPaginate
                    }}
                />
            </div>
        );
    }
}

WhiteListConfiguration.propTypes = {
    queryWhitelist: PropTypes.func,
    clearCouponsList: PropTypes.func,
    data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
};

export default withRouter(Form.create()(WhiteListConfiguration));
