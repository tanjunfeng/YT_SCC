/**
 * @file classifiedList.js
 * @author denglingbo
 *
 */

import Promise from 'bluebird';
import ActionType from './ActionType';
import {
    queryAllCategories,
    queryBrandsByPages,
    updateSortNum,
    updateShowStatus
} from '../service';
import { ClassifiedList } from '../view-model';

export const addAction = () => { };
export const putAction = () => { };
export const delAction = () => { };

export const receiveData = (data) => ({
    type: ActionType.RECEIVE_CLASSIFIED_LIST,
    payload: data,
});

/**
 * 请求列表信息
 * @param params
 */
export const fetchAction = (params) => dispatch => (
    queryAllCategories(params)
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
 * 修改显示状态
 * @param id
 * @param displayStatus
 */
export const updateShowStatusAction = (
    { id, displayStatus }) => updateShowStatus({ id, displayStatus });

/**
 * 修改排序
 * @param id
 * @param sortOrder
 * @param newSortOrder
 */
export const updateSortNumAction = (
    { id, sortOrder, newSortOrder }) => updateSortNum({ id, sortOrder, newSortOrder });

/**
 * 请求品牌列表
 * @param params
 */
export const fetchBrandsByPages = (params) => (
    new Promise((resolve, reject) => {
        queryBrandsByPages(params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            });
    })
);
