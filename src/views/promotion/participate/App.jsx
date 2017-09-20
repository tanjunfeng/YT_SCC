/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 促销管理 - 查询参与数据
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
import { managementList as columns } from '../columns';

@connect(state => ({
    promotionList: state.toJS().promotion.list
}), dispatch => bindActionCreators({
    getPromotionList,
    clearPromotionList,
    updatePromotionStatus
}, dispatch))

class PromotionParticipate extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        };
        this.handleParticipateSearch = this.handleParticipateSearch.bind(this);
        this.handleParticipateReset = this.handleParticipateReset.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.renderOperations = this.renderOperations.bind(this);
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
        this.setState({ pageNum });
        this.query();
    }

    query(condition) {
        const param = {
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            ...condition
        };
        this.props.getPromotionList(param).then((data) => {
            const { pageNum, pageSize } = data.data;
            this.setState({ pageNum, pageSize });
        });
    }

    handleParticipateSearch(param) {
        this.query(param);
    }

    handleParticipateReset() {
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

    render() {
        const { data, total } = this.props.promotionList;
        const { pageNum, pageSize } = this.state;
        return (
            <div>
                <SearchForm
                    onParticipateSearch={this.handleParticipateSearch}
                    onParticipateReset={this.handleParticipateReset}
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

PromotionParticipate.propTypes = {
    getPromotionList: PropTypes.func,
    clearPromotionList: PropTypes.func,
    updatePromotionStatus: PropTypes.func,
    promotionList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
}

export default withRouter(Form.create()(PromotionParticipate));
