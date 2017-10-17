/**
 * 可编辑单元格
 */
import React, { PureComponent } from 'react';
import { InputNumber } from 'antd';
import PropTypes from 'prop-types';

class EditableCell extends PureComponent {
    state = {
        value: this.props.value,
        error: false
    }

    handleChange = (value) => {
        this.setState({ value });
        this.props.onChange(value, this.state.error);
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
        const isNotMulti = this.state.value % salesInsideNumber !== 0;
        const step = sellFullCase === 0 ? minNumber : salesInsideNumber;
        // 库存不足 或 非整箱销售数量的整数倍时，通知错误
        if (!this.props.record.enough || (sellFullCase === 1 && isNotMulti)) {
            this.setState({
                error: true
            });
        } else {
            this.setState({
                error: false
            });
        }
        return (
            <div className="editable-cell">
                <InputNumber
                    defaultValue={this.state.value}
                    min={minNumber}
                    step={step}
                    onChange={this.handleChange}
                    onKeyUp={this.handlePressEnter}
                />
                {
                    !this.props.record.enough ?
                        <div className="error-message">库存不足</div> : null
                }
                {
                    sellFullCase === 1 && isNotMulti ?
                        <div className="error-message">不是整数倍</div> : null
                }
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
