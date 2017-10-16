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
        console.log(this.props);
        return (
            <div className="editable-cell">
                <InputNumber
                    defaultValue={this.props.value}
                    min={this.props.record.minNumber}
                    step={this.props.record.minNumber}
                    onChange={this.handleChange}
                    onKeyUp={this.handlePressEnter}
                />
                {this.props.record.enough ? null : <div className="not-enouph">库存不足</div>}
            </div>
        );
    }
}

EditableCell.propTypes = {
    value: PropTypes.number,
    record: PropTypes.objectOf(PropTypes.any),
    onChange: PropTypes.func
};

export default EditableCell;
