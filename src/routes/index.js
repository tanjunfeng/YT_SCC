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
import Home from 'bundle-loader?lazy!../views/home/App';
// 供应商录入列表
import SupplierInputList from 'bundle-loader?lazy!../views/supplier/supplierInputList';
// 供应商管理列表
import SupplierManageList from 'bundle-loader?lazy!../views/supplier/supplierManageList';
// 供应区域列表管理
import SupplierAreaManagement from 'bundle-loader?lazy!../views/supplier/supplierAreaManagement';
// 供应商入驻申请列表
import SuppliersApplicationList from 'bundle-loader?lazy!../views/supplier/suppliersApplicationList';
// 供应商入驻申请列表(改)
import SuppliersAppList from 'bundle-loader?lazy!../views/supplier/suppliersAppList';
// 供应商修改资料申请
import SupplierModifyApplication from 'bundle-loader?lazy!../views/supplier/supplierModifyApplication';
// 供应商详情
import SupplierDetail from 'bundle-loader?lazy!../views/supplier/detail';
// 添加供应商
import AddSupplier from 'bundle-loader?lazy!../views/supplier/addEdit';
// 在售商品管理
import OnSale from 'bundle-loader?lazy!../views/commodity/onSale';
// 待售商品管理
import ForSale from 'bundle-loader?lazy!../views/commodity/forSale';
// 商品详情
import SaleDetail from 'bundle-loader?lazy!../views/commodity/detail';
// 商品分类管理
import ClassifiedList from 'bundle-loader?lazy!../views/commodity/classifiedList';
// 商品管理列表
import ManagementList from 'bundle-loader?lazy!../views/commodity/managementList';
import CommodifyDetail from 'bundle-loader?lazy!../views/commodity/commodifyDetail';
// 销售价格
import FindPriceInfo from 'bundle-loader?lazy!../views/commodity/findPriceInfo';
// 销售价格
import PurchasingPice from 'bundle-loader?lazy!../views/commodity/purchasingPice';
// 分类列表页商品排序管理
import CateListGoodsSortManage from 'bundle-loader?lazy!../views/SysConfig/CateListGoodsSortManage';
// 数据字典
import DataDictionary from 'bundle-loader?lazy!../views/SysConfig/DataDictionary';
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

/*********************procurement************************* */
import PoMngList from 'bundle-loader?lazy!../views/procurement/poMngList';
import PoDetail from 'bundle-loader?lazy!../views/procurement/PoDetail';
import PoPrintList from 'bundle-loader?lazy!../views/procurement/PoPrintList';
import PoRcvMngList from 'bundle-loader?lazy!../views/procurement/PoRcvMngList';
import PoRcvList from 'bundle-loader?lazy!../views/procurement/PoRcvList';
import PoRcvDetail from 'bundle-loader?lazy!../views/procurement/PoRcvDetail';

// IBM 修改
// 商品采购关系维护
import ProcurementMaintenance from 'bundle-loader?lazy!../views/commodity/procurementMaintenance';
// 商品销售关系维护
import SalesMaintenance from 'bundle-loader?lazy!../views/commodity/salesMaintenance';
// 订单管理列表
import OrderManagementList from 'bundle-loader?lazy!../views/orderManagement/orderList';
// 订单管理-详情页
import OrderManagementDetails from 'bundle-loader?lazy!../views/orderManagement/orderDetails';

// 库存调整列表
import StoreAdjList from 'bundle-loader?lazy!../views/storeAdjustment/storeAdjList';
import ItemDetail from 'bundle-loader?lazy!../views/storeAdjustment/itemDetail';

/* eslint-enable */


/**
 * 路由配置
 * @type {[*]}
 */
const routes = [
    {
        path: '/',
        key: 'home',
        exact: true,
        component: () => (
            <Route
                path="/"
                exact
                render={() => <Bundle load={Home}>{(App) => <App />}</Bundle>}
            />
        )
    },
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
            // 在售商品列表
            {
                path: '/onSale',
                parent: 'gylspgl',
                key: 'onSaleGoodsList',
                component: () => (
                    <Switch>
                        <Route
                            path="/onSale"
                            exact
                            render={() => <Bundle load={OnSale}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/onSale/detail/:id"
                            render={() => <Bundle load={SaleDetail}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/onSale/price/:id"
                            render={() => <Bundle load={FindPriceInfo}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/onSale/purchasingPice/:id"
                            render={() => <Bundle load={PurchasingPice}>{(App) => <App />}</Bundle>}
                        />
                    </Switch>
                )
            },
            // 待售商品列表
            {
                path: '/forSale',
                parent: 'gylspgl',
                key: 'forSaleGoodsList',
                component: () => (
                    <Switch>
                        <Route
                            path="/forSale"
                            exact
                            render={() => <Bundle load={ForSale}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/forSale/detail/:id"
                            render={() => <Bundle load={SaleDetail}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/forSale/price/:id"
                            render={() => <Bundle load={FindPriceInfo}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/forSale/purchasingPice/:id"
                            render={() => <Bundle load={PurchasingPice}>{(App) => <App />}</Bundle>}
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
            },
            // 商品采购关系维护
            {
                path: '/procurementMaintenance',
                parent: 'gylspgl',
                key: 'procurementMaintenance',
                component: () => (
                    <Switch>
                        <Route
                            path="/procurementMaintenance"
                            exact
                            render={() => <Bundle load={ProcurementMaintenance}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/procurementMaintenance/:id"
                            render={() => <Bundle load={ProcurementMaintenance}>{(App) => <App />}</Bundle>}
                        />
                    </Switch>
                )
            },
            // 商品销售关系维护
            {
                path: '/salesMaintenance',
                parent: 'gylspgl',
                key: 'salesMaintenance',
                component: () => (
                    <Switch>
                        <Route
                            path="/salesMaintenance"
                            exact
                            render={() => <Bundle load={SalesMaintenance}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/salesMaintenance/:id"
                            render={() => <Bundle load={SalesMaintenance}>{(App) => <App />}</Bundle>}
                        />
                    </Switch>
                )
            },
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
                        {/* 
                          * /suppliersAppList/supplier/xprov334#/  供应商详情
                          * /suppliersAppList/place/14#/ 供应商地点详情
                          * /suppliersAppList/add/14#/ 新增供应商地点
                          * /suppliersAppList/edit/14#/ 修改供应商地点
                         */}
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
                        {/*
                         * /SuppliersAppList/edit/supplier/xprov334 编辑供应商地点
                        */}
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
                        {/* 
                          * /supplierInputList/supplier/xprov334#/  供应商详情
                          * /supplierInputList/place/14#/ 供应商地点详情
                          * /supplierInputList/add/14#/ 新增供应商地点
                          * /supplierInputList/edit/14#/ 修改供应商地点
                         */}
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
                         * /supplierInputList/edit/supplier/xprov334 编辑供应商地点
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
            }
        ]
    },
    // 采购管理
    {
        key: 'procurementMng',
        iconType: 'solution',
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
                        <Route
                            path="/po/create"
                            exact
                            render={() => <Bundle load={PoDetail}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/po/:poid"
                            exact
                            render={() => <Bundle load={PoDetail}>{(App) => <App />}</Bundle>}
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
                            render={() =>
                                <Bundle load={OrderManagementList}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/orderList/orderDetails/:orderNumber"
                            render={() => <Bundle load={OrderManagementDetails}>{(App) => <App />}</Bundle>}
                        />
                    </Switch>
                )
            }
        ]
    }
];

export default routes;
