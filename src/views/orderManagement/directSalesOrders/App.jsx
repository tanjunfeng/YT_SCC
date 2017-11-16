/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 采购管理 - 直营店下单
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Form, BackTop, Modal, message } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import StoresForm from './storesForm';
import GoodsForm from './goodsForm';
import GoodsTable from './goodsTable';
import {
    insertDirectOrder, updateGoodsInfo, batchCheckStorage
} from '../../../actions/procurement';
import { sortList } from './helper';

@connect(() => ({}), dispatch => bindActionCreators({
    insertDirectOrder, updateGoodsInfo, batchCheckStorage
}, dispatch))

class DirectSalesOrders extends PureComponent {
    state = {
        storeId: '', // 门店编号
        branchCompanyId: '', // 分公司 id
        deliveryWarehouseCode: '', // 送货舱编码
        goodsList: [], // 当前显示商品列表
        isSubmitDisabled: false, // 提交按钮是否禁用
        deletedGoodsList: [], // 由于不在销售区域而被删除的商品编号列表
        goodsAddOn: null, // 手工添加的单个商品
        modalRechooseVisible: false, // 提示重新选择门店的模态框
        importList: [], // 新增导入商品
        // 商品列表总计信息
        total: {
            rows: 0, // 记录行数
            quantities: 0, // 订购数量
            amount: 0 // 金额总计
        }
    }

    /**
     * 根据传入商品列表，提取需要商品编号和数量
     */
    getParams = goodsList => {
        const dist = [];
        goodsList.forEach(goods => {
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
            goodsList, goodsAddOn, branchCompanyId, deliveryWarehouseCode, importList
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

    handleStoresChange = record => {
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
            modalRechooseVisible: false,
            isSubmitDisabled: false
        });
        this.handleClear();
    }

    /**
     * 不重新选择商品，清空传入的门店信息
     */
    handleRechooseCancel = () => {
        this.record = null;
        this.setState({ modalRechooseVisible: false });
    }

    /**
     * 接受新增单个商品，并单个校验库存
     */
    handleGoodsFormChange = (goodsAddOn) => {
        if (goodsAddOn === null) {
            this.setState({ goodsAddOn });
            return;
        }
        this.updateGoodsInfoAction(goodsAddOn, goods => {
            this.setState({ goodsAddOn: { ...goods } });
        });
    }

    /**
     * 商品列表改变通知
     *
     * @param {*array} goodsList 更新的商品列表
     * @param {*object} total 商品小计信息
     */
    handleGoodsListChange = (goodsList, total) => {
        if (total.dataIndex > -1) {
            const goods = goodsList[total.dataIndex];
            this.updateGoodsInfoAction(goods, goodsChecked => {
                Object.assign(goods, { ...goodsChecked });
            });
        }
        // 刷新导入商品列表，清空报错商品列表, 清空excel导入商品列表
        this.setState({
            goodsList: [...goodsList],
            total,
            importList: []
        });
    }

    handleClear = () => {
        this.setState({
            goodsList: []
        });
    }

    /**
     * 商品导入回调函数
     *
     * @param {*array} importList 导入成功商品列表
     * @param {*array} deletedGoodsList 导入出错商品列表
     */
    handleGoodsListImport = (importList, deletedGoodsList = []) => {
        if (deletedGoodsList.length > 0) {
            const msg = deletedGoodsList.map(goods => (`${goods.productName} - ${goods.productCode}`)).join(',');
            // 存在导入出错商品时，显示弹窗
            Modal.error({
                className: 'deleted-ids',
                title: '导入失败的商品',
                content: msg,
            });
        }
        this.setState({ importList });
    }

    handleSubmit = () => {
        this.setState({ isSubmitDisabled: true });
        const goodsList = this.state.goodsList;
        // 校验库存
        this.checkStorage(goodsList, (list, length) => {
            if (length > 0) return;
            // 提交订单
            this.props.insertDirectOrder({
                storeId: this.state.storeId,
                directStoreCommerItemList: this.getParams(list)
            }).then(res => {
                // 报错或提交失败之后可继续提交
                if (res.code === 200) {
                    // 提交成功时显示订单编号
                    Modal.success({
                        title: '生成的订单编号',
                        content: res.data,
                    });
                } else {
                    message.error(res.message);
                    this.setState({ isSubmitDisabled: false });
                }
            }).catch(() => {
                this.setState({ isSubmitDisabled: false });
            });
        });
    }

    batchCheckStorageAction = goodsList => (
        new Promise((resove, reject) => {
            const { branchCompanyId, deliveryWarehouseCode } = this.state;
            // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/directStore/validateDirectOrder
            this.props.batchCheckStorage({
                branchCompanyId,
                loc: deliveryWarehouseCode,
                products: this.getParams(goodsList)
            }).then(res => {
                resove(res.data);
            }).catch(error => {
                reject(error);
            });
        })
    )

    /**
     * 批量校验库存
     *
     * @param {*array} goodsList 商品列表
     */
    checkStorage = (goodsList, callback) => {
        /**
         * 标记库存不足的商品
         *
         * @param {*array} notEnouphIds 库存不足商品编号
         * @param {*array} products 商品列表
         */
        const markStorage = (notEnouphIds, products) => {
            notEnouphIds.forEach(productId => {
                const goods = products.find(item => item.productId === productId);
                if (goods) {
                    Object.assign(goods, {
                        enough: false
                    });
                }
            });
        }
        this.batchCheckStorageAction(goodsList).then(data => {
            if (data.length > 0) {
                markStorage(data, goodsList);
            }
            // 返回标记完毕的商品列表和库存不足的商品数量，并把库存不足的商品整理到最前
            if (typeof callback === 'function') {
                callback([...sortList(goodsList)], data.length);
            }
        }).catch(error => {
            message.error(error);
        });
    }

    /**
     * 依次校验是否可以提交
     */
    validateGoods = () => {
        const goodsList = this.state.goodsList;
        const length = goodsList.length;
        if (this.state.isSubmitDisabled) {
            return false;
        }
        if (goodsList.length === 0 || goodsList.length > 300) {
            return false;
        }
        for (let i = 0, item = goodsList[i]; i < length; i++) {
            if (!item.enough) return false; // 库存不足
            if (!item.isMultiple) return false; // 不是内装数的整数倍
        }
        return true;
    }

    updateGoodsInfoAction = (goods, callback) => {
        const { productCode, quantity } = goods;
        const { branchCompanyId, deliveryWarehouseCode } = this.state;
        // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/directStore/updateItem
        this.props.updateGoodsInfo({
            productCode, quantity, branchCompanyId, deliveryWarehouseCode
        }).then(res => {
            if (typeof callback === 'function') {
                callback(Object.assign(goods, {
                    enough: res.data.enough,
                    salePrice: res.data.salePrice,
                    quantity
                }));
            }
        });
    }

    render() {
        return (
            <div className="direct-sales-orders">
                <StoresForm
                    onChange={this.handleStoresChange}
                />
                <GoodsForm
                    value={this.getGoodsFormValues()}
                    onChange={this.handleGoodsFormChange}
                    onImport={this.handleGoodsListImport}
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
                <BackTop />
            </div>
        );
    }
}

DirectSalesOrders.propTypes = {
    insertDirectOrder: PropTypes.func,
    updateGoodsInfo: PropTypes.func,
    batchCheckStorage: PropTypes.func
};

export default withRouter(Form.create()(DirectSalesOrders));
