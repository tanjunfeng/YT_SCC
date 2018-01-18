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
import { Table, Form } from 'antd';
import { Link } from 'react-router-dom';

import {
    getAreaGroup,
    clearAreaGroup
} from '../../../actions/commodity';
import SearchForm from './searchForm';
import columns from './columns';

@connect(state => ({
    areaGroup: state.toJS().commodity.areaGroup
}), dispatch => bindActionCreators({
    getAreaGroup,
    clearAreaGroup
}, dispatch))

class AreaGroupList extends PureComponent {
    componentWillMount() {
        this.props.clearAreaGroup();
    }

    componentDidMount() {
        this.props.getAreaGroup();
    }

    param = {
        current: 1
    }

    handleSearch = () => {

    }

    handleReset = () => {

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
        return (
            <div>
                <SearchForm
                    onSearch={this.handleSearch}
                    onReset={this.handleReset}
                />
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="areaGroupCode"
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
            </div>
        );
    }
}

AreaGroupList.propTypes = {
    getAreaGroup: PropTypes.func,
    clearAreaGroup: PropTypes.func,
    location: PropTypes.objectOf(PropTypes.any),
    areaGroup: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(AreaGroupList));
