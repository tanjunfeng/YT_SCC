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
import { Table, Form } from 'antd';

import {
    getPromotionList,
    clearPromotionList,
    updatePromotionStatus
} from '../../../actions/promotion';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { managementList as columns } from '../columns';

@connect(state => ({
    promotionList: state.toJS().promotion.list
}), dispatch => bindActionCreators({
    getPromotionList,
    clearPromotionList,
    updatePromotionStatus
}, dispatch))

class PromotionParticipate extends PureComponent {
    constructor(props) {
        super(props);
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        };
        this.handlePromotionSearch = this.handlePromotionSearch.bind(this);
        this.handlePromotionReset = this.handlePromotionReset.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.renderOperations = this.renderOperations.bind(this);
        this.query = this.query.bind(this);
    }

    componentWillMount() {
        this.props.clearPromotionList();
    }

    componentDidMount() {
        this.query();
    }

    componentWillUnmount() {
        this.props.clearPromotionList();
    }

    /**
     * 分页页码改变的回调
     */
    onPaginate = (pageNum) => {
        Object.assign(this.param, {
            pageNum
        });
        this.query();
    }

    query() {
        this.props.getPromotionList(this.param).then((data) => {
            const { pageNum, pageSize } = data.data;
            Object.assign(this.param, {
                pageNum, pageSize
            });
        });
    }

    handlePromotionSearch(param) {
        Object.assign(this.param, param);
        this.query();
    }

    handlePromotionReset() {
        // 重置检索条件
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        }
    }

    /**
     * 促销活动表单操作
    *
    * @param {Object} record 传值所有数据对象
    * @param {number} index 下标
    * @param {Object} items 方法属性
    */
    handleSelect(record, index, items) {
        const { key } = items;
        const id = record.id;
        switch (key) {
            case 'publish': // 发布
                this.props.updatePromotionStatus({
                    id,
                    status: 'released'
                }).then(() => {
                    this.query();
                });
                break;
            case 'close':   // 关闭
                this.props.updatePromotionStatus({
                    id,
                    status: 'closed'
                }).then(() => {
                    this.query();
                });
                break;
            default:
                break;
        }
    }

    render() {
        const { data, total } = this.props.promotionList;
        return (
            <div>
                <SearchForm
                    handlePromotionSearch={this.handlePromotionSearch}
                    handlePromotionReset={this.handlePromotionReset}
                />
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="id"
                    scroll={{
                        x: 1400
                    }}
                    bordered
                    pagination={{
                        ...this.param,
                        total,
                        showQuickJumper: true,
                        onChange: this.onPaginate
                    }}
                />
            </div>
        );
    }
}

PromotionParticipate.propTypes = {
    getPromotionList: PropTypes.func,
    clearPromotionList: PropTypes.func,
    updatePromotionStatus: PropTypes.func,
    promotionList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
}

export default withRouter(Form.create()(PromotionParticipate));
