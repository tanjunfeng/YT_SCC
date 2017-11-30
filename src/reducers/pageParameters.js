/**
 * @file pageParameters.js
 * @author liujinyu
 *
 */
import Immutable from 'immutable';
import ActionType from '../actions/ActionType';

const initState = Immutable.fromJS({
    returnGoodsParams: {
        data: {},
        franchiseeIdName: '',
        branchCompany: { id: '', name: '' }
    },
    exchangeGoodsParams: {
        data: [],
        franchiseeIdName: '',
        branchCompany: { id: '', name: '' }
    }
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.RETURN_GOODS_LIST_FORM_DATA:
            return state.set('returnGoodsParams', action.payload);
        case ActionType.RECEIVE_EXCHANGE_GOODS_LIST:
            return state.set('exchangeGoodsParams', action.payload);
        case ActionType.RETURN_GOODS_LIST_FORM_DATA_CLEAR:
            return state.set('returnGoodsParams', action.payload)
        default:
            return state;
    }
}
