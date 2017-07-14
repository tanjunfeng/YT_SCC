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
import { DicContentListVisible, Dictionarycontentlist } from '../../../actions/dictionary';
const FormItem = Form.Item;

@connect(
    state => ({
        maintenanceVisible: state.toJS().dictionary.maintenanceVisible,
        contentlistData: state.toJS().dictionary.contentlistData,
        id: state.toJS().dictionary.id
    }),
    dispatch => bindActionCreators({
        DicContentListVisible,
        Dictionarycontentlist
    }, dispatch)
)
class modifyContentlist extends PureComponent {
    constructor(props) {
        super(props);
        this.handleCancelModify = ::this.handleCancelModify;
        this.handleOk = ::this.handleOk;
    }
    componentDidMount() {
        const { id } = this.props;
        this.props.Dictionarycontentlist({ dictionaryId: id })
    }
    handleOk() {
        const id = this.props.id;
    }

    handleCancelModify() {
        this.props.DicContentListVisible({ isVisible: false })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { contentlistData } = this.props;
        const { dictionary, remark, contentName } = contentlistData;
        return (
            <Modal
                onOk={this.handleOk}
                onCancel={this.handleCancelModify}
                visible={this.props.maintenanceVisible}
                title="维护字典内容"
                okText="保存"
            >
                <div>
                    <div className="ant-form-item-control">
                        <span className="manage-form-label change-form-label">字典名称:</span>
                        <span>{dictionary}</span>
                    </div>
                    <div className="ant-form-item-control">
                        <span className="manage-form-label change-form-label">说明:</span>
                        <span>{remark}</span>
                    </div>
                    <div className="ant-form-item-control">
                        <span className="manage-form-label change-form-label">字典内容:</span>
                        <span>{contentName}</span>
                    </div>
                    <Form layout="vertical">
                        <FormItem className="manage-form-item">
                            <span className="manage-form-label change-form-label">字典名称：</span>
                            {getFieldDecorator('dictionary', {
                                rules: [{
                                    message: '请输入字典名称'
                                }],
                            })(
                                <Input className="manage-form-input" />
                                )}
                        </FormItem>
                        <FormItem >
                            <span className="manage-form-label change-form-label">字典编码：</span>
                            {getFieldDecorator('code', {
                                rules: [{
                                    message: '请输入字典编码'
                                }],
                            })(
                                <Input className="manage-form-input" />
                                )}
                        </FormItem>
                        <FormItem >
                            <span className="manage-form-label change-form-label">说明：</span>
                            {getFieldDecorator('remark')(<Input className="manage-form-input" type="textarea" />)}
                        </FormItem>
                    </Form>
                </div>
            </Modal >
        );
    }
}
export default withRouter(Form.create()(modifyContentlist));
