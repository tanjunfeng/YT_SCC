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
import { Form, Row, Button, message } from 'antd';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AddingGoodsByStore } from '../../../container/search';
import { queryGoodsInfo } from '../../../actions/procurement';
import Utils from '../../../util/util';
import { getRow } from './helper';
import Excel from './excel';

const FormItem = Form.Item;

@connect(() => ({}), dispatch => bindActionCreators({
    queryGoodsInfo
}, dispatch))

class GoodsForm extends PureComponent {
    handleGoodsChange = ({ record }) => {
        const { branchCompanyId, deliveryWarehouseCode } = this.props.value;
        if (record === undefined || branchCompanyId === '') {
            this.props.onChange(null);
            return;
        }
        const productCode = record.productCode;
        this.props.queryGoodsInfo(Utils.removeInvalid({
            productCode, branchCompanyId, deliveryWarehouseCode, quantity: 0
        })).then(res => {
            if (res.data.available === false) {
                message.error(res.data.message);
                return
            }
            this.props.onChange(getRow(res.data));
        });
    }

    /**
     * 处理导入的商品
     *
     * 将无效的商品和不在销售区域的商品筛选出来分别存入 importList 和 deletedGoodsList
     */
    handleImport = list => {
        const importList = [];
        const deletedGoodsList = [];
        if (list.length > 0) {
            list.forEach(item => {
                if (item.uploadFailedVos === null) {
                    const goods = getRow(item);
                    // 数量从导入返回数据重新复制
                    Object.assign(goods, {
                        quantity: item.saleQuantity
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
        const { branchCompanyId, deliveryWarehouseCode, canBeSubmit, total } = this.props.value;
        const excelParams = Utils.removeInvalid({ branchCompanyId, deliveryWarehouseCode });
        return (
            <div className="direct-sales-orders-form goods-form">
                <Form layout="inline">
                    <div className="search-box">
                        <h1>商品信息</h1>
                        <Row gutter={40}>
                            <FormItem>
                                <AddingGoodsByStore
                                    value={{ branchCompanyId }}
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
                                    总条数：<span>{total.rows}</span>
                                </div>
                                <div className="info">
                                    商品数量：<span>{total.quantities}</span>
                                </div>
                                <div className="info">
                                    金额：<span>{total.amount.toFixed(2)}</span>
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
