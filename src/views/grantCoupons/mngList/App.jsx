/*
 * @Author: tanjf
 * @Description: 促销管理 - 优惠券列表
 * @CreateDate: 2017-09-20 14:09:43
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-09-22 10:36:41
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Table, Form, message } from 'antd';
import {
    queryFranchiseeList,
    grantCoupon,
    clearFranchiseeList
} from '../../../actions/promotion';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { grantCouponsColumns as columns } from '../columns';

@connect(state => ({
    franchiseeList: state.toJS().promotion.franchiseeList
}), dispatch => bindActionCreators({
    queryFranchiseeList,
    clearFranchiseeList,
    grantCoupon
}, dispatch))

class GrantCouponList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            storeIds: [],
            current: 1
        };
        this.param = {};
        this.handlePromotionSearch = this.handlePromotionSearch.bind(this);
        this.handlePromotionReset = this.handlePromotionReset.bind(this);
        this.handleReleaseAll = this.handleReleaseAll.bind(this);
        this.handleReleaseChecked = this.handleReleaseChecked.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.query = this.query.bind(this);
    }

    componentDidMount() {
        this.handlePromotionReset();
        this.query();
    }

    componentWillUnmount() {
        this.props.clearFranchiseeList();
    }

    /**
     * 分页页码改变的回调
     */
    onPaginate = (pageNum) => {
        console.log(pageNum)
        Object.assign(this.param, {
            pageNum
        });
        this.setState({ current: pageNum });
        this.query();
    }

    /**
     * table复选框
     */
    onSelectChange(storeIds) {
        this.setState({ storeIds });
    }

    query() {
        this.props.queryFranchiseeList(this.param).then((res) => {
            const { pageNum, pageSize } = res.data;
            Object.assign(this.param, { pageNum, pageSize });
        });
    }

    handlePromotionSearch(param) {
        this.handlePromotionReset();
        Object.assign(this.param, {
            ...param
        });
        this.setState({ current: 1 });
        this.query();
    }

    handlePromotionReset() {
        // 重置检索条件
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        }
        this.setState({ storeIds: [] });
    }

    handleReleaseAll(promoIds) {
        this.props.grantCoupon({
            promoIds,
            storeIds: this.props.franchiseeList.data.map(franchisee => franchisee.storeId)
        }).then(() => {
            message.info('查询结果发券成功');
        });
    }

    handleReleaseChecked(promoIds) {
        this.props.grantCoupon({
            promoIds,
            storeIds: this.state.storeIds
        }).then(() => {
            message.info('选择加盟商发券成功');
        });
    }

    render() {
        const { data = [], total, pageNum, pageSize } = this.props.franchiseeList;
        columns[columns.length - 1].render = this.renderOperations;
        const rowSelection = {
            selectedRowKeys: this.state.storeIds,
            onChange: this.onSelectChange
        };
        return (
            <div>
                <SearchForm
                    onPromotionSearch={this.handlePromotionSearch}
                    onPromotionReset={this.handlePromotionReset}
                    onPromotionReleaseAll={this.handleReleaseAll}
                    isGrantDisabled={this.state.storeIds.length === 0}
                    onPromotionReleasChecked={this.handleReleaseChecked}
                />
                <Table
                    rowSelection={rowSelection}
                    dataSource={data}
                    columns={columns}
                    rowKey="storeId"
                    scroll={{
                        x: 1400
                    }}
                    bordered
                    pagination={{
                        current: this.state.current,
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

GrantCouponList.propTypes = {
    queryFranchiseeList: PropTypes.func,
    clearFranchiseeList: PropTypes.func,
    grantCoupon: PropTypes.func,
    franchiseeList: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(GrantCouponList));
