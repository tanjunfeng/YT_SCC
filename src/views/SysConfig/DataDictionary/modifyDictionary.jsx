/**
 * @file list.jsx
 * @author shijh
 *
 * 管理列表页面
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Modal, Input } from 'antd';
import { dictionarylist, DictionaryVisible } from '../../../actions/dictionary';
const FormItem = Form.Item;

@connect(
    state => ({
        dictionaryVisible: state.toJS().dictionary.dictionaryVisible
    }),
    dispatch => bindActionCreators({
        dictionarylist,
        DictionaryVisible
    }, dispatch)
)
class modifyDictionary extends PureComponent {
    constructor(props) {
        super(props);
        this.handleCancelModify = ::this.handleCancelModify
    }

    handleCancelModify() {
        this.props.DictionaryVisible({ isVisible: false })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                onOk={this.handleOk}
                onCancel={this.handleCancelModify}
                visible={this.props.dictionaryVisible}
                title="数据字典"
                okText="保存"
            >
                <Form layout="vertical">
                    <FormItem className="manage-form-item">
                        <span className="manage-form-label change-form-label">字典名称：</span>
                        {getFieldDecorator('title', {
                            rules: [{
                                message: '请输入字典名称'
                            }],
                        })(
                            <Input className="manage-form-input" />
                            )}
                    </FormItem>
                    <FormItem >
                        <span className="manage-form-label change-form-label">字典编码：</span>
                        {getFieldDecorator('title', {
                            rules: [{
                                message: '请输入字典编码'
                            }],
                        })(
                            <Input className="manage-form-input" />
                            )}
                    </FormItem>
                    <FormItem >
                        <span className="manage-form-label change-form-label">说明：</span>
                        {getFieldDecorator('description')(<Input className="manage-form-input" type="textarea" />)}
                    </FormItem>
                    <FormItem className="collection-create-form_last-form-item">
                        {getFieldDecorator('modifier', {
                            initialValue: 'public',
                        })}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}
export default withRouter(Form.create()(modifyDictionary));
