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
        this.props.onChange(value);
    }

    handlePressEnter = (event) => {
        const value = +(event.target.value) || 1;
        // 回车操作时保存数量
        if (event.keyCode === 13) {
            this.handleChange(value);
        }
    }

    render() {
        const { min, max } = this.props;
        return (
            <div className="editable-cell">
                <InputNumber
                    defaultValue={min}
                    min={0}
                    formatter={value => Math.floor(value)}
                    parser={value => Math.floor(value)}
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
    min: PropTypes.number,
    onChange: PropTypes.func
};

export default EditableCell;
