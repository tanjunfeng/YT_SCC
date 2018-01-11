/**
 * @file EditSteps.jsx
 * @author tanjunfeng liujinyu
 *
 * 售价审核列表
 */
import React from 'react';
import { Form, Row, Col, Table } from 'antd';
import { stepPriceColumns, stepPriceColumnsAfter } from './columns';

const FormItem = Form.Item;

export default (prop) => {
    const { newDatas = {}, isAfter } = prop;
    const data = newDatas.sellPricesInReview;
    const { sellSectionPrices = [] } = newDatas;
    const sellSectionPricesAfter = data ? data.sellSectionPrices : [];
    const forAfterColumns = () => {
        stepPriceColumnsAfter.forEach((val, i) => {
            stepPriceColumnsAfter[i].render = (text, record, index) => (
                <span className={sellSectionPrices[index] && sellSectionPrices[index][val.dataIndex] !== text ? 'sell-modal-color' : null} > {text}</span>
            )
        })
    }
    forAfterColumns()
    return (
        <div className="sell-modal-item item-max-height">
            {
                !isAfter
                    // 修改前
                    ? <div>
                        <div className="sell-modal-item-title">添加阶梯价格</div>
                        <div className="sell-modal-item-content">
                            <Table
                                rowKey="id"
                                columns={stepPriceColumns}
                                dataSource={sellSectionPrices}
                                pagination={false}
                            />
                        </div>
                        <Row>
                            <Col className="sell-prigce-edit-footer">
                                <FormItem label="建议零售价(元)：">
                                    <span className="sell-modal-day-input">
                                        {newDatas.suggestPrice || '-'}
                                    </span>
                                </FormItem>
                                <FormItem label="商品采购价格：">
                                    <span>{newDatas.purchasePrice || '-'}</span>
                                </FormItem>
                                <FormItem label="子公司：">
                                    <span>
                                        {newDatas.branchCompanyId} - {newDatas.branchCompanyName}
                                    </span>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    // 修改后
                    : <div>
                        <div className="sell-modal-item-title">添加阶梯价格</div>
                        <div className="sell-modal-item-content">
                            <Table
                                rowKey="id"
                                columns={stepPriceColumnsAfter}
                                dataSource={sellSectionPricesAfter}
                                pagination={false}
                            />
                        </div>
                        <Row>
                            <Col className="sell-prigce-edit-footer">
                                <FormItem label="建议零售价(元)：">
                                    <span className={
                                        data && data.suggestPrice !== newDatas.suggestPrice ?
                                            'sell-modal-border' : null}
                                    >{data ? data.suggestPrice : '-'}</span>
                                </FormItem>
                                <FormItem label="商品采购价格：">
                                    <span className={
                                        data && data.purchasePrice !== newDatas.purchasePrice ?
                                            'sell-modal-border' : null}
                                    >{newDatas.sellPricesInReview.state || '-'}</span>
                                </FormItem>
                                <FormItem label="子公司：">
                                    <span className={
                                        data && data.branchCompanyId !== newDatas.branchCompanyId ?
                                            'sell-modal-border' : null}
                                    >{data ? data.branchCompanyId : '-'} - {data ? data.branchCompanyName : '-'}</span>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
            }
        </div>
    )
}
