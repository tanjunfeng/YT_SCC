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

/**
 * 首先检查该用户是否 401
 */
// checkUser()
//     .then(data => {
//         startApp(data);
//     })
//     .catch(() => {
//         startApp();
//     });


startApp({
    user: {
        employeeName: 'admin'
    },
    "topMenus": {
        "menu": [
            {
                "id": 39,
                "code": "1,65,78",
                "name": "系统管理-（系统）",
                "submenu": []
            },
            {
                "id": 40,
                "code": "6,12,14,75,59,60,61",
                "name": "加盟子系统-（系统）",
                "submenu": []
            },
            {
                "id": 42,
                "code": "34",
                "name": "小超人运营管理-（系统）",
                "submenu": []
            },
            {
                "id": 57,
                "code": "43,45",
                "name": "主数据管理-（系统）",
                "submenu": []
            },
            {
                "id": 155,
                "code": "gyl",
                "name": "供应链管理",
                "submenu": []
            }
        ]
    },
    menus: {
        name: "denglingbo",
        age: "12",
        level: 5,
        city: "Chengdu",
        admin: 1,
        menu: [
            {
                code: "gylspgl",
                name: "商品管理",
                submenu: [
                    {
                        code: "onSaleGoodsList",
                        name: "在售商品列表"
                    },
                    {
                        code: "forSaleGoodsList",
                        name: "待售商品管理"
                    },
                    {
                        code: "goodsParameterManagement",
                        name: "商品参数管理"
                    },
                    {
                        "code": "goodsClassification",
                        "name": "商品分类列表"
                    }
                ]
            },
            {
                code: "gysgl",
                name: "供应商管理",
                submenu: [
                    {
                        code: "supplierManagement",
                        name: "供应商管理列表"
                    },
                    {
                        code: "supplierApplication",
                        name: "供应商入驻申请列表"
                    },
                    {
                        code: "suppliersAppList",
                        name: "供应商入驻申请列表"
                    },
                    {
                        code: "modifyApplication",
                        name: "供应商修改资料申请"
                    },
                    {
                        code: "supplierAreaManagement",
                        name: "供应商配送区域管理"
                    }
                ]
            },
            {
                code: 'gylxtpz',
                name: "系统配置",
                submenu: [
                    {
                        code: "goodsManange",
                        name: "分类列表页商品排序管理",
                    },
                    {
                        code: "dataDictionary",
                        name: "数据字典",
                    }
                ]
            },
            {
                code: "dmtgl",
                name: "多媒体管理",
                submenu: [
                    {
                        code: "jtygl",
                        name: "静态页管理",
                    },
                ]
            },
            {
                code: "wappz",
                name: "wap端页面配置",
                submenu: [{
                    code: "adPlanList404",
                    name: "404页面广告配置"
                },
                {
                    code: "carouselManagement",
                    name: "轮播广告管理"
                },
                    {
                        code: "quickNavigation",
                        name: "快捷导航管理"
                    },
                    {
                        code: "homeStyle",
                        name: "首页样式管理"
                    },
                    {
                        code: 'searchConfig',
                        name: '搜索推荐配置'
                    },
                    {
                        code: 'categoryIcon',
                        name: '分类图标管理'
                    }
                ]
            }
        ]
    }
})