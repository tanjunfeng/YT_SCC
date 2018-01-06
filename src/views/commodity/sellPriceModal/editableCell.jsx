/**
 * @file editableCell.jsx
 * @author taoqiyu
 *
 * 价格区间单元格
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { InputNumber } from 'antd';

class EditableCell extends PureComponent {
    handleChange = value => {
        this.props.onChange(value);
    }

    render() {
        const { editable, value, type } = this.props;
        // console.log(value === '-' ? '没有值' : '');
        return (
            <div className="editable-cell">
                {editable ?
                    <InputNumber
                        style={{ margin: '-5px 0' }}
                        value={value}
                        step={type === 'price' ? 0.01 : 1}
                        onChange={this.handleChange}
                    />
                    : value
                }
            </div>
        )
    }
}

EditableCell.propTypes = {
    value: PropTypes.string,
    editable: PropTypes.bool,
    type: PropTypes.string,
    onChange: PropTypes.func
};

export default EditableCell;
