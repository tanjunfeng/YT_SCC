/**
 * @file fetchGoods.js
 *
 * @author wtt
 *
 * 获取商品分类
 */

import Promise from 'bluebird';
import { dictionaryList, dictionaryContentList, insertDictionary } from '../service';
import ActionType from './ActionType';

// 查询字典分页列表
const receiveDictionary = (data) => ({
    type: ActionType.RECEIVE_DICTIONARY_LIST,
    payload: data,
});

export const dictionarylist = (params) => dispatch => (
    new Promise((resolve, reject) => {
        dictionaryList(params)
            .then(res => {
                dispatch(receiveDictionary(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 显示字典内容
const receiveContentlist = (data) => ({
    type: ActionType.RECEIVE_DICTIONARY_CONTENTLIST,
    payload: data,
});

export const contentlist = (params) => dispatch => (
    new Promise((resolve, reject) => {
        dictionaryContentList(params)
            .then(res => {
                dispatch(receiveContentlist(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 新增数据字典
const receiveInsertDictionary = (data) => ({
    type: ActionType.REQUEST_INSERT_DICTIONARY,
    payload: data,
});

export const addDictionary = (params) => dispatch => (
    new Promise((resolve, reject) => {
        insertDictionary(params)
            .then(res => {
                dispatch(receiveInsertDictionary(res.data));
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 跳转新增修改字典弹窗
const receiveDictionaryVisible = (data) => ({
    type: ActionType.MODIFY_DICTIONARY_VISIBLE,
    payload: data,
});

export const DictionaryVisible = (isShow) => dispatch =>
    dispatch(receiveDictionaryVisible(isShow));
