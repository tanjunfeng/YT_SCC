/**
 * @file App.jsx
 * @author shijh
 *
 * 价格区间选择组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

import { stepPriceColumns as columns } from './columns';

class EditableTable extends PureComponent {
    state = {
        prices: []
    }

    componentWillReceiveProps(nextProps) {
        if (this.propsvalue.data.length === 0 && nextProps.value.data.length > 0) {
            this.setState({ prices: nextProps.value.data });
        }
    }

    render() {
        // const { isEdit, startNumber } = this.props.value;
        const { prices } = this.state;
        console.log(prices);
        return (
            <Table columns={columns} dataSource={prices} />
        )
    }
}

EditableTable.propTypes = {
    value: PropTypes.objectOf(PropTypes.any)
};

export default EditableTable;
