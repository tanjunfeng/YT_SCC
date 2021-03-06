import { InputNumber, Form } from 'antd';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MAXGOODS } from '../../../constant/index';

export default class EditableCell extends PureComponent {
    constructor(props) {
        super(props);
        this.validate = ::this.validate;
    }
    state = {
        value: this.props.value,
        max: this.props.max ? this.props.max : MAXGOODS,
        step: this.props.step,
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

    handleBlur() {
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

    validate(value) {
        let isValidate;
        // 采购数量未输入、不为采购内装数整数倍
        if (!value || (value > 0 &&
            (this.state.purchaseInsideNumber) &&
            (value % this.state.purchaseInsideNumber !== 0))) {
            this.setState({ validateStatus: 'error' });
            isValidate = false;
        } else {
            this.setState({ validateStatus: 'success' });
            isValidate = true;
        }
        return isValidate;
    }
    render() {
        const { value, step, max } = this.state;
        return (
            <div>
                {
                    <div>
                        {this.state.editable
                            && <Form.Item validateStatus={this.state.validateStatus}>
                                <InputNumber
                                    value={value}
                                    min={0}
                                    max={max}
                                    step={step}
                                    onChange={e => this.handleChange(e)}
                                    onBlur={e => this.handleBlur(e)}
                                    onPressEnter={e => this.onPressEnter(e)}
                                />
                            </Form.Item>
                        }
                        {!this.state.editable && <span>{value}</span>
                        }
                    </div>
                }
            </div>
        );
    }
}

EditableCell.propTypes = {
    value: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    purchaseInsideNumber: PropTypes.number,
    editable: PropTypes.bool,
    onChange: PropTypes.func
}
