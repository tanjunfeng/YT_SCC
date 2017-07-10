/**
 * @file modifyInformationVisible.js
 *
 * @author shijh
 * 弹框显示控制
 */

import Promise from 'bluebird';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.MODIFY_INFORMATION_VISIBLE,
    payload: data,
});

export default (isShow) => dispatch => dispatch(receive(isShow));
