/**
 * 可编辑单元格
 */
import React, { PureComponent } from 'react';
import { InputNumber } from 'antd';
import PropTypes from 'prop-types';

class EditableCell extends PureComponent {
    handleChange = (value) => {
        this.props.onChange(value);
    }

    handlePressEnter = (event) => {
        // 回车操作时保存数量
        if (event.keyCode === 13) {
            this.handleChange();
        }
    }

    render() {
        return (
            <div className="editable-cell">
                <div className="editable-cell-input-wrapper">
                    <InputNumber
                        defaultValue={this.props.value || 1}
                        min={1}
                        onChange={this.handleChange}
                        onKeyUp={this.handlePressEnter}
                    />
                </div>
            </div>
        );
    }
}

EditableCell.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func
};

export default EditableCell;
