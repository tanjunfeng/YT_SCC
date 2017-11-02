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
        branchCompany: null
    }
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.RETURN_GOODS_LIST_FORM_DATA:
            return state.set('returnGoodsParams', action.payload);
        default:
            return state;
    }
}
