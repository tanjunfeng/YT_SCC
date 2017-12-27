/**
 * 查看审核结果
 *
 * @author liujinyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal, Radio, Input } from 'antd';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    queryCommentHis
} from '../../../actions/procurement';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(state => ({
    approvalList: state.toJS().procurement.approvalList,
}), dispatch => bindActionCreators({
    queryCommentHis,
}, dispatch))

class SeeModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            seeModelvisible: false
        }
    }

    componentDidMount() {
        this.props.queryCommentHis({ taskId: this.props.taskId })
    }

    componentWillReceiveProps(nextProps) {
        const seeModelvisible = nextProps.seeModelvisible;
        if (seeModelvisible !== this.props.seeModelvisible) {
            this.setState({
                seeModelvisible
            })
        }
    }

    /**
     * 点击取消
     */
    handleCancel = () => {
        this.props.closeSeeModal()
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { seeModelvisible } = this.state;
        const { approvalList } = this.props
        const formItemLayout = {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 18
            },
        };
        return (
            this.props.approvalList.length > 0
                ? <div>
                    <Modal
                        title="采购进价/售价审批"
                        visible={seeModelvisible}
                        onOk={this.handleCancel}
                        onCancel={this.handleCancel}
                    >
                        <Form layout="vertical">
                            <FormItem label="审批人" {...formItemLayout}>
                                {getFieldDecorator('handler', { initialValue: approvalList[0].handler })(
                                    <Input rows={4} disabled />)}
                            </FormItem>
                            <FormItem label="审批意见" {...formItemLayout}>
                                {getFieldDecorator('content', { initialValue: approvalList[0].content })(
                                    <TextArea rows={4} disabled />)}
                            </FormItem>
                        </Form>
                    </Modal>
                </div>
                : null
        );
    }
}

SeeModal.propTypes = {
    handlePurchaseSearch: PropTypes.func,
    handlePurchaseReset: PropTypes.func,
    queryCommentHis: PropTypes.func,
    closeModal: PropTypes.func,
    closeSeeModal: PropTypes.func,
    seeModelvisible: PropTypes.bool,
    form: PropTypes.objectOf(PropTypes.any),
    taskId: PropTypes.string,
    type: PropTypes.string,
    approvalList: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(SeeModal));
