/*
 * @Author: tanjf
 * @Description: 优惠券列表
 * @CreateDate: 2017-09-20 14:06:42
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-09-21 16:57:44
 */
/**
 * @file columns.js
 * @author taoqiyu
 *
 * 促销活动列表
 */

// 发放优惠券列表
const grantCouponsColumns = [{
    title: '加盟商编号',
    dataIndex: 'franchiseeId',
    key: 'franchiseeId',
    render: note => note || '无'
}, {
    title: '加盟商名称',
    dataIndex: 'franchinessController',
    key: 'franchinessController',
    render: note => note || '无'
}, {
    title: '门店编号',
    dataIndex: 'storeId',
    key: 'storeId',
    render: note => note || '无'
}, {
    title: '门店名称',
    dataIndex: 'storeName',
    key: 'storeName',
    render: note => note || '无'
}, {
    title: '加盟商姓名',
    dataIndex: 'proName',
    key: 'proName',
    render: note => note || '无'
}, {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone',
    render: note => note || '无'
}, {
    title: '所属子公司',
    dataIndex: 'branchCompanyId',
    key: 'branchCompanyId',
    render: note => note || '无'
}];

export { grantCouponsColumns };
