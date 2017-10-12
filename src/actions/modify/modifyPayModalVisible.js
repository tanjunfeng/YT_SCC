/**
 * @file modifyPayModalVisible.js
 * @author wuxinwei
 *
 * 支付弹框显示和控制
 */
import ActionType from '../ActionType';

// 订单管理-取消
const payModal = (data) => ({
    type: ActionType.MODIFY_PAY_MODAL_VISIBLE,
    payload: data,
});

export const modifyPayModalVisible = (isShow) => dispatch => dispatch(payModal(isShow));
