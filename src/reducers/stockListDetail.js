/**
 * @file stockListDetail.js
 * @author tanJf
 *
 */
import Immutable from 'immutable';
import ActionType from '../actions/ActionType';

const initState = Immutable.fromJS({
    data: {},
    sum: {}
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.STOCK_ADJUST_LIST_CB_DETAIL:
            const imAdjustmentItemVos = action.payload.data.imAdjustmentItemVos;
            let sumSl = 0;
            let sumCbe = 0;
            imAdjustmentItemVos.map((item) => {
                sumSl += item.quantity;
                sumCbe += item.adjustmentCost;
            })
            return state.set('data', action.payload).set('sum', {sumSl, sumCbe});

        default:
            return state;
    }
}
