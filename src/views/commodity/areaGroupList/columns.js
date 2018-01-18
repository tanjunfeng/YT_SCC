const columns = [{
    dataIndex: 'areaGroupCode',
    title: '区域组编码'
}, {
    dataIndex: 'areaGroupName',
    title: '区域组名称'
}, {
    dataIndex: 'branchCompany',
    title: '所属子公司',
    render: company => (company && company.name ? `${company.id} - ${company.name}` : '-')
}, {
    dataIndex: 'operation',
    title: '操作'
}];

export default columns;
