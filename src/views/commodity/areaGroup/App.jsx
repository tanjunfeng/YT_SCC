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

class AreaGroup extends PureComponent {
    componentWillMount() {
        this.props.clearAreaGroup();
        this.props.getAreaGroup();
    }

    componentDidMount() {
    }

    param = {
        current: 1
    }

    renderOperations = () => {

    }

    render() {
        const { data, total, pageNum, pageSize } = this.props.areaGroup;
        columns[columns.length - 1].render = this.renderOperations;
        return (
            <div>
                <SearchForm
                    onPromotionSearch={this.handlePromotionSearch}
                    onPromotionReset={this.handlePromotionReset}
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

AreaGroup.propTypes = {
    getAreaGroup: PropTypes.func,
    clearAreaGroup: PropTypes.func,
    areaGroup: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(AreaGroup));
