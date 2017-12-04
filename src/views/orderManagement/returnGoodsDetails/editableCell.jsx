/**
 * 可编辑单元格
 *
 * 受控组件
 */
import React, { PureComponent } from 'react';
import { InputNumber } from 'antd';
import PropTypes from 'prop-types';

class EditableCell extends PureComponent {
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
        const { min, step, error, value, actualReturnQuantity } = this.props;
        console.log(value)
        return (
            <div className="editable-cell">
                <InputNumber
                    defaultValue={value}
                    min={min}
                    max={actualReturnQuantity}
                    step={step}
                    onChange={this.handleChange}
                    onKeyUp={this.handlePressEnter}
                />
                <div className="error-message" style={{color: 'red'}}>{error}</div>
            </div>
        );
    }
}

EditableCell.propTypes = {
    value: PropTypes.number,
    min: PropTypes.number,
    step: PropTypes.number,
    actualReturnQuantity: PropTypes.number,
    error: PropTypes.string,
    onChange: PropTypes.func
};

export default EditableCell;
