/**
 * @file bankInfo.jsx
 * @author shijh
 *
 * 银行信息
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Icon } from 'antd';

class BankInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { detailData = {} } = this.props;
        const {
            supplierBankInfo = {},
        } = detailData
        return (
            <div className="supplier-detail supplier-detail-bankInfo">
                <div className="supplier-detail-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />
                            银行信息
                        </div>
                        <div className="detail-message-body">
                            <Row>
                                <Col span={8}><span>开户名：</span>
                                    <span>
                                        {supplierBankInfo.accountName}
                                    </span>
                                </Col>
                                <Col span={8}><span>开户行：</span>
                                    <span>
                                        {supplierBankInfo.openBank}
                                    </span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>开户行所在地：</span>
                                    <span>
                                        {`${supplierBankInfo.bankLocProvince}${supplierBankInfo.bankLocCity}${supplierBankInfo.bankLocCounty}`}
                                    </span>
                                </Col>
                                <Col span={8}><span>银行账号：</span>
                                    <span>
                                        {supplierBankInfo.bankAccount}
                                    </span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>银行开户许可证电子版：</span>
                                    <span>
                                        <a href={supplierBankInfo.bankAccountLicense}>点击查看</a>
                                    </span>
                                </Col>
                                {
                                    supplierBankInfo.invoiceHead &&
                                    <Col span={8}><span>供应商发票抬头：</span>
                                        <span>
                                            {supplierBankInfo.invoiceHead}
                                        </span>
                                    </Col>
                                }
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

BankInfo.propTypes = {
    initValue: PropTypes.objectOf(PropTypes.any),
};

export default BankInfo;
