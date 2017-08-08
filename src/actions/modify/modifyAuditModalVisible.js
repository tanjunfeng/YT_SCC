/**
 * @file modifyAuditModalVisible.js
 * @author caoyanxuan
 *
 * 弹框显示控制
 */
import ActionType from '../ActionType';

// 订单管理-取消
const receiveCause = (data) => ({
    type: ActionType.MODIFY_CAUSE_MODAL_VISIBLE,
    payload: data,
});
export const modifyCauseModalVisible = (isShow) => dispatch => dispatch(receiveCause(isShow));
