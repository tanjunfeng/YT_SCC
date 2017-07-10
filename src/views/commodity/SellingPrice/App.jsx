import React, { PureComponent } from 'react';
import { Icon, Checkbox, Card, Row, Col, Button, Modal } from 'antd';

import NewSellingPrice from './newSellingPrice';
import PriceAreaDetail from './priceAreaDetail';

class SellingPrice extends PureComponent {
    render() {
        return (
            <div className="supplier-detail-message" style={{ marginTop: '15px' }}>
                <div className="supplier-detail-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />商品信息
                        </div>
                        <div className="detail-message-body">
                            <ul className="detail-message-list">
                                <li className="detail-message-item"><span>商品名称：</span><span>康师傅 方便面（KSF） 经典系列 红烧牛肉 泡面 五连包</span></li>
                                <li className="detail-message-item"><span>商品品牌：</span><span>康师傅</span></li>
                                <li className="detail-message-item"><span>商品编号：</span><span>prod222</span></li>
                                <li className="detail-message-item"><span>商品分类：</span><span>休闲食品 > 膨化食品</span></li>
                                <li className="detail-message-item"><Checkbox>限制开增值税发票</Checkbox></li>
                                <li className="detail-message-item"><span>税率：</span><span>13%</span></li>
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

export default SellingPrice;
