/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 采购管理 - 直营店下单
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Form } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StoresForm from './storesForm';
import GoodsForm from './goodsForm';
import GoodsTable from './goodsTable';
import {
    insertDirectOrder
} from '../../../actions/procurement';

@connect(() => ({}), dispatch => bindActionCreators({
    insertDirectOrder
}, dispatch))

class DirectSalesOrders extends PureComponent {
    state = {
        storeId: '',
        branchCompanyId: '',
        deliveryWarehouseCode: '',
        goodsList: [],
        importList: [],
        goodsAddOn: null
    }

    handleStoresChange = (record) => {
        const { storeId, branchCompanyId, deliveryWarehouseCode } = record;
        this.setState({ storeId, branchCompanyId, deliveryWarehouseCode });
        this.handleClear();
    }

    handleGoodsFormChange = (goodsAddOn) => {
        this.setState({ goodsAddOn });
    }

    handleGoodsListChange = (goodsList) => {
        this.setState({ goodsList })
    }

    handleClear = () => {
        this.setState({
            goodsList: []
        });
    }

    handleImport = (importList) => {
        this.setState({ importList });
    }

    handleClearImportList = () => {
        this.setState({ importList: [] });
    }

    handleSubmit = () => {
        const dist = [];
        this.state.goodsList.forEach(goods => {
            dist.push({
                productId: goods.productId,
                quantity: goods.quantity
            });
        });
        this.props.insertDirectOrder({
            storeId: this.state.storeId,
            directStoreCommerItemVoList: dist
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
                    onImport={this.handleImport}
                    onSubmit={this.handleSubmit}
                />
                <GoodsTable
                    goodsList={this.state.goodsList}
                    goodsAddOn={this.state.goodsAddOn}
                    importList={this.state.importList}
                    branchCompanyId={this.state.branchCompanyId}
                    deliveryWarehouseCode={this.state.deliveryWarehouseCode}
                    onChange={this.handleGoodsListChange}
                    onClearImportList={this.handleClearImportList}
                />
            </div>
        );
    }
}

DirectSalesOrders.propTypes = {
    insertDirectOrder: PropTypes.func
};

export default withRouter(Form.create()(DirectSalesOrders));
