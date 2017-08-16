import { Table, InputNumber, Form } from 'antd';
import React, { PureComponent } from 'react';
export default class EditableCell extends PureComponent {
    constructor(props) {
        super(props);
        this.validate =::this.validate;
    }
    state = {
        value: this.props.value,
        deliveriedQuantity: this.props.deliveriedQuantity,
        validateStatus: null,
        editable: this.props.editable
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
        let { onChange } = this.props;
        let validateResult = this.validate(this.state.value);
        // call 回调函数
        if (onChange) {
            onChange({ value: this.state.value, isValidate: validateResult });
        }
    }

    validate(value) {
        let isValidate;
        //收货数量>供应商发运数量
        if (value && (value > 0 && (value > this.state.deliveriedQuantity))) {
            this.setState({ validateStatus: "error" });
            isValidate = false;
        } else {
            this.setState({ validateStatus: "success" });
            isValidate = true;
        }

        return isValidate;
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value, editable: nextProps.editable });
        this.validate(nextProps.value);
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