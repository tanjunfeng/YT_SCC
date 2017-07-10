/**
 * @file pub.js
 * @author denglingbo
 *
 * 页面公共，不涉及到 异步请求
 */
import ActionType from './ActionType';
import { queryRegionByCode, queryCategorys } from '../service';

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
