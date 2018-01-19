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

    getFormData = () => {
        const { areaGroupName, branchCompany } = this.props.form.getFieldsValue();
        return Utils.removeInvalid({ areaGroupName, branchCompanyId: branchCompany.id });
    }

    /**
     * 清除表单数据
     */
    clearData = () => {
        const {form } = this.props;
        const { resetFields, setFieldsValue } = form;
        resetFields();
        setFieldsValue({
            areaGroup: { reset: true },
            branchCompany: { reset: true }
        });
    }

    handleOk = () => {
        this.props.createAreaGroup(this.getFormData());
        this.props.onOk();
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
                            rules: [{ required: true, message: '请输入区域组名称' }]
                        })(<Input size="default" />)}
                    </FormItem>
                    <FormItem label="所属子公司">
                        {getFieldDecorator('branchCompany', {
                            rules: [{ required: true, message: '所属子公司不能为空' }],
                            initialValue: { id: '', name: '' }
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
