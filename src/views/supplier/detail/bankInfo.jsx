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
        const { initValue = {} } = this.props;
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
                                <Col span={8}><span>开户名：</span><span>深圳市豪利门业实业有限公司</span></Col>
                                <Col span={8}><span>开户行：</span><span>招商银行深圳福永支行</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>开户行所在地：</span><span>广东省深圳市宝安区</span></Col>
                                <Col span={8}><span>银行账号：</span><span>6225123496585623</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>银行开户许可证电子版：</span><span>点击查看</span></Col>
                                <Col span={8}><span>供应商发票抬头：</span><span>深圳市豪利门业实业有限公司</span></Col>
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
