/**
 * @file editableCell.jsx
 * @author taoqiyu
 *
 * 价格区间单元格
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { InputNumber } from 'antd';

function renderHighLight(value, mark) {
    return mark ? <span className="red">{value}</span> : value;
}

class EditableCell extends PureComponent {
    handleChange = value => {
        this.props.onChange(value);
    }

    render() {
        const { editable, value, type, mark } = this.props;
        return (
            <div className="editable-cell">
                {editable ?
                    <InputNumber
                        style={{ margin: '-5px 0' }}
                        value={value}
                        step={type === 'price' ? 0.01 : 1}
                        onChange={this.handleChange}
                    />
                    : renderHighLight(value, mark)
                }
            </div>
        )
    }
}

EditableCell.propTypes = {
    value: PropTypes.string,
    editable: PropTypes.bool,
    mark: PropTypes.bool,
    type: PropTypes.string,
    onChange: PropTypes.func
};

export default EditableCell;
