/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 促销管理 - 查询参与数据
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Form } from 'antd';

import { PAGE_SIZE } from '../../../constant';
import TabGroup from './tabGroup';
import SearchForm from './searchForm';

class CouponsParticipate extends PureComponent {
    state = {
        page: 'used', // 默认打开已使用优惠券
        current: 1, // 当前页码
        // 表单请求参数列表
        param: {
            promoId: this.PROMOTION_ID,
            pageNum: 1,
            pageSize: PAGE_SIZE
        }
    }

    getSearchFormValue = () => {
        const value = {
            PROMOTION_ID: this.PROMOTION_ID
        };
        const { page } = this.state;
        return Object.assign(value, { page });
    }

    PROMOTION_ID = this.props.match.params.id;

    handleSearch = (param) => {
        this.handleReset();
        this.setState({
            param: { ...param, ...this.state.param }
        });
    }

    handleReset = () => {
        // 重置检索条件
        this.setState({
            param: {
                promoId: this.PROMOTION_ID,
                pageNum: 1,
                pageSize: PAGE_SIZE
            },
            current: 1
        });
    }

    handleExport = () => {
    }

    handleTabChange = (page) => {
        this.setState({ page });
    }

    render() {
        return (
            <div>
                <SearchForm
                    value={this.getSearchFormValue()}
                    onSearch={this.handleSearch}
                    onReset={this.handleReset}
                    onExport={this.handleExport}
                />
                <h2>
                    <span>活动ID：{this.PROMOTION_ID}</span>
                    <span style={{ paddingLeft: 10 }}>活动名称：{this.PROMOTION_NAME}</span>
                </h2>
                <TabGroup
                    value={{ ...this.state }}
                    onChange={this.handleTabChange}
                />
            </div>
        );
    }
}

CouponsParticipate.propTypes = {
    match: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(CouponsParticipate));
