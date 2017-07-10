
/**
 * @file modifyUpdatePageBase.js
 *
 * @author Tanjunfeng
 *
 * 修改静态页面基本信息
 */
import Promise from 'bluebird';
import { updatestaticpagebase } from '../../service';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.UPDATE_STATIC_PAGESBASE,
    payload: data,
});

export default (params) => dispatch => (
    new Promise((resolve, reject) => {
        updatestaticpagebase(params)
            .then(res => {
                // dispatch(receive(res.data));
                resolve(res.message);
            })
            .catch(error => {
                reject(error);
            })
    })
)
