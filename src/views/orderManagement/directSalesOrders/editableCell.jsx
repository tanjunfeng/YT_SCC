/**
 * 可编辑单元格
 *
 * 受控组件
 */
import React, { PureComponent } from 'react';
import { InputNumber } from 'antd';
import PropTypes from 'prop-types';
import { MAX_AMOUNT_OF_ORDER } from '../../../constant/index';

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
        const { min, step, error, value } = this.props;
        return (
            <div className="editable-cell">
                <InputNumber
                    defaultValue={value}
                    min={min}
                    max={MAX_AMOUNT_OF_ORDER}
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
    error: PropTypes.string,
    onChange: PropTypes.func
};

export default EditableCell;
