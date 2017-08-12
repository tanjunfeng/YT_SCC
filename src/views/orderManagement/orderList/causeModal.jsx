/**
 * @file causeModal.jsx
 * @author caoyanxuan
 *
 * 订单管理-取消原因模态框
 */

import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Input, Modal, message } from 'antd';
import { modifyCauseModalVisible } from '../../../actions/modify/modifyAuditModalVisible';
import { modifyBatchCancel, modifyCancelOrder, fetchOrderDetailInfo } from '../../../actions/order';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(
    state => ({
        causeModalVisible: state.toJS().order.causeModalVisible,
        chooseData: state.toJS().order.chooseData,
        causeRecordId: state.toJS().order.causeRecordId,
    }),
    dispatch => bindActionCreators({
        modifyCauseModalVisible,
        fetchOrderDetailInfo,
    }, dispatch)
)
class CauseModal extends PureComponent {
    constructor(props) {
        super(props);
        this.handleTableCauseOk = ::this.handleTableCauseOk;
        this.handleTableCauseCancel = ::this.handleTableCauseCancel;
        this.state = {
        }
    }

    componentDidMount() {
    }

    /**
     * 模态框确认
     */
    handleTableCauseOk() {
        const { causeTextArea } = this.props.form.getFieldsValue();
        const { chooseData, causeRecordId } = this.props;
        this.props.form.validateFields((error) => {
            if (!error) {
                if (chooseData) {
                    // 批量取消
                    modifyBatchCancel({
                        ids: chooseData,
                        remark: causeTextArea
                    }).then(res => {
                        // 刷新列表
                        this.props.getSearchData();
                        this.props.modifyCauseModalVisible({ isShow: false });
                        message.success(res.message);
                    }).catch(err => {
                        message.error(err.message);
                    })
                } else {
                    // 单个取消
                    modifyCancelOrder({
                        id: causeRecordId,
                        remark: causeTextArea
                    }).then(res => {
                        // 列表页单个取消，刷新列表
                        this.props.getSearchData();
                        this.props.modifyCauseModalVisible({ isShow: false });
                        this.props.fetchOrderDetailInfo({id: causeRecordId});
                        message.success(res.message);
                    }).catch(err => {
                        message.error(err.message);
                    })
                }
            }
        })
    }

    /**
     * 模态框取消
     */
    handleTableCauseCancel() {
        this.props.modifyCauseModalVisible({ isShow: false });
    }

    render() {
        const { causeModalVisible } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                {
                    causeModalVisible
                    && <Modal
                        title="取消原因"
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
                                        取消原因:
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
                        </Form>
                    </Modal>
                }
            </div>
        );
    }
}

CauseModal.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    chooseData: PropTypes.arrayOf(PropTypes.any),
    causeRecordId: PropTypes.string,
    causeModalVisible: PropTypes.bool,
    modifyCauseModalVisible: PropTypes.func,
    getSearchData: PropTypes.func,
    fetchOrderDetailInfo: PropTypes.func,
}

CauseModal.defaultProps = {
}

export default withRouter(Form.create()(CauseModal));
