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
    // 获取子公司列表
    findCompanyBaseInfo
} from '../service';

const pubValueList = {
    // 通过id，和name 查询分公司值列表
    findCompanyBaseInfo,
}

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

export const fetchRegionByCode = ({type = 0, code = '100000'}) => dispatch => (
    queryRegionByCode({code})
        .then(res => {
            const { data } = res;
            dispatch(
                receiveRegion({type, parentCode: code, data})
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

/**
 * 公共模块获取值列表
 */
const receiveValuesList = (data) => ({
    type: ActionType.RECEIVE_VALUES_LIST,
    payload: data,
});

const checkResult = (res) => {
    let result = res;
    if (res.data instanceof Array) {
        result.data = {
            data: res.data
        }
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
