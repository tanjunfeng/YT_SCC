import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { updateQuickNavigation } from '../../../service';
import {
    Form,
    Input,
    Select,
    Modal,
    message,
    Button
} from 'antd';

import { fetchQuickNavigationList, showEditModal } from '../../../actions/wap';
import FileCut from '../fileCut';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({
        modalVisible: state.toJS().wap.modalVisible,
        visibleData: state.toJS().wap.visibleData,
    }),
    dispatch => bindActionCreators({
        fetchQuickNavigationList,
        showEditModal
    }, dispatch)
)
class EditModal extends Component {
    constructor(props) {
        super(props);
        this.handleCut = ::this.handleCut;
        this.handleEdit = ::this.handleEdit;
        this.handleOk = ::this.handleOk;
        this.handleCancel = ::this.handleCancel;
        this.state = {
            isCut: true
        }
        this.img = '';
    }

    handleCancel() {
        this.props.showEditModal({showModal: false})
    }

    handleCut() {
        this.img = this.imageUploader.getImageByBase64();
        this.setState({
            isCut: false
        })
    }

    handleEdit() {
        this.setState({
            isCut: true
        })
    }

    handleOk() {
        const { id, navigationPosition } = this.props.visibleData;
        this.props.form.validateFields((err, values) => {
            updateQuickNavigation({
                id,
                navigationPosition,
                picAddress: 'https://fd.yatang.cn/group1/M00/01/A6/wKgCZVlQdrCAF26_AAAcP4buFxQ212.png',
                ...values
            }).then((res) => {
                this.handleCancel();
                this.props.fetchQuickNavigationList();
            })
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { visibleData } = this.props;
        return (
            <Modal
                title="修改快捷功能设置"
                visible={this.props.modalVisible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                okText="保存"
            >
                <Form className="change-form">
                    <FormItem className="manage-form-item">
                        <span className="manage-form-label change-form-label">序号：</span>
                        <span>{visibleData.navigationPosition}</span>
                    </FormItem>
                    <FormItem className="manage-form-item">
                        <span className="manage-form-label change-form-label">类型：</span>
                        {getFieldDecorator('navigationType', {
                            rules: [{
                                required: true,
                                message: '请选择类型'
                            }],
                            initialValue: visibleData.navigationType
                        })(
                            <Select
                                style={{ width: '153px' }}
                                size="default"
                                placeholder="请选择"
                            >
                                <Option value="静态页面">静态页面</Option>
                                <Option value="功能链接">功能链接</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem className="manage-form-item">
                        <span className="manage-form-label change-form-label">名称：</span>
                        {getFieldDecorator('navigationName', {
                            rules: [{
                                required: true,
                                message: '请输入名称'
                            }],
                            initialValue: visibleData.navigationName
                        })(
                            <Input
                                className="manage-form-input"
                                placeholder="名称"
                            />
                        )}
                        <span className="change-form-tip">（说明：2~4个汉字）</span>
                    </FormItem>
                    <FormItem className="application-form-item">
                        <span className="application-modal-label">链接地址：</span>
                        {getFieldDecorator('linkAddress', {
                            rules: [{required: true, message: '请输入链接地址', whitespace: true}],
                            initialValue: visibleData.linkAddress
                        })(
                            <Input
                                onChange={this.handleTextChange}
                                type="textarea"
                                placeholder="请输入链接地址"
                                className="application-modal-textarea"
                                autosize={{ minRows: 2, maxRows: 8 }}
                            />
                        )}
                    </FormItem>
                    <FormItem className={
                        classnames('manage-form-item')
                    }>
                        <span className="manage-form-label change-form-label">快捷icon：（说明：支持PNG，建议大小200X200px，100k以内）</span>
                        <FileCut
                            ref={ref => { this.imageUploader = ref }}
                            width={200}
                            height={200}
                            accept={['jpg', 'jpeg', 'png']}
                        />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

EditModal.propTypes = {
    modalVisible: PropTypes.bool,
    showEditModal: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    fetchQuickNavigationList: PropTypes.func,
    visibleData: PropTypes.objectOf(PropTypes.any),
};

export default Form.create()(EditModal);
