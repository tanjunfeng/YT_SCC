import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';

class NewSellingPrice extends PureComponent {
    state = { visible: false }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    render() {
        return (
            <span>
                <Button type="large" onClick={this.showModal}>新增</Button>
                <Modal
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
            </span>
        );
    }
}

export default NewSellingPrice;
