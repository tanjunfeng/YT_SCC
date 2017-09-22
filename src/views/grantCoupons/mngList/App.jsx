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
import { Table, Form } from 'antd';
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
            pageNum: 1,
            pageSize: PAGE_SIZE,
            storeIds: [],
        };
        this.handlePromotionSearch = this.handlePromotionSearch.bind(this);
        this.handlePromotionReset = this.handlePromotionReset.bind(this);
        this.handleReleaseAll = this.handleReleaseAll.bind(this);
        this.handleReleaseChecked = this.handleReleaseChecked.bind(this);
        this.query = this.query.bind(this);
    }

    componentDidMount() {
        this.query();
    }

    componentWillUnmount() {
        this.props.clearFranchiseeList();
    }

    /**
     * 分页页码改变的回调
     */
    onPaginate = (pageNum) => {
        this.query({ pageNum });
    }

    /**
     * table复选框
     */
    rowSelection = {
        onChange: (storeIds) => {
            this.setState({ storeIds });
        }
    }

    query(condition) {
        const param = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            ...condition
        }
        this.props.queryFranchiseeList(param).then((data) => {
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

    handleReleaseAll(promoIds) {
        this.props.grantCoupon({
            promoIds,
            storeIds: this.props.franchiseeList.data.map(franchisee => franchisee.storeId)
        });
    }

    handleReleaseChecked(promoIds) {
        this.props.grantCoupon({
            promoIds,
            storeIds: this.state.storeIds
        });
    }

    render() {
        const { data, total } = this.props.franchiseeList;
        const { pageNum, pageSize } = this.state;
        columns[columns.length - 1].render = this.renderOperations;
        return (
            <div>
                <SearchForm
                    onPromotionSearch={this.handlePromotionSearch}
                    onPromotionReset={this.handlePromotionReset}
                    onPromotionReleaseAll={this.handleReleaseAll}
                    onPromotionReleasChecked={this.handleReleaseChecked}
                />
                <Table
                    rowSelection={this.rowSelection}
                    dataSource={data}
                    columns={columns}
                    rowKey="storeId"
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

GrantCouponList.propTypes = {
    queryFranchiseeList: PropTypes.func,
    clearFranchiseeList: PropTypes.func,
    grantCoupon: PropTypes.func,
    franchiseeList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
}

export default withRouter(Form.create()(GrantCouponList));
