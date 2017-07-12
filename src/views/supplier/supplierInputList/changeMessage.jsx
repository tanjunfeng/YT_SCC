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

    handleInformationCancel() {
        this.props.modifyInformationVisible({isVisible: false});
    }

    handleInformationOk() {
        this.props.form.validateFields((err) => {
            if (!err) {
                const { supplierCooperationId } = this.props.visibleData;
                const result = this.props.form.getFieldsValue();
                this.props.modifySupplierCooperationInfo({
                    id: supplierCooperationId,
                    ...result
                }).then(() => {
                    this.props.getList()
                })
            }
        })
    }

    render() {
        return (
            <Modal
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
                        <span className="manage-form-label">结算账期</span>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

ChangeMessage.propTypes = {
    modifyInformationVisible: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any),
    visibleData: PropTypes.objectOf(PropTypes.any),
    modifySupplierCooperationInfo: PropTypes.func,
    informationVisible: PropTypes.bool,
    getList: PropTypes.func,
}

export default withRouter(Form.create()(ChangeMessage));
