/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 促销管理 - 促销管理列表
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Table, Form } from 'antd';

import { getPromotionList } from '../../../actions/promotion';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { promotionMngList as columns } from '../columns';

@connect(state => ({
    promotionList: state.toJS().promotion.list
}), dispatch => bindActionCreators({
    getPromotionList
}, dispatch))

class PromotionManagementList extends PureComponent {
    constructor(props) {
        super(props);
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            total: 0
        };
        this.handlePromotionSearch = this.handlePromotionSearch.bind(this);
        this.handlePromotionReset = this.handlePromotionReset.bind(this);
        this.query = this.query.bind(this);
    }

    componentDidMount() {
        this.query();
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
            const { pageNum, pageSize, total } = data;
            Object.assign(this.param, {
                pageNum, pageSize, total
            });
        });
    }

    handlePromotionSearch(param) {
        Object.assign(this.param, param);
        this.query();
    }

    handlePromotionReset() {

    }

    render() {
        // this.query();
        return (
            <div>
                <SearchForm
                    handlePromotionSearch={this.handlePromotionSearch}
                    handlePromotionReset={this.handlePromotionReset}
                />
                <Table
                    dataSource={this.props.promotionList.data}
                    columns={columns}
                    rowKey="id"
                    scroll={{
                        x: 1400
                    }}
                    bordered
                    pagination={{
                        ...this.param,
                        showQuickJumper: true,
                        onChange: this.onPaginate
                    }}
                />
            </div>
        );
    }
}

PromotionManagementList.propTypes = {
    getPromotionList: PropTypes.func,
    promotionList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
}

export default withRouter(Form.create()(PromotionManagementList));
