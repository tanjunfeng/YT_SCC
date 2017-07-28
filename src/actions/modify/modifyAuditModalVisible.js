
/**
 * @file modifyAuditModalVisible.js
 *
 * @author caoyanxuan
 *
 * 弹框显示控制
 */
import ActionType from '../ActionType';

const receive = (data) => ({
    type: ActionType.MODIFY_AUDIT_MODAL_VISIBLE,
    payload: data,
});
// 搜索推荐配置页-模态框(cyx)
export const modifyAuditModalVisible = (isShow) => dispatch => dispatch(receive(isShow));
