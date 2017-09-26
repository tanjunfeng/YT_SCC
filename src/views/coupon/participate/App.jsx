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
import { Table, Form, Tabs } from 'antd';

import {
    getParticipate,
    getParticipate2,
    clearParticipate
} from '../../../actions/promotion';
import { exportParticipateData1, exportParticipateData2 } from '../../../service';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import {
    participateList as columns,
    participateListTab2 as columns2
} from '../columns';
import Util from '../../../util/util';

const TabPane = Tabs.TabPane;

@connect(state => ({
    participate: state.toJS().promotion.participate,
    participate2: state.toJS().promotion.participate2
}), dispatch => bindActionCreators({
    getParticipate,
    clearParticipate,
    getParticipate2
}, dispatch))

class CouponsParticipate extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            pageNum1: 1,
            pageSize1: PAGE_SIZE,
            tabPage: '1'
        };
        this.promoId = this.props.match.params.id;
        this.handleParticipateSearch = this.handleParticipateSearch.bind(this);
        this.handleParticipateReset = this.handleParticipateReset.bind(this);
        this.handleParticipateExport = this.handleParticipateExport.bind(this);
        this.onPaginate = this.onPaginate.bind(this);
        this.onPaginate1 = this.onPaginate1.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.query = this.query.bind(this);
    }

    componentDidMount() {
        this.query();
    }

    componentWillUnmount() {
        this.props.clearParticipate();
    }

    /**
     * Tab1 - 分页页码改变的回调
     */
    onPaginate = (pageNum) => {
        this.query({ page: pageNum });
    }

    /**
     *  Tab2 - 分页页码改变的回调
     */
    onPaginate1 = (pageNum) => {
        this.query({ page: pageNum });
    }

    handleTabChange(key) {
        this.setState({tabPage: key});
    }

    query(condition) {
        const param = {
            page: this.state.pageNum,
            pageSize: this.state.pageSize,
            promoId: this.promoId,
            ...condition
        };
        this.props.getParticipate(param).then((data) => {
            const { pageNum, pageSize } = data.data;
            this.setState({ pageNum, pageSize });
        });
        this.props.getParticipate2(param).then((data) => {
            const { pageNum, pageSize } = data.data;
            this.setState({ pageNum1: pageNum, pageSize1: pageSize });
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

    handleParticipateExport(param) {
        const condition = {
            page: this.state.pageNum,
            pageSize: this.state.pageSize,
            promoId: this.promoId,
            ...param
        };
        if (this.state.tabPage === '1') {
            Util.exportExcel(exportParticipateData1, condition);
        } else {
            Util.exportExcel(exportParticipateData2, condition);
        }
    }

    render() {
        const {
            participateDataDtoPageResult = {},
        } = this.props.participate;
        const { total } = participateDataDtoPageResult;
        const { pageNum, pageSize, pageNum1, pageSize1, } = this.state;
        const { data } = this.props.participate2;
        // const { promotionName } = data;
        return (
            <div>
                <SearchForm
                    onParticipateSearch={this.handleParticipateSearch}
                    onParticipateReset={this.handleParticipateReset}
                    onParticipateExport={this.handleParticipateExport}
                />
                <h2>
                    活动ID：{this.props.match.params.id}
                    活动名称：{1}
                </h2>
                <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
                    <TabPane tab="已使用" key="1">
                        <Table
                            dataSource={this.props.participate.data}
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
                    </TabPane>
                    <TabPane tab="未使用" key="2">
                        <Table
                            dataSource={this.props.participate2.data}
                            columns={columns2}
                            rowKey="id"
                            scroll={{
                                x: 1400
                            }}
                            bordered
                            pagination={{
                                pageNum1,
                                pageSize1,
                                total: this.props.participate2.total,
                                showQuickJumper: true,
                                onChange: this.onPaginate1
                            }}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

CouponsParticipate.propTypes = {
    getParticipate: PropTypes.func,
    getParticipate2: PropTypes.func,
    clearParticipate: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any),
    participate: PropTypes.objectOf(PropTypes.any),
    participate2: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(CouponsParticipate));
