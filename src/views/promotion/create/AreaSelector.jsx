/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 子公司区域选择模态框
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Form, Modal } from 'antd';
import AreaTree from '../../../container/area';

class AreaSelector extends PureComponent {
    constructor(props) {
        super(props);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentWillMount() {
        this.props.getAllCompanies();
    }

    handleOk = () => {
        this.props.selectorOk();
    }

    handleCancel = () => {
        this.props.selectorCancel();
    }

    render() {
        return (
            <div>
                <Modal
                    title="选择区域"
                    visible={this.props.selectorVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <AreaTree
                        companies={this.props.companies}
                    />
                </Modal>
            </div>
        );
    }
}

AreaSelector.propTypes = {
    selectorVisible: PropTypes.bool,
    selectorOk: PropTypes.func,
    getAllCompanies: PropTypes.func,
    companies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    selectorCancel: PropTypes.func
}

export default withRouter(Form.create()(AreaSelector));
