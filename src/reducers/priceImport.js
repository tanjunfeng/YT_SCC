/**
 * @file priceImport.js
 * @author liujinyu
 *
 */
import Immutable from 'immutable';
import ActionType from '../actions/ActionType';

const initState = Immutable.fromJS({
    priceImportlist: {}
});

export default function (state = initState, action) {
    switch (action.type) {
        case ActionType.RECEIVE_PRICE_IMPORT_LIST:
            return state.set('priceImportlist', action.payload);
        default:
            return state;
    }
}
