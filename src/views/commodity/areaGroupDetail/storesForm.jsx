/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 区域组详情
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Form, Table } from 'antd';

import SearchForm from './searchForm';
import columns from './columns';

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
    onSelectChange(selectedStores) {
        this.props.onSelect(selectedStores);
    }

    handleReset() {
        this.props.onReset();
    }

    handleSearch(param) {
        this.props.onSearch(param);
    }

    render() {
        const {
            title, data, selectedStores,
            pageNum, pageSize, totalCount, current
        } = this.props.value;
        const rowSelection = {
            selectedRowKeys: selectedStores,
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
                        current,
                        pageNum,
                        pageSize,
                        totalCount,
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
