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
import { Table, Form, Tabs, Button, message } from 'antd';

import {
    getUsedCouponParticipate,
    getUnUsedCouponParticipate,
    clearUsedCouponPatipate,
    clearUnUsedCouponPatipate,
    cancelCoupons
} from '../../../actions/promotion';
import { exportParticipateData1, exportParticipateData2 } from '../../../service';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import {
    usedParticipateList as usedColumns,
    unUsedParticipateList as unUsedColumns,
    invalidRecordList as invalidRecordColumns
} from '../columns';
import Util from '../../../util/util';

const TabPane = Tabs.TabPane;

@connect(state => ({
    usedCouponParticipate: state.toJS().promotion.usedCouponParticipate,
    invalidRecordList: state.toJS().promotion.invalidRecordList,
    unUsedCouponParticipate: state.toJS().promotion.unUsedCouponParticipate
}), dispatch => bindActionCreators({
    getUsedCouponParticipate,
    getUnUsedCouponParticipate,
    clearUsedCouponPatipate,
    clearUnUsedCouponPatipate,
    cancelCoupons
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
            tabPage: '1',
            selectedListData: []
        };
        this.current = 1;
        this.tabKey = false;
        this.currentUnUnsed = 1;
        this.currentInvalidRecord = 1;
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            promoId: this.PROMOTION_ID
        };
        this.paramUnUsed = {
            queryType: 1,
            pageNum: 1,
            pageSize: PAGE_SIZE,
            promoId: this.PROMOTION_ID
        };
        this.invalidRecord = {
            queryType: 2,
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
    /**
     *  Tab3 - 分页页码改变的回调
     */
    onPaginateToVoid = (pageNum) => {
        Object.assign(this.invalidRecord, { pageNum });
        this.currentInvalidRecord = pageNum;
        this.query('invalidRecord');
    }

    handleTabChange(key) {
        this.setState({ tabPage: key });
        switch (key) {
            case '1':
                this.queryUsed();
                break;
            case '2':
                this.queryUnUsed();
                break;
            case '3':
                this.queryinvalidRecord();
                break;
            default:
                break;
        }
    }

    queryUsed = () => {
        this.props.getUsedCouponParticipate(this.param).then((data) => {
            const { pageNum, pageSize } = data.data;
            Object.assign(this.param, { pageNum, pageSize });
        });
    }

    queryUnUsed = () => {
        this.props.getUnUsedCouponParticipate(this.paramUnUsed).then((data) => {
            const { pageNum, pageSize } = data.data;
            Object.assign(this.paramUnUsed, { pageNum, pageSize });
        });
    }

    queryinvalidRecord = () => {
        this.props.getUnUsedCouponParticipate(this.invalidRecord).then((data) => {
            const { pageNum, pageSize } = data.data;
            Object.assign(this.invalidRecord, { pageNum, pageSize });
        });
    }

    query(tab) {
        switch (tab) {
            case 'used':
                this.queryUsed();
                this.tabKey = false;
                break;
            case 'unUsed':
                this.queryUnUsed();
                this.tabKey = false;
                break;
            case 'invalidRecord':
                this.queryinvalidRecord();
                this.tabKey = false;
                break;
            default:
                this.queryUsed();
                this.queryUnUsed();
                this.queryinvalidRecord();
                break;
        }
    }

    handleCanceled = () => {
        const { selectedListData } = this.state;
        const cancelCouponsList = [];
        selectedListData.forEach((item) => {
            cancelCouponsList.push(item.id)
        })
        this.props.cancelCoupons({ couponActivityIds: cancelCouponsList.join(',') }).then((res) => {
            if (res.code === 200) {
                message.error(res.message);
                this.queryUnUsed();
            }
        })
    }

    handleParticipateSearch(param) {
        this.handleParticipateReset();
        this.param = {
            ...param,
            ...this.param
        };
        this.paramUnUsed = {
            ...param,
            ...this.paramUnUsed
        };
        this.invalidRecord = {
            ...param,
            ...this.invalidRecord
        };
        this.query();
    }

    handleParticipateReset() {
        // 重置检索条件
        this.param = {
            promoId: this.PROMOTION_ID,
            pageNum: 1,
            pageSize: PAGE_SIZE
        };
        this.paramUnUsed = {
            queryType: 1,
            promoId: this.PROMOTION_ID,
            pageNum: 1,
            pageSize: PAGE_SIZE
        };
        this.invalidRecord = {
            queryType: 2,
            promoId: this.PROMOTION_ID,
            pageNum: 1,
            pageSize: PAGE_SIZE
        };
        this.current = 1;
        this.currentUnUnsed = 1;
        this.currentInvalidRecord = 1;
    }

    handleParticipateExport(param) {
        const condition = {
            promoId: this.PROMOTION_ID,
            ...param
        };
        if (this.state.tabPage === '1') {
            Util.exportExcel(exportParticipateData1, condition);
        } else if (this.state.tabPage === '2') {
            Util.exportExcel(exportParticipateData2, {condition, queryType: 1});
        } else {
            Util.exportExcel(exportParticipateData2, {condition, queryType: 2});
        }
    }

    render() {
        const {
            participateDataDtoPageResult = {}
        } = this.props.usedCouponParticipate;
        const { total, pageNum, pageSize } = participateDataDtoPageResult;
        const rowSelection = {
            selectedRowKeys: this.state.chooseGoodsList,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    chooseGoodsList: selectedRowKeys,
                    selectedListData: selectedRows
                })
            },
        };
        return (
            <div>
                <SearchForm
                    value={this.tabKey}
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
                        <Button
                            className="Unused-button"
                            type="primary"
                            size="default"
                            onClick={this.handleCanceled}
                            style={{ float: 'right', marginTop: '-50px' }}
                        >
                            作废
                        </Button>
                        <Table
                            rowSelection={rowSelection}
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
                    <TabPane tab="作废记录" key="3">
                        <Table
                            dataSource={this.props.unUsedCouponParticipate.data}
                            columns={invalidRecordColumns}
                            rowKey="id"
                            scroll={{
                                x: 1400
                            }}
                            bordered
                            pagination={{
                                current: this.currentInvalidRecord,
                                pageNum: this.invalidRecord.pageNum,
                                pageSize: this.invalidRecord.pageSize,
                                total: this.props.unUsedCouponParticipate.total,
                                showQuickJumper: true,
                                onChange: this.onPaginateToVoid
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
    invalidRecordList: PropTypes.func,
    cancelCoupons: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any),
    usedCouponParticipate: PropTypes.objectOf(PropTypes.any),
    unUsedCouponParticipate: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(CouponsParticipate));
