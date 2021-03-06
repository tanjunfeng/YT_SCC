/**
 * @file index.js
 * @author denglingbo
 *
 * Reducers 入口
 */
import Immutable from 'immutable';

/**
 * pub and user 两个 reducers 为必需的
 */
import pub from './pub';
import user from './user';

import book from './book';
import topic from './topic';

import supplier from './supplier';

import commodity from './commodity'

import addSupplier from './addSupplier';

import categoryGoodsOrderNum from './categoryGoodsOrderNum';

import category from './category';

import mediaManage from './mediaManage';

import dictionary from './dictionary';

import wap from './wap';
/* ********************procurement************************* */

import order from './order';
/* ********************procurement************************* */
import procurement from './procurement';

import stockAdjust from './stockAdjust';
import stockListDetail from './stockListDetail';
import storeAdjustList from './storeAdjustList';
import promotion from './promotion';
import purchasePrice from './purchasePrice';
import process from './process';
import storeRealTime from './storeRealTime';

import queryCommodityList from './queryCommodityList';

import queryWhiteList from './queryWhiteList';


/* ********************销售管理************************* */
import salesManagement from './salesManagement'

// 商品管理售价导入
import priceImport from './priceImport'

export default Immutable.fromJS({
    pub,
    user,
    /**
     * Others Reducers
     */
    wap,
    order,
    book,
    topic,
    category,
    supplier,
    commodity,
    addSupplier,
    mediaManage,
    categoryGoodsOrderNum,
    dictionary,
    /* ********************procurement************************* */
    procurement,
    stockAdjust,
    stockListDetail,
    storeAdjustList,
    promotion,
    process,
    storeRealTime,
    queryCommodityList,

    queryWhiteList,
    // 销售管理
    salesManagement,
    purchasePrice,
    // 售价导入
    priceImport
});
