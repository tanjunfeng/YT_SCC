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
import { Form, Tabs } from 'antd';

import {
    getUsedCouponParticipate,
    getUnUsedCouponParticipate,
    clearUsedCouponPatipate,
    clearUnUsedCouponPatipate,
    cancelCoupons
} from '../../../actions/promotion';

import { PAGE_SIZE } from '../../../constant';
import TableCouponParticipate from './tableCouponParticipate'; import {
    usedParticipateColumns,
    unUsedParticipateColumns,
    garbageParticipateColumns
} from '../columns';

const TabPane = Tabs.TabPane;

@connect(state => ({
    usedCouponParticipate: state.toJS().promotion.usedCouponParticipate,
    unUsedCouponParticipate: state.toJS().promotion.unUsedCouponParticipate,
    garbageCouponParticipate: state.toJS().promotion.garbageCouponParticipate
}), dispatch => bindActionCreators({
    getUsedCouponParticipate,
    getUnUsedCouponParticipate,
    clearUsedCouponPatipate,
    clearUnUsedCouponPatipate,
    cancelCoupons
}, dispatch))

class TabGroup extends PureComponent {
    getTableValues = (page) => {
        let columns = [];
        const stores = {};
        const {
            usedCouponParticipate,
            unUsedCouponParticipate,
            garbageCouponParticipate
        } = this.props;
        switch (page) {
            case 'used':
                columns = usedParticipateColumns;
                Object.assign(stores, {
                    ...usedCouponParticipate
                });
                break;
            case 'unused':
                columns = unUsedParticipateColumns;
                Object.assign(stores, {
                    ...unUsedCouponParticipate
                });
                break;
            case 'garbage':
                columns = garbageParticipateColumns;
                Object.assign(stores, {
                    ...garbageCouponParticipate
                });
                break;
            default: break;
        }
        return { ...stores, columns, current: this.current };
    }

    PROMOTION_ID = this.props.match.params.id;
    current = 1;
    param = {
        promoId: this.PROMOTION_ID,
        pageNum: 1,
        pageSize: PAGE_SIZE
    };

    handleTabChange = (key) => {
        this.onChange(key); // 通知页面已发生改变
    }

    handlePageNumChange = (pageNum) => {
        Object.assign(this.param, { pageNum });
        this.current = pageNum;
        // todo: 执行查询一次
    }

    render() {
        const { page } = this.props;
        return (
            <Tabs defaultActiveKey={page} onChange={this.handleTabChange}>
                <TabPane tab="已使用" key="used">
                    <TableCouponParticipate
                        value={this.getTableValues('used')}
                        onChange={this.handlePageNumChange}
                    />
                </TabPane>
                <TabPane tab="未使用" key="unused">
                    <TableCouponParticipate
                        value={this.getTableValues('unused')}
                        onChange={this.handlePageNumChange}
                    />
                </TabPane>
                <TabPane tab="已作废" key="garbage">
                    <TableCouponParticipate
                        value={this.getTableValues('garbage')}
                        onChange={this.handlePageNumChange}
                    />
                </TabPane>
            </Tabs>
        );
    }
}

TabGroup.propTypes = {
    page: PropTypes.string,
    match: PropTypes.objectOf(PropTypes.any),
    usedCouponParticipate: PropTypes.objectOf(PropTypes.any),
    unUsedCouponParticipate: PropTypes.objectOf(PropTypes.any),
    garbageCouponParticipate: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(TabGroup));
