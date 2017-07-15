/**
 * @file licenseInfo.jsx
 * @author shijh
 *
 * 营业执照信息
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Icon } from 'antd';

class LicenseInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { initValue = {} } = this.props;
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
                                <Col span={8}><span>公司所在地：</span><span>广州市广州市福田区</span></Col>
                                <Col span={8}><span>公司详细地址：</span><span>四川省成都市青白江区×××路××号</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>商标注册证/受理通知书：</span><span>点击查看</span><span>证件到期日期 2017-07-02</span></Col>
                                <Col span={8}><span>食品安全认证：</span><span>点击查看</span><span>证件到期日期 2017-07-02</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>食品经营许可证：</span><span>点击查看</span><span>证件到期日期 2017-07-02</span></Col>
                                <Col span={8}><span>一般纳税人资格证电子版：</span><span>点击查看</span><span>证件到期日期 2017-07-02</span></Col>
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
                                <Col span={8}><span>公司名称：</span><span>成都市××食品公司</span></Col>
                                <Col span={8}><span>注册号(营业执照号)：</span><span>440306102787051</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>法定代表：</span><span>杜延金</span></Col>
                                <Col span={8}><span>法人身份证号：</span><span>321522197505061123</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>法人身份证电子版：</span><span>证件一 点击查看</span><span>证件二 点击查看</span></Col>
                                <Col span={8}><span>营业执照所在地：</span><span>广州市广州市福田区</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>营业执照详细地址：</span><span>成都市青白江区××大道××号</span></Col>
                                <Col span={8}><span>成立日期：</span><span>2001年3月6日</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>营业期限：</span><span>2001年3月6日 -  2999年3月6日 / 永久有效</span></Col>
                                <Col span={8}><span>注册资本：</span><span>100万元</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>经营范围：</span><span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span></Col>
                                <Col span={8}><span>营业执照副本电子版：</span><span>点击查看</span><span>证件到期日期 2017-07-02</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商质保金收取金额：</span><span>2000元</span></Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

LicenseInfo.propTypes = {
    initValue: PropTypes.objectOf(PropTypes.any),
};

export default LicenseInfo;
