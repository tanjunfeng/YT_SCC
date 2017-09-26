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
import { Modal, Table, Form, message } from 'antd';
import {
    queryAliveCouponsList,
    clearCouponsList
} from '../../../actions/promotion';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { releaseCouponsColumns as columns } from '../columns';

@connect(state => ({
    couponsList: state.toJS().promotion.couponsList
}), dispatch => bindActionCreators({
    queryAliveCouponsList,
    clearCouponsList
}, dispatch))

class ReleaseCouponModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            current: 1,
            promoIds: [],
        };
        this.handleCouponSearch = this.handleCouponSearch.bind(this);
        this.handleCouponReset = this.handleCouponReset.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.query = this.query.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.visible && this.props.visible) {
            this.setState({
                pageNum: 1,
                pageSize: PAGE_SIZE,
                promoIds: [],
            });
            // 隐藏时清空
            this.props.clearCouponsList();
        }
        if (nextProps.visible && !this.props.visible) {
            // 显示时按默认条件查询一次
            this.query();
        }
    }

    /**
     * 分页页码改变的回调
     */
    onPaginate = (pageNum) => {
        this.setState({ current: pageNum });
        this.query({ pageNum });
    }

    /**
     * table复选框
     */
    onSelectChange(promoIds) {
        this.setState({ promoIds });
    }

    query(condition) {
        const param = {
            pageNum: 1,
            pageSize: 5,
            ...condition
        }
        this.props.queryAliveCouponsList(param).then((data) => {
            const { pageNum, pageSize } = data.data;
            this.setState({ pageNum, pageSize });
        });
    }

    handleCouponSearch(param) {
        this.setState({ current: 1 });
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
        if (this.state.promoIds.length === 0) {
            message.error('请选择至少一张优惠券');
        } else {
            this.props.onReleaseCouponModalOk(this.state.promoIds);
        }
    }

    handleCancel() {
        this.props.onReleaseCouponModalCancel();
    }

    render() {
        const { data, total } = this.props.couponsList;
        const { pageNum, pageSize, promoIds } = this.state;
        const rowSelection = {
            selectedRowKeys: promoIds,
            onChange: this.onSelectChange
        };
        columns[columns.length - 1].render = this.renderOperations;
        return (
            <Modal
                title="选择优惠券类型"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                width={1200}
            >
                <SearchForm
                    visible={this.props.visible}
                    onCouponSearch={this.handleCouponSearch}
                    onCouponReset={this.handleCouponReset}
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
                        current: this.state.current,
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
    queryAliveCouponsList: PropTypes.func,
    clearCouponsList: PropTypes.func,
    onReleaseCouponModalOk: PropTypes.func,
    onReleaseCouponModalCancel: PropTypes.func,
    couponsList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
}

export default withRouter(Form.create()(ReleaseCouponModal));
