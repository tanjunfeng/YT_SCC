import { InputNumber, Form } from 'antd';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MAXGOODS } from '../../../constant/index';

const FormItem = Form.Item;

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
        editable: this.props.editable,
        message: ''
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value, editable: nextProps.editable });
        this.validate(nextProps.value);
    }

    onPressEnter() {
        const { onChange } = this.props;
        this.validate(this.state.value);
        // call 回调函数
        if (onChange) {
            onChange({ value: this.state.value});
        }
    }

    handleBlur() {
        const { onChange } = this.props;
        this.validate(this.state.value);
        // call 回调函数
        if (onChange) {
            onChange({ value: this.state.value});
        }
    }

    handleChange(value) {
        this.setState({ value });
    }

    validate(value) {
        // 采购数量未输入、不为采购内装数整数倍
        if (!value && this.props.type === 'price') {
            this.setState({
                validateStatus: 'error',
                message: '采购价格必须为正数'
            });
        } else if (!value && this.props.type === 'number') {
            this.setState({
                validateStatus: 'error',
                message: '采购数量必须为正整数'
            });
        } else if ((value > 0 &&
            (this.state.purchaseInsideNumber) &&
            (value % this.state.purchaseInsideNumber !== 0))) {
            this.setState({
                validateStatus: 'error',
                message: '采购数量必须为采购内装数的整数倍'
            });
        } else {
            this.setState({
                validateStatus: 'success',
                message: ''
            });
        }
    }
    render() {
        const { value, step, max } = this.state;
        return (
            <div>
                {
                    <div>
                        {this.state.editable
                            && <FormItem
                                validateStatus={this.state.validateStatus}
                                help={this.state.message}
                            >
                                <InputNumber
                                    value={value}
                                    min={0}
                                    max={max}
                                    step={step}
                                    onChange={e => this.handleChange(e)}
                                    onBlur={e => this.handleBlur(e)}
                                    onPressEnter={e => this.onPressEnter(e)}
                                />
                            </FormItem>
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
    onChange: PropTypes.func,
    type: PropTypes.string,
}
