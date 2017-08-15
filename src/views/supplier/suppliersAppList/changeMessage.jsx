/**
 * @file changeMessage.jsx
 * @author Tan junfeng
 *
 * 供应商管理列表
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Modal, Form } from 'antd';

import {
    modifyInformationVisible,
    modifySupplierCooperationInfo
} from '../../../actions';

const FormItem = Form.Item;

@connect(
    state => ({
        informationVisible: state.toJS().supplier.informationVisible,
        visibleData: state.toJS().supplier.visibleData
    }),
    dispatch => bindActionCreators({
        modifyInformationVisible,
        modifySupplierCooperationInfo
    }, dispatch)
)
class ChangeMessage extends PureComponent {
    constructor(props) {
        super(props);

        this.handleInformationOk = this.handleInformationOk.bind(this);
        this.handleInformationCancel = this.handleInformationCancel.bind(this);
    }

    /**
     * 模态框取消按钮
     */
    handleInformationCancel() {
        this.props.modifyInformationVisible({isVisible: false});
    }

    /**
     * 模态框确认按钮
     */
    handleInformationOk() {
        const { visibleData = {} } = this.props;
        const { id } = visibleData;
        this.handleInformationCancel();
        this.props.history.push(`/suppliersAppList/edit/supplier/${id}`)
    }

    render() {
        const { visibleData = {} } = this.props;
        const { failedReason = '' } = visibleData;
        return (
            <div>
                {
                    this.props.informationVisible
                    && <Modal
                        title="平台已拒绝原因"
                        visible={this.props.informationVisible}
                        onOk={this.handleInformationOk}
                        onCancel={this.handleInformationCancel}
                        okText="再次申请入驻"
                        width="410px"
                        maskClosable={false}
                    >
                        <Form>
                            <FormItem className="manage-form-item">
                                <span className="manage-form-label">
                                    {failedReason}
                                </span>
                            </FormItem>
                        </Form>
                    </Modal>
                }
            </div>
        )
    }
}

ChangeMessage.propTypes = {
    modifyInformationVisible: PropTypes.func,
    visibleData: PropTypes.objectOf(PropTypes.any),
    informationVisible: PropTypes.bool,
    history: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(ChangeMessage));
