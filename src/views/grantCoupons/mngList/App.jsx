/*
 * @Author: tanjf
 * @Description: 促销管理 - 优惠券列表
 * @CreateDate: 2017-09-20 14:09:43
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-09-21 14:46:51
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Table, Form } from 'antd';
import {
    getPromotionList,
    clearPromotionList,
    updatePromotionStatus
} from '../../../actions/promotion';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';

// 发放优惠券列表
const columns = [{
    title: '加盟商编号',
    dataIndex: 'franchiseeId',
    key: 'franchiseeId',
    render: note => note || '无'
}, {
    title: '加盟商名称',
    dataIndex: 'franchinessController',
    key: 'franchinessController',
    render: note => note || '无'
}, {
    title: '门店编号',
    dataIndex: 'storeId',
    key: 'storeId',
    render: note => note || '无'
}, {
    title: '门店名称',
    dataIndex: 'storeName',
    key: 'storeName',
    render: note => note || '无'
}, {
    title: '加盟商姓名',
    dataIndex: 'proName',
    key: 'proName',
    render: note => note || '无'
}, {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone',
    render: note => note || '无'
}, {
    title: '所属子公司',
    dataIndex: 'branchCompanyId',
    key: 'branchCompanyId',
    render: note => note || '无'
}];

@connect(state => ({
    promotionList: state.toJS().promotion.list
}), dispatch => bindActionCreators({
    getPromotionList,
    clearPromotionList,
    updatePromotionStatus
}, dispatch))

class GrantCouponList extends PureComponent {
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
        const param = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            selectedRowKeys: this.state.choose,
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
            <div>
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
            </div>
        );
    }
}

GrantCouponList.propTypes = {
    getPromotionList: PropTypes.func,
    clearPromotionList: PropTypes.func,
    promotionList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
}

export default withRouter(Form.create()(GrantCouponList));
