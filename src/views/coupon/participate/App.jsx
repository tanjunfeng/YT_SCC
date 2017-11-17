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
import SearchForm from './searchForm';
import TabGroup from './tabGroup';

class CouponsParticipate extends PureComponent {
    state = {
        page: 'used', // 默认打开已使用优惠券
        current: 1, // 当前页码
        // 表单请求参数列表
        param: {
            promoId: this.props.match.params.id,
            pageNum: 1,
            pageSize: PAGE_SIZE
        },
        shouldSearch: false // 是否触发一次搜索
    }

    /**
     * 合并 param 和 condition 作为表格查询的条件
     */
    getTabGroupValue = () => {
        const value = { ...this.state };
        if (this.condition !== null) {
            Object.assign(value.param, { ...this.condition });
        }
        return value;
    }

    /**
     * 表单选择的查询条件
     */
    handleSearch = (condition) => {
        this.clearPageParams(() => {
            this.condition = { ...condition };
            this.setState({
                param: { ...this.state.param },
                shouldSearch: true
            }, () => {
                // 触发一次搜索之后子组件就会执行搜索，此时置为 false
                this.setState({ shouldSearch: false });
            });
        });
    }

    /**
     * 清除表格相关查询条件
     */
    clearPageParams = (callback) => {
        // 重置检索条件
        this.setState({
            param: {
                promoId: this.props.match.params.id,
                pageNum: 1,
                pageSize: PAGE_SIZE
            },
            current: 1
        }, () => {
            if (typeof callback === 'function') {
                callback();
            }
        });
    }

    /**
     * 清除表单相关查询条件
     */
    clearCondition = () => {
        this.condition = null;
    }

    /**
     * 表单重置时除了 Tab 页不切换，其余参数全部重置
     */
    handleReset = () => {
        this.clearPageParams();
        this.clearCondition();
    }

    /**
     * 导出查询结果
     */
    handleExport = () => {
    }

    /**
     * 切换 Tab 操作
     */
    handleTabChange = (page) => {
        this.clearPageParams(() => {
            this.setState({ page });
        });
    }

    /**
     * 分页查询时回传当前页码
     */
    handlePageNumChange = (pageNum) => {
        const param = { ...this.state.param };
        this.setState({
            param: Object.assign(param, {
                pageNum
            }),
            current: pageNum
        });
    }

    render() {
        return (
            <div>
                <SearchForm
                    value={{ page: this.state.page }}
                    onSearch={this.handleSearch}
                    onReset={this.handleReset}
                    onExport={this.handleExport}
                />
                <h2>
                    <span>活动ID：{this.PROMOTION_ID}</span>
                    <span style={{ paddingLeft: 10 }}>活动名称：{this.PROMOTION_NAME}</span>
                </h2>
                <TabGroup
                    value={this.getTabGroupValue()}
                    onChange={this.handleTabChange}
                    onPageNumChange={this.handlePageNumChange}
                />
            </div>
        );
    }
}

CouponsParticipate.propTypes = {
    match: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(CouponsParticipate));
