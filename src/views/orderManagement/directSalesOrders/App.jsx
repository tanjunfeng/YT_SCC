/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 采购管理 - 直营店下单
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Form, BackTop, Modal } from 'antd';
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
        storeId: '', // 门店编号
        branchCompanyId: '', // 分公司 id
        deliveryWarehouseCode: '', // 送货舱编码
        goodsList: [], // 当前显示商品列表
        importList: [], // 导入商品列表
        goodsAddOn: null, // 手工添加的单个商品
        modalVisible: false
    }

    record = null; // 重新选择的门店信息

    handleStoresChange = (record) => {
        this.record = record;
        const { storeId, goodsList } = this.state;
        // 门店信息变化时，判断是否存在已选商品列表，并弹出确认框
        if (goodsList.length > 0 && storeId !== '') {
            this.setState({ modalVisible: true });
        } else {
            this.handleModalOk();
        }
    }

    /**
     * 重新选择商品
     */
    handleModalOk = () => {
        const { storeId, branchCompanyId, deliveryWarehouseCode } = this.record;
        this.setState({ storeId, branchCompanyId, deliveryWarehouseCode, modalVisible: false });
        this.handleClear();
    }

    /**
     * 不重新选择商品，清空传入的门店信息
     */
    handleModalCancel = () => {
        this.record = null;
        this.setState({ modalVisible: false });
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
        this.checkStorage().then(list => {
            if (list.length === 0) {
                this.props.insertDirectOrder({
                    storeId: this.state.storeId,
                    directStoreCommerItemList: dist
                });
            } else {
                this.markStorage(list);
            }
        });
    }

    /**
     * 标记库存不足的商品
     */
    markStorage = (list) => {
        const goodsList = [...this.state.goodsList];
        list.forEach(productId => {
            const index = goodsList.findIndex(
                item => item.productId === productId);
            if (index > -1) goodsList[index].enough = false;
        });
        this.setState({ goodsList });
    }

    /**
     * 批量校验库存
     */
    checkStorage = () => (
        new Promise((resove, reject) => {
            const { branchCompanyId, deliveryWarehouseCode, goodsList } = this.state;
            const products = [];
            goodsList.forEach(item => {
                products.push({
                    productId: item.productId,
                    quantity: item.quantity
                });
            });
            // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/directStore/validateDirectOrder
            this.props.batchCheckStorage({
                branchCompanyId,
                deliveryWarehouseCode,
                products
            }).then(res => {
                resove(res.data);
            }).catch(error => {
                reject(error);
            });
        })
    )

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
                <Modal
                    title="重新选择门店"
                    visible={this.state.modalVisible}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}
                >
                    <p>这个操作将要重新选择门店并清空已选择商品，确定吗？</p>
                </Modal>
                <BackTop />
            </div>
        );
    }
}

DirectSalesOrders.propTypes = {
    insertDirectOrder: PropTypes.func,
    batchCheckStorage: PropTypes.func
};

export default withRouter(Form.create()(DirectSalesOrders));
