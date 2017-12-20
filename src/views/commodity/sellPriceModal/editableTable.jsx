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
    render() {
        const { isEdit, startNumber } = this.props.value;
        console.log(isEdit, startNumber);
        return (
            <Table columns={[]} dataSource={[]} />
        )
    }
}

EditableTable.propTypes = {
    value: PropTypes.objectOf(PropTypes.any)
};

export default EditableTable;
