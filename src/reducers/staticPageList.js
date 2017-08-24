/**
 * @file staticPageList.js
 * @author Tanjunfeng
 *
 */

import Immutable from 'immutable';
import ActionType from '../actions/ActionType';

const data = {};
const initState = Immutable.fromJS({
    // 修改分类商品排序号
    data: {},

    // 静态页面列表查询
    findStaticPageLists: {},

    // 控制弹出框显示影藏
    toAddPriceVisible: false,

    // 弹出框数据
    visibleData: {},

});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.UPDATE_CATEGORYz: {
            Object.assign(data, action.payload)
            return state.set('data', Immutable.fromJS(data));
        }

        case ActionType.MODIFY_MEDIAADD_VISIBLE: {
            const { record, isVisible } = action.payload;
            return state.set('toAddPriceVisible', isVisible).set('visibleData', record);
        }

        case ActionType.RECEIVE_GET_MEDIA_MANAGEMENT:
            Object.assign(data, action.payload)
            return state.set('findStaticPageLists', Immutable.fromJS(data));

        default:
            return state;
    }
}
