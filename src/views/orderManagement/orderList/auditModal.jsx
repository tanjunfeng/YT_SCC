/**
 * @file distributionInfo.jsx
 * @author caoyanxuan
 *
 * 订单管理-审核模态框
 */

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Input, Select, Modal, message } from 'antd';
import { modifyAuditModalVisible } from '../../../actions/modify/modifyAuditModalVisible';

const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

@connect(
    state => ({
        auditModalVisible: state.toJS().order.auditModalVisible,
        visibleData: state.toJS().order.visibleData,
    }),
    dispatch => bindActionCreators({
        modifyAuditModalVisible
    }, dispatch)
)
class AuditModal extends PureComponent {
    constructor(props) {
        super(props);
        this.handleTableAuditOk = ::this.handleTableAuditOk;
        this.handleTableAuditCancel = ::this.handleTableAuditCancel;
        this.handleAuditSelectChange = ::this.handleAuditSelectChange;
        this.state = {
            auditOption: '请选择',
        }
    }

    componentDidMount() {
    }

    /**
     * 下拉框
     */
    handleAuditSelectChange(value) {
        this.setState({
            auditOption: value
        })
    }

    /**
     * 模态框确认
     */
    handleTableAuditOk() {
        const { visibleData } = this.props;
        const {
            auditOption,
            auditTextArea,
        } = this.props.form.getFieldsValue();
        if (this.state.auditOption === '请选择') {
            message.error('请选择审核结果！');
            return
        }
        this.props.form.validateFields((err) => {
            if (!err) {
                // ToDo:带数据发请求，提交表单
                this.props.modifyAuditModalVisible({isVisible: false});
                this.setState({
                    auditOption: '请选择'
                })
            }
        })
    }

    /**
     * 模态框取消
     */
    handleTableAuditCancel() {
        this.props.modifyAuditModalVisible({isVisible: false});
        this.setState({
            auditOption: '请选择'
        })
    }

    render() {
        const { auditModalVisible } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                {
                    auditModalVisible
                    && <Modal
                        title="订单审核"
                        visible={auditModalVisible}
                        onOk={this.handleTableAuditOk}
                        onCancel={this.handleTableAuditCancel}
                    >
                        <Form layout="inline">
                            <FormItem>
                                <div>
                                    <span className="order-modal-label">
                                        审核:
                                    </span>
                                    {getFieldDecorator('auditOption', {
                                        initialValue: '请选择'
                                    })(
                                        <Select
                                            onChange={this.handleAuditSelectChange}
                                        >
                                            <Option value="请选择" disabled>请选择</Option>
                                            <Option value="通过">通过</Option>
                                            <Option value="不通过">不通过</Option>
                                        </Select>
                                    )}
                                </div>
                            </FormItem>
                            {
                                this.state.auditOption === '通过'
                                && <span className="audit-pass">确认通过审核？</span>
                            }
                            {
                                this.state.auditOption === '不通过'
                                && <FormItem>
                                    <div>
                                        <span className="order-modal-label">
                                            <span style={{color: '#f00'}}>*</span>
                                            审核不通过原因:
                                        </span>
                                        {getFieldDecorator('auditTextArea', {
                                            rules: [{
                                                required: true,
                                                message: '请填写审核不通过原因!',
                                                whitespace: true
                                            }],
                                        })(
                                            <TextArea
                                                autosize={{ minRows: 5, maxRows: 6 }}
                                                style={{resize: 'none' }}
                                            />
                                        )}
                                    </div>
                                </FormItem>
                            }
                        </Form>
                    </Modal>
                }
            </div>
        );
    }
}

AuditModal.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    visibleData: PropTypes.objectOf(PropTypes.any),
    auditModalVisible: PropTypes.bool,
    modifyAuditModalVisible: PropTypes.func,
}

AuditModal.defaultProps = {
}

export default withRouter(Form.create()(AuditModal));
