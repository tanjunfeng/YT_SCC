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
    createAreaGroup, isAreaGroupExists
} from '../../../actions/commodity';
import Utils from '../../../util/util';
import { BranchCompany } from '../../../container/search/index';

const FormItem = Form.Item;

@connect(() => ({
}), dispatch => bindActionCreators({
    createAreaGroup, isAreaGroupExists
}, dispatch))

class ModalCreate extends PureComponent {
    state = { confirmLoading: false }

    getFormData = new Promise((resolve, reject) => {
        const { form } = this.props;
        const { validateFields, setFields } = form;
        validateFields((err, values) => {
            const { areaGroupName, branchCompany } = values;
            if (err) {
                reject();
            } else if (!areaGroupName || Utils.trim(areaGroupName) === '') {
                setFields({
                    areaGroupName: {
                        value: '',
                        errors: [new Error('未填写区域组名称')],
                    },
                });
                reject();
            } else if (!branchCompany || branchCompany.id === '') {
                setFields({
                    branchCompany: {
                        errors: [new Error('未选取所属子公司')],
                    },
                });
                reject();
            } else {
                resolve(Utils.removeInvalid({
                    areaGroupName,
                    branchCompanyId: branchCompany.id,
                    branchCompanyName: branchCompany.name
                }));
            }
        })
    })

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

    /**
     * 判断区域组名称是否重复
     */
    isDuplicate = data => new Promise((resolve, reject) => {
        const { areaGroupName } = data;
        this.props.isAreaGroupExists({
            areaGroupName
        }).then(res => {
            if (res.code === 200) {
                resolve(data);
            } else {
                reject();
            }
        }).catch(() => {
            reject();
        });
    });

    /**
     * 保存数据到后台
     */
    saveData = data => new Promise((resolve, reject) => {
        this.props.createAreaGroup(data).then(res => {
            // 正确返回并写入一行数据
            if (res.code === 200 && res.data === 1) {
                this.props.onOk();
                this.clearData();
            } else {
                reject();
            }
        }).catch(() => { reject() });
    });

    handleOk = () => {
        // 调用创建接口
        this.getFormData().then(
            data => this.isDuplicate(data)
        ).then(data => this.saveData(data)).finally(() => {
            this.setState({
                confirmLoading: false
            });
        })
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
    isAreaGroupExists: PropTypes.func,
    visible: PropTypes.bool,
    form: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(ModalCreate));
