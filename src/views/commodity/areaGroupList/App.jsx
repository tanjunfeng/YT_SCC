/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 区域组管理
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Table, Form, Button, Modal } from 'antd';
import { Link } from 'react-router-dom';

import { PAGE_SIZE } from '../../../constant';
import {
    getAreaGroup,
    clearAreaGroup,
    deleteAreaGroup
} from '../../../actions/commodity';
import SearchForm from './searchForm';
import ModalCreate from './modalCreate';
import columns from './columns';

const confirm = Modal.confirm;
function showDeleteConfirm(resolve) {
    confirm({
        title: '确定删除此区域组？',
        content: '若区域组下仍有门店则删除不会成功',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
            if (typeof resolve === 'function') {
                resolve();
            }
        }
    });
}

@connect(state => ({
    areaGroup: state.toJS().commodity.areaGroup
}), dispatch => bindActionCreators({
    getAreaGroup,
    clearAreaGroup,
    deleteAreaGroup
}, dispatch))

class AreaGroupList extends PureComponent {
    state = {
        areas: [], // 选中的区域组
        modalCreateVisible: false // 创建区域组模态框显示
    }

    componentWillMount() {
        this.props.clearAreaGroup();
    }

    componentDidMount() {
        this.handleReset();
        this.query();
    }

    /**
     * table复选框
     */
    onSelectChange = (areas) => {
        this.setState({ areas });
    }

    /**
     * 分页页码改变的回调
     */
    onPaginate = (pageNum = 1) => {
        Object.assign(this.param, {
            pageNum,
            current: pageNum
        });
        this.query();
    }

    query = () => {
        this.props.getAreaGroup(this.param).then(data => {
            const { pageNum, pageSize } = data.data;
            Object.assign(this.param, { pageNum, pageSize });
        });
    }

    param = {}

    handleSearch = (param) => {
        this.handleReset();
        Object.assign(this.param, {
            current: 1,
            ...param
        });
        this.query();
    }

    handleReset = () => {
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE
        }
    }

    handleDelete = () => {
        const { areas } = this.state;
        showDeleteConfirm(() => {
            this.props.deleteAreaGroup({ areaGroupCode: areas.join(',') });
        });
    }

    renderOperations = (text, record) => {
        const { areaGroupCode } = record;
        const { pathname } = this.props.location;
        return (
            <Link target="_blank" to={`${pathname}/detail/${areaGroupCode}`}>查看详情</Link>
        );
    }

    render() {
        const { data, total, pageNum, pageSize } = this.props.areaGroup;
        columns[columns.length - 1].render = this.renderOperations;
        const { areas, modalCreateVisible } = this.state;
        const rowSelection = {
            selectedRowKeys: areas,
            onChange: this.onSelectChange
        };
        return (
            <div className="area-group">
                <SearchForm
                    onSearch={this.handleSearch}
                    onReset={this.handleReset}
                />
                <div className="button-group">
                    <Button
                        size="default"
                        onClick={() => { this.setState({ modalCreateVisible: true }); }}
                    >
                        新增区域组
                    </Button>
                    <Button
                        size="default"
                        disabled={areas.length === 0}
                        onClick={this.handleDelete}
                    >
                        删除区域组
                    </Button>
                </div>
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="areaGroupCode"
                    rowSelection={rowSelection}
                    bordered
                    pagination={{
                        current: this.param.current,
                        pageNum,
                        pageSize,
                        total,
                        showQuickJumper: true,
                        onChange: this.onPaginate
                    }}
                />
                <ModalCreate
                    visible={modalCreateVisible}
                    onOk={() => {
                        this.query();
                        this.setState({ modalCreateVisible: false });
                    }}
                    onCancel={() => {
                        this.setState({ modalCreateVisible: false });
                    }}
                />
            </div>
        );
    }
}

AreaGroupList.propTypes = {
    getAreaGroup: PropTypes.func,
    clearAreaGroup: PropTypes.func,
    deleteAreaGroup: PropTypes.func,
    location: PropTypes.objectOf(PropTypes.any),
    areaGroup: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(AreaGroupList));
