/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 优惠券 - 参与数据 tab 页的抽离
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Table, Form, Button, Tabs } from 'antd';

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

class TabGroup extends PureComponent {
    handleTabChange = (key) => {
        this.setState({ tabPage: key });
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
            }
        };
        return (
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
                        className="unused-button"
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
        );
    }
}

TabGroup.propTypes = {
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

export default withRouter(Form.create()(TabGroup));
