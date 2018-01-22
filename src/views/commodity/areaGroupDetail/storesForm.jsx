/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 区域组详情
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Table } from 'antd';

// import { PAGE_SIZE } from '../../../constant';
import SearchForm from './searchForm';
import columns from './columns';
import {
    getAreaGroup, clearAreaGroup
} from '../../../actions/commodity';

@connect(state => ({
    areaGroup: state.toJS().commodity.areaGroup
}), dispatch => bindActionCreators({
    getAreaGroup, clearAreaGroup
}, dispatch))

class StoresForm extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
    }

    /**
     * table复选框
     */
    onSelectChange(stores) {
        this.props.onSelect(stores);
    }

    handleReset() {
        this.props.onReset();
    }

    handleSearch(param) {
        this.props.onSearch(param);
    }

    render() {
        const { title, data, stores, pageNum, pageSize, total } = this.props.value;
        const rowSelection = {
            selectedRowKeys: stores,
            onChange: this.onSelectChange
        };
        return (
            <div className="col-half">
                <h2>{title}</h2>
                <SearchForm
                    onSearch={this.handleSearch}
                    onReset={this.handleReset}
                />
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="id"
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
            </div>
        );
    }
}

StoresForm.propTypes = {
    onSearch: PropTypes.func,
    onSelect: PropTypes.func,
    onReset: PropTypes.func,
    value: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(StoresForm));
