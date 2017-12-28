/**
 * 进价审核 - 审核弹窗
 *
 * @author liujinyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal, Radio, Input, message } from 'antd';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { returnAuditInfo } from '../../../actions/process';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(() => ({}), dispatch => bindActionCreators({
    returnAuditInfo
}, dispatch))

class ExamineModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            confirmLoading: false,
        }
    }

    /**
     * 点击确定
     */
    handleOk = () => {
        // 表单校验
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    confirmLoading: true,
                });
                const { taskId, type } = this.props;
                const submitObj = Object.assign(values, { taskId, type })
                this.props.returnAuditInfo(submitObj)
                    .then(res => {
                        if (res.code === 200) {
                            message.success('保存成功');
                            this.setState({
                                confirmLoading: false
                            });
                            this.handleCancel();
                        } else {
                            message.success(res.message);
                        }
                    })
            }
        })
    }

    /**
     * 点击取消
     */
    handleCancel = () => {
        this.props.closeModal()
        this.props.form.resetFields();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { confirmLoading } = this.state;
        const { visible } = this.props;
        // 样式配置
        const formItemLayout = {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 18
            },
        };
        return (
            <div>
                <Modal
                    title="采购进价/售价审批"
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <Form layout="vertical">
                        <FormItem label="审批" {...formItemLayout}>
                            {getFieldDecorator('outcome', {
                                initialValue: 'reject',
                                rules: [{ required: true, message: '此项必选' }],
                            })(
                                <Radio.Group>
                                    <Radio value="pass">通过</Radio>
                                    <Radio value="reject">拒绝</Radio>
                                </Radio.Group>)}
                        </FormItem>
                        <FormItem label="审批意见" {...formItemLayout}>
                            {getFieldDecorator('comment', {
                                rules: [
                                    {
                                        required: true,
                                        message: '此项必填'
                                    }, {
                                        min: 5,
                                        message: '审批意见不少于5个字'
                                    }],
                            })(
                                <TextArea rows={4} placeholder="请输入审批意见（不少于5个字）" />)}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}

ExamineModal.propTypes = {
    handlePurchaseSearch: PropTypes.func,
    handlePurchaseReset: PropTypes.func,
    closeModal: PropTypes.func,
    returnAuditInfo: PropTypes.func,
    visible: PropTypes.bool,
    form: PropTypes.objectOf(PropTypes.any),
    taskId: PropTypes.string,
    type: PropTypes.string
};

export default withRouter(Form.create()(ExamineModal));
