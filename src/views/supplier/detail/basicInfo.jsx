/**
 * @file basicInfo.jsx
 * @author shijh
 *
 * 基本信息
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Icon, Table } from 'antd';
import moment from 'moment';

const columns = [{
    key: 'regionName',
    title: '大区',
    dataIndex: 'regionName',
    width: '10%',
    render: (text) => (<div className="area-detail-left">{text}</div>)
}, {
    key: 2,
    title: '省市区',
    dataIndex: 'province',
    width: '90%'
}];

const list = [{
    regionName: '华东',
    province: '上海市(2) : 市辖区、市辖县 江苏省(13) : 南京市、无锡市、徐州市、常州市、苏州市、南通市、连云港市、淮安市、盐城市、扬州市、镇江市、泰州市、宿迁市 浙江省(11) : 杭州市、宁波市、温州市、嘉兴市、湖州市、绍兴市、金华市、衢州市、舟山市、台州市、丽水市 安徽省(17) : 合肥市、芜湖市、蚌埠市、淮南市、马鞍山市、淮北市、铜陵市、安庆市、黄山市、滁州市、阜阳市、宿州市、巢湖市、六安市、亳州市、池州市、宣城市'
}]

class BasicInfo extends Component {
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

    render() {
        const { detailData = {} } = this.props;
        const {
            supplierBasicInfo = {},
            status = 0
        } = detailData

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
                                <Col span={8}><span>供应商类型：</span><span>供应商</span></Col>
                                <Col span={8}><span>供应商状态：</span>
                                    <span>
                                        {
                                            this.renderStatus(status)
                                        }
                                    </span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}><span>供应商编号：</span>
                                    <span>
                                        {
                                            supplierBasicInfo.spNo
                                        }
                                    </span>
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
                        </div>
                    </div>
                </div>
                <div className="supplier-detail-item supplier-area">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />
                            供应商辐射城市
                        </div>
                        <div className="detail-message-body">
                            <Table
                                dataSource={list}
                                columns={columns}
                                rowKey="id"
                                title={() => supplierBasicInfo.companyName}
                                pagination={false}
                                className="area-detail"
                                bordered
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

BasicInfo.propTypes = {
    match: PropTypes.objectOf(PropTypes.any),
    initValue: PropTypes.objectOf(PropTypes.any),
};

export default BasicInfo;
