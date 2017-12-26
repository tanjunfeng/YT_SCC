/**
 * @file mediaManage.js
 * @author Tanjunfeng
 *
 */

import Immutable from 'immutable';
import ActionType from '../actions/ActionType';

const data = {};
const initState = Immutable.fromJS({
    // 静态页面列表查询
    findstaticpagelist: {},
    // 新增静态页
    insertstaticpage: {},

    // 修改静态页面基本信息
    updatestaticpagebase: {},

    // 控制弹出框显示影藏
    toAddPriceVisible: false,

    // 弹出框数据
    visibleData: {},

    // 模态框title
    toAddMediaTitle: '',

    // 删除当前行数据
    deleteordernum: {},

    // 页面编辑查询数据
    editorList: {}

});

export default function (state = initState, action) {
    const datas = action.payload;
    switch (action.type) {
        case ActionType.RECEIVE_GET_MEDIA_EDITOR:
            Object.assign(data, action.payload)
            return state.set('editorList', Immutable.fromJS(data));

        case ActionType.RECEIVE_GET_MEDIA_MANAGEMENT:
            Object.assign(data, action.payload)
            return state.set('findstaticpagelist', Immutable.fromJS(data));

        case ActionType.PRODUCT_TO_ADD_MANAGEMENT:
            Object.assign(data, action.payload)
            return state.set('insertstaticpage', Immutable.fromJS(datas));

        case ActionType.UPDATE_STATIC_PAGESBASE:
            Object.assign(data, action.payload)
            return state.set('visibleData')
                .set('updatestaticpagebase', Immutable.fromJS(data));

        case ActionType.PRODUCT_TO_ADD_CATEGORY: {
            const { isVisible, toAddMediaTitle } = action.payload;
            return state.set(
                'toAddCategory',
                isVisible
            ).set('visibleData').set('toAddMediaTitle', toAddMediaTitle);
        }

        case ActionType.MODIFY_MEDIAADD_VISIBLE: {
            const { isVisible, record = {}, toAddMediaTitle } = action.payload;
            return state.set(
                'toAddPriceVisible',
                isVisible
            ).set('visibleData', record).set('toAddMediaTitle', toAddMediaTitle);
        }
        case ActionType.MODIFY_DELETE_ORDER_NUM:
            Object.assign(data, action.payload)
            return state.set('deleteordernum', Immutable.fromJS(data));

        default:
            return state;
    }
}
