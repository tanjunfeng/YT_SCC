/**
 * @file App.jsx
 * @author tanjf shijh
 *
 * 销售价格
 */
import React, { PureComponent } from 'react';
import { Icon, Checkbox, Card, Row, Col, Button, Modal } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import NewSellingPrice from './newSellingPrice';
import PriceAreaDetail from './priceAreaDetail';

import { fetchGetProductById } from '../../../actions';
import { fetchPriceInfo } from '../../../actions/procurement';
import AddPurchasement from './addPurchasementPrice';

@connect(
    state => ({
        productDetail: state.toJS().commodity.getProductById,
        stepPriceList: state.toJS().commodity.stepPriceList
    }),
    dispatch => bindActionCreators({
        fetchGetProductById,
        fetchPriceInfo
    }, dispatch)
)
class SellingPrice extends PureComponent {
    constructor(props) {
        super(props);
    }

    compoenentDidMount() {
        const { match } = this.props;
        this.props.fetchGetProductById({productId: match.params.id});
        this.props.fetchPriceInfo({productId: match.params.id});
    }

    render() {
        const { productDetail = {} } = this.props;
        return (
            <div className="supplier-detail-message" style={{ marginTop: '15px' }}>
                <div className="supplier-detail-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />商品信息
                        </div>
                        <div className="detail-message-body">
                            <ul className="detail-message-list">
                                <li className="detail-message-item"><span>商品名称：</span>
                                    <span>{productDetail.name}</span>
                                </li>
                                <li className="detail-message-item"><span>商品品牌：</span>
                                    <span>{productDetail.brandName}</span>
                                </li>
                                <li className="detail-message-item"><span>商品编号：</span>
                                    <span>{productDetail.productCode}</span>
                                </li>
                                <li className="detail-message-item"><span>商品分类：</span>
                                    <span>{`${productDetail.firstLevelCategoryName} > ${productDetail.secondLevelCategoryName} > ${productDetail.firstLevelCategoryName} > ${productDetail.firstLevelCategoryName}`}</span>
                                </li>
                                <li className="detail-message-item"><span>税率：</span>
                                    <span>{productDetail.deductibleTaxRate}%</span>
                                </li>
                                <li className="detail-message-item"><span>承诺发货时间</span>
                                    <span>下单后{productDetail.deliveryTime}天内发货</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="supplier-detail-item">
                    <div className="detail-message-header">
                        <Icon type="bank" className="detail-message-header-icon" />价格明细
                    </div>
                    <div className="detail-message-body">
                        <ul className="detail-message-list">
                            <li className="detail-message-item">
                                <span>筛选：</span>
                                <PriceAreaDetail />
                                <NewSellingPrice />
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="supplier-SellingPrice-item">
                    <div className="detail-message-body sellingPrice-message-body">
                        <Row className="detail-message-list">
                            <Col xl={{ span: 4}} lg={{ span: 5}} className="detail-message-item">
                                <div>
                                    <Card extra={<Icon type="close-square" className="detail-close-header-icon" />}>
                                        <div>价格: <span>10-100</span><span>100元/件</span> </div>
                                        <div>价格: <span>10-100</span><span>100元/件</span> </div>
                                    </Card>
                                </div>
                            </Col >
                            <Col xl={{ span: 4, offset: 1 }} lg={{ span: 5, offset: 1 }} className="detail-message-item">
                                <div>
                                    <Card extra={<Icon type="close-square" className="detail-close-header-icon" />}>
                                        <div>价格: <span>10-100</span><span>100元/件</span> </div>
                                        <div>价格: <span>10-100</span><span>100元/件</span> </div>
                                    </Card>
                                </div>
                            </Col>
                            <Col xl={{ span: 4, offset: 1 }} lg={{ span: 5, offset: 1 }} className="detail-message-item">
                                <div>
                                    <Card extra={<Icon type="close-square" className="detail-close-header-icon" />}>
                                        <div>价格: <span>10-100</span><span>100元/件</span> </div>
                                        <div>价格: <span>10-100</span><span>100元/件</span> </div>
                                    </Card>
                                </div>
                            </Col>
                            <Col xl={{ span: 4, offset: 1 }} lg={{ span: 5, offset: 1 }} className="detail-message-item">
                                <div>
                                    <Card extra={<Icon type="close-square" className="detail-close-header-icon" />}>
                                        <div>价格: <span>10-100</span><span>100元/件</span> </div>
                                        <div>价格: <span>10-100</span><span>100元/件</span> </div>
                                    </Card>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(SellingPrice);
