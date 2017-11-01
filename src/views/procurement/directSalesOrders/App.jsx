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
    insertDirectOrder, batchCheckStorage
} from '../../../actions/procurement';

@connect(() => ({}), dispatch => bindActionCreators({
    insertDirectOrder, batchCheckStorage
}, dispatch))

class DirectSalesOrders extends PureComponent {
    state = {
        storeId: '',    // 门店编号
        branchCompanyId: '',    // 分公司 id
        deliveryWarehouseCode: '',  // 送货舱编码
        goodsList: [],  // 当前显示商品列表
        importList: [], // 导入商品列表
        goodsAddOn: null    // 手工添加的单个商品
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
        // 批量校验库存
        // const { branchCompanyId, deliveryWarehouseCode, goodsList } = this.state;
        // const arr = [];
        // goodsList.forEach(item => {
        //     arr.push({
        //         productId: item.productId,
        //         branchCompanyId,
        //         loc: deliveryWarehouseCode
        //     });
        // });
        // this.props.batchCheckStorage(arr);
        this.props.insertDirectOrder({
            storeId: this.state.storeId,
            directStoreCommerItemList: dist
        });
    }

    /**
     * 依次校验是否可以提交
     */
    validateGoods = () => {
        const goodsList = this.state.goodsList;
        const length = goodsList.length;
        if (goodsList.length === 0) {
            return false;
        }
        for (let i = 0, item = goodsList[i]; i < length; i++) {
            if (!item.available) return false; // 不在当前销售区域
            if (!item.enough) return false; // 库存不足
            if (!item.isMultiple) return false; // 不是内装数的整数倍
        }
        return true;
    }

    render() {
        const {
            branchCompanyId,
            deliveryWarehouseCode,
            goodsList,
            goodsAddOn,
            importList
        } = this.state;
        const goodsFormValue = {
            branchCompanyId,
            deliveryWarehouseCode,
            canBeSubmit: this.validateGoods()
        };
        return (
            <div className="direct-sales-orders">
                <StoresForm
                    onChange={this.handleStoresChange}
                />
                <GoodsForm
                    value={goodsFormValue}
                    onChange={this.handleGoodsFormChange}
                    onImport={this.handleImport}
                    onSubmit={this.handleSubmit}
                />
                <GoodsTable
                    goodsList={goodsList}
                    goodsAddOn={goodsAddOn}
                    importList={importList}
                    branchCompanyId={branchCompanyId}
                    deliveryWarehouseCode={deliveryWarehouseCode}
                    onChange={this.handleGoodsListChange}
                    onClearImportList={this.handleClearImportList}
                />
            </div>
        );
    }
}

DirectSalesOrders.propTypes = {
    insertDirectOrder: PropTypes.func,
    batchCheckStorage: PropTypes.func
};

export default withRouter(Form.create()(DirectSalesOrders));
