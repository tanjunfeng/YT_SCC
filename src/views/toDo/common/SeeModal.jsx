/**
 * 查看审核结果
 *
 * @author liujinyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Table } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    queryCommentHis
} from '../../../actions/procurement';
import { seeModalColumns as columns } from '../columns';

@connect(state => ({
    approvalList: state.toJS().procurement.approvalList,
}), dispatch => bindActionCreators({
    queryCommentHis,
}, dispatch))

class SeeModal extends PureComponent {
    componentWillReceiveProps(nextProps) {
        if (nextProps.seeModelvisible && nextProps.seeModelvisible !== this.props.seeModelvisible) {
            this.props.queryCommentHis({ taskId: nextProps.taskId })
        }
    }

    /**
     * 点击取消
     */
    handleCancel = () => {
        this.props.closeSeeModal()
    }

    render() {
        const { approvalList, seeModelvisible } = this.props
        return (
            approvalList.length > 0
                ? <Modal
                    title="采购进价/售价审批"
                    visible={seeModelvisible}
                    onOk={this.handleCancel}
                    onCancel={this.handleCancel}
                    width={1000}
                    className="todo-see-modal"
                    maskClosable={false}
                >
                    <Table
                        dataSource={approvalList}
                        columns={columns}
                        rowKey="id"
                        bordered
                        pagination={false}
                    />
                </Modal>
                : null
        );
    }
}

SeeModal.propTypes = {
    queryCommentHis: PropTypes.func,
    closeSeeModal: PropTypes.func,
    seeModelvisible: PropTypes.bool,
    taskId: PropTypes.string,
    approvalList: PropTypes.objectOf(PropTypes.any)
};

export default SeeModal;
