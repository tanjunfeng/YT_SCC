/**
 * @file categoryGoodsOrderNum.js
 * @author Tanjunfeng
 *
 */

import Immutable from 'immutable';
import ActionType from '../actions/ActionType';

const data = {};
const initState = Immutable.fromJS({
    // 修改分类商品排序号
    data: {},
    // 查询主数据列表
    categoryOrderList: {},

    // 控制弹出框显示影藏
    toAddPriceVisible: false,
    // 弹出框数据
    visibleData: {},
    // 新增分类商品排序
    toAddCategory: {},
    // 通过商品编号获取商品名称
    querygoodsname: '',
    // 模态框title
    toAddCategoryTitle: '',
    // 删除当前行数据
    deleteordernum: {}
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.UPDATE_CATEGORY:
            Object.assign(data, action.payload)
            return state.set('data', Immutable.fromJS(data));

        case ActionType.QUERY_GOODS_NAME:
            return state.set('querygoodsname', action.payload);

        case ActionType.PRODUCT_TO_ADD_CATEGORY: {
            const { isVisible, toAddCategoryTitle} = action.payload;
            return state.set(
                'toAddCategory',
            isVisible).set(
                'toAddCategoryTitle',
                toAddCategoryTitle
                );
        }

        case ActionType.MODIFY_CATEGORY_VISIBLE: {
            const { isVisible, record = {} } = action.payload;
            return state
                .set('toAddPriceVisible', isVisible)
                .set('visibleData', record)
        }

        case ActionType.RECEIVE_GET_CATEGORYS:
            Object.assign(data, action.payload)
            return state.set('categoryOrderList', Immutable.fromJS(data));
        case ActionType.MODIFY_DELETE_ORDER_NUM:
            Object.assign(data, action.payload)
            return state.set('deleteordernum', Immutable.fromJS(data));

        default:
            return state;
    }
}
