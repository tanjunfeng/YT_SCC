/**
 * @file App.jsx
 * @author shijh
 *
 * 价格区间选择组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

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
        return (
            <Table columns={[]} dataSource={prices} />
        )
    }
}

EditableTable.propTypes = {
    value: PropTypes.objectOf(PropTypes.any)
};

export default EditableTable;
