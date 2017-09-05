/**
 * @file changeCategoryMessage.jsx
 * @author Tan junfeng
 *
 * 静态页管理模态框
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Modal, Form, Input, message } from 'antd';

import Utils from '../../../util/util';
import {
    modifyMediaAddVisible,
    modifyToAddInsertpage,
    modifyUpdatePageBase,
    fetchFindStaticPageList
} from '../../../actions';
import { PAGE_SIZE } from '../../../constant';

const FormItem = Form.Item;

@connect(
    state => ({
        toAddPriceVisible: state.toJS().mediaManage.toAddPriceVisible,
        data: state.toJS().mediaManage.data,
        categoryOrderList: state.toJS().mediaManage.categoryOrderList,
        toAddMediaTitle: state.toJS().mediaManage.toAddMediaTitle,
        visibleData: state.toJS().mediaManage.visibleData,
    }),
    dispatch => bindActionCreators({
        fetchFindStaticPageList,
        modifyMediaAddVisible,
        modifyToAddInsertpage,
        modifyUpdatePageBase
    }, dispatch)
)
class ChangeMessage extends PureComponent {
    constructor(props) {
        super(props);
        this.handleInformationOk = this.handleInformationOk.bind(this);
        this.handleInformationCancel = this.handleInformationCancel.bind(this);
        this.handleInformationOk = this.handleInformationOk.bind(this);

        this.state = {
            isDisabled: true
        }
    }

    handleInformationCancel() {
        this.props.modifyMediaAddVisible({isVisible: false});
    }

    handleInformationOk() {
        const {
            description,
            name,
        } = this.props.form.getFieldsValue();
        const { toAddMediaTitle, visibleData } = this.props;
        const { id } = visibleData;
        switch (toAddMediaTitle) {
            case '新增静态页':
                this.props.form.validateFields((err) => {
                    if (!err) {
                        this.props.modifyToAddInsertpage({
                            ...Utils.removeInvalid({ name, description})
                        }).then(() => {
                            message.success('新增成功！');
                            if (
                                (name !== '')
                                &&
                                (description !== '')) {
                                this.props.fetchFindStaticPageList({
                                    pageSize: PAGE_SIZE,
                                    pageNum: 1
                                });
                                this.props.modifyMediaAddVisible({isVisible: false});
                            }
                        }).catch((error) => {
                            message.error(error.message);
                        });
                    }
                })
                break;
            case '基础编辑':
                this.props.form.validateFields((err) => {
                    if (!err) {
                        this.props.modifyUpdatePageBase({
                            ...Utils.removeInvalid({ id, name, description })
                        }).then(() => {
                            message.success('编辑成功!');
                            if (
                                (name !== '')
                                &&
                                (description !== '')) {
                                this.props.fetchFindStaticPageList({
                                    pageSize: PAGE_SIZE,
                                    pageNum: 1
                                });
                                this.props.modifyMediaAddVisible({
                                    isVisible: false
                                });
                            }
                        }).catch((error) => {
                            message.error(error.message);
                        });
                    }
                })
                break;
            default:
                break;
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { prefixCls } = this.props;
        const {
            name,
            description,
        } = this.props.visibleData;
        const toAddMediaTitle = this.props.toAddMediaTitle;
        return (
            <div>
                <Modal
                    title={toAddMediaTitle}
                    visible={this.props.toAddPriceVisible}
                    onOk={this.handleInformationOk}
                    onCancel={this.handleInformationCancel}
                    maskClosable={false}
                    initialValue={this.props.visibleData}
                    width="450px"
                >
                    <Form className="jtgl-change-form">
                        <FormItem className="manage-form-item1">
                            <div>
                                <span className={`${prefixCls}-mc`}>
                                    <b>*</b>
                                    名称
                                </span>
                                {getFieldDecorator('name', {
                                    rules: [{
                                        required: true,
                                        message: '请输入名称'
                                    }],
                                    initialValue: name
                                })(
                                    <Input className={`${prefixCls}-input nameShow ant-input-lg`} />
                                )}
                            </div>
                        </FormItem>
                        <FormItem className="manage-form-item2">
                            <span className={`${prefixCls}-ms`}>描述</span>
                            {getFieldDecorator('description', {
                                rules: [{
                                    required: true,
                                    message: '请输入描述'
                                }],
                                initialValue: description
                            })(
                                <Input
                                    type="textarea"
                                    className={`${prefixCls}-input nameShow ant-input-lg`}
                                    rows={4}
                                />
                                )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

ChangeMessage.propTypes = {
    modifyMediaAddVisible: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    visibleData: PropTypes.objectOf(PropTypes.any),
    toAddMediaTitle: PropTypes.objectOf(PropTypes.any),
    modifyToAddInsertpage: PropTypes.func,
    fetchFindStaticPageList: PropTypes.func,
    modifyUpdatePageBase: PropTypes.func,
    toAddPriceVisible: PropTypes.bool,
    prefixCls: PropTypes.string,
}

ChangeMessage.defaultProps = {
    prefixCls: 'changeMessage-line',
};

export default withRouter(Form.create()(ChangeMessage));
