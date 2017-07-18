/**
 * @file App.jsx
 * @author caoyanxuan(copy shiyx)
 *
 * 商品详情
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, Button } from 'antd';

import { commodityDetails } from '../../../actions/producthome';
// import { imgext } from '../../../constant';

@connect(
    state => ({
        commodityDetail: state.toJS().commodity.commodityDetail,
    }),
    dispatch => bindActionCreators({
        commodityDetails
    }, dispatch)
)

class CommodifyDetail extends PureComponent {
    constructor(props) {
        super(props);

        this.handleGoBack = ::this.handleGoBack;
    }

    componentDidMount() {
        // const { id } = this.props.match.params;
        // this.props.commodityDetails({ id });
    }

    /**
     * 返回按钮
     */
    handleGoBack() {
        window.history.back();
    }

    render() {
        // const { commodityDetail } = this.props;
        // const { ...commodity } = commodityDetail;
        // const {
        //     internationalCodes = [],
        //     childSkus = [],
        //     skuInputVos = [],
        //     mainImage,
        //     images
        // } = commodity;
        // 商品基本信息
        const commodity = {
            commodityNumber: 123456,
            internationalCodes: [7241123033332000000, 7241123033332000001],
            firstLevelCategoryName: '饮料烟酒',
            secondLevelCategoryName: '水饮料',
            thirdLevelCategoryName: '碳酸饮料',
            fourthLevelCategoryName: '碳酸饮料',
            name: '百事可口可乐600ml特惠装',
            brandName: '脉动',
            description: '百事可乐 极度（Max）碳酸饮料 把乐带回家百事可乐 极度（Max）碳酸饮料 把乐带回家百事可乐 极度（Max）碳酸饮料 把乐带回家',
            inputTaxRate: 13,
            taxRate: 17,
            deliveryTime: 7,
            suggestedPrice: 100,
            suggestedRetailPrice: 100,
            GuidePurchasePrice: 100,
        }
        // 货运信息
        const freight = {
            producePlace: '成都',
            packingSpecifications: '330ml',
            minUnit: '瓶',
            weight: '500g',
            volume: '长100mm*宽100mm*高100mm',
            carton: '2*3*1',
            qualityGuaranteePeriod: '12月',
            storageConditions: '常温',
        }
        // 销售信息（SKU）
        const skuInputVos = [{
            attrName: '口味',
            value: '青柠、蓝莓',
        }, {
            attrName: '包装',
            value: '瓶装、灌装',
        }]
        // 图片信息
        const imgs = {
            commodityImgs: [
                'http://sit.image.com/group1/M00/00/FB/rB4KPVlsFXOAGDZWAABb5O0UTso681.jpg',
                'http://sit.image.com/group1/M00/00/F0/rB4KPllldGKAM-qXAAIWI0MYAlA563.jpg',
            ],
            subCommodityImgs: [
                {
                    name: '青柠,瓶装:',
                    subCommodityImg: [
                        'http://sit.image.com/group1/M00/00/FB/rB4KPVlsFXOAGDZWAABb5O0UTso681.jpg',
                        'http://sit.image.com/group1/M00/00/F0/rB4KPllldGKAM-qXAAIWI0MYAlA563.jpg',
                    ]
                },
                {
                    name: '青柠,罐装:',
                    subCommodityImg: [
                        'http://sit.image.com/group1/M00/00/FB/rB4KPVlsFXOAGDZWAABb5O0UTso681.jpg',
                        'http://sit.image.com/group1/M00/00/F0/rB4KPllldGKAM-qXAAIWI0MYAlA563.jpg',
                    ]
                },
                {
                    name: '蓝梅,罐装:',
                    subCommodityImg: [
                        'http://sit.image.com/group1/M00/00/FB/rB4KPVlsFXOAGDZWAABb5O0UTso681.jpg',
                        'http://sit.image.com/group1/M00/00/F0/rB4KPllldGKAM-qXAAIWI0MYAlA563.jpg',
                    ]
                },
            ]
        }

        // 关键字
        const keywords = '包装,蓝梅,青柠,罐装'
        return (
            <div className="commodify-detail-message" style={{ marginTop: '15px' }}>
                <div className="supplier-detail-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />商品基本信息
                        </div>
                        <div className="detail-message-body">
                            <ul className="detail-message-list">
                                {
                                    commodity.commodityNumber &&
                                    <li className="detail-message-item">
                                        <span>商品编码：</span>
                                        <span>{commodity.commodityNumber}</span>
                                    </li>
                                }
                                {
                                    commodity.internationalCodes &&
                                    <li className="detail-message-item">
                                        <span>国标码：</span>
                                        {
                                            commodity.internationalCodes.map(item => (
                                                <span key={item}>{item}</span>
                                            ))
                                        }
                                    </li>
                                }
                                <li className="detail-message-item">
                                    <span>商品类目：</span>
                                    <span>
                                        {commodity.firstLevelCategoryName && `${commodity.firstLevelCategoryName}`}
                                        {commodity.secondLevelCategoryName && `>${commodity.secondLevelCategoryName}`}
                                        {commodity.thirdLevelCategoryName && `>${commodity.thirdLevelCategoryName}`}
                                        {commodity.fourthLevelCategoryName && `>${commodity.fourthLevelCategoryName}`}
                                    </span>
                                </li>
                                {
                                    commodity.name &&
                                    <li className="detail-message-item">
                                        <span>商品名称：</span>
                                        <span>{commodity.name}</span>
                                    </li>
                                }
                                {
                                    commodity.brandName &&
                                    <li className="detail-message-item">
                                        <span>商品品牌：</span>
                                        <span>{commodity.brandName}</span>
                                    </li>
                                }
                                {
                                    commodity.description &&
                                    <li className="detail-message-item">
                                        <span>商品描述：</span>
                                        <span>{commodity.description}</span>
                                    </li>
                                }
                                {
                                    commodity.inputTaxRate &&
                                    <li className="detail-message-item">
                                        <span>进项税率：</span>
                                        <span>{`${commodity.inputTaxRate}%`}</span>
                                    </li>
                                }
                                {
                                    commodity.taxRate &&
                                    <li className="detail-message-item">
                                        <span>销项税率：</span>
                                        <span>{`${commodity.taxRate}%`}</span>
                                    </li>
                                }
                                {
                                    commodity.suggestedPrice &&
                                    <li className="detail-message-item">
                                        <span>建议出货价(元)：</span>
                                        <span>{`${commodity.suggestedPrice}元`}</span>
                                    </li>
                                }
                                {
                                    commodity.suggestedRetailPrice &&
                                    <li className="detail-message-item">
                                        <span>建议零售价(元)：</span>
                                        <span>{`${commodity.suggestedRetailPrice}元`}</span>
                                    </li>
                                }
                                {
                                    commodity.GuidePurchasePrice &&
                                    <li className="detail-message-item">
                                        <span>指导采购价(元)：</span>
                                        <span>{`${commodity.GuidePurchasePrice}元`}</span>
                                    </li>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="supplier-detail-item">
                    <div className="detail-message-header">
                        <Icon type="car" className="detail-message-header-icon" />货运信息
                    </div>
                    <div className="detail-message-body">
                        <ul className="detail-message-list">
                            {
                                freight.producePlace &&
                                <li className="detail-message-item">
                                    <span>产地：</span>
                                    <span>{freight.producePlace}</span>
                                </li>
                            }
                            {
                                freight.packingSpecifications &&
                                <li className="detail-message-item">
                                    <span>规格：</span>
                                    <span>{freight.packingSpecifications}</span>
                                </li>
                            }
                            {
                                freight.minUnit &&
                                <li className="detail-message-item">
                                    <span>销售单位：</span>
                                    <span>{freight.minUnit}瓶</span>
                                </li>
                            }
                            {
                                freight.weight &&
                                <li className="detail-message-item">
                                    <span>商品毛重：</span>
                                    <span>{freight.weight}</span>
                                </li>
                            }
                            <li className="detail-message-item">
                                <span>体积：</span>
                                <span>{freight.volume}</span>
                            </li>
                            {
                                freight.carton &&
                                <li className="detail-message-item">
                                    <span>箱规：</span>
                                    <span>{freight.carton}瓶</span>
                                </li>
                            }
                            {
                                freight.qualityGuaranteePeriod &&
                                <li className="detail-message-item">
                                    <span>保质期：</span>
                                    <span>{freight.qualityGuaranteePeriod}</span>
                                </li>
                            }
                            {
                                freight.storageConditions &&
                                <li className="detail-message-item">
                                    <span>储存条件：</span>
                                    <span>{freight.storageConditions}</span>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
                {
                    skuInputVos.length !== 0 &&
                    <div className="supplier-detail-item">
                        <div className="detail-message-header">
                            <Icon type="line-chart" className="detail-message-header-icon" />销售属性（SKU信息）
                    </div>
                        <div className="detail-message-body">
                            <ul className="detail-message-list">
                                {
                                    skuInputVos &&
                                    skuInputVos.map(item => (
                                        <li className="detail-message-item" key={item.value}>
                                            {item.attrName &&
                                            <span>
                                                {`属性名称：${item.attrName}`}
                                            </span>}
                                            <span className="detail-value">
                                                {`值：${item.value}`}
                                            </span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                }
                <div className="supplier-detail-item">
                    <div className="detail-message-header">
                        <Icon type="picture" className="detail-message-header-icon" />
                        <span>商品图片信息</span>
                        <span className="detail-prompt">(备注：图片尺寸为800*800像素，单张图片大小不超过1M，第一张为主图)</span>
                    </div>
                    <div className="detail-message-body">
                        <table className="detail-img-list" >
                            <tr>
                                <td>商品图片:</td>
                                {imgs.commodityImgs && imgs.commodityImgs.map(item => (
                                    <td key={item}>
                                        <img src={item} alt="" />
                                    </td>
                                ))
                                }
                            </tr>
                            {
                                imgs.subCommodityImgs && imgs.subCommodityImgs.map(item => (
                                    <tr key={item.name}>
                                        <td>
                                            {item.name}
                                        </td>
                                        {
                                            item.subCommodityImg.map(other => (
                                                <td key={other}>
                                                    <img src={other} alt="" />
                                                </td>
                                            ))
                                        }
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                </div>
                {
                    keywords && <div className="supplier-detail-item">
                        <div className="detail-message-header">
                            <Icon type="link" className="detail-message-header-icon" />商品搜索关键字
                    </div>
                        <div className="detail-message-body">
                            <ul className="detail-message-list">
                                <li className="detail-message-item"><span>关键字：</span><span>{keywords}</span></li>
                            </ul>
                        </div>
                    </div>
                }
                <div className="go-back-button">
                    <Button type="primary" onClick={this.handleGoBack}>返回</Button>
                </div>
            </div >
        )
    }
}
CommodifyDetail.propTypes = {
    match: PropTypes.objectOf(PropTypes.any),
}

CommodifyDetail.defaultProps = {
}
export default withRouter(CommodifyDetail);
