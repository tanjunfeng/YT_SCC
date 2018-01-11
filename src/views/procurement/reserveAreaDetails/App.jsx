/*
 * @Author: tanjf
 * @Description: 预定专区详情
 * @CreateDate: 2018-01-06 10:31:10
 * @Last Modified by: tanjf
 * @Last Modified time: 2018-01-11 11:02:48
 */

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Form, Input, Button, Row, Col, Select,
    Icon, Table, message, Menu,
    DatePicker, Dropdown
} from 'antd';
import moment from 'moment';
import { PAGE_SIZE } from '../../../constant';
import SearchForm from './searchForm';
import { wishAreaColumns } from '../columns';
import {
    queryReserveAreaList,
    clearReserveAreaList
} from '../../../actions/process';
import { Link } from 'react-router-dom';
import Util from '../../../util/util';
import { sellPriceChangeExport } from '../../../service';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;

@connect(state => ({
    reserveAreaData: state.toJS().procurement.reserveAreaData,
}), dispatch => bindActionCreators({
    queryReserveAreaList,
    clearReserveAreaList
}, dispatch))

class ReserveAreaDetails extends PureComponent {
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
    exportList = () => {
        Util.exportExcel(sellPriceChangeExport, Util.removeInvalid(this.param));
    }

    /**
     * 表单操作
     * @param {Object} text 当前行的值
     * @param {object} record 单行数据
    */
    renderOperation = (text, record) => {
        const { productId } = record;
        const { pathname } = this.props.location;
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, item)}>
                <Menu.Item key={0}>
                    <Link to={`/commodifyList/${productId}`}>查看详情</Link>
                </Menu.Item>
                <Menu.Item key={1}>
                    <a target="_blank" rel="noopener noreferrer">
                                到货通知
                    </a>
                </Menu.Item>
                <Menu.Item key={2}>
                    <a target="_blank" rel="noopener noreferrer">
                                无货处理
                    </a>
                </Menu.Item>
            </Menu>
        );
        return (
            <Dropdown overlay={menu} placement="bottomCenter">
                <a className="ant-dropdown-link">
                    表单操作 <Icon type="down" />
                </a>
            </Dropdown>
        )
    }

    render() {
        const { reserveAreaData = {} } = this.props;
        const { data = [] } = reserveAreaData;
        const { pageNum, total } = data;
        wishAreaColumns[wishAreaColumns.length - 1].render = this.renderOperation;
        return (
            <div>
                <SearchForm
                    onAreaListSearch={this.handleAreaListSearch}
                    onAreaListReset={this.handleAreaListReset}
                    exportList={this.handleExportList}
                />
                <Table
                    dataSource={data}
                    columns={wishAreaColumns}
                    rowKey="productCode"
                    scroll={{
                        x: 1400
                    }}
                    bordered
                    pagination={{
                        current: this.param.current,
                        pageNum: pageNum,
                        pageSize: PAGE_SIZE,
                        total: total,
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
