const columns = [{
    dataIndex: 'id',
    title: '区域组编码'
}, {
    dataIndex: 'areaGroupName',
    title: '区域组名称'
}, {
    dataIndex: 'branchCompanyId',
    title: '所属子公司',
    render: (text, record) => (
        record && record.branchCompanyId
            ? `${text} - ${record.branchCompanyName}`
            : '-'
    )
}, {
    dataIndex: 'operation',
    title: '操作'
}];

export default columns;
