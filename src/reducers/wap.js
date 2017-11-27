/**
 * @file supplier.js
 *
 * @author shijh
 * 供应商管理相关reducer
 */

import { fromJS } from 'immutable';
import ActionType from '../actions/ActionType';

const initState = fromJS({
    // 弹出框显示隐藏
    modalVisible: false,
    // 弹出框显示数据
    visibleData: {},
    // 广告列表
    adData: [],
    // 快捷导航列表
    naData: [],
    // 首页配置数据
    homeData: [],
    // 查询热门推荐关键字-table(cyx)
    ahData: [],
    // 保存输入框中的关键字(cyx)
    siData: [],
    // 回显输入框中默认关键字(cyx)
    ikData: [],
    // 模态框是否显示（cyx）
    informationVisible: false,
    // 模态框数据（cyx）
    modalTitle: '',
    // 删除table行数据回调数据（cyx）
    dbiData: {},
    // 添加关键字的回调数据（cyx）
    ashData: {},
    // 添加关键字的回调数据（cyx）
    uhData: {},
    // 分类图标管理-查询第三级分类（cyx）
    ciData: [],
    // 404页面广告配置-查询table(cyx)
    aaplData: [],
    // 轮播广告管理-查询轮播间隔时间(cyx)
    intervalData: {
        carouselInterval: 3
    },
    // 切换运营方式
    switchChange: {},
    // 获取用户有权限的公司信息
    companyData: null,
    // 获取区域id
    areaId: {},
    // 设置轮播运营方式
    switchOpt: {}
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.FETCH_CAROUSEL_AD_LIST:
            return state.set('adData', fromJS(action.payload));
        case ActionType.FETCH_NAVIGATION_LIST:
            return state.set('naData', fromJS(action.payload));
        case ActionType.SHOW_QUICK_MODAL: {
            const { modalShow = false, record = {} } = action.payload;
            return state.set('modalVisible', modalShow).set('visibleData', record);
        }
        case ActionType.FETCH_AREA_LIST:
            return state.set('homeData', fromJS(action.payload));
        // 搜索推荐配置-查询热门推荐关键字-table(cyx)
        case ActionType.FETCH_ALL_HOT:
            return state.set('ahData', fromJS(action.payload));
        // 搜索推荐配置-保存输入框中的关键字(cyx)
        case ActionType.FETCH_SAVE_INPUT:
            return state.set('siData', fromJS(action.payload));
        // 搜索推荐配置-回显输入框中默认关键字(cyx)
        case ActionType.FETCH_INPUT_KEYWORD:
            return state.set('ikData', fromJS(action.payload));
        // 搜索推荐配置-删除table行数据回调数据(cyx)
        case ActionType.DELETE_BY_ID:
            return state.set('dbiData', fromJS(action.payload));
        // 搜索推荐配置-添加关键字的回调数据(cyx)
        case ActionType.ADD_SAVE_HOT:
            return state.set('ashData', fromJS(action.payload));
        // 搜索推荐配置-修改关键字的回调数据(cyx)
        case ActionType.UPDATE_HOT:
            return state.set('uhData', fromJS(action.payload));
        // 分类图标管理-查询第三级分类（cyx）
        case ActionType.FETCH_CATEGORY_ID:
            return state.set('ciData', fromJS(action.payload));
        // 404页面广告配置-查询table(cyx)
        case ActionType.FETCH_ALL_AD_PLAN_LIST:
            return state.set('aaplData', fromJS(action.payload));
        // 轮播广告管理-查询轮播间隔时间(cyx)
        case ActionType.FETCH_CAROUSEL_INTERVAL:
            return state.set('intervalData', fromJS(action.payload));
        // 搜索推荐配置-模态框数据(cyx)
        case ActionType.MODIFY_MODAL_VISIBLE: {
            const { isVisible, record = {}, mTitle } = action.payload;
            return state.set('modalVisible', isVisible).set('visibleData', record).set('modalTitle', mTitle);
        }
        // 切换运营方式
        case ActionType.SWITCH_OPTION_WAY_HOME:
            return state.set('switchChange', fromJS(action.payload));
        // 获取用户有权限的公司信息
        case ActionType.BRANCH_COMPANY_INFO:
            return state.set('companyData', fromJS(action.payload));
        // 获取区域id
        case ActionType.FETCH_CAROUSEL_AREA:
            return state.set('areaId', fromJS(action.payload));
        // 设置轮播运营方式
        case ActionType.FETCH_SWITCH_OPT_WAYOF_CAROUSEL:
            return state.set('switchOpt', fromJS(action.payload));
        // 清空轮播图列表
        case ActionType.CLEAR_AD_LIST:
            return state.set('adData', []);
        // 清空首页配置数据
        case ActionType.CLEAR_HOME_PAGE:
            return state.set('homeData', []);
        default:
            return state;
    }
}
