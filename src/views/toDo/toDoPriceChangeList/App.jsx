/**
 * @file App.jsx
 * @author zhoucl
 *
 * 管理列表页面
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Table,
    message,
} from 'antd';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { PAGE_SIZE } from '../../../constant';
import Utils from '../../../util/util';
import { exportSupplierEnterList } from '../../../service';
import { pubFetchValueList } from '../../../actions/pub';
import {
    queryPriceChangeList,
} from '../../../actions/process';

import SearchFormInput from './searchFormInput';

const columns = [
    {
        title: '变价类型',
        dataIndex: 'changeType',
        key: 'changeType'
    }, 
    {
        title: '供应商',
        dataIndex: 'spCodeAndName',
        key: 'spCodeAndName',
    }, 
    {
        title: '供应商地点',
        dataIndex: 'spAdrCodeAndName',
        key: 'spAdrCodeAndName',
    }, 
    {
        title: '子公司',
        dataIndex: 'branchCompanyCodeAndName',
        key: 'branchCompanyCodeAndName',
    },
    {
        title: '部类',
        dataIndex: 'firstLevelCategoryName',
        key: 'firstLevelCategoryName',
    },
    {
        title: '大类',
        dataIndex: 'secondLevelCategoryName',
        key: 'secondLevelCategoryName',
    },
    {
        title: '中类',
        dataIndex: 'thirdLevelCategoryName',
        key: 'thirdLevelCategoryName',
    },
    {
        title: '小类',
        dataIndex: 'fourthLevelCategoryName',
        key: 'fourthLevelCategoryName',
    },
    {
        title: '商品信息',
        dataIndex: 'productCodeAndDesc',
        key: 'productCodeAndDesc',
    },
    {
        title: '操作人',
        dataIndex: 'createUserName',
        key: 'createUserName',
    },
    {
        title: '操作时间',
        dataIndex: 'createTime',
        key: 'createTime',
    },
    {
        title: '当前价格',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: '提交价格',
        dataIndex: 'newestPrice',
        key: 'newestPrice',
    },
    {
        title: '商品毛利率',
        dataIndex: 'grossProfitMargin',
        key: 'grossProfitMargin',
        render: text => (
            <span className={ parseFloat(text) < 0 ? 'decrease' : '' }>{text}</span>
        )
    },
    {
        title: '调价百分比',
        dataIndex: 'percentage',
        key: 'percentage',
        render: text => (
            <span className={ parseFloat(text) < 0 ? 'decrease' : '' }>{text}</span>
        )
    }
];

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
     * props数据类型约束
     */
    static propTypes = {
        queryPriceChangeList: PropTypes.func,
        pubFetchValueList: PropTypes.func,
        priceChangeList: PropTypes.objectOf(PropTypes.any)
    }
    
    /**
     * 导出
     */
    handleDownLoad(data) {
        Utils.exportExcel(exportSupplierEnterList, data);
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

    render () {
        const { queryPriceChangeList, pubFetchValueList } = this.props;
        const { data, pageNum, pageSize, total } = this.props.priceChangeList;
        return (
            <div className="foo">
                <SearchFormInput 
                    onExcel={ this.handleDownLoad } 
                    onQueryList = { this.handleQueryPriceChangeList } 
                    pubFetchValueList={ pubFetchValueList }>
                </SearchFormInput>
                <Table columns={ columns } 
                    rowKey={ record => record.id } 
                    dataSource={ data } 
                    pagination={{
                        current: pageNum,
                        total,
                        pageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.handlePaginationChange
                    }}/>
            </div>
        );
    }
}

export default withRouter(Form.create()(toDoPriceChangeList));
