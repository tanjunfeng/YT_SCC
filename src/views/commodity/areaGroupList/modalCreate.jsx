/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 区域组管理
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Modal, Input } from 'antd';
import {
    createAreaGroup
} from '../../../actions/commodity';
import Utils from '../../../util/util';
import { BranchCompany } from '../../../container/search/index';

const FormItem = Form.Item;

@connect(() => ({
}), dispatch => bindActionCreators({
    createAreaGroup
}, dispatch))

class ModalCreate extends PureComponent {
    state = { confirmLoading: false }

    getFormData = (callback) => {
        const { validateFields } = this.props.form;
        this.setState({
            confirmLoading: true
        });
        validateFields((err, values) => {
            if (err || !this.validateBranchCompany(values)) {
                this.setState({
                    confirmLoading: false
                });
                callback(false);
            } else {
                const { areaGroupName, branchCompany } = values;
                callback(
                    true,
                    Utils.removeInvalid({
                        areaGroupName,
                        branchCompanyId: branchCompany.id,
                        branchCompanyName: branchCompany.name
                    })
                );
            }
        });
    }

    /**
     * 校验子公司是否未选取并报错
     *
     * @return {*bool} 校验失败返回 false
     */
    validateBranchCompany = values => {
        const { setFields } = this.props.form;
        if (values.branchCompany.id === '') {
            setFields({
                branchCompany: {
                    errors: [new Error('未选取所属子公司')],
                },
            });
            return false;
        }
        return true;
    }

    /**
     * 清除表单数据
     */
    clearData = () => {
        const { form } = this.props;
        const { resetFields, setFieldsValue } = form;
        resetFields();
        setFieldsValue({
            branchCompany: { reset: true }
        });
    }

    handleOk = () => {
        // 调用创建接口
        this.getFormData((validated, data) => {
            if (validated) {
                this.props.createAreaGroup(data).then(res => {
                    if (res.code === 200 && res.data === 1) {
                        this.props.onOk();
                        this.clearData();
                        this.setState({
                            confirmLoading: false
                        });
                    }
                });
            }
        });
    }

    handleCancel = () => {
        this.props.onCancel();
    }

    render() {
        const { confirmLoading } = this.state;
        const { visible, form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                className="area-group-modal"
                title={confirmLoading ? '正在提交，请稍候' : '新增区域组'}
                visible={visible}
                onOk={this.handleOk}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
            >
                <Form layout="inline">
                    <FormItem label="区域组名称">
                        {getFieldDecorator('areaGroupName', {
                            initialValue: '',
                            rules: [
                                { required: true, message: '请输入区域组名称' },
                                { max: 15, message: '活动名称最长15位' }
                            ]
                        })(<Input size="default" />)}
                    </FormItem>
                    <FormItem label="所属子公司">
                        {getFieldDecorator('branchCompany', {
                            initialValue: { id: '', name: '' },
                            rules: [{ required: true, message: '所属子公司不能为空' }]
                        })(<BranchCompany />)}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

ModalCreate.propTypes = {
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    createAreaGroup: PropTypes.func,
    visible: PropTypes.bool,
    form: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(ModalCreate));
