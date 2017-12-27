/**
 * @file App.jsx
 * @author zhoucl
 *
 * 管理列表页面
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Table } from 'antd';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { PAGE_SIZE } from '../../../constant';
import Utils from '../../../util/util';
import { exportProdPriceChangeList } from '../../../service';
import { pubFetchValueList } from '../../../actions/pub';
import {
    queryPriceChangeList,
} from '../../../actions/process';

import SearchFormInput from './searchFormInput';
import { priceChangeColumns } from '../columns';

@connect(
    state => ({
        priceChangeList: state.toJS().procurement.priceChangeList
    }),
    dispatch => bindActionCreators({
        queryPriceChangeList,
        pubFetchValueList
    }, dispatch))

class toDoPriceChangeList extends PureComponent {
    /**
     * 导出Excel
     */
    handleDownLoad = data => {
        Utils.exportExcel(exportProdPriceChangeList, data);
    }

    /**
     * 分页查询价格变更列表
     */
    handlePaginationChange = pageIndex => {
        this.queryParams.pageNum = pageIndex;
        this.handleQueryPriceChangeList(this.queryParams);
    }

    /**
     * 查询价格变更列表
     */
    handleQueryPriceChangeList = queryParams => {
        this.queryParams = queryParams;
        this.props.queryPriceChangeList(queryParams);
    }

    render() {
        const { data, pageNum, total } = this.props.priceChangeList;
        const { pubFetchValueList } = this.props;
        return (
            <div>
                <SearchFormInput
                    onExcel={this.handleDownLoad}
                    onQueryList={this.handleQueryPriceChangeList}
                    pubFetchValueList={pubFetchValueList}
                />
                <Table
                    columns={priceChangeColumns}
                    rowKey={record => record.id}
                    dataSource={data}
                    pagination={{
                        current: pageNum,
                        total,
                        pageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.handlePaginationChange
                    }}
                />
            </div>
        );
    }
}

toDoPriceChangeList.propTypes = {
    queryPriceChangeList: PropTypes.func,
    pubFetchValueList: PropTypes.func,
    priceChangeList: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(toDoPriceChangeList));
