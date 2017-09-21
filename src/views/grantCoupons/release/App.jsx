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
    getPromotionList,
    clearPromotionList,
    updatePromotionStatus
} from '../../../actions/promotion';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { grantCouponsColumns as columns } from '../columns';

@connect(state => ({
    promotionList: state.toJS().promotion.list
}), dispatch => bindActionCreators({
    getPromotionList,
    clearPromotionList,
    updatePromotionStatus
}, dispatch))

class ReleaseCouponModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            choose: [],
        };
        this.selectedRowKeys = [];
        this.handlePromotionSearch = this.handlePromotionSearch.bind(this);
        this.handlePromotionReset = this.handlePromotionReset.bind(this);
        this.query = this.query.bind(this);
    }

    componentWillMount() {
        this.props.clearPromotionList();
    }

    componentDidMount() {
        this.query();
    }

    componentWillUnmount() {
        this.props.clearPromotionList();
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
                choose: selectedRowKeys,
            });
        }
    }

    query(condition) {
        const choose = [];
        choose.push(this.state.choose);
        const param = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            choose,
            ...condition
        }
        this.props.getPromotionList(param).then((data) => {
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

    render() {
        const { data, total } = this.props.promotionList;
        const { pageNum, pageSize } = this.state;
        columns[columns.length - 1].render = this.renderOperations;
        return (
            <Modal
                title="选择区域"
                visible={this.props.isSelectorVisible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <SearchForm
                    onPromotionSearch={this.handlePromotionSearch}
                    onPromotionReset={this.handlePromotionReset}
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
    getPromotionList: PropTypes.func,
    clearPromotionList: PropTypes.func,
    promotionList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
}

export default withRouter(Form.create()(ReleaseCouponModal));
