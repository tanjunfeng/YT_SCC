/**
 * @file index.jsx
 * @author deo
 *
 */
import React from 'react';
import ReactDOM from 'react-dom';
import FrameApp from 'freed-spa/src/App';
import App from './App';
import reducers from './reducers';
import { checkUser } from './actions/user';

/**
 * 启动 App
 */
const startApp = (data) => {
    ReactDOM.render(
        <FrameApp
            asyncReducers={reducers}
        >
            <App
                initData={data}
            />
        </FrameApp>,
        document.getElementById('root')
    );
}

const mockData = { "topMenus": { "menu": [{ "id": 39, "code": "1,65,78", "name": "系统管理", "submenu": [] }, { "id": 40, "code": "6,12,14,75,59,60,61", "name": "小超商家管理", "submenu": [] }, { "id": 42, "code": "134", "name": "雅堂小超商家版管理", "submenu": [] }, { "id": 57, "code": "43,45", "name": "主数据管理", "submenu": [] }, { "id": 155, "code": "gyl", "name": "供应链管理", "submenu": [] }, { "id": 169, "code": "dsjzx", "name": "大数据中心", "submenu": [] }, { "id": 190, "code": "cdyy", "name": "雅堂小超管理", "submenu": [] }] }, "menus": { "menu": [{ "id": 156, "code": "gylspgl", "name": "商品管理", "submenu": [{ "id": 214, "code": "commodifyList", "name": "商品管理列表", "submenu": [] }, { "id": 233, "code": "goodsClassification", "name": "商品分类列表", "submenu": [] }, { "id": 234, "code": "importPurchasePrice", "name": "采购进价批量导入", "submenu": [] }, { "id": 235, "code": "priceImport", "name": "售价导入", "submenu": [] }, { "id": 474, "code": "productSiteManage", "name": "商品地点关系管理", "submenu": [] }] }, { "id": 160, "code": "gysgl", "name": "供应商管理", "submenu": [{ "id": 163, "code": "supplierInputList", "name": "供应商管理列表", "submenu": [{ "id": 229, "code": "queryManageList", "name": "新增供应商", "submenu": [] }] }, { "id": 164, "code": "suppliersAppList", "name": "供应商入驻申请列表", "submenu": [] }] }, { "id": 215, "code": "ordergl", "name": "订单管理", "submenu": [{ "id": 216, "code": "orderList", "name": "销售订单列表", "submenu": [] }, { "id": 331, "code": "returnGoodsList", "name": "退货单列表", "submenu": [] }, { "id": 362, "code": "ddhhdlb", "name": "换货单列表", "submenu": [] }, { "id": 314, "code": "zydxd", "name": "直营店下单", "submenu": [] }, { "id": 369, "code": "ydzq", "name": "预定专区", "submenu": [] }] }, { "id": 222, "code": "gylxtpz", "name": "系统配置", "submenu": [{ "id": 224, "code": "dataDictionary", "name": "数据字典", "submenu": [] }, { "id": 304, "code": "whiteListConfig", "name": "白名单配置", "submenu": [] }] }, { "id": 231, "code": "dmtgl", "name": "多媒体管理", "submenu": [{ "id": 232, "code": "jtygl", "name": "静态页管理", "submenu": [] }] }, { "id": 265, "code": "kctz", "name": "库存调整", "submenu": [{ "id": 266, "code": "kctzlb", "name": "库存调整列表", "submenu": [] }, { "id": 285, "code": "sskccx", "name": "实时库存查询", "submenu": [] }] }, { "id": 363, "code": "dbsx", "name": "待办事项", "submenu": [{ "id": 364, "code": "cgdsplb", "name": "采购单审批列表", "submenu": [] }, { "id": 365, "code": "thsplb", "name": "退货审批列表", "submenu": [] }, { "id": 366, "code": "jjsh", "name": "进价审核", "submenu": [] }, { "id": 367, "code": "sjsh", "name": "售价审核", "submenu": [] }, { "id": 368, "code": "jgbgjllb", "name": "价格变更记录", "submenu": [] }] }, { "id": 193, "code": "wappz", "name": "移动端页面配置", "submenu": [{ "id": 217, "code": "adPlanList404", "name": "404页面广告配置", "submenu": [] }, { "id": 194, "code": "carouselManagement", "name": "轮播广告管理", "submenu": [] }, { "id": 219, "code": "homeStyle", "name": "首页样式管理", "submenu": [] }, { "id": 220, "code": "searchConfig", "name": "搜索推荐配置", "submenu": [] }, { "id": 221, "code": "categoryIcon", "name": "分类图标管理", "submenu": [] }] }, { "id": 225, "code": "procurementMng", "name": "采购管理", "submenu": [{ "id": 226, "code": "poMngList", "name": "采购单管理列表", "submenu": [] }, { "id": 227, "code": "poPrintList", "name": "采购单打印列表", "submenu": [] }, { "id": 228, "code": "poRcvMngList", "name": "收货单管理列表", "submenu": [] }, { "id": 367, "code": "cgthdgllb", "name": "退货单管理列表", "submenu": [] }] }, { "id": 277, "code": "cxgl", "name": "促销管理", "submenu": [{ "id": 278, "code": "cxxddz", "name": "促销活动", "submenu": [] }, { "id": 301, "code": "cxyhq", "name": "优惠券", "submenu": [] }, { "id": 303, "code": "ffyhq", "name": "发放优惠券", "submenu": [] }] }, { "id": 279, "code": "jyjszc", "name": "简易结算支持", "submenu": [{ "id": 280, "code": "gysjs", "name": "供应商结算", "submenu": [] }, { "id": 281, "code": "jmsjs", "name": "加盟商结算", "submenu": [] }] }, { "id": 305, "code": "lcgl", "name": "流程管理", "submenu": [{ "id": 306, "code": "lclb", "name": "流程列表", "submenu": [] }] }] }, "user": { "userId": 10027, "employeeLogin": "admin", "employeeName": "管理员", "employeePhonenumber": "15645678901", "employeeCompanyId": 100028, "companyName": "", "companyType": 1 } }

/**
 * 首先检查该用户是否 401
 */
startApp(mockData);
// checkUser().then(data => {
//     startApp(mockData);
// }).catch(() => {
//     startApp();
// });

