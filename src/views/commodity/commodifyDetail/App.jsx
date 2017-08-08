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

@connect(
    state => ({
        commodityDetail: state.toJS().commodity.commodityDetail,
    }),
    dispatch => bindActionCreators({
        commodityDetails
    }, dispatch)
)
class CommodifyDetail extends PureComponent {
    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.commodityDetails({ productId: id });
    }

    guaranteePeriodUnit = (unit) => {
        switch (unit) {
            case '1':
                return '年';
            case '2':
                return '月';
            case '3':
                return '天';
            default:
                return '';
        }
    }

    render() {
        const { commodityDetail } = this.props;
        
        return (
            <div className="commodify-detail-message" style={{ marginTop: '15px' }}>
                <div className="supplier-detail-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />
                            商品基本信息
                        </div>
                        <div className="detail-message-body">
                            <ul className="detail-message-list">
                                {
                                    commodityDetail.productCode
                                    && <li className="detail-message-item">
                                        <span>商品编码：</span>
                                        <span>{commodityDetail.productCode}</span>
                                    </li>
                                }
                                {
                                    commodityDetail.internationalCodes
                                    && <li className="detail-message-item">
                                        <span>国标码：</span>
                                        {
                                            commodityDetail.internationalCodes.map(item => (
                                                <span className="international-codes" key={item}>{item}</span>
                                            ))
                                        }
                                    </li>
                                }
                                <li className="detail-message-item">
                                    <span>商品类目：</span>
                                    <span>
                                        {
                                            commodityDetail.firstLevelCategoryName
                                            && `${commodityDetail.firstLevelCategoryName}`
                                        }
                                        {
                                            commodityDetail.secondLevelCategoryName
                                            && `>${commodityDetail.secondLevelCategoryName}`
                                        }
                                        {
                                            commodityDetail.thirdLevelCategoryName
                                            && `>${commodityDetail.thirdLevelCategoryName}`
                                        }
                                        {
                                            commodityDetail.fourthLevelCategoryName
                                            && `>${commodityDetail.fourthLevelCategoryName}`
                                        }
                                    </span>
                                </li>
                                {
                                    commodityDetail.saleName
                                    && <li className="detail-message-item">
                                        <span>商品名称：</span>
                                        <span>{commodityDetail.saleName}</span>
                                    </li>
                                }
                                {
                                    commodityDetail.brandName
                                    && <li className="detail-message-item">
                                        <span>商品品牌：</span>
                                        <span>{commodityDetail.brandName}</span>
                                    </li>
                                }
                                {
                                    commodityDetail.description
                                    && <li className="detail-message-item">
                                        <span>商品描述：</span>
                                        <span>{commodityDetail.description}</span>
                                    </li>
                                }
                                {
                                    commodityDetail.inputTaxRate
                                    && <li className="detail-message-item">
                                        <span>进项税率：</span>
                                        <span>{`${commodityDetail.inputTaxRate}%`}</span>
                                    </li>
                                }
                                {
                                    commodityDetail.taxRate
                                    && <li className="detail-message-item">
                                        <span>销项税率：</span>
                                        <span>{`${commodityDetail.taxRate}%`}</span>
                                    </li>
                                }
                                {
                                    commodityDetail.deliveryTime
                                    && <li className="detail-message-item">
                                        <span>承诺发货时间：</span>
                                        <span>{`下单后${commodityDetail.deliveryTime}天内发货`}</span>
                                    </li>
                                }
                                {
                                    commodityDetail.guideShipmentPrice
                                    && <li className="detail-message-item">
                                        <span>建议出货价(元)：</span>
                                        <span>{`${commodityDetail.guideShipmentPrice}元`}</span>
                                    </li>
                                }
                                {
                                    commodityDetail.price
                                    && <li className="detail-message-item">
                                        <span>建议零售价(元)：</span>
                                        <span>{`${commodityDetail.price}元`}</span>
                                    </li>
                                }
                                {
                                    commodityDetail.guidePurchasePrice
                                    && <li className="detail-message-item">
                                        <span>指导采购价(元)：</span>
                                        <span>{`${commodityDetail.guidePurchasePrice}元`}</span>
                                    </li>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="supplier-detail-item">
                    <div className="detail-message-header">
                        <Icon type="car" className="detail-message-header-icon" />
                        货运信息
                    </div>
                    <div className="detail-message-body">
                        <ul className="detail-message-list">
                            {
                                commodityDetail.producePlace
                                && <li className="detail-message-item">
                                    <span>产地：</span>
                                    <span>{commodityDetail.producePlace}</span>
                                </li>
                            }
                            {
                                commodityDetail.packingSpecifications
                                && <li className="detail-message-item">
                                    <span>规格：</span>
                                    <span>{commodityDetail.packingSpecifications}</span>
                                </li>
                            }
                            {
                                commodityDetail.minUnit
                                && <li className="detail-message-item">
                                    <span>销售单位：</span>
                                    <span>{commodityDetail.minUnit}</span>
                                </li>
                            }
                            {
                                commodityDetail.weight
                                && <li className="detail-message-item">
                                    <span>商品毛重：</span>
                                    <span>{commodityDetail.weight}</span>
                                </li>
                            }
                            {
                                commodityDetail.length
                                && commodityDetail.width
                                && commodityDetail.height
                                && <li className="detail-message-item">
                                    <span>体积：</span>
                                    <span>
                                        {`长${commodityDetail.length}mm * 
                                        宽${commodityDetail.width}mm * 
                                        高${commodityDetail.height}mm`}
                                    </span>
                                </li>
                            }
                            {
                                commodityDetail.horizontalProductNum
                                && commodityDetail.verticalProductNum
                                && commodityDetail.heightProductNum
                                && <li className="detail-message-item">
                                    <span>箱规：</span>
                                    <span>
                                        {`${commodityDetail.horizontalProductNum} * 
                                        ${commodityDetail.verticalProductNum} * 
                                        ${commodityDetail.heightProductNum}`}
                                    </span>
                                </li>
                            }
                            {
                                commodityDetail.qualityGuaranteePeriod
                                && <li className="detail-message-item">
                                    <span>保质期：</span>
                                    <span>{`${commodityDetail.qualityGuaranteePeriod}
                                        ${this.guaranteePeriodUnit(commodityDetail.guaranteePeriodUnit)}`}</span>
                                </li>
                            }
                            {
                                commodityDetail.storageCondition
                                && <li className="detail-message-item">
                                    <span>储存条件：</span>
                                    <span>{commodityDetail.storageCondition}</span>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
                <div className="supplier-detail-item">
                    <div className="detail-message-header">
                        <Icon type="picture" className="detail-message-header-icon" />
                        <span>商品图片信息</span>
                        <span className="detail-prompt">
                            (备注：图片尺寸为800*800像素，单张图片大小不超过1M，第一张为主图)
                        </span>
                    </div>
                    <div className="detail-message-body">
                        <table className="detail-img-list" >
                            <tbody>
                                <tr>
                                    <td>商品图片:</td>
                                    {
                                        commodityDetail.mainImage
                                        && <td>
                                            <img src={commodityDetail.mainImage} alt="" />
                                        </td>
                                    }
                                    {
                                        commodityDetail.imgUrls
                                        && commodityDetail.imgUrls.map(item => (
                                            <td key={item}>
                                                <img src={item} alt="" />
                                            </td>
                                        ))
                                    }
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {
                    commodityDetail.keywords
                    && <div className="supplier-detail-item">
                        <div className="detail-message-header">
                            <Icon type="link" className="detail-message-header-icon" />
                            商品搜索关键字
                        </div>
                        <div className="detail-message-body">
                            <ul className="detail-message-list">
                                <li className="detail-message-item">
                                    <span>关键字：</span>
                                    <span>{commodityDetail.keywords}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                }
                <div className="go-back-button">
                    <Button
                        type="primary"
                        onClick={() => {
                            this.props.history.goBack();
                        }}
                    >返回</Button>
                </div>
            </div >
        )
    }
}
CommodifyDetail.propTypes = {
    match: PropTypes.objectOf(PropTypes.any),
    commodityDetail: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any),
    commodityDetails: PropTypes.func
}

CommodifyDetail.defaultProps = {
}
export default withRouter(CommodifyDetail);
