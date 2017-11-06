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
import Excel from './excel';

const FormItem = Form.Item;

@connect(() => ({}), dispatch => bindActionCreators({
    queryGoodsInfo
}, dispatch))

class GoodsForm extends PureComponent {
    /**
     * 组装表格显示字段
     */
    getRow = (goodsInfo) => {
        const {
            productId,
            productCode,
            internationalCodes,
            productName,
            unitExplanation,
            salePrice,
            packingSpecifications,
            available, // 是否在本区域销售
            minNumber, // 起订数量
            minUnit, // 最小销售单位
            fullCaseUnit, // 整箱单位
            salesInsideNumber, // 销售内装数
            sellFullCase // 是否整箱销售，１:按整箱销售，0:不按整箱销售
        } = goodsInfo;
        const record = {
            productId,
            productCode,
            productName,
            available,
            salePrice,
            sellFullCase,
            salesInsideNumber,
            minNumber
        };
        const quantity = sellFullCase === 0 ? minNumber : minNumber * salesInsideNumber;
        const subTotal = quantity * salePrice;
        // 起订数量显示单位
        const minNumberSpecifications = sellFullCase === 0 ? `${minNumber}${fullCaseUnit || ''}` : `${minNumber}${minUnit || '-'}`;
        Object.assign(record, {
            productSpecifications: `${packingSpecifications || '-'} / ${unitExplanation || '-'}`,
            packingSpecifications: sellFullCase === 0 ? '-' : `${salesInsideNumber}${fullCaseUnit || ''} / ${minUnit || '-'}`,
            internationalCode: internationalCodes[0].internationalCode,
            quantity,
            subTotal,
            minNumberSpecifications,
            enough: true, // 是否库存充足，默认充足
            isMultiple: true // 是否是销售内装数的整数倍，默认是整数倍
        });
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

    /**
     * 处理导入的商品
     *
     * 将无效的商品和不在销售区域的商品筛选出来分别存入 importList 和 deletedGoodsList
     */
    handleImport = (list) => {
        const importList = [];
        const deletedGoodsList = [];
        if (list.length > 0) {
            list.forEach(item => {
                if (item.uploadFailedVos === null) {
                    const goods = this.getRow(item);
                    // 数量从导入返回数据重新复制
                    Object.assign(goods, {
                        quantity: item.quantity
                    });
                    importList.push(goods);
                } else {
                    deletedGoodsList.push({
                        productName: item.uploadFailedVos.productName,
                        productCode: item.uploadFailedVos.productCode
                    });
                }
            });
        }
        this.props.onImport(importList, deletedGoodsList);
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
                                    branchCompanyId={branchCompanyId}
                                    onChange={this.handleGoodsChange}
                                />
                            </FormItem>
                            <FormItem className="download" >
                                <a target="_blank" href={`${window.config.apiHost}directStore/downloadExcelModel`}>
                                    下载 Excel 模板
                                </a>
                            </FormItem>
                            <FormItem className="file-upload">
                                <Excel
                                    value={{ ...excelParams }}
                                    onChange={this.handleImport}
                                />
                            </FormItem>
                        </Row>
                        <Row gutter={40} type="flex" justify="end">
                            <FormItem>
                                <div className="info">
                                    数量：<span>30</span>
                                </div>
                                <div className="info">
                                    金额：<span>2000</span>
                                </div>
                            </FormItem>
                            <FormItem>
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
