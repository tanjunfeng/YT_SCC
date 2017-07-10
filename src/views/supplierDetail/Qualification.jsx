import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import LicenseInfo from './common/licenseInfo';
import OrgCodeInfo from './common/orgCodeInfo';

class Qualification extends PureComponent {
    constructor(props) {
        super(props);

        this.handleClick = ::this.handleClick;
    }

    handleClick() {

    }

    render() {
        const { data = {}, failedReason, ...props } = this.props
        const { supplierlicenseInfo = {}, supplierOrgCodeInfo = {} } = data;
        return (
            <div className="supplier-company-qualification">
                <div className="supplier-detail-message">
                    <LicenseInfo
                        {...props}
                        initValue={supplierlicenseInfo}
                        title="公司营业执照信息(副本)"
                        type="LicenseInfo"
                    />
                    <OrgCodeInfo
                        {...props}
                        initValue={supplierOrgCodeInfo}
                        title="组织机构代码证"
                        type="OrgCodeInfo"
                    />
                </div>
            </div>
        )
    }
}

Qualification.propTypes = {
    data: PropTypes.objectOf(PropTypes.any),
    canEdit: PropTypes.bool,
    failedReason: PropTypes.bool,
}

Qualification.defaultProps = {
}

export default withRouter(Qualification);
