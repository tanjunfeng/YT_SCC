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
    getUsedCouponParticipate,
    getUnUsedCouponParticipate,
    clearUsedCouponPatipate,
    clearUnUsedCouponPatipate
} from '../../../actions/promotion';
import { exportParticipateData1, exportParticipateData2 } from '../../../service';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import {
    usedParticipateList as usedColumns,
    unUsedParticipateList as unUsedColumns
} from '../columns';
import Util from '../../../util/util';

const TabPane = Tabs.TabPane;

@connect(state => ({
    usedCouponParticipate: state.toJS().promotion.usedCouponParticipate,
    unUsedCouponParticipate: state.toJS().promotion.unUsedCouponParticipate
}), dispatch => bindActionCreators({
    getUsedCouponParticipate,
    getUnUsedCouponParticipate,
    clearUsedCouponPatipate,
    clearUnUsedCouponPatipate
}, dispatch))

class CouponsParticipate extends PureComponent {
    constructor(props) {
        super(props);
        this.PROMOTION_ID = this.props.match.params.id;
        this.PROMOTION_NAME = this.props.match.params.promotionName;
        this.handleParticipateSearch = this.handleParticipateSearch.bind(this);
        this.handleParticipateReset = this.handleParticipateReset.bind(this);
        this.handleParticipateExport = this.handleParticipateExport.bind(this);
        this.onPaginate = this.onPaginate.bind(this);
        this.onPaginateUnUsed = this.onPaginateUnUsed.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.query = this.query.bind(this);
        this.state = {
            tabPage: '1'
        };
        this.current = 1;
        this.currentUnUnsed = 1;
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            promoId: this.PROMOTION_ID
        };
        this.paramUnUsed = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            promoId: this.PROMOTION_ID
        };
    }

    componentDidMount() {
        this.query();
    }

    componentWillUnmount() {
        this.props.clearUsedCouponPatipate();
        this.props.clearUnUsedCouponPatipate();
    }

    /**
     * Tab1 - 分页页码改变的回调
     */
    onPaginate = (pageNum) => {
        Object.assign(this.param, { pageNum });
        this.current = pageNum;
        this.query('used');
    }

    /**
     *  Tab2 - 分页页码改变的回调
     */
    onPaginateUnUsed = (pageNum) => {
        Object.assign(this.paramUnUsed, { pageNum });
        this.currentUnUnsed = pageNum;
        this.query('unUsed');
    }

    handleTabChange(key) {
        this.setState({ tabPage: key });
    }

    query(tab) {
        const queryUsed = () => {
            this.props.getUsedCouponParticipate(this.param).then((data) => {
                const { pageNum, pageSize } = data.data;
                Object.assign(this.param, { pageNum, pageSize });
            });
        };
        const queryUnUsed = () => {
            this.props.getUnUsedCouponParticipate(this.paramUnUsed).then((data) => {
                const { pageNum, pageSize } = data.data;
                Object.assign(this.paramUnUsed, { pageNum, pageSize });
            });
        };
        switch (tab) {
            case 'used':
                queryUsed();
                break;
            case 'unUsed':
                queryUnUsed();
                break;
            default:
                queryUsed();
                queryUnUsed();
                break;
        }
    }

    handleParticipateSearch(param) {
        this.handleParticipateReset();
        this.param = {
            ...param,
            ...this.param
        };
        this.paramUnUsed = this.param;
        this.query();
    }

    handleParticipateReset() {
        // 重置检索条件
        this.param = {
            promoId: this.PROMOTION_ID,
            pageNum: 1,
            pageSize: PAGE_SIZE
        };
        this.current = 1;
        this.currentUnUnsed = 1;
        this.paramUnUsed = this.param;
    }

    handleParticipateExport(param) {
        const condition = {
            promoId: this.PROMOTION_ID,
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
            participateDataDtoPageResult = {}
        } = this.props.usedCouponParticipate;
        const { total, pageNum, pageSize } = participateDataDtoPageResult;
        console.log(participateDataDtoPageResult)
        return (
            <div>
                <SearchForm
                    onParticipateSearch={this.handleParticipateSearch}
                    onParticipateReset={this.handleParticipateReset}
                    onParticipateExport={this.handleParticipateExport}
                />
                <h2>
                    <span>活动ID：{this.PROMOTION_ID}</span>
                    <span style={{ paddingLeft: 10 }}>活动名称：{this.PROMOTION_NAME}</span>
                </h2>
                <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
                    <TabPane tab="已使用" key="1">
                        <Table
                            dataSource={this.props.usedCouponParticipate.data}
                            columns={usedColumns}
                            rowKey="orderId"
                            scroll={{
                                x: 1400
                            }}
                            bordered
                            pagination={{
                                current: this.current,
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
                            dataSource={this.props.unUsedCouponParticipate.data}
                            columns={unUsedColumns}
                            rowKey="id"
                            scroll={{
                                x: 1400
                            }}
                            bordered
                            pagination={{
                                current: this.currentUnUnsed,
                                pageNum: this.paramUnUsed.pageNum,
                                pageSize: this.paramUnUsed.pageSize,
                                total: this.props.unUsedCouponParticipate.total,
                                showQuickJumper: true,
                                onChange: this.onPaginateUnUsed
                            }}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

CouponsParticipate.propTypes = {
    getUsedCouponParticipate: PropTypes.func,
    getUnUsedCouponParticipate: PropTypes.func,
    clearUsedCouponPatipate: PropTypes.func,
    clearUnUsedCouponPatipate: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any),
    usedCouponParticipate: PropTypes.objectOf(PropTypes.any),
    unUsedCouponParticipate: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(CouponsParticipate));
