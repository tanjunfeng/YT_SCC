/**
 * 直营店下单，添加商品
 *
 * 1. 点选值清单依次添加
 * 2. 下载 excel 模板批量添加
 *
 * @returns 商品列表
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Button } from 'antd';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AddingGoodsByStore } from '../../../container/search';
import { queryGoodsInfo } from '../../../actions/procurement';
import Utils from '../../../util/util';
import { Excel } from '../../../container/upload';

const FormItem = Form.Item;

@connect(() => ({}), dispatch => bindActionCreators({
    queryGoodsInfo
}, dispatch))

class GoodsForm extends PureComponent {
    getRow = (goodsInfo) => {
        const {
            productId,
            productCode,
            internationalCodes,
            productName,
            unitExplanation,
            salePrice,
            packingSpecifications,
            available,  // 是否在本区域销售
            minNumber,  // 起订数量
            minUnit,    // 最小销售单位
            fullCaseUnit,   // 整箱单位
            salesInsideNumber,  // 销售内装数
            sellFullCase    // 是否整箱销售，１:按整箱销售，0:不按整箱销售
        } = goodsInfo;
        const record = {
            productId,
            productCode,
            internationalCode: internationalCodes[0].internationalCode,
            productName,
            productSpecifications: `${packingSpecifications || '-'} / ${unitExplanation || '-'}`,
            available,
            salePrice,
            sellFullCase,
            salesInsideNumber,
            packingSpecifications: sellFullCase === 0 ? '-' : `${salesInsideNumber}${fullCaseUnit || ''} / ${minUnit || '-'}`,
            quantity: sellFullCase === 0 ? minNumber : minNumber * salesInsideNumber,
            minNumber,
            minNumberSpecifications: sellFullCase === 0 ? `${minNumber}${fullCaseUnit || ''}` : `${minNumber}${minUnit || '-'}`, // 起订数量显示单位
            enough: true,    // 是否库存充足，默认充足
            isMultiple: true    // 是否是销售内装数的整数倍，默认是整数倍
        };
        return record;
    }

    handleGoodsChange = ({ record }) => {
        const { branchCompanyId, deliveryWarehouseCode } = this.props.value;
        if (record === undefined || branchCompanyId === '') {
            this.props.onChange(null);
            return;
        }
        const productId = record.productId;
        this.props.queryGoodsInfo(Utils.removeInvalid({
            productId, branchCompanyId, deliveryWarehouseCode, quantity: 0
        })).then(res => {
            this.props.onChange(this.getRow(res.data));
        });
    }

    handleImport = (list) => {
        const dist = [];
        list.forEach(item => {
            dist.push(this.getRow(item));
        });
        this.props.onImport(dist);
    }

    handleSubmit = () => {
        this.props.onSubmit();
    }

    render() {
        const { branchCompanyId, deliveryWarehouseCode, canBeSubmit } = this.props.value;
        const excelParams = Utils.removeInvalid({ branchCompanyId, deliveryWarehouseCode });
        return (
            <div className="direct-sales-orders-form goods-form">
                <Form layout="inline">
                    <div className="search-box">
                        <h1>商品信息</h1>
                        <Row gutter={40}>
                            <FormItem>
                                <AddingGoodsByStore
                                    branchCompanyId={this.props.value.branchCompanyId}
                                    onChange={this.handleGoodsChange}
                                />
                            </FormItem>
                            <FormItem className="file-upload">
                                <Excel
                                    value={excelParams}
                                    onChange={this.handleImport}
                                />
                            </FormItem>
                            <FormItem>
                                <a className="download" target="_blank" href={`${window.config.apiHost}directStore/downloadExcelModel`}>
                                    下载 Excel 模板
                                </a>
                                <div className="info">
                                    数量：<span>30</span>
                                </div>
                                <div className="info">
                                    金额：<span>2000</span>
                                </div>
                            </FormItem>
                            <FormItem className="fr">
                                <Button type="primary" size="default" onClick={this.handleSubmit} disabled={!canBeSubmit}>
                                    提交
                                </Button>
                            </FormItem>
                        </Row>
                    </div>
                </Form>
            </div>
        );
    }
}

GoodsForm.propTypes = {
    value: PropTypes.objectOf(PropTypes.any),
    canBeSubmit: PropTypes.bool,
    queryGoodsInfo: PropTypes.func,
    onChange: PropTypes.func,
    onImport: PropTypes.func,
    onSubmit: PropTypes.func
};

export default withRouter(Form.create()(GoodsForm));
