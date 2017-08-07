/**
 * @file wap.js
 * @author shijh
 *
 * wap端配置相关action
 */

import {
    queryCarouselAdList,
    queryQuickNavigationList,
    areaList,
    queryAllHot,
    saveInput,
    selectInputKeyword,
    deleteById,
    updateHot,
    saveHot,
    queryCategoriesLv4IconList,
    addOrUpdateCategoryIcon,
    queryAllAdPlanList,
    deleteAdPlanById,
    changeAdPlanState,
    addAdPlan,
    updateAdPlan,
    queryCarouselInterval,
    deleteCarouselAd,
    updateCarouselAd,
    updateCarouselAdStatus,
    updateCarouselInterval,
    insertCarouselAd,
} from '../service';
import ActionType from './ActionType';

const receiveAdList = (data) => ({
    type: ActionType.FETCH_CAROUSEL_AD_LIST,
    payload: data,
})

// 查询图片轮播
export const fetchCarouselAdList = (data) => dispatch => (
    queryCarouselAdList(data)
        .then(res => {
            dispatch(
                receiveAdList(res.data)
            );
        })
        .catch(err => Promise.reject(err))
)

const receiveCarouselInterval = (data) => ({
    type: ActionType.FETCH_CAROUSEL_INTERVAL,
    payload: data,
})

// 轮播广告管理（cyx）-查询轮播间隔时间
export const fetchCarouselInterval = (data) => dispatch => (
    queryCarouselInterval(data)
        .then(res => {
            dispatch(
                receiveCarouselInterval(res.data)
            );
        })
        .catch(err => Promise.reject(err))
)

const receiveNaList = (data) => ({
    type: ActionType.FETCH_NAVIGATION_LIST,
    payload: data,
})

// 查询快捷导航
export const fetchQuickNavigationList = (data) => dispatch => (
    queryQuickNavigationList(data)
        .then(res => {
            dispatch(
                receiveNaList(res.data)
            );
        })
        .catch(err => Promise.reject(err))
)

// 弹出修改快捷导航弹出框
export const showEditModal = (data) => ({
    type: ActionType.SHOW_QUICK_MODAL,
    payload: data
})

const receiveAreaList = (data) => ({
    type: ActionType.FETCH_AREA_LIST,
    payload: data,
})

// 查询移动端首页配置
export const fetchAreaList = (data) => dispatch => (
    new Promise((resolve, reject) => {
        Promise.all([areaList(data), queryQuickNavigationList()])
        .then((result) => {
            // TODO接口会调整，暂时在这里处理
            const all = result[0].data;
            const quick = result[1].data;
            all.map((item, index) => {
                if (item.id === 'quick-nav') {
                    result[0].data[index].itemAds = quick;
                    return null;
                }
            })
            dispatch(
                receiveAreaList(result[0].data)
            );
            resolve(result[0].data);
        }).catch((err) => {
            if (err.data && err.data.code === 401) {
                reject(err);
            }
        })
    })
)

const receiveAllHot = (data) => ({
    type: ActionType.FETCH_ALL_HOT,
    payload: data,
})

// 查询热门推荐关键字-Table(cyx)
export const fetchAllHot = (data) => dispatch => (
    queryAllHot(data)
        .then(res => {
            dispatch(
                receiveAllHot(res.data)
            );
        })
        .catch(err => Promise.reject(err))
)

const receiveInputKeyword = (data) => ({
    type: ActionType.FETCH_INPUT_KEYWORD,
    payload: data,
})

// 回显输入框中的默认关键字(cyx)
export const fetchInputKeyword = (data) => dispatch => (
    selectInputKeyword(data)
        .then(res => {
            dispatch(
                receiveInputKeyword(res.data)
            );
        })
        .catch(err => Promise.reject(err))
)

const receiveSaveHot = (data) => ({
    type: ActionType.ADD_SAVE_HOT,
    payload: data,
})

// 删除table行记录(cyx)
export const removeTableHot = (data) => dispatch => (
    deleteById(data)
        .then(res => {
            dispatch(
                receiveSaveHot(res.data)
            );
        })
        .catch(err => Promise.reject(err))
)

const receiveHotId = (data) => ({
    type: ActionType.DELETE_BY_ID,
    payload: data,
})

// 添加热门关键字(cyx)
export const addSaveHOT = (data) => dispatch => (
    saveHot(data)
        .then(res => {
            dispatch(
                receiveHotId(res.data)
            );
        })
        .catch(err => Promise.reject(err))
)

const receiveUpdateHot = (data) => ({
    type: ActionType.UPDATE_HOT,
    payload: data,
})

// 修改热门关键字(cyx)
export const modifyUpdateHot = (data) => dispatch => (
    updateHot(data)
        .then(res => {
            dispatch(
                receiveUpdateHot(res.data)
            );
        })
        .catch(err => Promise.reject(err))
)

const receiveSaveInput = (data) => ({
    type: ActionType.FETCH_SAVE_MESSAGE,
    payload: data,
})

// 保存输入框中的热门推荐关键字(cyx)
export const addSaveInput = (data) => dispatch => (
    new Promise((resolve, reject) => {
        saveInput(data)
            .then(res => {
                dispatch(
                    receiveSaveInput(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

const receiveCategoriesLv4IconList = (data) => ({
    type: ActionType.FETCH_CATEGORY_ID,
    payload: data,
})

// 查询热门推荐关键字-Table(cyx)
export const fetchCategoryId = (data) => dispatch => (
    queryCategoriesLv4IconList(data)
        .then(res => {
            dispatch(
                receiveCategoriesLv4IconList(res.data)
            );
        })
        .catch(err => Promise.reject(err))
)

const receive = (data) => ({
    type: ActionType.MODIFY_MODAL_VISIBLE,
    payload: data,
});
// 搜索推荐配置页-模态框(cyx)
export const modifyModalVisible = (isShow) => dispatch => dispatch(receive(isShow));

// 分类图标管理-上传或修改ICON(cyx)
export const modifyCategoryIcon = (data) => (
    new Promise((resolve, reject) => {
        addOrUpdateCategoryIcon(data)
            .then(res => {
                resolve(res);
            })
            .catch(err => reject(err))
    })
)
// export const modifyCategoryIcon = (data, callBack) => () => (
//     addOrUpdateCategoryIcon(data)
//         .then(res => {
//             callBack(res.data)
//         })
//         .catch(err => Promise.reject(err))
// )

const receiveAllAdPlanList = (data) => ({
    type: ActionType.FETCH_ALL_AD_PLAN_LIST,
    payload: data,
})

// 404页面-查询Table(cyx)
export const fetchAllAdPlanList = (data) => dispatch => (
    queryAllAdPlanList(data)
        .then(res => {
            dispatch(
                receiveAllAdPlanList(res.data)
            );
        })
        .catch(err => Promise.reject(err))
)

// 404页面-删除方案(cyx)
export const removeAdPlanById = (data, callBack) => () => (
    deleteAdPlanById(data)
        .then(res => {
            callBack(res.data)
        })
        .catch(err => Promise.reject(err))
)

// 404页面-方案的启停(cyx)
export const modifyAdPlanState = (data, callBack) => () => (
    changeAdPlanState(data)
        .then(res => {
            callBack(res.data)
        })
        .catch(err => Promise.reject(err))
)

// 404页面-新增方案(cyx)
export const addAdPlanList = (data, callBack) => () => (
    addAdPlan(data)
        .then(res => {
            callBack(res.data)
        })
        .catch(err => Promise.reject(err))
)

// 404页面-修改方案(cyx)
export const modifyAdPlanList = (data, callBack) => () => (
    updateAdPlan(data)
        .then(res => {
            callBack(res.data)
        })
        .catch(err => Promise.reject(err))
)

// 轮播广告管理-删除项(cyx)
export const removeCarouselAd = (data) => (
    new Promise((resolve, reject) => {
        deleteCarouselAd(data)
            .then(res => {
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

// 轮播广告管理-启停项(cyx)
export const modifyCarouselAdStatus = (data) => (
    new Promise((resolve, reject) => {
        updateCarouselAdStatus(data)
            .then(res => {
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

// 轮播广告管理-修改轮播时间间隔(cyx)
export const modifyCarouselInterval = (data) => (
    new Promise((resolve, reject) => {
        updateCarouselInterval(data)
            .then(res => {
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

// 轮播广告管理-新增
export const addCarouselAd = (data) => (
    new Promise((resolve, reject) => {
        insertCarouselAd(data)
            .then(res => {
                resolve(res);
            })
            .catch(err => reject(err))
    })
)

// 轮播广告管理-修改
export const modifyCarouselAd = (data) => (
    new Promise((resolve, reject) => {
        updateCarouselAd(data)
            .then(res => {
                resolve(res);
            })
            .catch(err => reject(err))
    })
)
