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
        deletedGoodsList: [], // 由于不在销售区域而被删除的商品编号列表
        goodsAddOn: null, // 手工添加的单个商品
        modalRechooseVisible: false, // 提示重新选择门店的模态框
        modalDeletedIdsVisible: false, // 提示未导入商品的模态框
        // 商品列表总计信息
        total: {
            rows: 0, // 记录行数
            quantities: 0, // 订购数量
            amount: 0   // 金额总计
        }
    }

    getDirectStoreCommerItemList = () => {
        const dist = [];
        this.state.goodsList.forEach(goods => {
            dist.push({
                productId: goods.productId,
                quantity: goods.quantity
            });
        });
        return dist;
    }

    getGoodsTableValues = () => {
        const {
            branchCompanyId, deliveryWarehouseCode, goodsList, goodsAddOn, importList
        } = this.state;
        return {
            goodsList, goodsAddOn, importList, branchCompanyId, deliveryWarehouseCode
        }
    }

    getGoodsFormValues = () => {
        const {
            branchCompanyId,
            deliveryWarehouseCode,
            total
        } = this.state;
        const goodsFormValue = {
            branchCompanyId,
            deliveryWarehouseCode,
            total,
            canBeSubmit: this.validateGoods()
        };
        return goodsFormValue;
    }

    record = null; // 重新选择的门店信息

    handleStoresChange = (record) => {
        this.record = record;
        const { storeId, goodsList } = this.state;
        // 门店信息变化时，判断是否存在已选商品列表，并弹出确认框
        if (goodsList.length > 0 && storeId !== '') {
            this.setState({ modalRechooseVisible: true });
        } else {
            this.handleRechooseOk();
        }
    }

    /**
     * 重新选择商品
     */
    handleRechooseOk = () => {
        const { storeId, branchCompanyId, deliveryWarehouseCode } = this.record;
        this.setState({
            storeId,
            branchCompanyId,
            deliveryWarehouseCode,
            modalRechooseVisible: false
        });
        this.handleClear();
    }

    /**
     * 关闭未导入商品提示框
     */
    handleDeletedIdsClose = () => {
        this.setState({ modalDeletedIdsVisible: false, deletedGoodsList: [] });
    }

    /**
     * 不重新选择商品，清空传入的门店信息
     */
    handleRechooseCancel = () => {
        this.record = null;
        this.setState({ modalRechooseVisible: false });
    }

    handleGoodsFormChange = (goodsAddOn) => {
        this.setState({ goodsAddOn });
    }

    /**
     * 商品列表改变通知
     *
     * @param {*array} goodsList 更新的商品列表
     * @param {*object} total 商品小计信息
     */
    handleGoodsListChange = (goodsList, total) => {
        // 批量校验库存
        this.checkStorage().then(list => {
            if (list.length > 0) {
                this.markStorage(list);
            }
        });
        // 清空导入商品列表，报错商品列表
        this.setState({ goodsList, importList: [], total })
    }

    handleClear = () => {
        this.setState({
            goodsList: []
        });
    }

    handleImport = (importList, deletedGoodsList = []) => {
        if (deletedGoodsList.length > 0) {
            this.setState({ modalDeletedIdsVisible: true });
        }
        this.setState({ importList, deletedGoodsList });
    }

    handleSubmit = () => {
        this.checkStorage().then(list => {
            if (list.length === 0) {
                this.props.insertDirectOrder({
                    storeId: this.state.storeId,
                    directStoreCommerItemList: this.getDirectStoreCommerItemList()
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
                loc: deliveryWarehouseCode,
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
        if (goodsList.length === 0 || goodsList.length > 300) {
            return false;
        }
        for (let i = 0, item = goodsList[i]; i < length; i++) {
            if (!item.enough) return false; // 库存不足
            if (!item.isMultiple) return false; // 不是内装数的整数倍
        }
        return true;
    }

    importError = () => {
        if (!this.state.modalDeletedIdsVisible) {
            Modal.error({
                title: '导入失败的商品',
                content: () => (this.state.deletedGoodsList.map(goods => `${goods.productName} - ${goods.productCode}`).join('，'))
            });
            this.setState({ modalDeletedIdsVisible: true });
        }
    }

    render() {
        const { deletedGoodsList } = this.state;
        return (
            <div className="direct-sales-orders">
                <StoresForm
                    onChange={this.handleStoresChange}
                />
                <GoodsForm
                    value={this.getGoodsFormValues()}
                    onChange={this.handleGoodsFormChange}
                    onImport={this.handleImport}
                    onSubmit={this.handleSubmit}
                />
                <GoodsTable
                    value={this.getGoodsTableValues()}
                    onChange={this.handleGoodsListChange}
                />
                <Modal
                    title="重新选择门店"
                    visible={this.state.modalRechooseVisible}
                    onOk={this.handleRechooseOk}
                    onCancel={this.handleRechooseCancel}
                >
                    <p>这个操作将要重新选择门店并清空已选择商品，确定吗？</p>
                </Modal>
                <Modal
                    className="deleted-ids"
                    title="导入失败的商品"
                    visible={this.state.modalDeletedIdsVisible}
                    onOk={this.handleDeletedIdsClose}
                    onCancel={this.handleDeletedIdsClose}
                >
                    <span className="red">
                        {deletedGoodsList.map(goods =>
                            `${goods.productName} - ${goods.productCode}`).join('，')}
                    </span>
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
