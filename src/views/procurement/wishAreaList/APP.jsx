/*
 * @Author: tanjf
 * @Description: 心愿专区
 * @CreateDate: 2018-01-06 10:31:10
 * @Last Modified by: tanjf
 * @Last Modified time: 2018-01-09 14:10:16
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

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;

@connect(state => ({
}), dispatch => bindActionCreators({
}, dispatch))

class WishAreaList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div>
                <SearchForm
                />
                <Table
                    dataSource={data}
                    columns={wishAreaColumns}
                    rowKey="orderId"
                    scroll={{
                        x: 1400
                    }}
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
        )
    }
}
WishAreaList.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
}
export default withRouter(Form.create()(WishAreaList));
