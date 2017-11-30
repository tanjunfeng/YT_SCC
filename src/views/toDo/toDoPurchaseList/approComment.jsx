import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {Modal, Select, Form} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {}from '../../../actions';

const Option = Select.Option;

class ApproComment extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectValue: null,
            textareaValue: null,
        }
    }
    selectChange = (value) => {
        this.setState({
            selectValue: value
        })
    }
    textareaChange = (event) => {
        this.setState({
            textareaValue: event.target.value
        })
    }
    handleOk = () => {

    }
    handleCancel = () => {
        this.props.onCancel();
    }
    render() {
        return (
            <Modal
                visible={this.props.visible}
                title="审批意见"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <div>
                    <span>审批：</span>
                    <Select defaultValue="请选择" onChange={this.selectChange}>
                        <Option value="请选择">请选择</Option>
                        <Option value="通过">通过</Option>
                        <Option value="拒绝">拒绝</Option>
                    </Select>
                </div>
                <div className="comment">
                    <span>审批意见：</span>
                    <textarea onChange={this.textareaChange} />
                </div>
            </Modal>
        )
    }
}
ApproComment.propTypes = {
    visible: PropTypes.bool,
    onCancel: PropTypes.func
}

export default withRouter(Form.create()(ApproComment));
