/**
 * @file addSupplier.js
 * @author shijh
 *
 */

import Immutable, { fromJS } from 'immutable';
import ActionType from '../actions/ActionType';

const findIndex = (arr, id) => {
    console.log(arr);
    console.log(id);
    for (let i = 0; i < arr.length; i++) {
        if (parseInt(arr[i].id, 10) === parseInt(id, 10)) {
            return i;
        }
    }
    return -1;
}

const data = {};
const initState = Immutable.fromJS({
    data: {},
    // 大地区数据
    largeRegin: [],
    // 仓库信息列表
    warehouseInfo: [],
    // 仓库信息详细列表
    warehouseData: []
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.ADD_SUPPLIER_MESSAGE:
            Object.assign(data, action.payload)
            return state.set('data', Immutable.fromJS(data));

        case ActionType.RECEIVE_LARGER_REGIN:
            return state.set('largeRegin', fromJS(action.payload))

        case ActionType.RECEIVE_WARE_HOUSE:
            return state.set('warehouseInfo', fromJS(action.payload));

        case ActionType.RECEIVE_WARE_HOUSE_INFO: {
            const warehouseData = state.toJS().warehouseData;
            warehouseData.push(action.payload);
            return state.set('warehouseData', fromJS(warehouseData));
        }

        case ActionType.RECEIVE_DELETE_WARE_HOUSE_INFO: {
            const { id } = action.payload;
            const warehouseData = state.toJS().warehouseData;
            const index = findIndex(warehouseData, id);
            if (index > -1) {
                warehouseData.splice(index, 1);
            }
            return state.set('warehouseData', fromJS(warehouseData));
        }

        case ActionType.RECEIVE_INSERT_SUPPLIER_ADDRESS: {
            return state.set('insert', action.payload);
        }

        default:
            return state;
    }
}
