import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import BasicInfo from './common/basicInfo';
import OperTaxInfo from './common/operTaxInfo';
import BankInfo from './common/bankInfo';

class SupplierMessage extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const { data = {}, canEdit, canExamine, failedReason, ...props } = this.props;
        const { supplierBasicInfo = {}, supplierOperTaxInfo = {}, supplierBankInfo = {} } = data;
        return (
            <div className="supplier-detail-message">
                <BasicInfo
                    {...props}
                    failedReason={failedReason}
                    initValue={supplierBasicInfo}
                    title="供应商信息"
                />
                <OperTaxInfo
                    {...props}
                    canEdit={canEdit}
                    canExamine={canExamine}
                    initValue={supplierOperTaxInfo}
                    title="公司经营及税务信息"
                    type="OperTaxContent"
                />
                <BankInfo
                    {...props}
                    canEdit={canEdit}
                    canExamine={canExamine}
                    initValue={supplierBankInfo}
                    title="银行信息"
                    type="BankContent"
                />
            </div>
        )
    }
}

SupplierMessage.propTypes = {
    data: PropTypes.objectOf(PropTypes.any),
    canEdit: PropTypes.bool,
    canExamine: PropTypes.bool,
    failedReason: PropTypes.bool,
}

SupplierMessage.defaultProps = {
}

export default withRouter(SupplierMessage);
