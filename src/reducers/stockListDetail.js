/**
 * @file stockListDetail.js
 * @author zhangbaihua
 *
 */
import Immutable from 'immutable';
import ActionType from '../actions/ActionType';

const initState = Immutable.fromJS({
    data: {},
    sum: '',
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.STOCK_ADJUST_LIST_DETAIL:
            const imAdjustmentItemVos = action.payload.data.imAdjustmentItemVos;
            let sum = 0;
            imAdjustmentItemVos.map((item) => {
                sum += item.quantity
            })
            return state.set('data', action.payload).set('sum', sum);

        default:
            return state;
    }
}
