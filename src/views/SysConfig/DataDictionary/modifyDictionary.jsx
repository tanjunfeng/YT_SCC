/**
 * @file modifyDictionary.jsx
 * @author shixinyuan
 *
 * 数据字典维护弹窗
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Modal, Input } from 'antd';
import { dictionarylist, DictionaryVisible, addDictionary, UpdateDictionary } from '../../../actions/dictionary';
const FormItem = Form.Item;

@connect(
    state => ({
        isEdit: state.toJS().dictionary.isEdit,
        record: state.toJS().dictionary.record,
        dictionaryVisible: state.toJS().dictionary.dictionaryVisible
    }),
    dispatch => bindActionCreators({
        dictionarylist,
        DictionaryVisible,
        addDictionary,
        UpdateDictionary
    }, dispatch)
)
class modifyDictionary extends PureComponent {
    constructor(props) {
        super(props);
        this.handleCancelModify = ::this.handleCancelModify;
        this.handleOk = ::this.handleOk;
    }

    handleOk() {
        const result = this.props.form.getFieldsValue();
        const { id } = this.props.record;
        this.props.isEdit ?
            this.props.UpdateDictionary({
                ...result, id
            }).then(() => {
                this.props.DictionaryVisible({ isVisible: false })
                this.props.fetchList();
            }) :
            this.props.addDictionary({
                ...result
            }).then(() => {
                this.props.DictionaryVisible({ isVisible: false })
                this.props.fetchList();
            });
    }

    handleCancelModify() {
        this.props.DictionaryVisible({ isVisible: false })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { isEdit, record } = this.props;
        return (
            <Modal
                onOk={this.handleOk}
                onCancel={this.handleCancelModify}
                visible={this.props.dictionaryVisible}
                title={isEdit ? '修改字典' : '新增字典'}
                okText="保存"
            >
                <Form layout="vertical">
                    <FormItem className="manage-form-item">
                        <span className="manage-form-label change-form-label">字典名称：</span>
                        {getFieldDecorator('dictionary', {
                            rules: [{
                                message: '请输入字典名称'
                            }],
                            initialValue: isEdit ? record.dictionary : ''
                        })(
                            <Input
                                className="manage-form-input"
                            />
                            )}
                    </FormItem>
                    <FormItem >
                        <span className="manage-form-label change-form-label">字典编码：</span>
                        {getFieldDecorator('code', {
                            rules: [{
                                message: '请输入字典编码'
                            }],
                            initialValue: isEdit ? record.code : ''
                        })(
                            <Input className="manage-form-input" />
                            )}
                    </FormItem>
                    <FormItem >
                        <span className="manage-form-label change-form-label">说明：</span>
                        {getFieldDecorator('remark', {
                            rules: [{
                                message: '请输入说明'
                            }],
                            initialValue: isEdit ? record.remark : ''
                        })(
                            <Input className="manage-form-input" type="textarea" />
                            )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}
export default withRouter(Form.create()(modifyDictionary));
