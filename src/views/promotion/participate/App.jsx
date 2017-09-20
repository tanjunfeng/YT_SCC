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
    getParticipateList,
    clearParticipateList
} from '../../../actions/promotion';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { participateList as columns } from '../columns';

@connect(state => ({
    participates: state.toJS().promotion.participates
}), dispatch => bindActionCreators({
    getParticipateList,
    clearParticipateList
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
        this.query = this.query.bind(this);
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.query({ promoId: id });
    }

    componentWillUnmount() {
        this.props.clearParticipateList();
    }

    /**
     * 分页页码改变的回调
     */
    onPaginate = (pageNum) => {
        this.query({ page: pageNum });
    }

    query(condition) {
        const param = {
            page: this.state.pageNum,
            pageSize: this.state.pageSize,
            ...condition
        };
        this.props.getParticipateList(param).then((data) => {
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

    render() {
        const { data, total } = this.props.participates;
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
    getParticipateList: PropTypes.func,
    clearParticipateList: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any),
    participates: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
}

export default withRouter(Form.create()(PromotionParticipate));
