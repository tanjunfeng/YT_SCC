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
                <InputNumber
                    defaultValue={this.props.value}
                    min={this.props.row.salesInsideNumber}
                    step={this.props.row.salesInsideNumber}
                    onChange={this.handleChange}
                    onKeyUp={this.handlePressEnter}
                />
                {this.props.row.enough ? null : <div className="not-enouph">库存不足</div>}
            </div>
        );
    }
}

EditableCell.propTypes = {
    value: PropTypes.number,
    row: PropTypes.objectOf(PropTypes.any),
    enough: PropTypes.bool,
    onChange: PropTypes.func
};

export default EditableCell;
