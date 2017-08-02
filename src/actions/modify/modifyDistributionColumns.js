/**
 * @file modifyDistributionColumns.js
 * @author caoyanxuan
 *
 * 订单管理详情页-配送信息-修改table值
 */
import ActionType from '../ActionType';

const receive = (index, value, witchInput) => ({
    type: ActionType.MODIFY_DISTRIBUTION_COLUMNS,
    payload: { index, value, witchInput },
});
export const modifyDistributionColumns = (
    index,
    value,
    witchInput
) => dispatch => dispatch(receive(
    index,
    value,
    witchInput
));
