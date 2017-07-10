import React, { PureComponent } from 'react';
import { Icon, Modal } from 'antd';
import Examine from './examine';

function Common(WrappedComponent) {
    return class HOC extends PureComponent {
        constructor(props) {
            super(props);

            this.handleEditClick = ::this.handleEditClick;
            this.handleCancel = ::this.handleCancel;
            this.handleExamine = ::this.handleExamine;
            this.showfailedReason = ::this.showfailedReason;
            this.handleAuditOk = ::this.handleAuditOk;
            this.handleAuditCancel = ::this.handleAuditCancel;
            this.handleHide = ::this.handleHide;
            this.showExaminefailed = ::this.showExaminefailed;

            this.state = {
                edit: false,
                visible: false,
                showExamine: false,
                isAudit: false,
                examineFail: false
            }
        }

        handleEditClick() {
            this.setState({
                edit: true
            })
        }

        handleCancel(result = false) {
            if (typeof result === 'boolean') {
                this.setState({
                    edit: false,
                    isAudit: result
                })
                return 0;
            }
            this.setState({
                edit: false
            })
        }

        handleExamine() {
            this.setState({
                showExamine: true
            })
        }

        handleHide() {
            this.setState({
                showExamine: false
            })
        }

        showfailedReason(e) {
            const reason = e.target.getAttribute('data-reason');
            this.failedReason = reason;
            this.modalData = {
                title: '平台未通过原因',
                okText: '再次申请入住',
                cancelText: '关闭'
            }
            this.setState({
                visible: true
            })
        }

        showExaminefailed(e) {
            const reason = e.target.getAttribute('data-reason');
            this.failedReason = reason;
            this.modalData = {
                title: '审核未通过原因',
                okText: '再次编辑',
                cancelText: '关闭'
            }
            this.setState({
                visible: true,
                examineFail: true
            })
        }

        handleAuditOk() {
            const { examineFail } = this.state;
            if (examineFail) {
                this.setState({
                    visible: false,
                    edit: true
                })
                return;
            }
            const { detailData } = this.props;
            this.props.history.push(`/applicationList/edit/${detailData.id}`)
            this.setState({
                visible: false
            })
        }

        handleAuditCancel() {
            this.setState({
                visible: false
            })
        }

        render() {
            const { edit, isAudit } = this.state;
            const {
                title,
                canEdit,
                canExamine,
                initValue = {},
                failedReason,
                detailData,
                type,
                getDtail
            } = this.props;

            const isNeedEdit = initValue.status === 1;
            return (
                <div className="supplier-detail-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />{title}
                            {
                                canEdit && !edit && !isAudit && !initValue.isAudit && !isNeedEdit &&
                                <span
                                    className="detail-message-header-edit"
                                    onClick={this.handleEditClick}
                                >
                                    <Icon type="edit" />编辑
                                </span>
                            }
                            {
                                canEdit && !isNeedEdit && (isAudit || initValue.isAudit) &&
                                <span
                                    className="detail-message-header-edit"
                                >
                                    审核中...
                                </span>
                            }
                            {
                                canExamine && initValue.isAudit &&
                                <span
                                    className="detail-message-header-examine"
                                    onClick={this.handleExamine}
                                >
                                    <Icon type="edit" />审核
                                </span>
                            }
                            {
                                failedReason && detailData.status === 1 &&
                                <a
                                    style={{marginLeft: '40px'}}
                                    data-reason={detailData.failedReason}
                                    onClick={this.showfailedReason}
                                >
                                    入驻未通过原因
                                </a>
                            }
                            {
                                canEdit && isNeedEdit &&
                                <a
                                    style={{marginLeft: '40px'}}
                                    data-type="examineFail"
                                    data-reason={initValue.failedReason}
                                    onClick={this.showExaminefailed}
                                >
                                    查看审核未通过原因
                                </a>
                            }
                        </div>
                        <WrappedComponent
                            {...this.props}
                            handleCancel={this.handleCancel}
                            handleEditClick={this.handleEditClick}
                            getDtail={getDtail}
                            edit={edit}
                        />
                    </div>
                    {
                        this.state.visible &&
                        <Modal
                            title={this.modalData.title}
                            visible={this.state.visible}
                            onOk={this.handleAuditOk}
                            onCancel={this.handleAuditCancel}
                            okText={this.modalData.okText}
                            cancelText={this.modalData.cancelText}
                        >
                            <div>{this.failedReason}</div>
                        </Modal>
                    }
                    {
                        this.state.showExamine &&
                        <Examine
                            title={title}
                            type={type}
                            spId={detailData.id}
                            id={initValue.id}
                            getDtail={getDtail}
                            handleHide={this.handleHide}
                        />
                    }
                </div>
            )
        }
    }
}

export default Common;
