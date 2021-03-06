export const logisticsList = {
    defaultValue: '',
    data: [{
        key: '',
        value: '全部'
    }, {
        key: '0',
        value: '直送'
    }, {
        key: '1',
        value: '配送'
    }]
};

export const placeTypeListQuery = {
    defaultValue: '',
    data: [{
        key: '',
        value: '全部'
    }, {
        key: '2',
        value: '区域组'
    }, {
        key: '3',
        value: '门店'
    }]
};

export const logisticsModelStr = {
    0: '直送',
    1: '配送'
};

export const placeFieldMap = {
    // 子公司 取id字段
    1: 'id',
    // 区域 取areaGroupCode字段
    2: 'id',
    // 门店 取id字段
    3: 'id'
};

// 商品类别映射
export const productLevel = [
    'firstLevelCategoryId',
    'secondLevelCategoryId',
    'thirdLevelCategoryId',
    'fourthLevelCategoryId'
];

export const placeTypeListCreate = {
    defaultValue: '',
    data: [
        {
            key: '',
            value: '--请选择--'
        }, {
            key: '1',
            value: '子公司'
        }, {
            key: '2',
            value: '区域组'
        }, {
            key: '3',
            value: '门店'
        }]
};

