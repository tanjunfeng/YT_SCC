/**
 * @file app.jsx
 * @author zhangbaihua
 *
 * 库存调整搜索列表
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'antd';
import { stockAdjust } from '../../../actions';
import { PAGE_SIZE } from '../../../constant';                          // 每页分页条数
import fetchCategoryList from '../../../actions/fetch/fetchCategory';   // 分类列表页商品排序管理
import SearchForm from '../searchForm';
import StoreAdjItem from '../storeAdjItem';

@connect(
    state => ({
        categoryorderlist: state.toJS().categoryGoodsOrderNum.categoryOrderList,
        toAddPriceVisible: state.toJS().categoryGoodsOrderNum.toAddPriceVisible,
        deleteordernum: state.toJS().categoryGoodsOrderNum.toAddPriceVisible,
        stockAdjStore: state.toJS().stockAdjust.data,
    }),
    dispatch => bindActionCreators({
        fetchCategoryList,
        stockAdjust
    }, dispatch)
)
class StoreAdjList extends Component {
    constructor(props) {
        super(props);

        this.current = 1;
        this.times = [null, null];
        this.classify = {
            firstCategoryId: null,
            secondCategoryId: null,
            thirdCategoryId: null
        }
    }
    componentDidMount() {
        this.props.stockAdjust({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            shelfStatus: 0
        });
    }

    /**
     * @param {number} pageNUmber 页码数
     *
     * 根据页面请求数据
     */
    handlePaginationChange = (pageNumber) => {
        this.current = pageNumber;
        this.props.stockAdjust({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            shelfStatus: 0
        });
    }

    /**
     * @param  {object}  data   搜索条件
     *
     * 按条件搜索
     */
    handleSearch = (data) => {
        this.props.stockAdjust({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            shelfStatus: 0,
            // ...Utils.removeInvalid(this.classify),
            ...data
        });
    }


    // 重置按钮
    handleFormReset = () => {
        // this.props.form.resetFields();
        // this.setState({
        //     times: null
        // })
        // this.times = [null, null];
        // this.classifyRef && this.classifyRef.resetValue()
    }

    render() {
        // columns[columns.length - 1].render = this.renderOperation;
        if (this.props.stockAdjStore.length === 0) {
            return null;
        }
        return (
            <div className="onsale">
                <div className="manage-form">
                    <SearchForm
                        isSuplierAddMenu
                        onSearch={this.handleSearch}
                        onReset={this.handleFormReset}
                    // onInput={this.handleInputSupplier}
                    // onExcel={this.handleDownLoad}
                    />
                </div>
                <StoreAdjItem
                    searchDateList={this.props.stockAdjStore}
                    onChangePagination={this.handlePaginationChange}
                    stockAdjust={this.props.stockAdjust}
                />
            </div>
        );
    }
}

StoreAdjList.propTypes = {
    stockAdjStore: PropTypes.arrayOf(PropTypes.any),
    stockAdjust: PropTypes.func
}


export default withRouter(Form.create()(StoreAdjList));
