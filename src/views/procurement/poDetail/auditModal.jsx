/**
 * @file causeModal.jsx
 * @author caoyanxuan
 *
 * 采购订单-审核模态框
 */

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Input, Modal, message, Select, InputNumber } from 'antd';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';
import { modifyAuditPurchaseOrderInfo } from '../../../actions/procurement';


const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

@connect(
    state => ({
        causeModalVisible: state.toJS().order.causeModalVisible,
        causeRecordId: state.toJS().order.causeRecordId,
    }),
    dispatch => bindActionCreators({
        modifyCauseModalVisible,
    }, dispatch)
)
class Audit extends PureComponent {
    constructor(props) {
        super(props);
        this.handleTableCauseOk = ::this.handleTableCauseOk;
        this.handleTableCauseCancel = ::this.handleTableCauseCancel;
        this.state = {
            option: '请选择'
        }
    }

    componentDidMount() {
    }

    /**
     * 模态框确认
     */
    handleTableCauseOk() {
        const { causeTextArea } = this.props.form.getFieldsValue();
        const { causeRecordId } = this.props;
        const { option } = this.state;
        switch (option) {
            case '请选择':
                message.error('请选择！')
                return;
            case '通过':
                modifyAuditPurchaseOrderInfo({
                    id: causeRecordId,
                    status: 2,
                }).then(res => {
                    this.props.modifyCauseModalVisible({ isShow: false });
                    this.setState({
                        option: '请选择'
                    })
                    message.success(res.message);
                    this.props.history.goBack();
                }).catch(err => {
                    message.error(err.message);
                })
                break;
            case '不通过':
                this.props.form.validateFields((error) => {
                    if (!error) {
                        modifyAuditPurchaseOrderInfo({
                            id: causeRecordId,
                            status: 3,
                            failedReason: causeTextArea
                        }).then(res => {
                            this.props.modifyCauseModalVisible({ isShow: false });
                            this.setState({
                                option: '请选择'
                            })
                            message.success(res.message);
                            this.props.history.goBack();
                        }).catch(err => {
                            message.error(err.message);
                        })
                    }
                })
                break;
            default:
                break;
        }
    }

    /**
     * 模态框取消
     */
    handleTableCauseCancel() {
        this.props.modifyCauseModalVisible({ isShow: false });
        this.setState({
            option: '请选择'
        })
    }

    render() {
        const { causeModalVisible } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { option } = this.state;
        return (
            <div>
                {
                    causeModalVisible
                    && <Modal
                        title="审核"
                        maskClosable={false}
                        visible={causeModalVisible}
                        onOk={this.handleTableCauseOk}
                        onCancel={this.handleTableCauseCancel}
                    >
                        <Form layout="inline">
                            <FormItem>
                                <div>
                                    <span className="order-modal-label">
                                        <span style={{color: '#f00'}}>*</span>
                                        请选择:
                                    </span>
                                    <Select
                                        defaultValue="请选择"
                                        onChange={(value) => {
                                            this.setState({
                                                option: value
                                            })
                                        }}
                                    >
                                        <Option value="请选择" disabled>请选择</Option>
                                        <Option value="通过">通过</Option>
                                        <Option value="不通过">不通过</Option>
                                    </Select>
                                </div>
                            </FormItem>
                            {
                                option === '不通过'
                                && <FormItem>
                                    <div>
                                        <span className="order-modal-label">
                                            <span style={{color: '#f00'}}>*</span>
                                            不通过原因:
                                        </span>
                                        {getFieldDecorator('causeTextArea', {
                                            rules: [{
                                                required: true,
                                                message: '请填写取消原因!',
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

Audit.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
    causeRecordId: PropTypes.string,
    causeModalVisible: PropTypes.bool,
    modifyCauseModalVisible: PropTypes.func
}

Audit.defaultProps = {
}

export default withRouter(Form.create()(Audit));
