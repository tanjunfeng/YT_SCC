/**
 * @file supplierSpace.jsx
 * @author shijh
 *
 * 供应商地址
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Icon } from 'antd';
import moment from 'moment';
import Warehouse from '../locationInformation/warehouse';

class SupplierSpace extends Component {
    constructor(props) {
        super(props);
    }

    /**
     * 供应商状态转换
     * @param {string} status 供应商状态
     */
    renderStatus(status) {
        switch(status) {
            case 0:
                return '草稿'
            case 1:
                return '待审核'
            case 2:
                return '已审核'
            case 3:
                return '已拒绝'
            case 4:
                return '修改中'
            default:
                break;
        }
        return null;
    }

    /**
     * 供应商等级转换
     * @param {number} grade 供应商等级
     */
    renderGrade(grade) {
        switch(grade) {
            case 1:
                return '战略供应商'
            case 2:
                return '核心供应商'
            case 3:
                return '可替代供应商'
            default:
                break;
        }
        return null;
    }

    /**
     * 供应商地点等级转换
     * @param {number} grade 供应商地点等级
     */
    renderPrGrade(grade) {
        switch (grade) {
            case 1:
                return '生产厂家'
            case 2:
                return '批发商'
            case 3:
                return '经销商'
            case 4:
                return '代销商'
            case 5:
                return '其他'
            default:
                break;
        }
        return null;
    }

    renderPeriod(period) {
        switch (period) {
            case 0:
                return '周结'
            case 1:
                return '半月结'
            case 2:
                return '月结'
            case 3:
                return '票到付款'
            default:
                break;
        }
        return null;
    }

    renderPayType(type) {
        switch (type) {
            case 0:
                return '网银'
            case 1:
                return '银行转账'
            case 2:
                return '现金'
            case 3:
                return '支票'
            default:
                break;
        }
        return null;
    }

    renderPayCondition(type) {
        switch (type) {
            case 1:
                return '票到七天'
            case 2:
                return '票到十五天'
            case 3:
                return '票到三十天'
            default:
                break;
        }
        return null;
    }

    render() {
        const { detailSp = {}, detailData = {} } = this.props;
        const {
            supplierBasicInfo = {},
        } = detailData
        const {
            spAdrBasic = {},
            spAdrContact = {},
            spAdrDeliverys = [],
        } = detailSp

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
                                <Col span={8}><span>供应商编号：</span>
                                    <span>{supplierBasicInfo.spNo}</span>
                                </Col>
                                <Col span={8}><span>供应商名称：</span>
                                    <span>{supplierBasicInfo.companyName}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商等级：</span>
                                    <span>
                                        {
                                            this.renderGrade(supplierBasicInfo.grade)
                                        }
                                    </span>
                                </Col>
                                <Col span={8}><span>供应商入驻日期：</span>
                                    <span>
                                        {moment(supplierBasicInfo.settledTime).format('YYYY-MM-DD')}
                                    </span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商地点编号：</span>
                                    <span>{spAdrBasic.providerNo}</span>
                                </Col>
                                <Col span={8}><span>供应商地点名称：</span>
                                    <span>{spAdrBasic.providerName}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商地点状态：</span>
                                    <span>
                                        {this.renderStatus(detailSp.status)}
                                    </span>
                                </Col>
                                <Col span={8}><span>供应商地点经营状态：</span>
                                    <span>
                                        {
                                            spAdrBasic.operaStatus === 0
                                            ? '禁用'
                                            : '启用'
                                        }
                                    </span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商地点到货周期：</span>
                                    <span>{spAdrBasic.goodsArrivalCycle}天</span>
                                </Col>
                                <Col span={8}><span>账期：</span>
                                    <span>
                                        {this.renderPeriod(spAdrBasic.settlementPeriod)}
                                    </span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商地点级别：</span>
                                    <span>
                                        {this.renderPrGrade(spAdrBasic.grade)}
                                    </span>
                                </Col>
                                <Col span={8}><span>供应商地点所属区域：</span>
                                    <span>{spAdrBasic.belongAreaName}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商付款方式：</span>
                                    <span>{this.renderPayType(spAdrBasic.payType)}</span>
                                </Col>
                                <Col span={8}><span>供应商地点所属子公司：</span>
                                    <span>{spAdrBasic.orgName}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>付款条件：</span>
                                    <span>{this.renderPayCondition(spAdrBasic.payCondition)}</span>
                                </Col>
                            </Row>
                            <Row>
                                {
                                    spAdrBasic.auditPerson &&
                                    <Col span={8}><span>供应商审核人：</span>
                                        <span>{spAdrBasic.auditPerson}</span>
                                    </Col>
                                }
                                {
                                    spAdrBasic.auditDate &&
                                    <Col span={8}><span>供应商审核时间：</span>
                                        <span>{moment(spAdrBasic.auditDate).format('YYYY-MM-DD')}</span>
                                    </Col>
                                }
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
                            <Warehouse
                                isShow={false}
                                defaultValue={spAdrDeliverys}
                            />
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
                                <Col span={8}><span>供应商姓名：</span>
                                    <span>{spAdrContact.providerName}</span>
                                </Col>
                                <Col span={8}><span>供应商电话：</span>
                                    <span>{spAdrContact.providerPhone}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商邮箱：</span>
                                    <span>{spAdrContact.providerEmail}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>采购员姓名：</span>
                                    <span>{spAdrContact.purchaseName}</span>
                                </Col>
                                <Col span={8}><span>采购员电话：</span>
                                    <span>{spAdrContact.purchasePhone}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>采购员邮箱：</span>
                                    <span>{spAdrContact.purchaseEmail}</span>
                                </Col>
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
