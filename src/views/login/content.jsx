import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Form, Icon, Input, Button } from 'antd';

const FormItem = Form.Item;

class Content extends PureComponent {
    constructor(props) {
        super(props);

        // this.handleLogin = ::this.handleLogin;
    }

    componentWillMount() { }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err) => {
            if (!err) {
                const { from } = this.props.location.state || { from: { pathname: '/' } };
                window.location.href = from.pathname;
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="yt-login-contn">
                <div className="yt-login-header">欢迎登陆</div>
                <Form onSubmit={this.handleSubmit} className="yt-login-form">
                    <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: '请输入您的用户名!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
                            )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入您的密码!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />
                            )}
                    </FormItem>
                     <FormItem>
                        {getFieldDecorator('verificationCode', {
                            rules: [{ required: true, message: '请输入您的验证码!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="verificationCode" placeholder="请输入验证码" />
                            )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" className="yt-login-form-button">
                            登陆
                        </Button>
                    </FormItem>
                    
                </Form>
            </div>
        )
    }
}

export default withRouter(Form.create()(Content));