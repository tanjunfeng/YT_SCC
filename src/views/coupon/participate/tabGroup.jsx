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
import {
    usedParticipateList as usedColumns,
    unUsedParticipateList as unUsedColumns,
    invalidRecordList as invalidRecordColumns
} from '../columns';

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
