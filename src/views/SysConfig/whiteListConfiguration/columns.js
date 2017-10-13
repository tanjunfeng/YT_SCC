/*
 * @Author: tanjf
 * @Description: 白名单配置列表
 * @CreateDate: 2017-09-20 14:06:42
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-10-13 13:52:19
 */
const couponList = [{
    title: '所属子公司',
    dataIndex: 'branchCompanyName',
    key: 'branchCompanyName'
}, {
    title: '加盟商编号',
    dataIndex: 'franchiseeId',
    key: 'franchiseeId'
}, {
    title: '加盟商名称',
    dataIndex: 'franchinessName',
    key: 'franchinessName'
}, {
    title: '门店编号',
    dataIndex: 'storeId',
    key: 'storeId'
},
{
    title: '门店名称',
    dataIndex: 'storeName',
    key: 'storeName'
}, {
    title: '省',
    dataIndex: 'provinceName',
    key: 'provinceName',
}, {
    title: '市',
    dataIndex: 'cityName',
    key: 'cityName',
}, {
    title: '区',
    dataIndex: 'districtName',
    key: 'districtName',
}, {
    title: '详细地址',
    dataIndex: 'address',
    key: 'address',
}, {
    title: '联系人',
    dataIndex: 'contact',
    key: 'contact',
}, {
    title: '联系电话',
    dataIndex: 'mobilePhone',
    key: 'mobilePhone'
}, {
    title: '上线状态',
    dataIndex: 'scPurchaseFlag',
    key: 'scPurchaseFlag'
}, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: scPurchaseFlag => (scPurchaseFlag === '已上线' ? '下线' : '上线')
}];

export { couponList };
