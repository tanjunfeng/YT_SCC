/*
 * @Author: tanjf
 * @Description: 优惠券列表
 * @CreateDate: 2017-09-20 14:06:42
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-09-21 16:57:44
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

const releaseCouponsColumns = [{
    title: '券ID',
    dataIndex: 'id',
    key: 'id'
}, {
    title: '券名称',
    dataIndex: 'promotionName',
    key: 'promotionName'
}, {
    title: '面额',
    dataIndex: 'discount',
    key: 'discount'
}, {
    title: '品类',
    dataIndex: 'promoCategoriesPo',
    key: 'promoCategoriesPo'
}, {
    title: '使用区域',
    dataIndex: 'branchCompanyId',
    key: 'branchCompanyId'
}, {
    title: '使用条件',
    dataIndex: 'quanifyAmount',
    key: 'quanifyAmount',
    render: amount => (`满${amount}可用`)
}, {
    title: '有效日期',
    dataIndex: 'branchCompanyId',
    key: 'branchCompanyId'
}, {
    title: '发放数量',
    dataIndex: 'branchCompanyId',
    key: 'branchCompanyId'
}, {
    title: '已领取',
    dataIndex: 'branchCompanyId',
    key: 'branchCompanyId'
}, {
    title: '已使用',
    dataIndex: 'branchCompanyId',
    key: 'branchCompanyId'
}, {
    title: '备注',
    dataIndex: 'note',
    key: 'note'
}];

export { grantCouponsColumns, releaseCouponsColumns };
