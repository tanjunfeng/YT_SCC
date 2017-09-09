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
    poList: state.toJS().procurement.poList,
    selectedPoMngRows: state.toJS().procurement.selectedPoMngRows
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
        this.result = [];
        this.handleSearch = this.handleSearch.bind(this);
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
            Object.assign(this.result, data.data);
        });
    }

    handleSearch(param) {
        Object.assign(this.param, param);
        this.query();
    }

    render() {
        return (
            <div>
                <SearchForm
                    handlePromotionSearch={this.handleSearch}
                />
                <Table
                    dataSource={this.result}
                    columns={columns}
                    rowKey="id"
                    scroll={{
                        x: 1400
                    }}
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
}

export default withRouter(Form.create()(PromotionManagementList));
