import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form, InputNumber } from 'antd';
import { Validator } from '../../util/validator'

const FormItem = Form.Item;

const AscadeChoice = (props) => {
    const { getFieldDecorator } = props.form;
    const { step } = props;
    return (
        <Form layout="inline" onSubmit={this.handleSubmit} className="ascade-choice-form">
            <FormItem className="ascade-choice-first">
                {getFieldDecorator('first', {
                    rules: [Validator.type.number]
                })(
                    <InputNumber size="default" max={99.99} min={0} />
                )}
            </FormItem>
            <span className="ascade-choice-step">{step}</span>
            <FormItem className="ascade-choice-second">
                {getFieldDecorator('second', {
                    rules: [Validator.type.number]
                })(
                    <InputNumber size="default" max={99.99} min={0} />
                )}
            </FormItem>
        </Form>
    );
}

AscadeChoice.propTypes = {
    step: PropTypes.string,
    form: PropTypes.objectOf(PropTypes.any),
}

AscadeChoice.defaultProps = {
    step: '到'
}

export default Form.create()(AscadeChoice);
