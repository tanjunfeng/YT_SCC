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

import Util from '../../../util/util';
import { usedParticipateData, unusedParticipateData } from '../../../service';
import { PAGE_SIZE } from '../../../constant';
import SearchForm from './searchForm';
import TabGroup from './tabGroup';

class CouponsParticipate extends PureComponent {
    state = {
        page: 'used', // 默认打开已使用优惠券
        shouldSearch: false // 是否触发一次搜索
    }

    /**
     * 合并 param 和 condition 作为表格查询的条件
     */
    getTabGroupValue = () => {
        const value = { ...this.state, current: this.current };
        Object.assign(value, {
            param: { ...this.param }
        });
        return value;
    }

    current = 1; // 当前页码
    // 表单请求参数列表
    param = {
        promoId: this.props.match.params.id,
        pageNum: 1,
        pageSize: PAGE_SIZE
    }

    /**
     * 表单选择的查询条件
     */
    handleSearch = (condition) => {
        this.clearPageParams();
        this.param = { ...this.param, ...condition };
        this.setState({
            shouldSearch: true
        }, () => {
            // 触发一次搜索之后子组件就会执行搜索，此时置为 false
            this.setState({ shouldSearch: false });
        });
    }

    /**
     * 清除表格相关查询条件
     */
    clearPageParams = () => {
        this.param = {
            promoId: this.props.match.params.id,
            pageNum: 1,
            pageSize: PAGE_SIZE
        }
        // 重置检索条件
        this.current = 1;
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
    handleExport = (param) => {
        const condition = {
            promoId: this.PROMOTION_ID,
            ...this.param,
            ...param
        };
        const conditionUnused = {
            promoId: this.PROMOTION_ID,
            ...this.param,
            queryType: 1,
            ...param
        };
        const conditionGarbage = {
            promoId: this.PROMOTION_ID,
            ...this.param,
            queryType: 2,
            ...param
        };
        switch (this.state.page) {
            case 'used':
                Util.exportExcel(usedParticipateData, condition);
                break;
            case 'unused':
                Util.exportExcel(unusedParticipateData, conditionUnused);
                break;
            case 'garbage':
                Util.exportExcel(unusedParticipateData, conditionGarbage);
                break;
            default: break;
        }
    }

    /**
     * 切换 Tab 操作
     */
    handleTabChange = (page) => {
        this.clearPageParams();
        // 重置检索条件
        this.setState({
            page,
            shouldSearch: true
        }, () => {
            this.setState({
                shouldSearch: false
            });
        });
    }

    /**
     * 分页查询时回传当前页码
     */
    handlePageNumChange = (pageNum) => {
        Object.assign(this.param, {
            pageNum
        });
        this.current = pageNum;
        this.setState({
            shouldSearch: true
        }, () => {
            // 触发一次搜索之后子组件就会执行搜索，此时置为 false
            this.setState({ shouldSearch: false });
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
