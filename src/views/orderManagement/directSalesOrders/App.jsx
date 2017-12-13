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
        loading: false,
        isSubmitDisabled: false, // 提交按钮是否禁用
        deletedGoodsList: [], // 由于不在销售区域而被删除的商品编号列表
        goodsAddOn: null, // 手工添加的单个商品
        importList: [], // 新增导入商品
        // 商品列表总计信息
        total: {
            rows: 0, // 记录行数
            quantities: 0, // 订购数量
            amount: 0 // 金额总计
        },
        shouldClear: false // 是否清空所有子组件
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
            branchCompanyId, deliveryWarehouseCode, goodsList, goodsAddOn, importList, loading
        } = this.state;
        return {
            goodsList, goodsAddOn, branchCompanyId, deliveryWarehouseCode, importList, loading
        }
    }

    getGoodsFormValues = () => {
        const {
            branchCompanyId,
            deliveryWarehouseCode,
            total,
            shouldClear
        } = this.state;
        const goodsFormValue = {
            branchCompanyId,
            deliveryWarehouseCode,
            total,
            canBeSubmit: this.validateGoods(),
            shouldClear
        };
        return goodsFormValue;
    }

    handleStoresChange = record => {
        const { storeId, branchCompanyId, deliveryWarehouseCode } = record;
        this.setState({
            storeId,
            branchCompanyId,
            deliveryWarehouseCode,
            isSubmitDisabled: false,
            total: {
                rows: 0, // 记录行数
                quantities: 0, // 订购数量
                amount: 0 // 金额总计
            }
        });
        this.handleClear();
    }

    /**
     * 接受新增单个商品，并单个校验库存
     */
    handleGoodsFormChange = (goodsAddOn) => {
        if (goodsAddOn === null) {
            this.setState({ goodsAddOn });
            return;
        }
        this.updateGoods(goodsAddOn, goods => {
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
            this.updateGoods(goods, goodsChecked => {
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

    pageReset = () => {
        this.handleClear();
        this.setState({
            shouldClear: true
        });
    }

    handleClear = () => {
        this.setState({
            goodsList: []
        });
    }

    /**
     * 虚拟商品和实体商品同时下单警告框
     */
    couponIdShouldWarning = (isClickIn) => {
        const text = isClickIn ? '添加商品失败' : '导入失败'
        Modal.warning({
            title: text,
            content: '虚拟商品和实体商品请分开下单',
        });
    }

    /**
     * 判断当前导入商品类型是否和之前的一致
     * @param {string} couponId 当前导入商品的虚拟商品id
     * @param {string} couponId 导入商品列表中第一条商品的虚拟商品id
     */
    isType = (couponId, firstCouponId) => {
        if (firstCouponId) {
            if (couponId) {
                return true
            }
            return false
        }
        if (couponId) {
            return false
        }
        return true
    }

    /**
     * 商品导入回调函数
     *
     * @param {*array} importList 导入成功商品列表
     * @param {*array} deletedGoodsList 导入出错商品列表
     */
    handleGoodsListImport = (importList, deletedGoodsList = []) => {
        // 判断当前导入商品类型是否和之前的一致
        const { goodsList } = this.state;
        for (let i = 0; i < importList.length; i++) {
            // 如果之前已经有导入的商品
            if (goodsList.length > 0) {
                // 当前列表已经存在的商品的第一个商品的虚拟id
                const goodsListFirstCouponId = goodsList[0].couponId;
                const isSameTypeGoodsList = this.isType(
                    importList[i].couponId, goodsListFirstCouponId);
                if (!isSameTypeGoodsList) {
                    this.couponIdShouldWarning()
                    return
                }
            }
            // 导入商品的第一个商品的虚拟id
            const importListFirstCouponId = importList[0].couponId;
            const isSameTypeImportList = this.isType(importList[i].couponId,
                importListFirstCouponId);
            if (!isSameTypeImportList) {
                this.couponIdShouldWarning()
                return
            }
        }
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
                    this.pageReset();
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
            this.setState({ loading: true });
            // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/directStore/validateDirectOrder
            this.props.batchCheckStorage({
                branchCompanyId,
                loc: deliveryWarehouseCode,
                products: this.getParams(goodsList)
            }).then(res => {
                resove(res.data);
            }).catch(error => {
                reject(error);
            }).finally(() => {
                this.setState({ loading: false });
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
        if (length === 0 || length > 300) {
            return false;
        }
        for (let i = 0; i < length; i++) {
            if (!goodsList[i].enough) return false; // 库存不足
            if (!goodsList[i].isMultiple) return false; // 不是内装数的整数倍
        }
        return true;
    }

    updateGoods = (goods, callback) => {
        const { productCode, quantity } = goods;
        const { branchCompanyId, deliveryWarehouseCode, goodsList } = this.state;
        this.setState({ loading: true });
        // http://gitlab.yatang.net/yangshuang/sc_wiki_doc/wikis/sc/directStore/updateItem
        this.props.updateGoodsInfo({
            productCode, quantity, branchCompanyId, deliveryWarehouseCode
        }).then(res => {
            // 判断当前导入商品类型是否和之前的一致
            if (goodsList.length > 0) {
                const couponId = res.data.couponId
                const firstCouponId = goodsList[0].couponId;
                const isSameTypeGoodsList = this.isType(couponId, firstCouponId)
                if (!isSameTypeGoodsList) {
                    this.couponIdShouldWarning(true)
                    return
                }
            }
            if (typeof callback === 'function') {
                callback(Object.assign(goods, {
                    enough: res.data.enough,
                    salePrice: res.data.salePrice,
                    quantity
                }));
            }
        }).finally(() => {
            this.setState({ loading: false });
        });
    }

    render() {
        const { goodsList, shouldClear } = this.state;
        return (
            <div className="direct-sales-orders">
                <StoresForm
                    value={{
                        shouldWarning: goodsList.length > 0, // 是否应该弹窗警告
                        shouldClear
                    }}
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
