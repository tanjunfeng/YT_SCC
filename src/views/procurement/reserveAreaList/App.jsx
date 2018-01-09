/*
 * @Author: tanjf
 * @Description: 预定专区
 * @CreateDate: 2018-01-06 10:31:10
 * @Last Modified by: tanjf
 * @Last Modified time: 2018-01-09 17:34:21
 */

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Form, Input, Button, Row, Col, Select,
    Icon, Table, message, Upload,
    DatePicker
} from 'antd';
import moment from 'moment';
import { PAGE_SIZE } from '../../../constant';
import SearchForm from './searchForm';
import { wishAreaColumns } from '../columns';
import {
    queryReserveAreaList,
    clearReserveAreaList
} from '../../../actions/process';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;

@connect(state => ({
    reserveAreaData: state.toJS().procurement.reserveAreaData,
}), dispatch => bindActionCreators({
    queryReserveAreaList,
    clearReserveAreaList
}, dispatch))

class ReserveAreaList extends PureComponent {
    constructor(props) {
        super(props);

        this.param = {};
        this.state = {
        }
    }

    componentWillMount() {
        this.props.clearReserveAreaList();
    }

    componentDidMount() {
        this.query()
    }

    componentWillUnmount() {
        this.props.clearReserveAreaList();
    }

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
        this.props.queryReserveAreaList(this.param).then((data) => {
            const { pageNum, pageSize } = data.data;
            Object.assign(this.param, { pageNum, pageSize });
        });
    }

    /**
     * searchForm 回传值
     * @param {Object} param
     */
    onAreaListSearch = (param) => {
        this.onAreaListReset();
        this.param = {
            current: 1,
            ...param
        };
        this.query();
    }

    /**
     * 列表页查询条件重置
     */
    onAreaListReset = () => {
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        };
    }

    render() {
        const { reserveAreaData = {} } = this.props;
        const { data = {} } = reserveAreaData;
        return (
            <div>
                <SearchForm
                    onAreaListSearch={this.onAreaListSearch}
                    onAreaListReset={this.onAreaListReset}
                />
                <Table
                    dataSource={data.data}
                    columns={wishAreaColumns}
                    rowKey="productCode"
                    scroll={{
                        x: 1400
                    }}
                    bordered
                    pagination={{
                        current: this.param.current,
                        pageNum: data.pageNum,
                        pageSize: PAGE_SIZE,
                        total: data.total,
                        showQuickJumper: true,
                        onChange: this.onPaginate
                    }}
                />
            </div>
        )
    }
}
ReserveAreaList.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
}
export default withRouter(Form.create()(ReserveAreaList));
