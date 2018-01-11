/*
 * @Author: tanjf
 * @Description: 预定专区详情
 * @CreateDate: 2018-01-06 10:31:10
 * @Last Modified by: tanjf
 * @Last Modified time: 2018-01-11 19:57:30
 */

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Table } from 'antd';
import { PAGE_SIZE } from '../../../constant';
import SearchForm from './searchForm';
import { wishAreaDetailsColumns } from '../columns';
import {
    queryReserAreaDetail,
    clearReserAreaDetail
} from '../../../actions/process';
import Util from '../../../util/util';
import { wishListsForExcel } from '../../../service';

@connect(state => ({
    reserveAreaDetaiData: state.toJS().procurement.reserveAreaDetaiData,
}), dispatch => bindActionCreators({
    queryReserAreaDetail,
    clearReserAreaDetail
}, dispatch))

class ReserveAreaDetails extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    componentWillMount() {
        this.props.clearReserAreaDetail();
    }

    componentDidMount() {
        this.query()
    }

    componentWillUnmount() {
        this.props.clearReserAreaDetail();
    }

    param = {
        pageNum: 1,
        pageSize: PAGE_SIZE,
        current: 1
    };

    /**
     * 分页页码改变的回调
     */
    onPaginate = (pageNum) => {
        Object.assign(this.param, { pageNum, current: pageNum });
        this.query();
    }

    /**
     * 列表页查询
     */
    query = () => {
        this.props.queryReserAreaDetail(this.param).then((data) => {
            const { pageNum, pageSize } = data;
            Object.assign(this.param, { pageNum, pageSize });
        });
    }

    /**
     * searchForm 回传值
     * @param {Object} param
     */
    handleAreaListSearch = (param) => {
        this.handleAreaListReset();
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            current: 1,
            ...param
        };
        this.query();
    }

    /**
     * 列表页查询条件重置
     */
    handleAreaListReset = () => {
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        };
    }

    handleSelect = (record, index) => {
        if (index.key === '1') {
            console.log(record)
        }
    }

    /**
     * 下载导入结果的回调
    */
    handleExportList = () => {
        Util.exportExcel(wishListsForExcel, Util.removeInvalid(this.param));
    }

    render() {
        const { reserveAreaDetaiData = {} } = this.props;
        const { data = [] } = reserveAreaDetaiData;
        const { pageNum, total } = data;
        return (
            <div>
                <SearchForm
                    onAreaListSearch={this.handleAreaListSearch}
                    onAreaListReset={this.handleAreaListReset}
                    exportList={this.handleExportList}
                />
                <Table
                    dataSource={data}
                    columns={wishAreaDetailsColumns}
                    rowKey="id"
                    bordered
                    pagination={{
                        current: this.param.current,
                        pageNum,
                        pageSize: PAGE_SIZE,
                        total,
                        showQuickJumper: true,
                        onChange: this.onPaginate
                    }}
                />
            </div>
        )
    }
}
ReserveAreaDetails.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
}
export default withRouter(Form.create()(ReserveAreaDetails));
