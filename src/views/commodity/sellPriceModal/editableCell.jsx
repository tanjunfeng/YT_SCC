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
        const { editable, value } = this.props;
        return (
            <div>
                {editable ?
                    <InputNumber
                        style={{ margin: '-5px 0' }}
                        value={value}
                        formatter={text => Math.floor(text)}
                        parser={text => Math.floor(text)}
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
    onChange: PropTypes.func
};

export default EditableCell;
