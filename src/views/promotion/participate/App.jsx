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
    getPromotionParticipate,
    clearPromotionParticipate
} from '../../../actions/promotion';
import { exportParticipateData } from '../../../service';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { participateList as columns } from '../columns';
import Util from '../../../util/util';

@connect(state => ({
    participate: state.toJS().promotion.promotionParticipate
}), dispatch => bindActionCreators({
    getPromotionParticipate,
    clearPromotionParticipate
}, dispatch))

class PromotionParticipate extends PureComponent {
    constructor(props) {
        super(props);
        this.param = {};
        this.PROMOTION_ID = this.props.match.params.id;
        this.handleParticipateSearch = this.handleParticipateSearch.bind(this);
        this.handleParticipateReset = this.handleParticipateReset.bind(this);
        this.handleParticipateExport = this.handleParticipateExport.bind(this);
        this.onPaginate = this.onPaginate.bind(this);
        this.query = this.query.bind(this);
    }

    componentDidMount() {
        this.handleParticipateReset();
        this.query();
    }

    componentWillUnmount() {
        this.props.clearPromotionParticipate();
    }

    /**
     * 分页页码改变的回调
     */
    onPaginate = (pageNum) => {
        Object.assign(this.param, { pageNum });
        this.query();
    }

    query() {
        this.props.getPromotionParticipate(this.param).then(data => {
            const { total, pageNum, pageSize } = data.data.participateDataDtoPageResult;
            Object.assign(this.param, { total, pageNum, pageSize });
        });
    }

    handleParticipateSearch(param) {
        Object.assign(this.param, param);
        this.query();
    }

    handleParticipateReset() {
        // 重置检索条件
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            promoId: this.PROMOTION_ID,
        }
    }

    handleParticipateExport(param) {
        Object.assign(this.param, param);
        Util.exportExcel(exportParticipateData, this.param);
    }

    render() {
        const { participateDataDtoPageResult = {}, promotionName } = this.props.participate;
        const { data, total, pageNum, pageSize } = participateDataDtoPageResult;
        return (
            <div>
                <SearchForm
                    onParticipateSearch={this.handleParticipateSearch}
                    onParticipateReset={this.handleParticipateReset}
                    onParticipateExport={this.handleParticipateExport}
                />
                <h2>活动ID：{this.PROMOTION_ID}    活动名称：{promotionName}</h2>
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
    getPromotionParticipate: PropTypes.func,
    clearPromotionParticipate: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any),
    participate: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(PromotionParticipate));
