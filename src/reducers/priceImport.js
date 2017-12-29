/**
 * @file priceImport.js
 * @author liujinyu
 *
 */
import Immutable from 'immutable';
import ActionType from '../actions/ActionType';

const initState = Immutable.fromJS({
    priceImportlist: {},
    isSellVildBtn: {},
    createCell: {}
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.RECEIVE_PRICE_IMPORT_LIST:
            return state.set('priceImportlist', action.payload);
        case ActionType.RECEIVE_PRICE_IMPORT_SELL_VAILD:
            return state.set('isSellVildBtn', action.payload);
        case ActionType.RECEIVE_PRICE_IMPORT_CREATE_SELL:
            return state.set('createCell', action.payload);
        default:
            return state;
    }
}
