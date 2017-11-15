/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 促销管理 - 查询参与数据
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Form } from 'antd';

import TabGroup from './tabGroup';
import SearchForm from './searchForm';

class CouponsParticipate extends PureComponent {
    state = {
        page: 'used' // 默认打开已使用优惠券
    }

    handleTabChange = (key) => {
        this.setState({ page: key });
    }

    handleSearch = () => {
    }

    handleReset() {
    }

    handleExport() {
    }

    render() {
        const { page } = this.state;
        return (
            <div>
                <SearchForm
                    value={page}
                    onSearch={this.handleSearch}
                    onReset={this.handleReset}
                    onExport={this.handleExport}
                />
                <h2>
                    <span>活动ID：{this.PROMOTION_ID}</span>
                    <span style={{ paddingLeft: 10 }}>活动名称：{this.PROMOTION_NAME}</span>
                </h2>
                <TabGroup
                    value={page}
                />
            </div>
        );
    }
}

export default withRouter(Form.create()(CouponsParticipate));
