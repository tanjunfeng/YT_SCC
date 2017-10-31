/**
 * @file pub.js
 * @author denglingbo
 *
 * 页面公共，不涉及到 异步请求
 */
import ActionType from './ActionType';
import {
    queryRegionByCode,
    queryCategorys,
    findCompanyBaseInfo,
    queryBrandsByPages,
    querySuppliersList,
    goodsChangeStatus,
    prodBatchPutAway,
    prodBatchUpdate,
    availablProducts,
    supplierSearchBox,
    supplierAdrSearchBox,
    getWarehouseInfo1,
    queryAllCategoriesWithIconByParentId,
    getStoreInfo,
    queryProductByStore,
    querycategories,
    getFranchiseeInfo,
    findCanUseCompanyInfo,
    queryCategorysByLevel,
    queryBranchCompanyInfo,
    queryProductForSelect,
    queryDirectStores,
    queryPurchaseOrderProducts,
    queryPurchaseOrderBrands,
    findCompanyBaseInfo as findCompaniesService
} from '../service';

const pubValueList = {
    // 通过id，和name 查询分公司值列表
    findCompanyBaseInfo,
    // 通过表单值查询品牌列表
    queryBrandsByPages,
    // 通过表单值查询供应商地点列表
    querySuppliersList,
    // 商品的暂停购进和恢复采购
    goodsChangeStatus,
    // 商品的区域性批量上架
    prodBatchPutAway,
    // 商品的区域性批量下架
    prodBatchUpdate,
    // 批量全国上下架
    availablProducts,
    // 供应商选择组件
    supplierSearchBox,
    // 供应商地点选择组件
    supplierAdrSearchBox,
    // 查询逻辑仓库列表
    getWarehouseInfo1,
    // 查询门店列表
    getStoreInfo,
    queryProductByStore,
    // 根据分类名字或者编码查询指定等级的分类列表
    querycategories,
    // 查询加盟商
    getFranchiseeInfo,
    // 查询可用子公司信息
    findCanUseCompanyInfo,
    // 差部类 大类 中类
    queryCategorysByLevel,
    // 通过商品id查询子公司
    queryBranchCompanyInfo,
    // 添加商品
    queryProductForSelect,
    // 查询直营店
    queryDirectStores,
    // 品牌值清单
    queryPurchaseOrderBrands,
    // 商品值清单
    queryPurchaseOrderProducts
};

const receiveCollapsed = (isCollapsed) => ({
    type: ActionType.PUB_COLLAPSED,
    payload: isCollapsed
})

/**
 * 菜单收拢 or 展开
 * @param isCollapsed, 菜单是否收拢
 */
export const menuCollapsed = (isCollapsed) => dispatch => (
    dispatch(receiveCollapsed(isCollapsed))
)

const receiveRegion = (data) => ({
    type: ActionType.PUB_GET_REGION,
    payload: data
})

export const fetchRegionByCode = ({ type = 0, code = '100000' }) => dispatch => (
    queryRegionByCode({ code })
        .then(res => {
            const { data } = res;
            dispatch(
                receiveRegion({ type, parentCode: code, data })
            );
        })
)

const receiveAllCategorys = (data) => ({
    type: ActionType.RECEIVE_All_CATEGORYS,
    payload: data,
});

export const fetchCategorys = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryCategorys(params)
            .then(res => {
                dispatch(receiveAllCategorys(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 全国上下架
const receiveAvailablProducts = (data) => ({
    type: ActionType.RECEIVE_AVAILAB_PRODUCTS,
    payload: data,
});

export const getAvailablProducts = (params) => dispatch => (
    new Promise((resolve, reject) => {
        availablProducts(params)
            .then(res => {
                dispatch(receiveAvailablProducts(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)

const receiveCategorysById = (data) => ({
    type: ActionType.RECEIVE_CATEGORYS_BY_ID,
    payload: data,
});
// 查询单级分类信息
export const fetchCategorysById = (params) => dispatch => (
    new Promise((resolve, reject) => {
        queryAllCategoriesWithIconByParentId(params)
            .then(res => {
                dispatch(receiveCategorysById(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)

/**
 * 公共模块获取值列表
 */
const receiveValuesList = (data) => ({
    type: ActionType.RECEIVE_VALUES_LIST,
    payload: data,
});

const checkResult = (res) => {
    const result = res;
    if (res.data instanceof Array) {
        result.data = {
            data: res.data
        }
        result.total = res.data.length
    }
    return result;
}

export const pubFetchValueList = (params, type) => dispatch => (
    new Promise((resolve, reject) => {
        pubValueList[type](params)
            .then(res => {
                dispatch(receiveValuesList(res.data));
                resolve(checkResult(res));
            })
            .catch(err => {
                reject(err);
            })
    })
)

const findCompaniesAction = (data) => ({
    type: ActionType.FIND_ALL_COMPANIES,
    payload: data
});

/**
 * 获取子公司列表
 */
export const getAllCompanies = (params) => dispatch => (
    new Promise((resolve, reject) => {
        findCompaniesService(params)
            .then(res => {
                dispatch(
                    findCompaniesAction(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err))
    })
);

/**
 * 清空子公司列表
 */
export const clearCompaniesList = () => dispatch => (dispatch({
    type: ActionType.CLEAR_ALL_COMPANIES,
    payload: []
}));
