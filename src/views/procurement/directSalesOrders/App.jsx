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

    handleSubmit = () => {
        this.props.insertDirectOrder({
            storeId: this.state.storeId,
            directStoreCommerItemVoList: []
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
                    onSubmit={this.handleSubmit}
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

DirectSalesOrders.propTypes = {
    insertDirectOrder: PropTypes.func
};

export default withRouter(Form.create()(DirectSalesOrders));
