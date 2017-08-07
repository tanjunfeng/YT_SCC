/**
 * @file fetchGoods.js
 *
 * @author wtt
 *
 * 获取商品分类
 */

import Promise from 'bluebird';
import {
    dictionaryList,
    dictionaryContentList,
    insertDictionary,
    updateDictionary,
    deleteDictionary,
    updateContent,
    insertDictionaryContent
} from '../service';
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

// 查询显示字典维护内容列表
const receiveContentlist = (data) => ({
    type: ActionType.RECEIVE_DICTIONARY_CONTENTLIST,
    payload: data,
});

export const Dictionarycontentlist = (params) => dispatch => (
    new Promise((resolve, reject) => {
        dictionaryContentList(params)
            .then(res => {
                dispatch(receiveContentlist(res.data));
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 修改字典内容或设置状态
const receiveUpdateDictionary = (data) => ({
    type: ActionType.REQUEST_INSERT_DICTIONARY,
    payload: data,
});

export const UpdateDictionary = (params) => dispatch => (
    new Promise((resolve, reject) => {
        updateDictionary(params)
            .then(res => {
                dispatch(receiveUpdateDictionary(res.data));
                resolve(res.data);
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
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 删除数据字典
const receiveDeleteDictionary = (data) => ({
    type: ActionType.REQUEST_INSERT_DICTIONARY,
    payload: data,
});

export const DeleteDictionary = (params) => dispatch => (
    new Promise((resolve, reject) => {
        deleteDictionary(params)
            .then(res => {
                dispatch(receiveDeleteDictionary(res.data));
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 修改字典内容或设置状态
const receiveUpdateContent = (data) => ({
    type: ActionType.REQUEST_UPDATE_CONTENT,
    payload: data,
});

export const updateContentData = (params) => dispatch => (
    new Promise((resolve, reject) => {
        updateContent(params)
            .then(res => {
                dispatch(receiveUpdateContent(res.data));
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            })
    })
)

// 新增数据字典内容
const receiveDictionaryContent = (data) => ({
    type: ActionType.REQUEST_INSERT_DICTIONARY_CONTENT,
    payload: data,
});

export const dictionaryContent = (params) => dispatch => (
    new Promise((resolve, reject) => {
        insertDictionaryContent(params)
            .then(res => {
                dispatch(receiveDictionaryContent(res.data));
                resolve(res.data);
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

// 跳转维护字典内容弹窗
const receiveDicContentListVisible = (data) => ({
    type: ActionType.MAINTENANCE_DICTIONARY_VISIBLE,
    payload: data,
});

export const DicContentListVisible = (isShow) => dispatch =>
    dispatch(receiveDicContentListVisible(isShow));
