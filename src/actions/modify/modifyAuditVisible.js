/**
 * @file modifyAuditVisible.js
 *
 * @author shijh
 * 弹框显示控制
 */

import Promise from 'bluebird';
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.MODIFY_AUDIT_VISIBLE,
    payload: data,
});

export default (isShow) => dispatch => dispatch(receive(isShow));
