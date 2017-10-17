/**
 * 可编辑单元格
 */
import React, { PureComponent } from 'react';
import { InputNumber } from 'antd';
import PropTypes from 'prop-types';

class EditableCell extends PureComponent {
    state = {
        value: this.props.value
    }

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
        const { minNumber, sellFullCase, salesInsideNumber } = this.props.record;
        // 填入的数量是否是内装数量的整数倍
        const isMulti = this.state.value % salesInsideNumber === 0;
        const step = sellFullCase === 0 ? minNumber : salesInsideNumber;
        return (
            <div className="editable-cell">
                <InputNumber
                    defaultValue={this.state.value}
                    min={minNumber}
                    step={step}
                    onChange={this.handleChange}
                    onKeyUp={this.handlePressEnter}
                />
                {this.props.record.enough ? null : <div className="error-message">库存不足</div>}
                {sellFullCase === 0 && isMulti ? null : <div className="error-message">库存不足</div>}
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
