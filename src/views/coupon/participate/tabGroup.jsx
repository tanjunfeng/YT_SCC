/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 优惠券 - 参与数据 tab 页的抽离
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Form, Tabs } from 'antd';

import TableCouponParticipate from './tableCouponParticipate';

const TabPane = Tabs.TabPane;

class TabGroup extends PureComponent {
    render() {
        return (
            <Tabs defaultActiveKey="used" onChange={this.handleTabChange}>
                <TabPane tab="已使用" key="used">
                    <TableCouponParticipate />
                </TabPane>
                <TabPane tab="未使用" key="unused">
                    <TableCouponParticipate />
                </TabPane>
                <TabPane tab="已作废" key="garbage">
                    <TableCouponParticipate />
                </TabPane>
            </Tabs>
        );
    }
}

TabGroup.propTypes = {
}

export default withRouter(Form.create()(TabGroup));
