import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {Modal, Select, Form, Input} from 'antd';
import Utils from '../../../util/util';
import {
    optionStatus,
} from '../../../constant/procurement';

const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

class ApproComment extends PureComponent {
    getFormData() {
        return new Promise((resolve, reject) => {
            this.props.form.validateFields((err, values) => {
                if (err) {
                    reject(err);
                }
                const {
                    outcome,
                    comment
                } = values;
                const dist = {
                    outcome,
                    comment
                };
                if (outcome === '') {
                    this.props.form.setFields({
                        outcome: {
                            value: values.area,
                            errors: [new Error('未选择审批状态')],
                        },
                    });
                    reject();
                } else {
                    Object.assign(dist, {
                        outcome
                    });
                }
                if (outcome === '0') {
                    if (comment === '') {
                        this.props.form.setFields({
                            comment: {
                                value: comment,
                                errors: [new Error('请输入审批意见!')]
                            }
                        });
                        reject();
                    } else {
                        Object.assign(dist, {
                            comment
                        });
                    }
                }
                resolve(Utils.removeInvalid(dist));
            });
        });
    }
    handleOk = () => {
        this.getFormData().then((param) => this.props.onOk(param));
        this.props.form.resetFields();
    }
    handleCancel = () => {
        this.props.onCancel();
        this.props.form.resetFields();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                visible={this.props.visible}
                title="审批意见"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Form onSubmit={(e) => {
                    e.preventDefault()
                }}
                >
                    {/* 审批意见 */}
                    <FormItem label="审批意见" style={{ display: 'flex' }}>
                        {getFieldDecorator('outcome', {
                            initialValue: optionStatus.defaultValue,
                            rules: [{ required: true, message: '请选择审批意见!' }]
                        })(
                            <Select style={{ width: '153px' }} size="default">
                                {
                                    optionStatus.data.map((item) => (
                                        <Option key={item.key} value={item.key}>
                                            {item.value}
                                        </Option>))
                                }
                            </Select>)}
                    </FormItem>
                    <FormItem label="意见" style={{ display: 'flex' }}>
                        {getFieldDecorator('comment', {
                            initialValue: '',
                            rules: [
                                { required: false, message: '请填写审批意见!' },
                                { max: 150, message: '请输入150字以内' }
                            ]
                        })(
                            <TextArea
                                placeholder="可填写意见"
                                style={{ resize: 'none' }}
                                autosize={{
                                    minRows: 4,
                                    maxRows: 6
                                }}
                            />)}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}
ApproComment.propTypes = {
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    onOk: PropTypes.func
}

export default withRouter(Form.create()(ApproComment));
