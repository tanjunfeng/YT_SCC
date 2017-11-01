import { InputNumber, Form } from 'antd';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class EditableCell extends PureComponent {
    constructor(props) {
        super(props);
        this.validate = ::this.validate;
    }
    state = {
        value: this.props.value,
        purchaseInsideNumber: this.props.purchaseInsideNumber,
        validateStatus: null,
        editable: this.props.editable
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value, editable: nextProps.editable });
        this.validate(nextProps.value);
    }

    onPressEnter() {
        const { onChange } = this.props;
        const validateResult = this.validate(this.state.value);
        // call 回调函数
        if (onChange) {
            onChange({ value: this.state.value, isValidate: validateResult });
        }
    }

    handleChange(value) {
        this.setState({ value });
    }

    handleBlur() {
        const { onChange } = this.props;
        const validateResult = this.validate(this.state.value);
        // call 回调函数
        if (onChange) {
            onChange({ value: this.state.value, isValidate: validateResult });
        }
    }

    validate(value) {
        let isValidate;
        // 收货数量>供应商发运数量
        if (value && (value > 0 && (value > this.state.purchaseInsideNumber))) {
            this.setState({ validateStatus: 'error' });
            isValidate = false;
        } else {
            this.setState({ validateStatus: 'success' });
            isValidate = true;
        }

        return isValidate;
    }

    render() {
        const { value } = this.state;
        return (
            <div>
                {
                    <div>
                        {this.state.editable &&
                            <Form.Item validateStatus={this.state.validateStatus}>
                                <InputNumber
                                    value={value}
                                    min={1}
                                    onChange={e => this.handleChange(e)}
                                    onBlur={e => this.handleBlur(e)}
                                    onPressEnter={e => this.onPressEnter(e)}
                                />
                            </Form.Item>
                        }
                        {!this.state.editable &&
                            <span>{value}</span>
                        }
                    </div>
                }
            </div>
        );
    }
}

EditableCell.propTypes = {
    value: PropTypes.string,
    purchaseInsideNumber: PropTypes.number,
    editable: PropTypes.bool,
    onChange: PropTypes.func
}
