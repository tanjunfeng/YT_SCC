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

// import { PAGE_SIZE } from '../../../constant';
import SearchForm from './searchForm';

class StoresForm extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(param) {
        this.props.onSearch(param);
    }

    render() {
        return (
            <div className="col-half">
                <SearchForm
                    onSearch={this.handleSearch}
                />
                {/* <Table
                    dataSource={records}
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
                /> */}
            </div>
        );
    }
}

StoresForm.propTypes = {
    onSearch: PropTypes.func
}

export default withRouter(Form.create()(StoresForm));
