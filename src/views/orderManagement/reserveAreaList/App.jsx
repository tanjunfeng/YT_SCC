/*
 * @Author: tanjf
 * @Description: 预定专区
 * @CreateDate: 2018-01-06 10:31:10
 * @Last Modified by: tanjf
 * @Last Modified time: 2018-01-17 19:53:52
 */

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {
    Form, Icon, Table, message, Menu, Dropdown, Modal
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { PAGE_SIZE } from '../../../constant';
import Util from '../../../util/util';
import SearchForm from './searchForm';
import { wishAreaColumns } from '../columns';
import {
    queryReserveAreaList,
    comleteOrCloseWishList,
    clearReserveAreaList
} from '../../../actions/process';
import { wishListsForExcel } from '../../../service';

const confirm = Modal.confirm;

@connect(state => ({
    reserveAreaData: state.toJS().procurement.reserveAreaData,
}), dispatch => bindActionCreators({
    queryReserveAreaList,
    clearReserveAreaList,
    comleteOrCloseWishList
}, dispatch))

class ReserveAreaList extends PureComponent {
    constructor(props) {
        super(props);

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
        Object.assign(this.param, { pageNum, current: pageNum, pageSize: PAGE_SIZE});
        this.query();
    }

    param = {
        pageNum: 1,
        pageSize: PAGE_SIZE,
        current: 1
    };

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
            pageNum: 1,
            pageSize: PAGE_SIZE,
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
        const closeWishList = this.props.comleteOrCloseWishList;
        const { key } = index;
        const { id } = record;
        switch (key) {
            case 'complete':
                confirm({
                    title: '到货处理',
                    content: '确认此到货处理操作？',
                    onOk: () => {
                        closeWishList({wishListId: id, status: key}).then(res => {
                            if (res.code === 200) message.success(res.message);
                        })
                    },
                    onCancel() { }
                });
                break;
            case 'close':
                confirm({
                    title: '无货处理',
                    content: '确认此无货处理操作？',
                    onOk: () => {
                        closeWishList({wishListId: id, status: key}).then(res => {
                            if (res.code === 200) message.success(res.message);
                        })
                    },
                    onCancel() { }
                });
                break;
            default:
                break;
        }
    }

    /**
     * 下载导入结果的回调
    */
    handleExportList = (data) => {
        Util.exportExcel(wishListsForExcel, Util.removeInvalid(data));
    }

    /**
     * 表单操作
     * @param {Object} text 当前行的值
     * @param {object} record 单行数据
    */
    renderOperation = (text, record) => {
        const { id } = record;
        const { pathname } = this.props.location;
        const menu = (
            <Menu onClick={(item) => this.handleSelect(record, item)}>
                <Menu.Item key={0}>
                    <Link target="_blank" to={`${pathname}/reserveAreaDetails/${id}`}>查看详情</Link>
                </Menu.Item>
                <Menu.Item key={'complete'}>
                    <a target="_blank" rel="noopener noreferrer">
                                到货通知
                    </a>
                </Menu.Item>
                <Menu.Item key={'close'}>
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
        const { data = [], pageNum, total } = reserveAreaData;
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
ReserveAreaList.propTypes = {
    clearReserveAreaList: PropTypes.func,
    queryReserveAreaList: PropTypes.func,
    comleteOrCloseWishList: PropTypes.func,
    location: PropTypes.objectOf(PropTypes.any),
    reserveAreaData: PropTypes.objectOf(PropTypes.any)
}
export default withRouter(Form.create()(ReserveAreaList));
