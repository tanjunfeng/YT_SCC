/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 采购管理 - 直营店下单
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Table, Form, message } from 'antd';

import { goodsColumns as columns } from '../columns';
import StoresForm from './storesForm';
import GoodsForm from './goodsForm';

class DirectSalesOrders extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            goodsFormConditions: {
                branchCompanyId: '',
                deliveryWarehouseCode: ''
            },
            goodsList: [],
            appending: false
        }
    }

    getRow = (goodsInfo) => {
        const {
                productCode,
            internationalCodes,
            productName,
            unitExplanation,
            salePrice,
            minNuber
            } = goodsInfo;
        return {
            index: this.state.goodsList.length + 1,
            productCode,
            internationalCode: internationalCodes[0].internationalCode,
            productName,
            unitExplanation,
            salePrice,
            minNuber
        };
    }

    handleStoresChange = (record) => {
        this.setState({
            goodsFormConditions: {
                branchCompanyId: record.branchCompanyId,
                deliveryWarehouseCode: record.deliveryWarehouseCode
            }
        });
        this.handleClear();
    }

    handleGoodsFormChange = (goodsInfo) => {
        const arr = this.state.goodsList;
        this.setState({ appending: true });
        if (typeof goodsInfo === 'object' && goodsInfo.productCode) {
            // 判断此商品是否已存在
            const existGoods = arr.find(e => e.productCode === goodsInfo.productCode);
            if (existGoods === undefined) {
                arr.push(this.getRow(goodsInfo));
                this.setState({ appending: false });
            } else {
                message.info(`已存在此商品，顺序号${existGoods.index}`);
                this.setState({ appending: false });
            }
        }
    }

    handleClear = () => {
        this.setState({ goodsList: [] });
    }

    render() {
        return (
            <div>
                <StoresForm
                    onChange={this.handleStoresChange}
                />
                <GoodsForm
                    value={this.state.goodsFormConditions}
                    onChange={this.handleGoodsFormChange}
                />
                <Table
                    dataSource={this.state.goodsList}
                    columns={columns}
                    rowKey="productCode"
                    scroll={{
                        x: 1400,
                        y: 500
                    }}
                />
            </div>
        );
    }
}

export default withRouter(Form.create()(DirectSalesOrders));
