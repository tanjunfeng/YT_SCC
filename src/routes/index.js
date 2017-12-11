/**
 * @file routes.js
 * @author denglingbo
 *
 * App 所有的路由配置
 */
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Bundle from 'freed-spa/src/bundle';
/* eslint-disable */
// 供应商录入列表
import SupplierInputList from 'bundle-loader?lazy!../views/supplier/supplierInputList';
// 供应商入驻申请列表(改)
import SuppliersAppList from 'bundle-loader?lazy!../views/supplier/suppliersAppList';
// 供应商详情
import SupplierDetail from 'bundle-loader?lazy!../views/supplier/detail';

// 添加供应商
import AddSupplier from 'bundle-loader?lazy!../views/supplier/addEdit';
// 商品分类管理
import ClassifiedList from 'bundle-loader?lazy!../views/commodity/classifiedList';
// 商品管理列表
import ManagementList from 'bundle-loader?lazy!../views/commodity/managementList';
import CommodifyDetail from 'bundle-loader?lazy!../views/commodity/commodifyDetail';
// 分类列表页商品排序管理
import CateListGoodsSortManage from 'bundle-loader?lazy!../views/SysConfig/CateListGoodsSortManage';
// 数据字典
import DataDictionary from 'bundle-loader?lazy!../views/SysConfig/DataDictionary';
// 白名单
import WhiteListConfig from 'bundle-loader?lazy!../views/SysConfig/whiteListConfiguration/whiteList';
// 静态页管理
import StaticPageHome from 'bundle-loader?lazy!../views/mediaManagement/StaticPageHome';
// ckeditor
import editorPages from 'bundle-loader?lazy!../views/mediaManagement/editorPages';
// wap端轮播配置
import CarouselManagement from 'bundle-loader?lazy!../views/wrapConfigure/carousel';
// wap端快捷导航配置
import QuickNavigation from 'bundle-loader?lazy!../views/wrapConfigure/quickNavigation';
// wap端快捷首页样式配置
import HomeStyle from 'bundle-loader?lazy!../views/wrapConfigure/homeStyle';
// wap端搜索推荐配置
import SearchRecommendConfig from 'bundle-loader?lazy!../views/wrapConfigure/searchRecommendConfig';
// wap端分类图标管理
import CategoryIconManagement from 'bundle-loader?lazy!../views/wrapConfigure/categoryIconManagement';
// wap端分类图标管理
import AdPlanList404 from 'bundle-loader?lazy!../views/wrapConfigure/adPlanList404';

// 采购管理
import PoMngList from 'bundle-loader?lazy!../views/procurement/poMngList';
import PoDetail from 'bundle-loader?lazy!../views/procurement/poDetail';
import PoCreateList from 'bundle-loader?lazy!../views/procurement/PoCreateList';
import PoPrintList from 'bundle-loader?lazy!../views/procurement/poPrintList';
import PoRcvMngList from 'bundle-loader?lazy!../views/procurement/poRcvMngList';
import PoRcvList from 'bundle-loader?lazy!../views/procurement/poRcvList';
import PoRcvDetail from 'bundle-loader?lazy!../views/procurement/poRcvDetail';
import ReturnManagementList from 'bundle-loader?lazy!../views/procurement/returnManagementList';
import ReturnManagementDetail from 'bundle-loader?lazy!../views/procurement/returnManagementDetail';
import ReturnManagementCreat from 'bundle-loader?lazy!../views/procurement/returnManagementCreat';

// 商品采购关系维护
import ProcurementMaintenance from 'bundle-loader?lazy!../views/commodity/procurementMaintenance';
// 商品销售关系维护
import SalesMaintenance from 'bundle-loader?lazy!../views/commodity/salesMaintenance';
// 订单管理列表
import OrderManagementList from 'bundle-loader?lazy!../views/orderManagement/orderList';
// 订单管理-详情页
import OrderManagementDetails from 'bundle-loader?lazy!../views/orderManagement/orderDetails';
// 订单管理-订单详情-后台退货
import BackstageBack from 'bundle-loader?lazy!../views/orderManagement/backstageBack';
// 订单管理 - 直营店下单
import DirectStoreOrder from 'bundle-loader?lazy!../views/orderManagement/directSalesOrders';

// 销售管理

// 退货单管理列表
import ReturnGoodsList from 'bundle-loader?lazy!../views/orderManagement/returnGoodsList';
// 退货单详情
import ReturnGoodsDetails from 'bundle-loader?lazy!../views/orderManagement/returnGoodsDetails';
// 新建/编辑退货单
import ReturnGoodsModify from 'bundle-loader?lazy!../views/procurement/returnGoodsModify';

// 订单管理 - 销售换货
import ExchangeGoodsList from 'bundle-loader?lazy!../views/orderManagement/exchangeGoodsList';
import ExchangeGoodsDetail from 'bundle-loader?lazy!../views/orderManagement/exchangeGoodsDetail';

// 库存调整列表
import StoreAdjList from 'bundle-loader?lazy!../views/storeAdjustment/storeAdjList';
import ItemDetail from 'bundle-loader?lazy!../views/storeAdjustment/itemDetail';
// 实时库存查询
import StoreRealTime from 'bundle-loader?lazy!../views/storeAdjustment/storeRealTime';

// 采购单审批列表
import ToDoPurchaseList from 'bundle-loader?lazy!../views/toDo/toDoPurchaseList';
// 退货单审批列表
import ToDoReturnList from 'bundle-loader?lazy!../views/toDo/toDoReturnList';

// 简易结算支持
import SimpleOrderList from 'bundle-loader?lazy!../views/simpleSettlement/simpleOrderList';
import FranchiseeSettlement from 'bundle-loader?lazy!../views/simpleSettlement/franchiseeSettlement';

// 促销活动
import PromotionManagementList from 'bundle-loader?lazy!../views/promotion/mngList';
import PromotionCreate from 'bundle-loader?lazy!../views/promotion/create';
import PromotionDetail from 'bundle-loader?lazy!../views/promotion/detail';
import PromotionParticipate from 'bundle-loader?lazy!../views/promotion/participate';

// 优惠券
import CouponList from 'bundle-loader?lazy!../views/coupon/mngList';
import CouponCreate from 'bundle-loader?lazy!../views/coupon/create';
import CouponDetail from 'bundle-loader?lazy!../views/coupon/detail';
import CouponsParticipate from 'bundle-loader?lazy!../views/coupon/participate';

// 发放优惠券
import GrantCouponList from 'bundle-loader?lazy!../views/grantCoupons/mngList';
import grantCouponDetail from 'bundle-loader?lazy!../views/grantCoupons/detail';

// 流程管理
import ProcessList from 'bundle-loader?lazy!../views/process/processList';

/* eslint-enable */

/**
 * 路由配置
 * @type {[*]}
 */
const routes = [
    // 系统配置
    {
        key: 'gylxtpz',
        iconType: 'setting',
        routes: [
            // 分类列表页商品排序管理
            {
                path: '/cateListGoodsSortManage',
                parent: 'gylxtpz',
                key: 'goodsManange',
                component: () => (
                    <Route
                        path="/CateListGoodsSortManage"
                        exact
                        render={() => (<Bundle load={CateListGoodsSortManage}>
                            {(App) => <App />}
                        </Bundle>)}
                    />
                ),
            },
            {
                // 数据字典
                path: '/dataDictionary',
                parent: 'gylxtpz',
                key: 'dataDictionary',
                component: () => (
                    <Route
                        path="/DataDictionary"
                        exact
                        render={() => <Bundle load={DataDictionary}>{(App) => <App />}</Bundle>}
                    />
                ),
            },
            {
                // 白名单配置
                path: '/whiteListConfig',
                parent: 'gylxtpz',
                key: 'whiteListConfig',
                component: () => (
                    <Route
                        path="/whiteListConfig"
                        exact
                        render={() =>
                            <Bundle load={WhiteListConfig}>{(App) => <App />}</Bundle>
                        }
                    />
                ),
            }
        ]
    },
    {
        // 多媒体管理
        key: 'dmtgl',
        iconType: 'switcher',
        routes: [
            // 静态页管理
            {
                path: '/StaticPageHome',
                parent: 'dmtgl',
                key: 'jtygl',
                component: () => (
                    <Switch>
                        <Route
                            path="/StaticPageHome"
                            exact
                            render={() => <Bundle load={StaticPageHome}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/StaticPageHome/:ckEditor"
                            render={() => <Bundle load={editorPages}>{(App) => <App />}</Bundle>}
                        />
                    </Switch>
                )
            }
        ]
    },
    {
        key: 'gylspgl',
        iconType: 'red-envelope',
        routes: [
            // 商品管理列表
            {
                path: '/commodifyList',
                parent: 'gylspgl',
                key: 'commodifyList',
                component: () => (
                    <Switch>
                        <Route
                            path="/commodifyList"
                            exact
                            render={() => (<Bundle load={ManagementList}>
                                {(App) => <App />}</Bundle>)
                            }
                        />
                        <Route
                            path="/commodifyList/:id"
                            exact
                            render={() => (<Bundle load={CommodifyDetail}>
                                {(App) => <App />}</Bundle>)}
                        />
                        <Route
                            path="/commodifyList/procurementMaintenance/:id"
                            exact
                            render={() => (<Bundle load={ProcurementMaintenance}>
                                {(App) => <App />}</Bundle>)}
                        />
                        <Route
                            path="/commodifyList/salesMaintenance/:id"
                            exact
                            render={() => (<Bundle load={SalesMaintenance}>
                                {(App) => <App />}</Bundle>)}
                        />
                    </Switch>
                )
            },
            // 商品分类列表
            {
                path: '/classifiedList',
                parent: 'gylspgl',
                key: 'goodsClassification',
                component: () => (
                    <Switch>
                        <Route
                            path="/classifiedList"
                            exact
                            render={() => <Bundle load={ClassifiedList}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/classifiedList/:id"
                            render={() => <Bundle load={ClassifiedList}>{(App) => <App />}</Bundle>}
                        />
                    </Switch>
                )
            }
        ]
    },
    {
        key: 'gysgl',
        iconType: 'solution',
        routes: [
            // 供应商入驻申请列表(改)
            {
                path: '/suppliersAppList',
                parent: 'gysgl',
                key: 'suppliersAppList',
                component: () => (
                    <Switch>
                        <Route
                            path="/SuppliersAppList"
                            exact
                            render={() => (<Bundle load={SuppliersAppList}>
                                {(App) => <App />}
                            </Bundle>)}
                        />
                        <Route
                            path="/SuppliersAppList/:type/:id"
                            exact
                            render={() => <Bundle load={SupplierDetail}>{(App) => <App />}</Bundle>}
                        />
                        {/* 新增供应商  */}
                        <Route
                            path="/SuppliersAppList/add"
                            exact
                            render={() => <Bundle load={AddSupplier}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/SuppliersAppList/edit/:type/:id"
                            exact
                            render={() => <Bundle load={AddSupplier}>{(App) => <App />}</Bundle>}
                        />
                    </Switch>
                )
            },
            // 供应商管理列表
            {
                path: '/supplierInputList',
                parent: 'gysgl',
                key: 'supplierInputList',
                component: () => (
                    <Switch>
                        <Route
                            path="/supplierInputList"
                            exact
                            render={() => (<Bundle load={SupplierInputList}>
                                {(App) => <App />}
                            </Bundle>)}
                        />
                        <Route
                            path="/supplierInputList/:type/:id"
                            exact
                            render={() => <Bundle load={SupplierDetail}>{(App) => <App />}</Bundle>}
                        />
                        {/* 新增供应商  */}
                        <Route
                            path="/supplierInputList/add"
                            exact
                            render={() => <Bundle load={AddSupplier}>{(App) => <App />}</Bundle>}
                        />
                        {/*
                         * /supplierInputList/edit/supplier/xprov334 编辑供应商
                        */}
                        <Route
                            path="/supplierInputList/edit/:type/:id"
                            exact
                            render={() => <Bundle load={AddSupplier}>{(App) => <App />}</Bundle>}
                        />
                    </Switch>
                )
            },
        ]
    },
    // wap端页面配置
    {
        key: 'wappz',
        iconType: 'tablet',
        routes: [
            // 404页面广告配置
            {
                path: '/adPlanList404',
                parent: 'wappz',
                key: 'adPlanList404',
                component: () => (
                    <Route
                        path="/adPlanList404"
                        exact
                        render={() => <Bundle load={AdPlanList404}>{(App) => <App />}</Bundle>}
                    />
                ),
            },
            // 轮播广告管理
            {
                path: '/carouselManagement',
                parent: 'wappz',
                key: 'carouselManagement',
                component: () => (
                    <Route
                        path="/carouselManagement"
                        exact
                        render={() => <Bundle load={CarouselManagement}>{(App) => <App />}</Bundle>}
                    />
                ),
            },
            // 快捷导航管理
            {
                path: '/quickNavigation',
                parent: 'wappz',
                key: 'quickNavigation',
                component: () => (
                    <Route
                        path="/quickNavigation"
                        exact
                        render={() => <Bundle load={QuickNavigation}>{(App) => <App />}</Bundle>}
                    />
                ),
            },
            // 首页样式管理
            {
                path: '/homeStyle',
                parent: 'wappz',
                key: 'homeStyle',
                component: () => (
                    <Route
                        path="/homeStyle"
                        exact
                        render={() => <Bundle load={HomeStyle}>{(App) => <App />}</Bundle>}
                    />
                ),
            },
            // 搜索推荐配置
            {
                path: '/searchRecommendConfig',
                parent: 'wappz',
                key: 'searchConfig',
                component: () => (
                    <Route
                        path="/searchRecommendConfig"
                        exact
                        render={() => (<Bundle load={SearchRecommendConfig}>
                            {(App) => <App />}
                        </Bundle>)}
                    />
                ),
            },
            // 分类图标管理
            {
                path: '/categoryIconManagement',
                parent: 'wappz',
                key: 'categoryIcon',
                component: () => (
                    <Route
                        path="/categoryIconManagement"
                        exact
                        render={() => (<Bundle load={CategoryIconManagement}>
                            {(App) => <App />}
                        </Bundle>)}
                    />
                ),
            },
        ]
    },
    {
        // 库存调整
        key: 'kctz',
        iconType: 'switcher',
        routes: [
            // 库存调整列表
            {
                path: '/storeAdjList',
                parent: 'kctz',
                key: 'kctzlb',
                component: () => (
                    <Switch>
                        <Route
                            path="/storeAdjList"
                            exact
                            render={() => <Bundle load={StoreAdjList}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/storeAdjList/:id"
                            render={() => <Bundle load={ItemDetail}>{(App) => <App />}</Bundle>}
                        />
                    </Switch>
                )
            },
            // 实时库存查询
            {
                path: '/storeRealTime',
                parent: 'kctz',
                key: 'sskccx',
                component: () => (
                    <Switch>
                        <Route
                            path="/storeRealTime"
                            exact
                            render={() => <Bundle load={StoreRealTime}>{(App) => <App />}</Bundle>}
                        />
                    </Switch>
                )
            },
        ]
    },
    {
        // 简易结算支持
        key: 'jyjszc',
        iconType: 'fork',
        routes: [
            // 供应商结算
            {
                path: '/simpleOrderList',
                parent: 'jyjszc',
                key: 'gysjs',
                component: () => (
                    <Switch>
                        <Route
                            path="/simpleOrderList"
                            exact
                            render={() => (<Bundle load={SimpleOrderList}>
                                {(App) => <App />}</Bundle>)}
                        />
                        <Route
                            path="/simpleOrderList/:id"
                            render={() => (<Bundle load={SimpleOrderList}>
                                {(App) => <App />}</Bundle>)
                            }
                        />
                    </Switch>
                )
            },
            {
                path: '/franchiseeSettlement',
                parent: 'jyjszc',
                key: 'jmsjs',
                component: () => (
                    <Switch>
                        <Route
                            path="/franchiseeSettlement"
                            exact
                            render={() => (<Bundle load={FranchiseeSettlement}>
                                {(App) => <App />}</Bundle>)}
                        />
                        <Route
                            path="/franchiseeSettlement/:id"
                            render={() => (<Bundle load={FranchiseeSettlement}>
                                {(App) => <App />}</Bundle>)}
                        />
                    </Switch>
                )
            }
        ]
    },
    // 采购管理
    {
        key: 'procurementMng',
        iconType: 'save',
        routes: [
            // 采购单管理列表
            {
                path: '/po',
                parent: 'procurementMng',
                key: 'poMngList',
                component: () => (
                    <Switch>
                        <Route
                            path="/po"
                            exact
                            render={() => (<Bundle load={PoMngList}>
                                {(App) => <App />}
                            </Bundle>)}
                        />
                        {/* /po/create */}
                        <Route
                            path="/po/:type"
                            exact
                            render={() => <Bundle load={PoDetail}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/po/:type/:purchaseOrderNo"
                            exact
                            render={() => <Bundle load={PoCreateList}>{(App) => <App />}</Bundle>}
                        />
                    </Switch>
                )
            },
            {
                path: '/poprintlist',
                parent: 'procurementMng',
                key: 'poPrintList',
                component: () => (
                    <Switch>
                        <Route
                            path="/poprintlist"
                            exact
                            render={() => (<Bundle load={PoPrintList}>
                                {(App) => <App />}
                            </Bundle>)}
                        />
                    </Switch>
                )
            },
            {
                path: '/porcvmnglist',
                parent: 'procurementMng',
                key: 'poRcvMngList',
                component: () => (
                    <Switch>
                        <Route
                            path="/porcvmnglist"
                            exact
                            render={() => (<Bundle load={PoRcvMngList}>
                                {(App) => <App />}
                            </Bundle>)}
                        />
                        <Route
                            path="/porcvmnglist/:porcvid"
                            exact
                            render={() => <Bundle load={PoRcvDetail}>{(App) => <App />}</Bundle>}
                        />
                    </Switch>
                )
            },
            {
                path: '/porcvlist',
                parent: 'procurementMng',
                key: 'poRcvList',
                component: () => (
                    <Switch>
                        <Route
                            path="/porcvlist"
                            exact
                            render={() => (<Bundle load={PoRcvList}>
                                {(App) => <App />}
                            </Bundle>)}
                        />

                        <Route
                            path="/porcvlist/create/:poid"
                            exact
                            render={() => <Bundle load={PoRcvDetail}>{(App) => <App />}</Bundle>}
                        />
                    </Switch>
                )
            },
            {
                path: '/returnManagementList',
                parent: 'procurementMng',
                key: 'cgthdgllb',
                component: () => (
                    <Switch>
                        <Route
                            path="/returnManagementList"
                            exact
                            render={() => (<Bundle load={ReturnManagementList}>
                                {(App) => <App />}
                            </Bundle>)}
                        />
                        <Route
                            path="/returnManagementList/returnManagementDetail/:id"
                            exact
                            render={
                                () => (
                                    <Bundle load={ReturnManagementDetail}>
                                        {(App) => <App />}
                                    </Bundle>
                                )
                            }
                        />
                        <Route
                            path="/returnManagementList/modify"
                            exact
                            render={
                                () => (
                                    <Bundle load={ReturnGoodsModify}>
                                        {(App) => <App />}
                                    </Bundle>
                                )
                            }
                        />
                        <Route
                            path="/returnManagementList/modify/:id"
                            exact
                            render={
                                () => (
                                    <Bundle load={ReturnGoodsModify}>
                                        {(App) => <App />}
                                    </Bundle>
                                )
                            }
                        />
                    </Switch>
                )
            }
        ]
    },
    {
        // 订单管理
        key: 'ordergl',
        iconType: 'pushpin',
        routes: [
            // 订单管理列表
            {
                path: '/orderList',
                parent: 'ordergl',
                key: 'orderList',
                component: () => (
                    <Switch>
                        <Route
                            path="/orderList"
                            exact
                            render={() => (<Bundle load={OrderManagementList}>
                                {(App) => <App />}</Bundle>
                            )}
                        />
                        <Route
                            path="/orderList/orderDetails/:id"
                            render={() => (<Bundle load={OrderManagementDetails}>
                                {(App) => <App />}</Bundle>)}
                        />
                        <Route
                            path="/orderList/orderBackstageBack/:id"
                            render={() => (<Bundle load={BackstageBack}>
                                {(App) => <App />}</Bundle>)}
                        />
                    </Switch>
                )
            },
            {
                path: '/returnGoodsList',
                parent: 'ordergl',
                key: 'returnGoodsList',
                component: () => (
                    <Switch>
                        <Route
                            path="/returnGoodsList"
                            exact
                            render={() => (<Bundle load={ReturnGoodsList}>
                                {(App) => <App />}
                            </Bundle>)}
                        />
                        <Route
                            path="/returnGoodsList/detail/:type/:id"
                            exact
                            render={() => (<Bundle load={ReturnGoodsDetails}>
                                {(App) => <App />}
                            </Bundle>)}
                        />
                        <Route
                            path="/returnGoodsList/detail/:type/:state/:id"
                            exact
                            render={() => (<Bundle load={ReturnGoodsDetails}>
                                {(App) => <App />}
                            </Bundle>)}
                        />
                    </Switch>
                )
            },
            {
                path: '/exchangeGoodsList',
                parent: 'ordergl',
                key: 'ddhhdlb',
                component: () => (
                    <Switch>
                        <Route
                            path="/exchangeGoodsList"
                            exact
                            render={() => (<Bundle load={ExchangeGoodsList}>
                                {(App) => <App />}
                            </Bundle>)}
                        />
                        <Route
                            path="/exchangeGoodsList/detail/:type/:id"
                            exact
                            render={() => (<Bundle load={ExchangeGoodsDetail}>
                                {(App) => <App />}
                            </Bundle>)}
                        />
                    </Switch>
                )
            },
            {
                path: '/directStoreOrder',
                parent: 'ordergl',
                key: 'zydxd',
                component: () => (
                    <Switch>
                        <Route
                            path="/directStoreOrder"
                            exact
                            render={() => (<Bundle load={DirectStoreOrder}>
                                {(App) => <App />}
                            </Bundle>)}
                        />
                    </Switch>
                )
            }
        ]
    },
    {
        // 待办事项
        key: 'dbsx',
        iconType: 'pushpin',
        routes: [
            // 采购单审批列表
            {
                path: '/toDoPurchaseList',
                parent: 'dbsx',
                key: 'cgdsplb',
                component: () => (
                    <Switch>
                        <Route
                            path="/toDoPurchaseList"
                            exact
                            render={() => (<Bundle load={ToDoPurchaseList}>
                                {(App) => <App />}</Bundle>
                            )}
                        />
                    </Switch>
                )
            },
            // 退货单审批列表
            {
                path: '/toDoReturnList',
                parent: 'dbsx',
                key: 'thsplb',
                component: () => (
                    <Switch>
                        <Route
                            path="/toDoReturnList"
                            exact
                            render={() => (<Bundle load={ToDoReturnList}>
                                {(App) => <App />}</Bundle>
                            )}
                        />
                        <Route
                            path="/toDoReturnList/returnManagementDetail/:id"
                            render={() => (<Bundle load={ReturnManagementDetail}>
                                {(App) => <App />}</Bundle>)}
                        />
                    </Switch>
                )
            }
        ]
    },
    {
        // 促销管理
        key: 'cxgl',
        iconType: 'pushpin',
        routes: [
            {
                // 下单打折
                path: '/promotion',
                parent: 'cxgl',
                key: 'cxxddz',
                component: () => (
                    <Switch>
                        <Route
                            path="/promotion"
                            exact
                            render={() => (<Bundle load={PromotionManagementList}>
                                {(App) => <App />}</Bundle>)}
                        />
                        <Route
                            path="/promotion/create"
                            exact
                            render={() => (<Bundle load={PromotionCreate}>
                                {(App) => <App />}</Bundle>)}
                        />
                        <Route
                            path="/promotion/detail/:id"
                            exact
                            render={() => (<Bundle load={PromotionDetail}>
                                {(App) => <App />}</Bundle>)}
                        />
                        <Route
                            path="/promotion/participate/:id"
                            exact
                            render={() => (<Bundle load={PromotionParticipate}>
                                {(App) => <App />}</Bundle>)}
                        />
                    </Switch>
                )
            },
            {
                // 优惠券
                path: '/coupon',
                parent: 'cxgl',
                key: 'cxyhq',
                component: () => (
                    <Switch>
                        <Route
                            path="/coupon"
                            exact
                            render={() => (<Bundle load={CouponList}>
                                {(App) => <App />}</Bundle>)}
                        />
                        <Route
                            path="/coupon/create"
                            exact
                            render={() => (<Bundle load={CouponCreate}>
                                {(App) => <App />}</Bundle>)}
                        />
                        <Route
                            path="/coupon/detail/:id"
                            exact
                            render={() => (<Bundle load={CouponDetail}>
                                {(App) => <App />}</Bundle>)}
                        />
                        <Route
                            path="/coupon/participate/:id/:promotionName"
                            exact
                            render={() => (<Bundle load={CouponsParticipate}>
                                {(App) => <App />}</Bundle>)}
                        />
                    </Switch>
                )
            },
            {
                // 发放优惠券
                path: '/grantCoupons',
                parent: 'cxgl',
                key: 'ffyhq',
                component: () => (
                    <Switch>
                        <Route
                            path="/grantCoupons"
                            exact
                            render={() => (<Bundle load={GrantCouponList}>
                                {(App) => <App />}</Bundle>)}
                        />
                        <Route
                            path="/grantCoupons/detail/:id"
                            exact
                            render={() => (<Bundle load={grantCouponDetail}>
                                {(App) => <App />}</Bundle>)}
                        />
                    </Switch>
                )
            }
        ]
    },
    {
        // 流程管理
        key: 'lcgl',
        iconType: 'area-chart',
        routes: [
            {
                // 流程列表
                path: '/process',
                parent: 'lcgl',
                key: 'lclb',
                component: () => (
                    <Switch>
                        <Route
                            path="/process"
                            exact
                            render={() => (<Bundle load={ProcessList}>
                                {(App) => <App />}</Bundle>)}
                        />
                    </Switch>
                )
            }
        ]
    }
];

export default routes;
