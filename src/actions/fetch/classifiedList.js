/**
 * @file fectchClassifiedList.js
 * @author denglingbo
 *
 */
import Promise from 'bluebird';
import { fetchClassifiedList } from '../../service';
import ActionType from '../ActionType';
import { ClassifiedList } from '../../view-model';

export const receiveClassifiedList = (data) => ({
    type: ActionType.RECEIVE_CLASSIFIED_LIST,
    payload: data,
});

export default (params) => dispatch => (
    fetchClassifiedList(params)
        .then(res => {
            dispatch(
                receiveClassifiedList(
                    ClassifiedList(res.data)
                )
            );
        })
        .catch(err => Promise.reject(err))
)
