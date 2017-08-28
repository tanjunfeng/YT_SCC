/**
 * @file licenseInfo.jsx
 * @author shijh
 *
 * 营业执照信息
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Icon } from 'antd';
import moment from 'moment';

class LicenseInfo extends PureComponent {
    render() {
        const { detailData = {} } = this.props;
        const {
            supplierlicenseInfo = {},
            supplierOperTaxInfo = {}
        } = detailData
        return (
            <div className="supplier-detail">
                <div className="supplier-detail-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />
                            经营及证照信息
                        </div>
                        <div className="detail-message-body">
                            <Row>
                                <Col span={8}><span>公司所在地：</span>
                                    <span>
                                        {`${supplierOperTaxInfo.companyLocProvince}${supplierOperTaxInfo.companyLocCity}${supplierOperTaxInfo.companyLocCounty}`}
                                    </span>
                                </Col>
                                <Col span={8}><span>公司详细地址：</span>
                                    <span>{supplierOperTaxInfo.companyDetailAddress}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>商标注册证/受理通知书：</span>
                                    <span><a href={supplierOperTaxInfo.registrationCertificate} target="_blank">点击查看</a></span>
                                    &nbsp;
                                    {
                                        supplierOperTaxInfo.regCerExpiringDate &&
                                        <span className="detail-message-endTime">证件到期日:
                                            {moment(supplierOperTaxInfo.regCerExpiringDate).format('YYYY-MM-DD')}
                                        </span>
                                    }
                                </Col>
                                <Col span={8}><span>食品安全认证：</span>
                                    <span><a href={supplierOperTaxInfo.qualityIdentification} target="_blank">点击查看</a></span>
                                    &nbsp;
                                    {
                                        supplierOperTaxInfo.quaIdeExpiringDate &&
                                        <span className="detail-message-endTime">证件到期日:
                                            {moment(supplierOperTaxInfo.quaIdeExpiringDate).format('YYYY-MM-DD')}
                                        </span>
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>食品经营许可证：</span>
                                    <span><a href={supplierOperTaxInfo.qualityIdentification} target="_blank">点击查看</a></span>
                                    &nbsp;
                                    {
                                        supplierOperTaxInfo.quaIdeExpiringDate &&
                                        <span className="detail-message-endTime">证件到期日:
                                            {moment(supplierOperTaxInfo.quaIdeExpiringDate).format('YYYY-MM-DD')}
                                        </span>
                                    }
                                </Col>
                                <Col span={8}><span>一般纳税人资格证电子版：</span>
                                    <span><a href={supplierOperTaxInfo.generalTaxpayerQualifiCerti} target="_blank">点击查看</a></span>
                                    &nbsp;
                                    {
                                        supplierOperTaxInfo.taxpayerCertExpiringDate &&
                                        <span className="detail-message-endTime">证件到期日:
                                            {moment(supplierOperTaxInfo.taxpayerCertExpiringDate).format('YYYY-MM-DD')}
                                        </span>
                                    }
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <div className="supplier-detail-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />
                            公司营业执照信息（副本）
                        </div>
                        <div className="detail-message-body">
                            <Row>
                                <Col span={8}><span>公司名称：</span>
                                    <span>{supplierlicenseInfo.companyName}</span>
                                </Col>
                                <Col span={8}><span>注册号(营业执照号)：</span>
                                    <span>{supplierlicenseInfo.registLicenceNumber}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>法定代表：</span>
                                    <span>{supplierlicenseInfo.legalRepresentative}</span>
                                </Col>
                                <Col span={8}><span>法人身份证号：</span>
                                    <span>{supplierlicenseInfo.legalRepreCardNum}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>法人身份证电子版：</span>
                                    <span>身份证一： <a target="_blank" href={supplierlicenseInfo.legalRepreCardPic1}>点击查看</a></span>
                                    &nbsp;&nbsp;
                                    <span>身份证二： <a target="_blank" href={supplierlicenseInfo.legalRepreCardPic2}>点击查看</a></span>
                                </Col>
                                <Col span={8}><span>营业执照所在地：</span>
                                    <span>{`${supplierlicenseInfo.licenseLocProvince}${supplierlicenseInfo.licenseLocCity}${supplierlicenseInfo.licenseLocCounty}`}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>营业执照详细地址：</span>
                                    <span>{supplierlicenseInfo.licenseAddress}</span>
                                </Col>
                                <Col span={8}><span>成立日期：</span>
                                    <span>
                                        {moment(supplierlicenseInfo.establishDate).format('YYYY年MM月DD日')}
                                    </span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>营业期限：</span>
                                    <span>
                                        {
                                            supplierlicenseInfo.perpetualManagement === 1
                                            ? '永久有效'
                                            : `${moment(supplierlicenseInfo.startDate).format('YYYY年MM月DD日')} - ${moment(supplierlicenseInfo.endDate).format('YYYY年MM月DD日')}`
                                        }
                                    </span>
                                </Col>
                                <Col span={8}><span>注册资本：</span>
                                    <span>{supplierlicenseInfo.registeredCapital}万元</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>经营范围：</span>
                                    <span>
                                        {supplierlicenseInfo.businessScope}
                                    </span>
                                </Col>
                                <Col span={8}><span>营业执照副本电子版：</span>
                                    <span><a href={supplierlicenseInfo.registLicencePic} target="_blank">点击查看</a></span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商质保金收取金额：</span>
                                    <span>{supplierlicenseInfo.guaranteeMoney}元</span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

LicenseInfo.propTypes = {
    detailData: PropTypes.objectOf(PropTypes.any)
};

export default LicenseInfo;
