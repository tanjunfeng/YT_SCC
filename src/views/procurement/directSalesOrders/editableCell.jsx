/**
 * 可编辑单元格
 */
import React, { PureComponent } from 'react';
import { InputNumber, Icon } from 'antd';
import PropTypes from 'prop-types';

class EditableCell extends PureComponent {
    state = {
        value: this.props.value || 0,
        editable: false,
    }

    handleChange = (value) => {
        this.setState({ value });
    }

    check = () => {
        this.setState({ editable: false });
        this.props.onChange(this.state.value);
    }

    edit = () => {
        this.setState({ editable: true });
    }

    render() {
        const { value, editable } = this.state;
        return (
            <div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <InputNumber
                                defaultValue={value}
                                onChange={this.handleChange}
                                onPressEnter={this.check}
                            />
                            <Icon
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.check}
                            />
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            {value}
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                                onClick={this.edit}
                            />
                        </div>
                }
            </div>
        );
    }
}

EditableCell.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func
};

export default EditableCell;
