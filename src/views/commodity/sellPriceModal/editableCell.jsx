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

    handleValueFormat = (text) => {
        const { type } = this.props;
        if (type === 'price') {
            return Number(text).toFixed(2);
        }
        return Math.floor(text);
    }

    render() {
        const { editable, value, type } = this.props;
        return (
            <div className="editable-cell">
                {editable ?
                    <InputNumber
                        style={{ margin: '-5px 0' }}
                        value={value}
                        formatter={this.handleValueFormat}
                        parser={this.handleValueFormat}
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
    value: PropTypes.number,
    editable: PropTypes.bool,
    type: PropTypes.string,
    onChange: PropTypes.func
};

export default EditableCell;
