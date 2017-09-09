/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 促销管理 - 促销管理列表
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Table, Form, Icon, Menu, Dropdown } from 'antd';
import { Link } from 'react-router-dom';

import { getPromotionList, clearPromotionList } from '../../../actions/promotion';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { promotionMngList as columns } from '../columns';

@connect(state => ({
    promotionList: state.toJS().promotion.list
}), dispatch => bindActionCreators({
    getPromotionList,
    clearPromotionList
}, dispatch))

class PromotionManagementList extends PureComponent {
    constructor(props) {
        super(props);
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            total: 0
        };
        this.handlePromotionSearch = this.handlePromotionSearch.bind(this);
        this.handlePromotionReset = this.handlePromotionReset.bind(this);
        this.renderOperations = this.renderOperations.bind(this);
        this.query = this.query.bind(this);
    }

    componentWillMount() {
        this.props.clearPromotionList();
    }

    componentDidMount() {
        this.query();
    }

    /**
     * 分页页码改变的回调
     */
    onPaginate = (pageNum) => {
        Object.assign(this.param, {
            pageNum
        });
        this.query();
    }

    query() {
        this.props.getPromotionList(this.param).then((data) => {
            const { pageNum, pageSize, total } = data.data;
            Object.assign(this.param, {
                pageNum, pageSize, total
            });
        });
    }

    handlePromotionSearch(param) {
        Object.assign(this.param, param);
        this.query();
    }

    handlePromotionReset() {
        // 重置检索条件
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            total: 0
        }
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
    renderOperations = (text, record) => {
        const { id } = record;
        const { pathname } = this.props.location;
        const menu = (
            <Menu>
                <Menu.Item key="detail">
                    <Link to={`${pathname}/promotion/${id}`}>活动详情</Link>
                </Menu.Item>
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

    render() {
        // columns[columns.length - 1].render = this.renderOperations;
        return (
            <div>
                <SearchForm
                    handlePromotionSearch={this.handlePromotionSearch}
                    handlePromotionReset={this.handlePromotionReset}
                />
                <Table
                    dataSource={this.props.promotionList.data}
                    columns={columns}
                    rowKey="id"
                    scroll={{
                        x: 1400
                    }}
                    bordered
                    pagination={{
                        ...this.param,
                        showQuickJumper: true,
                        onChange: this.onPaginate
                    }}
                />
            </div>
        );
    }
}

PromotionManagementList.propTypes = {
    getPromotionList: PropTypes.func,
    clearPromotionList: PropTypes.func,
    promotionList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    location: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(PromotionManagementList));
