/*
 * @Author: tanjf
 * @Description: 促销管理 - 优惠券列表
 * @CreateDate: 2017-09-20 14:09:43
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-09-22 15:18:02
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Table, Form, Icon, Menu, Dropdown } from 'antd';
import { Link } from 'react-router-dom';

import {
    queryCouponsList,
    clearCouponsList,
    updatePromotionStatus
} from '../../../actions/promotion';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { couponList as columns } from '../columns';

@connect(state => ({
    couponsList: state.toJS().promotion.couponsList
}), dispatch => bindActionCreators({
    queryCouponsList,
    clearCouponsList,
    updatePromotionStatus
}, dispatch))

class CouponList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        };
        this.handlePromotionSearch = this.handlePromotionSearch.bind(this);
        this.handlePromotionReset = this.handlePromotionReset.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.renderOperations = this.renderOperations.bind(this);
        this.query = this.query.bind(this);
    }

    componentWillMount() {
        this.props.clearCouponsList();
    }

    componentDidMount() {
        this.query();
    }

    componentWillUnmount() {
        this.props.clearCouponsList();
    }

    /**
     * 分页页码改变的回调
     */
    onPaginate = (pageNum) => {
        this.query({ pageNum });
    }

    query(condition) {
        const param = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            ...condition
        }
        this.props.queryCouponsList(param).then((data) => {
            const { pageNum, pageSize } = data.data;
            this.setState({ pageNum, pageSize });
        });
    }

    handlePromotionSearch(param) {
        this.query(param);
    }

    handlePromotionReset() {
        // 重置检索条件
        this.setState({
            pageNum: 1,
            pageSize: PAGE_SIZE
        });
    }

    /**
     * 促销活动表单操作
    *
    * @param {Object} record 传值所有数据对象
    * @param {number} index 下标
    * @param {Object} items 方法属性
    */
    handleSelect(record, index, items) {
        const { key } = items;
        const id = record.id;
        switch (key) {
            case 'publish': // 发布
                this.props.updatePromotionStatus({
                    id,
                    status: 'released'
                }).then(() => {
                    this.query();
                });
                break;
            case 'close':   // 关闭
                this.props.updatePromotionStatus({
                    id,
                    status: 'closed'
                }).then(() => {
                    this.query();
                });
                break;
            default:
                break;
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
    renderOperations = (text, record, index) => {
        const { id, status } = record;
        const { pathname } = this.props.location;
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                <Menu.Item key="detail">
                    <Link to={`${pathname}/detail/${id}`}>活动详情</Link>
                </Menu.Item>
                <Menu.Item key="participate">
                    <Link to={`${pathname}/participate/${id}`}>参与数据</Link>
                </Menu.Item>
                {
                    // 未发布的可发布
                    (status === 'unreleased') ?
                        <Menu.Item key="publish">
                            <a target="_blank" rel="noopener noreferrer">
                                发布
                        </a>
                        </Menu.Item>
                        : null
                }
                {
                    // 未发布的可发布，未发布和已发布的可结束
                    (status === 'unreleased' || status === 'released') ?
                        <Menu.Item key="close">
                            <a target="_blank" rel="noopener noreferrer">
                                关闭
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

    render() {
        const { data, total } = this.props.couponsList;
        const { pageNum, pageSize } = this.state;
        columns[columns.length - 1].render = this.renderOperations;
        return (
            <div>
                <SearchForm
                    onPromotionSearch={this.handlePromotionSearch}
                    onPromotionReset={this.handlePromotionReset}
                />
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="id"
                    scroll={{
                        x: 1400
                    }}
                    bordered
                    pagination={{
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

CouponList.propTypes = {
    queryCouponsList: PropTypes.func,
    clearCouponsList: PropTypes.func,
    updatePromotionStatus: PropTypes.func,
    couponsList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    location: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(CouponList));
