/**
 * @file user.js
 * @author denglingbo
 *
 * 用户信息 Action
 */
import { login, fetchRights, user, queryLeftMenus } from '../service';
import ActionType from './ActionType';
import { Sider } from '../view-model';
import { CODE } from '../constant';

export const receiveUser = (data) => ({
    type: ActionType.RECEIVE_USER,
    payload: data,
});

export const receiveLogout = () => ({
    type: ActionType.RECEIVE_USER,
    payload: null,
});

const receiveRights = (data) => ({
    type: ActionType.RECEIVE_RIGHTS,
    payload: data,
});

/**
 * 获取用户信息
 * 1. 成功则设置为登录状态
 * 2. 失败则设置为登出状态
 */
export const checkUser = () => (
    new Promise((resolve, reject) => {
        user().then((res) => {
            const { topMenus, ...datas } = res.data;
            const currentItem = topMenus.find((item) => (
                item.authorityCode === CODE
            ))
            queryLeftMenus({ menuId: currentItem.authorityId }).then((result) => {
                const { data } = result;
                resolve({
                    topMenus: Sider(topMenus),
                    menus: Sider(data),
                    user: datas
                });
            }).catch((err) => {
                if (err.data && err.data.code === 401) {
                    reject(err);
                }
            })
        }).catch((err) => {
            if (err.data && err.data.code === 401) {
                reject(err);
            }
        })
    })
)

/**
 * 获取用户权限
 * @param code
 * @param pathname
 */
export const fetchRightsAction = params => dispatch => (
    new Promise((resolve, reject) => {
        fetchRights(params)
            .then(res => {
                dispatch(
                    receiveRights(res.data)
                );
                resolve(res);
            })
            .catch(err => reject(err));
    })
);

/**
 * 登录接口
 * 该接口只设置用户 isAuth
 * @param params
 */
export const loginAction = (params) => (
    login(params)
        .then(() => Promise.resolve())
        .catch(err => Promise.reject(err))
)
