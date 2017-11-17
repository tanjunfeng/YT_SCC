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
import { Form, Tabs, Button, message } from 'antd';

import {
    getUsedCouponParticipate,
    getUnUsedCouponParticipate,
    getGarbageCouponParticipate,
    clearUsedCouponPatipate,
    clearUnUsedCouponPatipate,
    clearGarbageCouponPatipate,
    cancelCoupons
} from '../../../actions/promotion';
import TableCouponParticipate from './tableCouponParticipate';
import {
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
    getGarbageCouponParticipate,
    clearUsedCouponPatipate,
    clearUnUsedCouponPatipate,
    clearGarbageCouponPatipate,
    cancelCoupons
}, dispatch))

class TabGroup extends PureComponent {
    state = {
        promotionIds: []
    }

    componentDidMount() {
        this.query();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value.page !== nextProps.value.page) {
            // 切换 tab 时执行查询
            this.query(nextProps.value.page);
        }
    }

    onSelectChange = (promotionIds) => {
        this.setState({ promotionIds });
    }

    getTableValues = (page) => {
        let columns = null;
        let rowKey = 'id';
        const stores = {};
        const {
            usedCouponParticipate,
            unUsedCouponParticipate,
            garbageCouponParticipate
        } = this.props;
        switch (page) {
            case 'used':
                columns = usedParticipateColumns;
                rowKey = 'orderId';
                Object.assign(stores, {
                    ...usedCouponParticipate
                });
                break;
            case 'unused':
                columns = unUsedParticipateColumns;
                Object.assign(stores, {
                    ...unUsedCouponParticipate,
                    rowSelection: {
                        selectedRowKeys: this.state.promotionIds,
                        onChange: this.onSelectChange,
                    }
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
        return { ...stores, columns, current: this.current, rowKey };
    }

    handleTabChange = (key) => {
        this.props.onChange(key); // 通知页面已发生改变
    }

    /**
     * 查询当页数据
     *
     * @param {*string} page 页码
     */
    query = (page = this.props.value.page) => {
        const param = this.props.value.param;
        switch (page) {
            case 'used':
                this.props.clearUnUsedCouponPatipate();
                this.props.clearGarbageCouponPatipate();
                this.props.getUsedCouponParticipate(param).then((data) => {
                    const { pageNum, pageSize } = data.data;
                    Object.assign(param, { pageNum, pageSize });
                });
                break;
            case 'unused':
                this.props.clearUsedCouponPatipate();
                this.props.clearGarbageCouponPatipate();
                this.props.getUnUsedCouponParticipate(param).then((data) => {
                    const { pageNum, pageSize } = data.data;
                    Object.assign(param, { pageNum, pageSize });
                });
                break;
            case 'garbage':
                this.props.clearUsedCouponPatipate();
                this.props.clearUnUsedCouponPatipate();
                this.props.getGarbageCouponParticipate(param).then((data) => {
                    const { pageNum, pageSize } = data.data;
                    Object.assign(param, { pageNum, pageSize });
                });
                break;
            default: break;
        }
    }

    handlePageNumChange = (pageNum) => {
        this.props.onPageNumChange(pageNum);
        this.query();
    }

    handleGarbage = () => {
        const { promotionIds } = this.state;
        this.props.cancelCoupons({ couponActivityIds: promotionIds.join(',') }).then((res) => {
            if (res.code === 200) {
                message.success(res.message);
                this.query();
            }
        })
    }

    /**
     * 选中的未使用券
     */
    handleUnUsedSelect = (promotionIds) => {
        this.setState({ promotionIds })
    }

    garbageButton = () => {
        if (this.props.value.page === 'unused') {
            return (
                <Button
                    type="primary"
                    size="default"
                    disabled={this.state.promotionIds.length === 0}
                    onClick={this.handleGarbage}
                >
                    作废
                </Button>
            );
        }
        return null;
    }

    render() {
        const { page } = this.props.value;
        return (
            <Tabs
                defaultActiveKey={page}
                onChange={this.handleTabChange}
                tabBarExtraContent={this.garbageButton()}
            >
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
                        onSelect={this.handleUnUsedSelect}
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
    getUsedCouponParticipate: PropTypes.func,
    getUnUsedCouponParticipate: PropTypes.func,
    getGarbageCouponParticipate: PropTypes.func,
    clearUsedCouponPatipate: PropTypes.func,
    clearUnUsedCouponPatipate: PropTypes.func,
    clearGarbageCouponPatipate: PropTypes.func,
    onChange: PropTypes.func,
    onPageNumChange: PropTypes.func,
    cancelCoupons: PropTypes.func,
    value: PropTypes.objectOf(PropTypes.any),
    usedCouponParticipate: PropTypes.objectOf(PropTypes.any),
    unUsedCouponParticipate: PropTypes.objectOf(PropTypes.any),
    garbageCouponParticipate: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(TabGroup));
