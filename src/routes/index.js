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
// 销售价格
import FindPriceInfo from 'bundle-loader?lazy!../views/commodity/findPriceInfo';
// 销售价格
import PurchasingPice from 'bundle-loader?lazy!../views/commodity/purchasingPice';
// 分类列表页商品排序管理
import CateListGoodsSortManage from 'bundle-loader?lazy!../views/sysConfig/CateListGoodsSortManage';
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
        ]
    },
    {
        key: 'gysgl',
        iconType: 'solution',
        routes: [
            // 供应商管理列表
            {
                path: '/supplierList',
                parent: 'gysgl',
                key: 'supplierManagement',
                component: () => (
                    <Switch>
                        <Route
                            path="/supplierList"
                            exact
                            render={() => (<Bundle load={SupplierManageList}>
                                {(App) => <App />}
                            </Bundle>)}
                        />
                        <Route
                            path="/supplierList/:id"
                            exact
                            render={() => <Bundle load={SupplierDetail}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/supplierList/:id/:type"
                            render={() => <Bundle load={SupplierDetail}>{(App) => <App />}</Bundle>}
                        />
                    </Switch>
                )
            },
            // 供应商入驻申请列表
            {
                path: '/applicationList',
                parent: 'gysgl',
                key: 'supplierApplication',
                component: () => (
                    <Switch>
                        <Route
                            path="/applicationList"
                            exact
                            render={() => (<Bundle load={SuppliersAppList}>
                                {(App) => <App />}
                            </Bundle>)}
                        />
                        <Route
                            path="/applicationList/add"
                            exact
                            render={() => <Bundle load={AddSupplier}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/applicationList/edit/:id"
                            render={() => <Bundle load={AddSupplier}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/applicationList/:id"
                            render={() => <Bundle load={SupplierDetail}>{(App) => <App />}</Bundle>}
                        />
                    </Switch>
                )
            },
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
                            path="/SuppliersAppList/add"
                            exact
                            render={() => <Bundle load={AddSupplier}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/SuppliersAppList/edit/:id"
                            render={() => <Bundle load={AddSupplier}>{(App) => <App />}</Bundle>}
                        />
                        <Route
                            path="/SuppliersAppList/:id"
                            render={() => <Bundle load={SupplierDetail}>{(App) => <App />}</Bundle>}
                        />
                    </Switch>
                )
            },
            // 供应商修改资料申请
            {
                path: '/modifyApplication',
                parent: 'gysgl',
                key: 'modifyApplication',
                component: () => (
                    <Switch>
                        <Route
                            path="/modifyApplication"
                            exact
                            render={() => (<Bundle load={SupplierModifyApplication}>
                                {(App) => <App />}
                            </Bundle>)}
                        />
                        <Route
                            path="/modifyApplication/:id"
                            render={() => (<Bundle load={SupplierDetail}>
                                {(App) => <App />}
                            </Bundle>)}
                        />
                    </Switch>
                )
            },
            // 供应商配送区域管理
            {
                path: '/areaManagement',
                parent: 'gysgl',
                key: 'supplierAreaManagement',
                component: () => (
                    <Route
                        path="/areaManagement"
                        render={() => (<Bundle load={SupplierAreaManagement}>
                            {(App) => <App />}
                        </Bundle>)}
                    />
                )
            },
            // 供应商录入管理
            {
                path: '/supplierInputList',
                parent: 'gysgl',
                key: 'supplierInputList',
                component: () => (
                    <Route
                        path="/supplierInputList"
                        render={() => (<Bundle load={SupplierInputList}>
                            {(App) => <App />}
                        </Bundle>)}
                    />
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
                        render={() => <Bundle load={CategoryIconManagement}>{(App) => <App />}</Bundle>}
                    />
                ),
            },
        ]
    }
];

export default routes;
