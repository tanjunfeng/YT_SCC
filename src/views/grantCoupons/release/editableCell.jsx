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
        let v = value;
        if (isNaN(v) || v < 1) {
            v = 1;
        }
        this.props.onChange(v);
    }

    handlePressEnter = (event) => {
        const value = +(event.target.value) || 1;
        // 回车操作时保存数量
        if (event.keyCode === 13) {
            this.handleChange(value);
        }
    }

    render() {
        const { max } = this.props;
        return (
            <div className="editable-cell">
                <InputNumber
                    defaultValue={1}
                    min={1}
                    max={max}
                    onChange={this.handleChange}
                    onKeyUp={this.handlePressEnter}
                />
            </div>
        );
    }
}

EditableCell.propTypes = {
    max: PropTypes.number,
    onChange: PropTypes.func
};

export default EditableCell;
