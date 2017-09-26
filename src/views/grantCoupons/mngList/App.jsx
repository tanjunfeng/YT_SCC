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
        };
        this.param = {};
        this.handlePromotionSearch = this.handlePromotionSearch.bind(this);
        this.handlePromotionReset = this.handlePromotionReset.bind(this);
        this.handleReleaseAll = this.handleReleaseAll.bind(this);
        this.handleReleaseChecked = this.handleReleaseChecked.bind(this);
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
        Object.assign(this.param, {
            pageNum,
            current: pageNum
        });
        this.query();
    }

    /**
     * table复选框
     */
    rowSelection = {
        onChange: (storeIds) => {
            this.setState({ storeIds });
        }
    }

    query() {
        this.props.queryFranchiseeList(this.param).then((data) => {
            const { pageNum, pageSize } = data.data;
            Object.assign(this.param, { pageNum, pageSize });
        });
    }

    handlePromotionSearch(param) {
        Object.assign(this.param, {}, {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            current: 1,
            ...param
        });
        this.query();
    }

    handlePromotionReset() {
        // 重置检索条件
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        }
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
        const { data, total } = this.props.franchiseeList;
        const { pageNum, pageSize } = this.state;
        columns[columns.length - 1].render = this.renderOperations;
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
                    rowSelection={this.rowSelection}
                    dataSource={data}
                    columns={columns}
                    rowKey="storeId"
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
