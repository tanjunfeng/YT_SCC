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
    constructor(props) {
        super(props);
        this.state = {
            selectValue: null,
            textareaValue: null,
        }
    }
    getFormData() {
        return new Promise((resolve, reject) => {
            this.props.form.validateFields((err, values) => {
                if (err) {
                    reject(err);
                }
                const {
                    auditResult,
                    auditOpinion
                } = values;
                const dist = {
                    auditResult,
                    auditOpinion
                };
                if (auditResult === '') {
                    this.props.form.setFields({
                        auditResult: {
                            value: values.area,
                            errors: [new Error('未选择审批状态')],
                        },
                    });
                    reject();
                } else {
                    Object.assign(dist, {
                        auditResult
                    });
                }
                if (auditResult === '0') {
                    if (auditOpinion === '') {
                        this.props.form.setFields({
                            auditOpinion: {
                                value: auditOpinion,
                                errors: [new Error('请输入审批意见!')]
                            }
                        });
                        reject();
                    } else {
                        Object.assign(dist, {
                            auditOpinion
                        });
                    }
                }
                resolve(Utils.removeInvalid(dist));
            });
        });
    }
    handleOk = () => {
        this.getFormData().then((param) => this.props.handleCommentOk(param))
    }
    selectChange = (value) => {
        this.setState({
            selectValue: value
        })
    }
    textareaChange = (event) => {
        this.setState({
            textareaValue: event.target.value
        })
    }
    handleCancel = () => {
        this.props.onCancel();
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
                {/* <div>
                    <span>审批：</span>
                    <Select defaultValue="请选择" onChange={this.selectChange}>
                        <Option value="请选择">请选择</Option>
                        <Option value="通过">通过</Option>
                        <Option value="拒绝">拒绝</Option>
                    </Select>
                </div>
                <div className="comment">
                    <span>审批意见：</span>
                    <textarea onChange={this.textareaChange} />
                </div> */}
                <Form onSubmit={(e) => {
                    e.preventDefault()
                }}
                >
                    {/* 审批意见 */}
                    <FormItem label="审批意见" style={{ display: 'flex' }}>
                        {getFieldDecorator('auditResult', {
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
                        {getFieldDecorator('auditOpinion', {
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
    handleCommentOk: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(ApproComment));
