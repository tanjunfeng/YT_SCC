/**
 * @file App.jsx
 * @author tanjunfeng liujinyu
 *
 * 售价审核列表
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Row, Col } from 'antd';
import FreightConditions from './FreightConditions';
import EditSteps from './EditSteps';

class SellPriceModal extends Component {
    handleCancel = () => {
        this.props.handleClose();
    }

    catchAuditstate = () => {
        const { datas } = this.props;
        const newDatas = datas.data;
        switch (newDatas.auditStatus) {
            case 1:
                return '已提交';
            case 2:
                return '已审核';
            case 3:
                return '已拒绝';
            default:
                return null;
        }
    }

    render() {
        const { datas } = this.props;
        const newDatas = datas.data;
        return (
            <Modal
                title="销售价格"
                visible
                className="sell-examination-modal todo-see-modal"
                onOk={this.handleCancel}
                onCancel={this.handleCancel}
                maskClosable={false}
            >
                <div>
                    <span className="changeBefore">修改前:</span>
                    <span className="changeAfter">修改后:</span>
                </div>
                <div>
                    <div className="sell-modal-body-wrap sell-modal-body-width">
                        <div>
                            <FreightConditions
                                isAfter={false}
                                newDatas={newDatas}
                            />
                            <EditSteps
                                isAfter={false}
                                newDatas={newDatas}
                            />
                        </div>
                    </div>
                    <div className="sell-modal-body-wrap sell-modal-body-width">
                        <FreightConditions
                            isAfter
                            newDatas={newDatas}
                        />
                        <EditSteps
                            isAfter
                            newDatas={newDatas}
                        />
                    </div >
                    <Row className="edit-state-list">
                        <Col>
                            <span>提交人：</span>
                            <span>{newDatas.firstCreated === 1 ?
                                newDatas.createUserName :
                                newDatas.modifyUserName || '-'}</span>
                        </Col>
                        <Col>
                            <span>审核人：</span>
                            <span>{newDatas.auditUserName || '-'}</span>
                        </Col>
                        <Col>
                            <span>售价状态：</span>
                            <span>
                                <i className={`new-price-state new-price-state-${newDatas.auditStatus}`} />
                                {this.catchAuditstate() || '-'}
                            </span>
                        </Col>
                    </Row>
                </div >
            </Modal>
        );
    }
}

SellPriceModal.propTypes = {
    handleClose: PropTypes.func,
    datas: PropTypes.objectOf(PropTypes.any)
};

export default SellPriceModal;
