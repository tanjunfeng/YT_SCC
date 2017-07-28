import { Table, InputNumber, Form } from 'antd';
import React, { PureComponent } from 'react';
export default class EditableCell extends PureComponent {
    constructor(props) {
        super(props);
        console.log(props);
        this.validate =::this.validate;
    }
    state = {
        value: this.props.value,
        step: this.props.step,
        poInnerAmount: this.props.poInnerAmount,
        validateStatus: null,
        editable: this.props.editable
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value, editable: nextProps.editable });
        this.validate(nextProps.value);
    }

    handleChange(value) {
        this.setState({ value });
    }
    handleBlur() {
        let { onChange } = this.props;
        let validateResult = this.validate(this.state.value);
        // call 回调函数
        if (onChange) {
            onChange({ value: this.state.value, isValidate: validateResult });
        }
    }
    onPressEnter() {
        console.log("on press enter");
        let { onChange } = this.props;
        let validateResult = this.validate(this.state.value);
        // call 回调函数
        if (onChange) {
            onChange({ value: this.state.value, isValidate: validateResult });
        }
    }

    validate(value) {
        let isValidate;
        //采购数量未输入、不为采购内装数整数倍
        if (!value || (value > 0 && (value % this.state.poInnerAmount != 0))) {
            this.setState({ validateStatus: "error" });
            isValidate = false;
        } else {
            this.setState({ validateStatus: "success" });
            isValidate = true;
        }

        return isValidate;
    }
    render() {
        const { value, step } = this.state;
        return (
            <div>
                {
                    <div>
                        {this.state.editable && <Form.Item validateStatus={this.state.validateStatus}>
                            <InputNumber
                                value={value}
                                min={1}
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