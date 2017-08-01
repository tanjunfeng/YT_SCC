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
         switch(grade) {
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

    render() {
        const { detailSp = {}, detailData = {} } = this.props;
        console.log(detailData);
        console.log(detailSp);
        const {
            supplierBasicInfo = {},
        } = detailData
        const {
            spAdrBasic = {},
            spAdrContact = {},
            warehouse = [],
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
                                    <span>{spAdrBasic.settlementPeriod}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商地点级别：</span>
                                    <span>
                                        {this.renderPrGrade(spAdrBasic.grade)}
                                    </span>
                                </Col>
                                <Col span={8}><span>供应商地点所属区域：</span>
                                    <span>{spAdrBasic.belongArea}</span>
                                </Col>
                            </Row>
                            {/* <Row>
                                <Col span={8}><span>供应商审核人：</span>
                                    <span>{spAdrBasic.auditPerson}</span>
                                </Col>
                                <Col span={8}><span>供应商审核日期：</span>
                                    <span>
                                        {moment(spAdrBasic.auditDate).format('YYYY-MM-DD')}
                                    </span>
                                </Col>
                            </Row> */}
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
                            {
                                warehouse.map((item, index) => {
                                    return (
                                        <div className="supplier-detail-warehouse">
                                            <Row>
                                                <Col span={8}><span>仓库：</span>
                                                    <span>{`${item.warehouseCode} - ${item.warehouseName}`}</span>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={8}><span>仓储服务方：</span>
                                                    <span>{item.warehouseService}</span>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={8}><span>送货仓联系人：</span>
                                                    <span>{item.contactPerson}</span>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={8}><span>送货仓联系方式：</span>
                                                    <span>{item.contactMode}</span>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={8}><span>送货仓区域信息：</span>
                                                    <span>{item.county}</span>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={8}><span>送货仓详细地址：</span>
                                                    <span>{item.address}</span>
                                                </Col>
                                            </Row>
                                        </div>
                                    )
                                })
                            }
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
