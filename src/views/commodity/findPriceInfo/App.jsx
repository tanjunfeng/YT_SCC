import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, Card, Button } from 'antd';

import { findPrice, ProductAddPriceVisible, deletePurchasePrice } from '../../../actions/producthome';
import CasadingAddress from '../../../components/ascadingAddress';
import AddSellPrice from './toAddSellPrice';

@connect(
    state => ({
        toAddPriceVisible: state.toJS().commodity.toAddPriceVisible,
        price: state.toJS().commodity.price
    }),
    dispatch => bindActionCreators({
        findPrice,
        ProductAddPriceVisible,
        deletePurchasePrice
    }, dispatch)
)
class FindPriceInfo extends PureComponent {
    constructor(props) {
        super(props);
        this.componentDidMount = ::this.componentDidMount;
        this.handleSlelectChange = ::this.handleSlelectChange;
        this.handleWatch = ::this.handleWatch;
        this.fetNewData = ::this.fetNewData;
    }
    componentDidMount() {
        this.fetNewData();
    }

    fetNewData() {
        const { id } = this.props.match.params;
        this.props.findPrice({ productId: id });
    }

    handleSlelectChange() {

    }

    handleWatch() {
        this.props.ProductAddPriceVisible({ isVisible: true, isEdit: false })
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
        const { pricingId, cityNames, id } = item;
        this.props.ProductAddPriceVisible(
            { isVisible: true, isEdit: true, pricingId, id }
        )
    }

    render() {
        const { productVo = {} } = this.props.price;
        const { goodsPriceInfoVos = [] } = this.props.price;
        const {
            name = '',
            id = '',
            brandName = '',
            firstLevelCategoryName = '',
            secondLevelCategoryName = '',
            thirdLevelCategoryName = '',
            deductibleTaxRate = '',
            invoiceLimit = '' } = productVo;

        return (
            <div className="supplier-detail-message" style={{ marginTop: '15px' }}>
                <div className="supplier-detail-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />商品信息
                        </div>
                        <div className="detail-message-body">
                            <ul className="detail-message-list">
                                <li className="detail-message-item">
                                    <span>商品名称：</span>
                                    <span>{name}</span>
                                </li>
                                <li className="detail-message-item">
                                    <span>商品品牌：</span>
                                    <span>{brandName}</span>
                                </li>
                                <li className="detail-message-item">
                                    <span>商品编号：</span>
                                    <span>{id}</span>
                                </li>
                                <li className="detail-message-item">
                                    <span>商品分类：</span>
                                    <span>
                                        {firstLevelCategoryName && `${firstLevelCategoryName}`}
                                        {secondLevelCategoryName && `>${secondLevelCategoryName}`}
                                        {thirdLevelCategoryName && `>${thirdLevelCategoryName}`}
                                    </span>
                                </li>
                                <li className="detail-message-item">
                                    {!!invoiceLimit ? '限制开增值税发票' : '不限制开增值税发票'}
                                </li>
                                <li className="detail-message-item">
                                    <span>税率：</span>
                                    <span>{deductibleTaxRate}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="price-content">
                    <div className=" price-detail-item supplier-detail-item">
                        <div className="detail-message-header">
                            <Icon type="bank" className="detail-message-header-icon" />价格明细
                    </div>
                        <div className="detail-message-body">
                            <ul className="detail-message-list">
                                <li className="detail-message-item">
                                    <CasadingAddress
                                        id="space"
                                        showNum="2"
                                        hasAll
                                        onChange={this.handleSlelectChange}
                                    />
                                    <Button onClick={this.handleWatch}>新增</Button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="supplier-SellingPrice-item">
                    <div className="detail-message-body sellingPrice-message-body">
                        <ul className="detail-message-list">
                            {
                                goodsPriceInfoVos.map(item => (
                                    <li
                                        key={item.id}
                                        className="detail-message-item supplier-SellingPrice-item"
                                        onClick={(e) => this.handleWatchModify(item, e)
                                        }>
                                        <Card
                                            extra={<Icon type="close-circle-o"
                                                onClick={(e) => this.handleDelete(item, e)}
                                                className="detail-close-header-icon" />
                                            }>
                                            <div className="detail-message-price">
                                                <div className="detail-message-price-left">价格:</div>
                                                <div className="detail-message-price-right">
                                                    <div>
                                                        <span>
                                                            {item.startNumber1}-{item.endNumber1}
                                                        </span>
                                                        <span>{item.price1}元/件</span>
                                                    </div>
                                                    <div>
                                                        <span>
                                                            {item.startNumber2}-{item.endNumber2}
                                                        </span>
                                                        <span>{item.price2}元/件</span>
                                                    </div>
                                                    <div>
                                                        <span>
                                                            {item.startNumber3}-{item.endNumber3}
                                                        </span>
                                                        <span>{item.price3}元/件</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-message-price">
                                                <div className="detail-message-price-left">地区:</div>
                                                <div className="detail-message-price-right">
                                                    <span>{item.cityNames}</span>
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
                    this.props.toAddPriceVisible &&
                    <AddSellPrice
                        fetchList={this.fetNewData}
                    />
                }
            </div>
        )
    }
}

FindPriceInfo.propTypes = {
    findPrice: PropTypes.objectOf(PropTypes.any),
    ProductAddPriceVisible: PropTypes.func
}

export default withRouter(FindPriceInfo);
