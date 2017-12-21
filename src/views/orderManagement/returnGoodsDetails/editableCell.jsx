/**
 * 可编辑单元格
 *
 * 受控组件
 */
import React, { PureComponent } from 'react';
import { InputNumber } from 'antd';
import PropTypes from 'prop-types';

class EditableCell extends PureComponent {
    valueNum = 0
    handleChange = (value) => {
        this.props.onChange(+(value));
    }

    handlePressEnter = (event) => {
        const value = +(event.target.value) || 0;
        // 回车操作时保存数量
        if (event.keyCode === 13) {
            this.handleChange(value);
        }
    }

    render() {
        const { min, step, value, max, error } = this.props;
        return (
            <div className="editable-cell">
                <InputNumber
                    defaultValue={value}
                    min={min}
                    max={max}
                    formatter={text => Math.floor(text)}
                    parser={text => Math.floor(text)}
                    step={step}
                    onChange={this.handleChange}
                    onKeyUp={this.handlePressEnter}
                />
                <div className="error-message">{error}</div>
            </div>
        );
    }
}

EditableCell.propTypes = {
    value: PropTypes.number,
    min: PropTypes.number,
    step: PropTypes.number,
    max: PropTypes.number,
    error: PropTypes.string,
    onChange: PropTypes.func
};

export default EditableCell;
