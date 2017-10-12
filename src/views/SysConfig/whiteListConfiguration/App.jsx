/*
 * @Author: tanjf
 * @Description: 促销管理 - 优惠券列表
 * @CreateDate: 2017-09-20 14:09:43
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-10-12 16:01:49
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Table, Form, Icon, Menu, Dropdown, Modal, Button } from 'antd';

import {
    queryCouponsList,
    clearCouponsList,
    updatePromotionStatus
} from '../../../actions/promotion';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { couponList as columns } from './columns';

@connect(state => ({
    couponsList: state.toJS().promotion.couponsList
}), dispatch => bindActionCreators({
    queryCouponsList,
    clearCouponsList,
    updatePromotionStatus
}, dispatch))

class WhiteListConfiguration extends PureComponent {
    constructor(props) {
        super(props);
        this.param = {};
        this.isVisible= false;
        this.state = {
            storeIds: [],
            current: 1
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
        this.props.queryCouponsList(this.param).then((data) => {
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
        console.log(item.key)
    }

    handleOk() {

    }

    handleCancel() {

    }

    renderOperations = (text, record, index) => {
        const { status } = record;
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, index, item)}>
                {
                    // 上线
                    (status === 'unreleased') ?
                        <Menu.Item key="online">
                            <a target="_blank" rel="noopener noreferrer">
                                上线
                        </a>
                        </Menu.Item>
                        : null
                }
                {
                    // 下线
                    (status !== 'unreleased') ?
                        <Menu.Item key="Offline">
                            <a target="_blank" rel="noopener noreferrer">
                                下线
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
        const { data, total, pageNum, pageSize } = this.props.couponsList;
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
                />
                <Table
                    rowSelection={rowSelection}
                    dataSource={data}
                    columns={columns}
                    rowKey="id"
                    scroll={{
                        x: 1400
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
                <div>
                    <Modal
                        visible={this.isVisible}
                        title="Title"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                            <Button key="submit" type="primary" size="large" onClick={this.handleOk}>
                                确认
                            </Button>
                        ]}
                    >
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                    </Modal>
                </div>
            </div>
        );
    }
}

WhiteListConfiguration.propTypes = {
    queryCouponsList: PropTypes.func,
    clearCouponsList: PropTypes.func,
    couponsList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
}

export default withRouter(Form.create()(WhiteListConfiguration));
