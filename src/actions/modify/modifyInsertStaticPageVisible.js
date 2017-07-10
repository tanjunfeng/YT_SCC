/**
 * @file modifyCategoryVisible.js
 *
 * @author Tanjunfeng
 * 弹框显示控制
 */

import Promise from 'bluebird';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.MODIFY_MEDIA_VISIBLE,
    payload: data,
});

export default (isShow) => dispatch => dispatch(receive(isShow));
