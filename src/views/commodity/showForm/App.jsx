/**
 * @file App.jsx
 * @author shijinhua,caoyanxuan
 *
 * 公共searchForm
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Breadcrumb, Row, Col, Icon } from 'antd';

import Utils from '../../../util/util';

class ShowForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            state: 0
        }
    }

    /**
     * 列表数据获取
     */
    getValue() {
        const {
            supplierNumber,
            supplierName,
            supplierLicense,
            supplierType,
            supplierState,
            supplierLevel,
        } = this.props.form.getFieldsValue();
        const searchData = {
            supplierNumber,
            supplierName,
            supplierLicense,
            supplierType,
            supplierState,
            supplierLevel,
            inTime: this.state.inTime
        };
        this.searchData = Utils.removeInvalid(searchData);
        // console.log(searchData)
    }

    render() {
        const state = this.state;
        return (
            <div className="manage-form">
                <div>
                    <div style={{fontSize: 16, fontWeight: 900}}>
                        <Icon type="desktop" className="css-appstore" />&nbsp;商品信息
                    </div>
                    <Row className="css-row-padding" style={{paddingLeft: 22}}>
                        <Col span={9} className="css-col">
                            <span>商品名称:</span>
                            <Breadcrumb className="css-breadcrumb">
                                <Breadcrumb.Item>
                                    康师傅 方便面（KSF） 经典系列 红烧牛肉 泡面 五连包
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                        <Col span={8} className="css-col">
                            <span>商品品牌:</span>
                            <Breadcrumb className="css-breadcrumb">
                                <Breadcrumb.Item>康师傅</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                        <Col span={7} className="css-col">
                            <span>商品编号:</span>
                            <Breadcrumb className="css-breadcrumb">
                                <Breadcrumb.Item>prod222</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                        <Col span={9} className="css-col">
                            <span>商品分类:</span>
                            <Breadcrumb separator=">" className="css-breadcrumb">
                                <Breadcrumb.Item>休闲食品</Breadcrumb.Item>
                                <Breadcrumb.Item>休闲零食</Breadcrumb.Item>
                                <Breadcrumb.Item>膨化食品</Breadcrumb.Item>
                                <Breadcrumb.Item>小类</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                        {
                            state === 0 &&
                            <Col span={8} className="css-col">
                                <span>税率:</span>
                                <Breadcrumb className="css-breadcrumb">
                                    <Breadcrumb.Item>13%</Breadcrumb.Item>
                                </Breadcrumb>
                            </Col>
                        }
                    </Row>
                </div>
            </div>
        );
    }
}

ShowForm.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
};

export default Form.create()(ShowForm);
