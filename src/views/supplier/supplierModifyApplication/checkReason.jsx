import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Modal,
} from 'antd';

import { modifyCheckReasonVisible } from '../../../actions';


@connect(
    state => ({
        checkResonVisible: state.toJS().supplier.checkResonVisible
    }),
    dispatch => bindActionCreators({
        modifyCheckReasonVisible
    }, dispatch)
)
class CheckReason extends PureComponent {
    constructor(props) {
        super(props);

        this.handleAuditCancel = ::this.handleAuditCancel;
    }


    handleAuditCancel() {
        this.props.modifyCheckReasonVisible({isVisible: false});
    }

    render() {
        return (
            <Modal
                title="审核不通过原因"
                visible={this.props.checkResonVisible}
                onCancel={() => modifyCheckReasonVisible({isVisible: false})}
                footer={null}
            >
                <ul className="check-reason-list">
                    <li className="check-reason-item">
                        <span className="check-reason-left">审核时间：</span>
                        <span className="check-reason-right">2016-10-20</span>
                    </li>
                    <li className="check-reason-item">
                        <span className="check-reason-left">审核人：</span>
                        <span className="check-reason-right">lis</span>
                    </li>
                    <li className="check-reason-item">
                        <span className="check-reason-left">不通过原因：</span>
                        <span className="check-reason-right">
                            1.公司法人身份证不清晰
                            2.银行账号位数不对
                            XXXXXXXXXXXXXXXXXXX
                            XXXXXXXXXXXXXXXX
                        </span>
                    </li>
                </ul>
            </Modal>
        );
    }
}

CheckReason.propTypes = {
    checkResonVisible: PropTypes.bool,
    modifyCheckReasonVisible: PropTypes.func
}

export default CheckReason;
