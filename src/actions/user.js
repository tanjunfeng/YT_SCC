/**
 * @file user.js
 * @author denglingbo
 *
 * 用户信息 Action
 */
import { login, fetchRights, user, queryLeftMenus, logout } from '../service';
import ActionType from './ActionType';
import { Sider } from '../view-model';
import { ID } from '../constant';

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
        Promise.all([user(), queryLeftMenus({menuId: ID})]).then(function (result) {
            const { topMenus, ...datas } = result[0].data;
            const { data } = result[1];
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
    })
)

/**
 * 获取用户权限
 * @param code
 * @param pathname
 */
export const fetchRightsAction = (code) => dispatch => {
    // fetchRights(code)
    //     .then(res => dispatch(receiveRights(res.data)))
    //     .catch(err => Promise.reject(err));
}

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
