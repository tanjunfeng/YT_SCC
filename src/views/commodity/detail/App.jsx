import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon } from 'antd';

import { commodityDetails } from '../../../actions/producthome';
import { imgext } from '../../../constant';

@connect(
    state => ({
        commodityDetail: state.toJS().commodity.commodityDetail,
    }),
    dispatch => bindActionCreators({
        commodityDetails
    }, dispatch)
)

class SaleDetail extends PureComponent {
    constructor(props) {
        super(props);

        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.commodityDetails({ id });
    }


    render() {
        const { commodityDetail } = this.props;
        const { ...commodity } = commodityDetail;
        const {
            internationalCodes = [],
            childSkus = [],
            skuInputVos = [],
            mainImage,
            images
        } = commodity;
        // if (childSkus.length === 0) {
        //     return null
        // }
        return (
            <div className="supplier-detail-message" style={{ marginTop: '15px' }}>
                <div className="supplier-detail-item">
                    <div className="detail-message">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />商品基本信息
                        </div>
                        <div className="detail-message-body">
                            <ul className="detail-message-list">
                                {
                                    internationalCodes &&
                                    <li className="detail-message-item">
                                        <span>国标码：</span>
                                        {
                                            internationalCodes.map(item => (
                                                <span>{item}</span>
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
                                    </span>
                                </li>
                                {
                                    commodity.brandName &&
                                    <li className="detail-message-item"><span>商品品牌：</span><span>{commodity.brandName}</span></li>
                                }
                                {
                                    commodity.name &&
                                    <li className="detail-message-item"><span>商品名称：</span><span>{commodity.name}</span></li>
                                }
                                {
                                    commodity.invoiceLimit !== null &&
                                    <li className="detail-message-item"><span>发票限制：</span><span>{!!commodity.invoiceLimit ? '限制开增值税发票' : '不限制开增值税发票'}</span></li>
                                }
                                {
                                    commodity.inputTaxRate &&
                                    <li className="detail-message-item"><span>进税率：</span><span>{commodity.inputTaxRate}</span></li>
                                }
                                {
                                    commodity.taxRate !== null &&
                                    <li className="detail-message-item"><span>销项税率：</span><span>{commodity.taxRate}%</span></li>
                                }
                                {
                                    commodity.deliveryTime &&
                                    <li className="detail-message-item"><span>承诺发货时间：</span><span>{commodity.deliveryTime}</span></li>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="supplier-detail-item">
                    <div className="detail-message-header">
                        <Icon type="solution" className="detail-message-header-icon" />商品信息
                    </div>
                    <div className="detail-message-body">
                        <ul className="detail-message-list">
                            {
                                commodity.producePlace &&
                                <li className="detail-message-item"><span>产地：</span><span>{commodity.producePlace}</span></li>
                            }
                            {
                                commodity.packingSpecifications &&
                                <li className="detail-message-item"><span>规格：</span><span>{commodity.packingSpecifications}</span></li>
                            }
                            {
                                commodity.minUnit &&
                                <li className="detail-message-item"><span>销售单位：</span><span>{commodity.minUnit}瓶</span></li>
                            }
                            {
                                commodity.carton &&
                                <li className="detail-message-item"><span>箱规：</span><span>{commodity.carton}瓶</span></li>
                            }
                            {
                                commodity.weight &&
                                <li className="detail-message-item"><span>商品毛重：</span><span>{commodity.weight}</span></li>
                            }
                            <li className="detail-message-item"><span>体积：</span><span>{commodity.packingSpecifications}</span></li>
                            {
                                commodity.qualityGuaranteePeriod &&
                                <li className="detail-message-item"><span>保质期：</span><span>{commodity.qualityGuaranteePeriod}</span></li>
                            }
                            <li className="detail-message-item"><span>是否含糖：</span><span>低糖</span></li>
                        </ul>
                    </div>
                </div>
                {
                    skuInputVos.length !== 0 && childSkus.length !== 0 &&
                    <div className="supplier-detail-item">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />销售属性（SKU信息）
                    </div>
                        <div className="detail-message-body">
                            <ul className="detail-message-list">
                                {
                                    skuInputVos && skuInputVos.map(item => (
                                        <li className="detail-message-item">
                                            {item.name && <span>属性名称：</span>}
                                            <span>{item.name}</span>
                                            <span className="detail-value">值：</span><span>{item.value.join()}</span>
                                        </li>
                                    ))
                                }
                            </ul>
                            {
                                childSkus.length !== 0 &&
                                <table className="detail-table">
                                    <tr className="detail-table-tr">
                                        <th>排序</th>
                                        {
                                            childSkus[0].attr1Name &&
                                            <th>{childSkus[0].attr1Name}</th>
                                        }
                                        {
                                            childSkus[0].attr2Name &&
                                            <th>{childSkus[0].attr2Name}</th>
                                        }
                                    </tr>
                                    {
                                        childSkus && childSkus.map((item, index) => (
                                            <tr className="detail-table-tr">
                                                <td>{index + 1}</td>
                                                {
                                                    item.attr1Value &&
                                                    <td>{item.attr1Value}</td>
                                                }
                                                {
                                                    item.attr2Value &&
                                                    <td>{item.attr2Value}</td>
                                                }
                                            </tr>
                                        ))
                                    }
                                </table>
                            }
                        </div>
                    </div>
                }
                <div className="supplier-detail-item">
                    <div className="detail-message-header">
                        <Icon type="solution" className="detail-message-header-icon" />
                        <span>商品图片信息</span>
                        <span className="detail-prompt">(备注：图片尺寸为800*800像素，单张图片大小不超过1M，第一张为主图)</span>
                    </div>
                    <div className="detail-message-body">
                        <table className="detail-img-list" >
                            <tr>
                                <td>商品图片:</td>
                                <td>
                                    {mainImage == null ? '*主图' : <img src={`${imgext}${mainImage}`} />}

                                </td>
                                {images && images.map(item => (
                                    <td>
                                        <img src={`${imgext}${item.url}`} />
                                    </td>
                                ))
                                }
                            </tr>
                            {
                                childSkus && childSkus.map(item => (
                                    <tr>
                                        <td>
                                            {item.attr1Value},{item.attr2Value}
                                        </td>
                                        <td>
                                            *主图
                                        </td>
                                        {
                                            item.images.map(other => (
                                                <td>
                                                    <img src={`${imgext}${other.url}`} />
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
                    commodity.keywords && <div className="supplier-detail-item">
                        <div className="detail-message-header">
                            <Icon type="solution" className="detail-message-header-icon" />商品搜索关键字
                    </div>
                        <div className="detail-message-body">
                            <ul className="detail-message-list">
                                <li className="detail-message-item"><span>关键字：</span><span>{commodity.keywords}</span></li>
                            </ul>
                        </div>
                    </div>
                }
            </div >
        )
    }
}

export default withRouter(SaleDetail);
