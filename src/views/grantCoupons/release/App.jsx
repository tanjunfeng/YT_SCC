/**
 * 发放优惠券弹窗
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Modal, Table, Form } from 'antd';
import {
    queryCouponsList,
    clearCouponsList
} from '../../../actions/promotion';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { releaseCouponsColumns as columns } from '../columns';

@connect(state => ({
    couponsList: state.toJS().promotion.coupons
}), dispatch => bindActionCreators({
    queryCouponsList,
    clearCouponsList
}, dispatch))

class ReleaseCouponModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            promoIds: [],
        };
        this.handleCouponSearch = this.handleCouponSearch.bind(this);
        this.handleCouponReset = this.handleCouponReset.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.query = this.query.bind(this);
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

    /**
     * table复选框
     */
    rowSelection = {
        onChange: (selectedRowKeys) => {
            this.setState({
                promoIds: selectedRowKeys,
            });
        }
    }

    query(condition) {
        const param = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            promoIds: this.state.promoIds,
            ...condition
        }
        this.props.queryCouponsList(param).then((data) => {
            const { pageNum, pageSize } = data.data;
            this.setState({ pageNum, pageSize });
        });
    }

    handleCouponSearch(param) {
        this.query(param);
    }

    handleCouponReset() {
        // 重置检索条件
        this.setState({
            pageNum: 1,
            pageSize: PAGE_SIZE
        });
    }

    handleOk() {

    }

    handleCancel() {

    }

    render() {
        const { data, total } = this.props.couponsList;
        const { pageNum, pageSize } = this.state;
        columns[columns.length - 1].render = this.renderOperations;
        return (
            <Modal
                title="选择优惠券类型"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <SearchForm
                    onCouponSearch={this.handleCouponSearch}
                    onCouponReset={this.handleCouponReset}
                />
                <Table
                    rowSelection={this.rowSelection}
                    dataSource={data}
                    columns={columns}
                    rowKey="franchiseeId"
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
            </Modal>
        );
    }
}

ReleaseCouponModal.propTypes = {
    visible: PropTypes.bool,
    queryCouponsList: PropTypes.func,
    clearCouponsList: PropTypes.func,
    couponsList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
}

export default withRouter(Form.create()(ReleaseCouponModal));
