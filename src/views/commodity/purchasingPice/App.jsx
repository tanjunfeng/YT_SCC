import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, Checkbox, Card, Row, Col, Button, Modal, message } from 'antd';

import { PurchasePriceDetail, purchasePriceVisible, deletePurchasePrice } from '../../../actions/producthome';
import AddPurchasement from './addPurchasementPrice';

@connect(
    state => ({
        toPurchasePriceVisible: state.toJS().commodity.toPurchasePriceVisible,
        purchasePrice: state.toJS().commodity.purchasePrice
    }),
    dispatch => bindActionCreators({
        PurchasePriceDetail,
        purchasePriceVisible,
        deletePurchasePrice
    }, dispatch)
)
class Purchasing extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSlelectChange = ::this.handleSlelectChange;
        this.handleWatch = ::this.handleWatch;
        this.handleWatchModify = ::this.handleWatchModify;
        this.handleDelete = ::this.handleDelete;
        this.fetNewData = :: this.fetNewData;
    }

    componentDidMount() {
        this.fetNewData()
    }

    fetNewData() {
        const { id } = this.props.match.params;
        this.props.PurchasePriceDetail({ productId: id });
    }

    handleSlelectChange() {

    }

    handleWatch() {
        this.props.purchasePriceVisible({ isVisible: true, isEdit: false })
    }

    handleDelete(item, e) {
        const { id } = item;
        e.stopPropagation();
        this.props.deletePurchasePrice({ id: id })
            .then(() => {
                this.fetNewData();
            })
    }

    handleWatchModify(item) {
        const { id, supplierId, status, companyName, pricingId } = item;
        if (status === 2) {
            this.props.purchasePriceVisible({ isVisible: true, isEdit: true, id, supplierId, companyName, pricingId })
        } else if (status === 0) {
            message.success('待审批')
        } else if (status === 1) {
            message.success('审核不通过')
        } else if (status === 3) {
            message.success('已冻结')
        } else if (status === 4) {
            message.success('终止合作')
        } else if (status === 5) {
            message.success('修改待审核')
        } else if (status === 6) {
            message.success('修改审核未通过')
        }
    }

    render() {
        const { product = {} } = this.props.purchasePrice;
        const { goodsPriceInfoList = [] } = this.props.purchasePrice;
        const {
            name = '',
            id = '',
            brandName = '',
            firstLevelCategoryName = '',
            secondLevelCategoryName = '',
            thirdLevelCategoryName = '',
            deductibleTaxRate = '',
            invoiceLimit = '' } = product;

        return (
            <div className="supplier-detail-message" style={{ marginTop: '15px' }}>
                <div className="supplier-detail-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />商品信息
                        </div>
                        <div className="detail-message-body">
                            <ul className="detail-message-list">
                                {
                                    name &&
                                    <li className="detail-message-item"><span>商品名称：</span><span>{name}</span></li>
                                }
                                {
                                    brandName &&
                                    <li className="detail-message-item"><span>商品品牌：</span><span>{brandName}</span></li>
                                }
                                {
                                    id &&
                                    <li className="detail-message-item"><span>商品编号：</span><span>{id}</span></li>
                                }
                                <li className="detail-message-item">
                                    <span>商品分类：</span>
                                    <span>{firstLevelCategoryName && `${firstLevelCategoryName}`}{secondLevelCategoryName && `>${secondLevelCategoryName}`}{thirdLevelCategoryName && `>${thirdLevelCategoryName}`}</span>
                                </li>
                                <li className="detail-message-item">{!!invoiceLimit ? '限制开增值税发票' : '不限制开增值税发票'}</li>
                                <li className="detail-message-item"><span>税率：</span><span>{deductibleTaxRate}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className=" price-detail-item supplier-detail-item">
                    <div className="detail-message-header">
                        <Icon type="bank" className="detail-message-header-icon" />价格明细
                    </div>
                    <div className="detail-message-body">
                        <ul className="detail-message-list">
                            <li className="detail-message-item">
                                <Button onClick={this.handleWatch}>新增</Button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="supplier-SellingPrice-item">
                    <div className="detail-message-body sellingPrice-message-body">
                        <ul className="detail-message-list">
                            {
                                goodsPriceInfoList.map(item => (
                                    <li key={item.id} className="detail-message-item supplier-SellingPrice-item" onClick={(e) => this.handleWatchModify(item, e)}>
                                        <Card extra={<Icon type="close-circle-o" onClick={(e) => this.handleDelete(item, e)} className="detail-close-header-icon" />}>
                                            <div>{item.companyName}</div>
                                            <div className="detail-message-price">
                                                <div className="detail-message-price-left">价格:</div>
                                                <div className="detail-message-price-right">
                                                    <div>
                                                        <span>{item.startNumber1}-{item.endNumber1}</span><span>{item.price1}元/件</span>
                                                    </div>
                                                    <div>
                                                        <span>{item.startNumber2}-{item.endNumber2}</span><span>{item.price2}元/件</span>
                                                    </div>
                                                    <div>
                                                        <span>{item.startNumber3}-{item.endNumber3}</span><span>{item.price3}元/件</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </li >
                                ))
                            }
                        </ul>
                    </div>
                </div>
                {
                    this.props.toPurchasePriceVisible &&
                    <AddPurchasement
                        fetchList={this.fetNewData}
                    />
                }
            </div>
        )
    }
}

export default withRouter(Purchasing);
