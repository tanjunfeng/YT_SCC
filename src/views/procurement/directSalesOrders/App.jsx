/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 采购管理 - 直营店下单
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Form } from 'antd';
import StoresForm from './storesForm';
import GoodsForm from './goodsForm';
import GoodsTable from './goodsTable';

class DirectSalesOrders extends PureComponent {
    state = {
        branchCompanyId: '',
        deliveryWarehouseCode: '',
        goodsList: [],
        goodsAddOn: null
    }

    handleStoresChange = (record) => {
        const { branchCompanyId, deliveryWarehouseCode } = record;
        this.setState({ branchCompanyId, deliveryWarehouseCode });
        this.handleClear();
    }

    handleGoodsFormChange = (goodsAddOn) => {
        this.setState({ goodsAddOn });
    }

    handleGoodsListChange = (goodsList) => {
        this.setState({goodsList})
    }

    handleClear = () => {
        this.setState({
            goodsList: []
        });
    }

    render() {
        const { branchCompanyId, deliveryWarehouseCode } = this.state;
        return (
            <div className="direct-sales-orders">
                <StoresForm
                    onChange={this.handleStoresChange}
                />
                <GoodsForm
                    value={{ branchCompanyId, deliveryWarehouseCode }}
                    onChange={this.handleGoodsFormChange}
                />
                <GoodsTable
                    goodsList={this.state.goodsList}
                    goodsAddOn={this.state.goodsAddOn}
                    branchCompanyId={this.state.branchCompanyId}
                    deliveryWarehouseCode={this.state.deliveryWarehouseCode}
                    onChange={this.handleGoodsListChange}
                />
            </div>
        );
    }
}

export default withRouter(Form.create()(DirectSalesOrders));
