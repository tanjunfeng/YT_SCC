/**
 * 进价审核 - 审核弹窗
 *
 * @author liujinyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal, Radio, Input } from 'antd';
import { withRouter } from 'react-router';

const FormItem = Form.Item;
const { TextArea } = Input;

class ExamineModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        const visible = nextProps.visible;
        if (visible !== this.props.visible) {
            this.setState({
                visible
            })
        }
    }

    /**
     * 点击确定
     */
    handleOk = () => {
        this.setState({
            ModalText: 'The modal will be closed after two seconds',
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 2000);
    }

    /**
     * 点击取消
     */
    handleCancel = () => {
        this.props.closeModal()
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { visible, confirmLoading } = this.state;
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
                            {getFieldDecorator('modifier', {
                                initialValue: '0',
                                rules: [{ required: true, message: '此项必选' }],
                            })(
                                <Radio.Group>
                                    <Radio value="1">通过</Radio>
                                    <Radio value="0">拒绝</Radio>
                                </Radio.Group>)}
                        </FormItem>
                        <FormItem label="审批意见" {...formItemLayout}>
                            {getFieldDecorator('title', {
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
    visible: PropTypes.bool,
    form: PropTypes.objectOf(PropTypes.any),
};

export default withRouter(Form.create()(ExamineModal));
