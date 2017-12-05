import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Form,
    Input,
    Modal,
    Row,
    Col,
    message
} from 'antd';
import Utils from '../../util/util';
import { modifypassword } from '../../actions/pub';

const FormItem = Form.Item;

@connect(
    state => ({
        modalVisible: state.toJS().wap.modalVisible
    }),
    dispatch => bindActionCreators({
        modifypassword
    }, dispatch)
)
class ModifyThePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible
        }
    }

    // 获取用于搜索的所有有效表单值
    getFormData = () => (
        new Promise((resolve, reject) => {
            this.props.form.validateFields((err, values) => {
                if (err) {
                    reject(err);
                }
                const {
                    newPassword,
                    newPasswords
                } = values;
                const dist = {
                    newPassword,
                    newPasswords
                };
                if (newPassword !== null) {
                    Object.assign(dist, {
                        newPassword
                    });
                }
                if (newPasswords !== null) {
                    Object.assign(dist, {
                        newPasswords
                    });
                }
                if (newPassword !== undefined) {
                    if (newPassword !== newPasswords) {
                        this.props.form.setFields({
                            newPassword: {
                                value: values.newPasswords,
                                errors: [new Error('两次输入密码不一致，请重新输入')],
                            },
                        });
                        this.props.form.setFields({
                            newPasswords: {
                                value: values.newPasswords,
                                errors: [new Error('两次输入密码不一致，请重新输入')],
                            },
                        });
                        reject();
                    } else {
                        Object.assign(dist, {
                            newPassword,
                            newPasswords
                        });
                    }
                }
                resolve(Utils.removeInvalid(dist));
            });
        })
    )

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = () => {
        this.getFormData().then((param) => {
            this.props.modifypassword({newPassword: param.newPassword})
            .then((res) => {
                if (res.code === 200) {
                    this.props.onChange(false);
                    message.success('密码修改成功!')
                }
            }).catch((res) => {
                message.error(res.message)
            })
        });
    }
    handleCancel = () => {
        this.props.onChange(false);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { visible } = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 22 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            <div>
                {
                    visible &&
                    <Modal
                        title="修改密码"
                        visible={visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        htmlType="submit"
                    >
                        <Form className="change-form" onSubmit={this.handleOk}>
                            <FormItem
                                {...formItemLayout}
                                label="原密码"
                                style={{display: 'flex'}}
                            >
                                <Row gutter={8}>
                                    <Col span={12}>
                                        {getFieldDecorator('oldPassword', {
                                            rules: [{ required: true, message: '请输入原密码!' }],
                                        })(
                                            <Input style={{width: 200}} />
                                            )}
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="新密码"
                                extra="密码为6-20位字母、数字或者下划线"
                                style={{display: 'flex'}}
                            >
                                <Row gutter={8}>
                                    <Col span={12}>
                                        {getFieldDecorator('newPassword', {
                                            rules: [{ required: true, message: '您输入的密码不匹配，请重新输入!' }],
                                        })(
                                            <Input style={{width: 200}} />
                                            )}
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="重复新密码"
                                extra="密码为6-20位字母、数字或者下划线"
                                style={{display: 'flex'}}
                            >
                                <Row gutter={8}>
                                    <Col span={12}>
                                        {getFieldDecorator('newPasswords', {
                                            rules: [{ required: true, message: '您输入的密码不匹配，请重新输入!' }],
                                        })(
                                            <Input style={{width: 200}} />
                                            )}
                                    </Col>
                                </Row>
                            </FormItem>
                        </Form>
                    </Modal>
                }
            </div>
        );
    }
}

ModifyThePassword.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    visible: PropTypes.bool,
    onChange: PropTypes.func,
    modifypassword: PropTypes.func
};

export default Form.create()(ModifyThePassword);
