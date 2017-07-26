/**
 * @file supplierSpace.jsx
 * @author shijh
 *
 * 供应商地址
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Icon } from 'antd';

class SupplierSpace extends Component {
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
                            基础信息
                        </div>
                        <div className="detail-message-body">
                            <Row>
                                <Col span={8}><span>供应商编号：</span><span>1000001</span></Col>
                                <Col span={8}><span>供应商名称：</span><span>深圳市豪利门业实业有限公司</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商等级：</span><span>战略供应商</span></Col>
                                <Col span={8}><span>供应商入驻日期：</span><span>2017-07-02</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商地点编号：</span><span>1000001</span></Col>
                                <Col span={8}><span>供应商地点名称：</span><span>四川 - 深圳市豪利门业实业有限公司</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商地点状态：</span><span>工作表</span></Col>
                                <Col span={8}><span>供应商地点经营状态：</span><span>启动</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商地点到货周期：</span><span>2天</span></Col>
                                <Col span={8}><span>账期：</span><span>月结</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商地点级别：</span><span>生产厂家</span></Col>
                                <Col span={8}><span>供应商地点所属区域：</span><span>四川</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商审核人：</span><span>张云</span></Col>
                                <Col span={8}><span>供应商审核日期：</span><span>2017-07-02</span></Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <div className="supplier-detail-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />
                            送货信息
                        </div>
                        <div className="detail-message-body">
                            <Row>
                                <Col span={8}><span>仓储服务方：</span><span>新希望集团</span></Col>
                                <Col span={8}><span>供应商送货仓库编码：</span><span>XXXXXX</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商送货仓库名称：</span><span>雅堂一号仓库</span></Col>
                                <Col span={8}><span>供应商送货仓储区域：</span><span>四川省成都市高新区</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商送货仓库详细地址：</span><span>XXXXXX街道XXXXX号</span></Col>
                                <Col span={8}><span>供应商送货仓库联系人：</span><span>李丽</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商送货仓库联系方式：</span><span>18683591475</span></Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <div className="supplier-detail-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />
                            联系信息
                        </div>
                        <div className="detail-message-body">
                            <Row>
                                <Col span={8}><span>供应商姓名：</span><span>深圳市豪利门业实业有限公司</span></Col>
                                <Col span={8}><span>供应商名称：</span><span>15280943761</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商邮箱：</span><span>15566252555@163.com</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>采购员姓名：</span><span>深圳市豪利门业实业有限公司</span></Col>
                                <Col span={8}><span>采购员电话：</span><span>18952487434</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>采购员邮箱：</span><span>15566252555@163.com</span></Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

SupplierSpace.propTypes = {
    initValue: PropTypes.objectOf(PropTypes.any),
};

export default SupplierSpace;
