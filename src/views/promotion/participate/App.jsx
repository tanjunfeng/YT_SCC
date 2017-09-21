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
    getParticipate,
    clearParticipate
} from '../../../actions/promotion';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { participateList as columns } from '../columns';

@connect(state => ({
    participate: state.toJS().promotion.participate
}), dispatch => bindActionCreators({
    getParticipate,
    clearParticipate
}, dispatch))

class PromotionParticipate extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        };
        this.promoId = this.props.match.params.id;
        this.handleParticipateSearch = this.handleParticipateSearch.bind(this);
        this.handleParticipateReset = this.handleParticipateReset.bind(this);
        this.onPaginate = this.onPaginate.bind(this);
        this.query = this.query.bind(this);
    }

    componentDidMount() {
        this.query();
    }

    componentWillUnmount() {
        this.props.clearParticipate();
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
            promoId: this.promoId,
            ...condition
        };
        this.props.getParticipate(param).then((data) => {
            const { pageNum, pageSize } = data.data.participateDataDtoPageResult;
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
        const { participateDataDtoPageResult = {}, promotionName } = this.props.participate;
        const { data, total } = participateDataDtoPageResult;
        const { pageNum, pageSize } = this.state;
        return (
            <div>
                <SearchForm
                    onParticipateSearch={this.handleParticipateSearch}
                    onParticipateReset={this.handleParticipateReset}
                />
                <h2>活动ID：{this.props.match.params.id}    活动名称：{promotionName}</h2>
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="orderId"
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
    getParticipate: PropTypes.func,
    clearParticipate: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any),
    participate: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(PromotionParticipate));
