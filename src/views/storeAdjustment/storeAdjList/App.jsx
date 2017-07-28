/**
 * @file app.jsx
 * @author Tan junfeng
 *
 * 分类列表页商品排序管理
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Form,
    Dropdown,
    Icon,
    message,
    Modal,
    Menu
} from 'antd';
import {
    stockAdjust,
    // modifyCategoryVisible                                               // 弹框显示控制
} from '../../../actions';

import { PAGE_SIZE } from '../../../constant';                          // 每页分页条数
import fetchCategoryList from '../../../actions/fetch/fetchCategory';   // 分类列表页商品排序管理
import { categoryList } from '../../../constant/formColumns';           // 分类列表页商品排序管理列表
import SearchForm from '../searchForm';
import StoreAdjItem from '../storeAdjItem';

import Utils from '../../../util/util';

const confirm = Modal.confirm;
// const FormItem = Form.Item;

const columns = categoryList;

@connect(
    state => ({
        categoryorderlist: state.toJS().categoryGoodsOrderNum.categoryOrderList,
        toAddPriceVisible: state.toJS().categoryGoodsOrderNum.toAddPriceVisible,
        deleteordernum: state.toJS().categoryGoodsOrderNum.toAddPriceVisible,
        stockAdjStore: state.toJS().stockAdjust.data,
    }),
    dispatch => bindActionCreators({
        fetchCategoryList,
        // modifyAuditVisible,
        // modifyCheckReasonVisible,
        // modifyCategoryVisible,
        // modifyDeleteOrderNum,
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

    handlePaginationChange = (pageNumber) => {
        this.current = pageNumber;
        this.props.stockAdjust({
            pageSize: PAGE_SIZE,
            pageNum: this.current,
            shelfStatus: 0
        });
    }

    // 搜索
    handleSearch = (data) => {
        console.log(data);
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
        console.log(this.props.stockAdjStore);
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
    // modifyDeleteOrderNum: PropTypes.func,
    // toAddPriceVisible: PropTypes.func,
    // fetchCategoryList: PropTypes.func,
    // modifyCategoryVisible: PropTypes.func,
    stockAdjStore: PropTypes.arrayOf(PropTypes.any),
    form: PropTypes.objectOf(PropTypes.any),
    // categoryorderlist: PropTypes.objectOf(PropTypes.any),
    stockAdjust: PropTypes.func
}


export default withRouter(Form.create()(StoreAdjList));
