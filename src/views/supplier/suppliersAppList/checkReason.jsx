import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import moment from 'moment';

import { modifyCheckReasonVisible } from '../../../actions';
import { findFailedReason } from '../../../actions/addSupplier'


@connect(
    state => ({
        checkResonVisible: state.toJS().supplier.checkResonVisible,
        visibleData: state.toJS().supplier.visibleData,
        resonData: state.toJS().supplier.resonData
    }),
    dispatch => bindActionCreators({
        modifyCheckReasonVisible,
        findFailedReason
    }, dispatch)
)
class CheckReason extends PureComponent {
    constructor(props) {
        super(props);

        this.handleAuditCancel = ::this.handleAuditCancel;
    }

    componentDidMount() {
        const { visibleData } = this.props;
        this.props.findFailedReason({
            id: visibleData.id
        })
    }

    handleAuditCancel() {
        this.props.modifyCheckReasonVisible(false);
    }

    render() {
        const { resonData = {} } = this.props;
        const { auditTime = null, auditUser = null, failedReason = null } = resonData;
        return (
            <Modal
                title="审核不通过原因"
                visible={this.props.checkResonVisible}
                onCancel={this.handleAuditCancel}
                footer={null}
            >
                <ul className="check-reason-list">
                    <li className="check-reason-item">
                        <span className="check-reason-left">审核时间：</span>
                        {
                            auditTime &&
                            <span className="check-reason-right">
                                {
                                    !!auditTime
                                    ? moment(auditTime).format('YYYY-MM-DD')
                                    : '无'
                                }
                            </span>
                        }
                    </li>
                    <li className="check-reason-item">
                        <span className="check-reason-left">审核人：</span>
                        {
                            auditUser &&
                            <span className="check-reason-right">{auditUser}</span>
                        }
                    </li>
                    <li className="check-reason-item">
                        <span className="check-reason-left">不通过原因：</span>
                        {
                            failedReason &&
                            <span className="check-reason-right">
                                {failedReason}
                            </span>
                        }
                    </li>
                </ul>
            </Modal>
        );
    }
}

CheckReason.propTypes = {
    modifyCheckReasonVisible: PropTypes.bool,
    checkResonVisible: PropTypes.bool,
    resonData: PropTypes.objectOf(PropTypes.any),
    findFailedReason: PropTypes.func,
}

export default CheckReason;
