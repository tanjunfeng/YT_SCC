/*
 * @Author: tanjf
 * @Description: 优惠券列表
 * @CreateDate: 2017-09-20 14:06:42
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-09-26 19:54:10
 */
/**
 * @file columns.js
 * @author chenghaojie
 *
 * 促销活动列表
 */

import Util from '../../util/util';

const processOverview = [{
    title: '流程名称',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '发布时间',
    dataIndex: 'deploymentTime',
    key: 'deploymentTime'
}, {
    title: '操作',
    dataIndex: 'operating',
    key: 'operating'
}];
const processDetails = [{
    title: 'ID',
    dataIndex: 'id',
    key: 'id'
}, {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '流程定义的KEY',
    dataIndex: 'key',
    key: 'key'
}, {
    title: '流程定义的版本',
    dataIndex: 'version',
    key: 'version'
}, {
    title: '流程定义的规则文件名称',
    dataIndex: 'resourceName',
    key: 'resourceName'
}, {
    title: '流程定义的规则图片名称',
    dataIndex: 'diagramResourceName',
    key: 'diagramResourceName'
}, {
    title: '部署ID',
    dataIndex: 'deploymentId',
    key: 'deploymentId'
}, {
    title: '操作',
    dataIndex: 'operating',
    key: 'operating',
    render: timestamp => Util.getTime(timestamp)
}];

export {processOverview, processDetails};
