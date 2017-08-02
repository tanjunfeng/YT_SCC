/**
 * @file classifiedList.js
 * @author denglingbo
 *
 */

import Promise from 'bluebird';
import ActionType from './ActionType';
import { queryCategorys, queryBrandsByPages } from '../service';
import { ClassifiedList } from '../view-model';

export const addAction = () => {}
export const putAction = () => {}
export const delAction = () => {}

export const receiveData = (data) => ({
    type: ActionType.RECEIVE_CLASSIFIED_LIST,
    payload: data,
});

/**
 * 请求列表信息
 * @param params
 */
export const fetchAction = (params) => dispatch => (
    queryCategorys(params)
        .then(res => {
            dispatch(
                receiveData(
                    ClassifiedList(res.data)
                )
            );
        })
        .catch(err => Promise.reject(err))
)

/**
 * 请求品牌列表
 * @param params
 */
export const fetchBrandsByPages = (params) => (
    new Promise((resolve, reject) => {
        queryBrandsByPages(params)
        .then(res => {
            console.log(res);
            resolve(res.data);
        })
        .catch(err => {
            reject(err);
        });
    })
);

