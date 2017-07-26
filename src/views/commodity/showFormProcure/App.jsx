/**
 * @file App.jsx
 * @author Tanjf
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
        // console.log(this.props.innitalvalue)
        const {
            brandName,
            deductibleTaxRate,
            firstLevelCategoryName,
            fourthLevelCategoryName,
            guidePurchasePrice,
            guideShipmentPrice,
            id,
            inputTaxRate,
            invoiceLimit,
            name,
            productCode,
            purchaseInsideNumber,
            saleName,
            secondLevelCategoryName,
            supplyChainStatus,
            thirdLevelCategoryName
        } = this.props.innitalvalue;
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
                                    {name}
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                        <Col span={8} className="css-col">
                            <span>商品品牌:</span>
                            <Breadcrumb className="css-breadcrumb">
                                <Breadcrumb.Item>{brandName}</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                        <Col span={7} className="css-col">
                            <span>商品编号:</span>
                            <Breadcrumb className="css-breadcrumb">
                                <Breadcrumb.Item>{productCode}</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                        <Col span={9} className="css-col">
                            <span>商品分类:</span>
                            <Breadcrumb separator=">" className="css-breadcrumb">
                                <Breadcrumb.Item>{firstLevelCategoryName}</Breadcrumb.Item>
                                <Breadcrumb.Item>{secondLevelCategoryName}</Breadcrumb.Item>
                                <Breadcrumb.Item>{thirdLevelCategoryName}</Breadcrumb.Item>
                                <Breadcrumb.Item>{fourthLevelCategoryName}</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

ShowForm.propTypes = {
    innitalvalue: PropTypes.objectOf(PropTypes.any),
    form: PropTypes.objectOf(PropTypes.any),
};

export default Form.create()(ShowForm);
