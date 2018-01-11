/**
 * @file FreightConditions.jsx
 * @author tanjunfeng liujinyu
 *
 * 售价审核列表
 */
import React from 'react';
import { Form, InputNumber } from 'antd';

const FormItem = Form.Item;
export default (prop) => {
    const { newDatas = {}, isAfter } = prop;
    const data = newDatas.sellPricesInReview;
    const forSellFullCase = () => {
        if (data) {
            return data.sellFullCase === 1 ? '是' : '否'
        }
        return '-'
    }
    const procurementModel = (item) => {
        if (item) {
            return item.preHarvestPinStatus === 0 ? '先销后采' : '先采后销'
        }
        return '-'
    }
    return (
        <div className="sell-modal-body-wrap">
            {
                !isAfter
                    // 修改前
                    ? <Form
                        layout="inline"
                        onSubmit={this.handleSubmit}
                    >
                        <div className="sell-modal-item last-freightConditions">
                            <div className="sell-modal-item-title">货运条件</div>
                            <div className="sell-modal-item-content">
                                <FormItem>
                                    <span>*销售内装数：</span>
                                    <span>
                                        <InputNumber
                                            defaultValue={newDatas.salesInsideNumber || '-'}
                                            readOnly
                                        />
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span>*起订量：</span>
                                    <span>
                                        <InputNumber
                                            defaultValue={newDatas.minNumber || '-'}
                                            readOnly
                                        />
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span>*最大销售数量：</span>
                                    <span>
                                        <InputNumber
                                            defaultValue={newDatas.maxNumber || '-'}
                                            readOnly
                                        />
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span>*承诺发货时间：下单后</span>
                                    <span className="sell-modal-day-input">
                                        <InputNumber
                                            min={0}
                                            defaultValue={newDatas.deliveryDay || '-'}
                                            readOnly
                                        />
                                    </span>
                                    天内发货
                                </FormItem>
                                <FormItem>
                                    <span>是否整箱销售:</span>
                                    <span className="sell-modal-day-input">
                                        {newDatas.sellFullCase === 1 ? '是' : '否'}
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span>整箱销售单位:</span>
                                    <span className="sell-modal-day-input">
                                        {newDatas.fullCaseUnit || '-'}
                                    </span>
                                </FormItem>
                                {/* 采购模式 */}
                                <FormItem className="sell-modal-qy">
                                    <span className="sell-modal-select"> 采购模式 : </span>
                                    <span className="sell-modal-day-input">
                                        {procurementModel(newDatas)}
                                    </span>
                                </FormItem>
                            </div>
                        </div>
                    </Form>
                    // 修改后
                    : <Form layout="inline">
                        <div className="sell-modal-item last-freightConditions">
                            <div className="sell-modal-item-title">货运条件</div>
                            <div className="sell-modal-item-content">
                                <FormItem>
                                    <span>*销售内装数：</span>
                                    <span className={
                                        data && data.salesInsideNumber
                                            !== newDatas.salesInsideNumber ?
                                            'sell-modal-border' : null}
                                    >{data ? data.salesInsideNumber : '-'}</span>
                                </FormItem>
                                <FormItem>
                                    <span>*起订量：</span>
                                    <span className={
                                        data && data.minNumber !== newDatas.minNumber ?
                                            'sell-modal-border' : null}
                                    >{data ? data.minNumber : '-'}</span>
                                </FormItem>
                                <FormItem>
                                    <span>*最大销售数量：</span>
                                    <span className={
                                        data && data.maxNumber !== newDatas.maxNumber ?
                                            'sell-modal-border' : null}
                                    >{data ? data.maxNumber : '-'}</span>
                                </FormItem>
                                <FormItem>
                                    <span>*承诺发货时间：下单后</span>
                                    <span className={
                                        data && data.deliveryDay !== newDatas.deliveryDay ?
                                            'sell-modal-border' : null}
                                    >{data ? data.deliveryDay : '-'}</span>
                                    天内发货
                                </FormItem>
                                <FormItem>
                                    <span>是否整箱销售:</span>
                                    <span>{forSellFullCase()}</span>
                                </FormItem>
                                <FormItem>
                                    <span>整箱销售单位:</span>
                                    <span>{data && data.fullCaseUnit ? data.fullCaseUnit : '-'}</span>
                                </FormItem>
                                {/* 采购模式 */}
                                <FormItem className="sell-modal-qy">
                                    <span className="sell-modal-select"> 采购模式 : </span>
                                    <span>{procurementModel(data)}</span>
                                </FormItem>
                            </div>
                        </div>
                    </Form>
            }
        </div >
    )
}
