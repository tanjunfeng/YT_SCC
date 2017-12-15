/**
* @file App.jsx
* @author zhao zhi jian
*
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Table } from 'antd';
import SearchBar from './SearchBar';
import {
    getListData,
    getListDataEmpty
} from '../../../actions/storeRealTime';
import { PAGE_SIZE } from '../../../constant';
import {
    TableHeader
} from '../../../constant/storeRealTime';

@connect(
    state => ({
        /**
         * 列表数据
         */
        listData: state.toJS().storeRealTime.data,
    }),
    dispatch => bindActionCreators({
        /**
         * 请求 列表数据
         */
        getListData,
        /**
         * 清空列表数据
         */
        getListDataEmpty
    }, dispatch)
)

class App extends Component {
    constructor(props) {
        super(props);

        this.onPageChanges = this.onPageChanges.bind(this);
        this.setCurrentPage = this.setCurrentPage.bind(this);
        this.fetchListData = this.fetchListData.bind(this);

        this.state = {
            currentPage: 1 // 分页当前状态
        }
    }

    componentDidMount() {
        this.fetchListData();
    }

    componentWillUnmount() {
        this.props.getListDataEmpty();
    }

    // 翻页事件
    onPageChanges(pageNumber) {
        const { searchData } = this.state;
        const params = {
            pageNum: pageNumber,
            pageSize: PAGE_SIZE,
            ...searchData
        }
        this.props.getListData(params)
            .then(() => (
                this.setCurrentPage(pageNumber)
            ));
    }

    /**
     * 设置分页当前状态
     * @param {number} num
     */
    setCurrentPage(num = 1) {
        this.setState({
            currentPage: num
        });
    }

    // 请求列表数据
    fetchListData() {
        const params = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        }
        this.props.getListData(params);
    }

    render() {
        const { listData } = this.props;
        if (listData.length === 0) {
            return null;
        }
        const { currentPage } = this.state;
        return (
            <div>
                <SearchBar
                    setCurrentPage={this.setCurrentPage}
                />
                <div className="area-list">
                    <Table
                        columns={TableHeader}
                        scroll={{ x: 1400 }}
                        dataSource={listData.data}
                        rowKey={(record) => (Object.values(record).join('.'))}
                        pagination={{
                            showQuickJumper: true,
                            current: currentPage,
                            defaultPageSize: listData.pageSize,
                            defaultCurrent: 1,
                            total: listData.total,
                            onChange: this.onPageChanges
                        }}
                    />
                </div>
            </div>
        )
    }
}

App.propTypes = {
    getListData: PropTypes.objectOf(PropTypes.any),
    listData: PropTypes.objectOf(PropTypes.any),
    getListDataEmpty: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(App);
