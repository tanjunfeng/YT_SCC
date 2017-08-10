import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import EmerContInfo from './common/emerContInfo';
import SettledContInfo from './common/settledContInfo';

class Contact extends PureComponent {
    constructor(props) {
        super(props);

        this.handleClick = ::this.handleClick;
    }

    handleClick() {

    }

    render() {
        const { data = {}, failedReason, ...props } = this.props
        const { supplierEmerContInfo = {}, supplierSettledContInfo = {} } = data;
        return (
            <div className="supplier-detail-message">
                <EmerContInfo
                    {...props}
                    initValue={supplierEmerContInfo}
                    title="供应商紧急联系人"
                    type="EmerContInfo"
                />
                <SettledContInfo
                    {...props}
                    initValue={supplierSettledContInfo}
                    title="招商入驻联系人"
                    type="SettledContInfo"
                />
            </div>
        )
    }
}

Contact.propTypes = {
    data: PropTypes.objectOf(PropTypes.any),
    canEdit: PropTypes.bool,
    failedReason: PropTypes.bool,
}

Contact.defaultProps = {
}

export default withRouter(Contact);
