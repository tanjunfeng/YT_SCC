/**
 * @file app.jsx
 * @author tangjunfeng liujinyu
 * 商品采购关系维护
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, InputNumber, Checkbox, Input } from 'antd';

const FormItem = Form.Item;

class ProdModal extends Component {
    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.state = {
            checked: props.getProdPurchaseByIds.supplierType === 1
        }
    }

    /**
     * 弹出层取消事件
     */
    handleCancel() {
        this.props.handleClose();
    }

    render() {
        const {
            getProdPurchaseByIds
        } = this.props;
        const prefixCls = 'purchase-modal'
        const firstCreated = () => {
            switch (getProdPurchaseByIds.firstCreated) {
                case 0:
                    return getProdPurchaseByIds.modifyUserName;
                case 1:
                    return getProdPurchaseByIds.createUserName;
                default:
                    return null;
            }
        }
        return (
            <Modal
                title="采购价格"
                visible
                className="purchase-examination-modal"
                onOk={this.handleCancel}
                width={'480px'}
                onCancel={this.handleCancel}
                maskClosable={false}
            >
                <div className={`${prefixCls}-body-wrap`}>
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <div className={`${prefixCls}-item`}>
                            <div className={`${prefixCls}-item-title`}>货运条件</div>
                            <div>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>*采购内装数：</span>
                                    <span className={`${prefixCls}-barcode-input`}>
                                        <InputNumber defaultValue={getProdPurchaseByIds.purchaseInsideNumber || '-'} readOnly />
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>*当前采购价(元)：</span>
                                    <span className={`${prefixCls}-barcode-input`}>
                                        <InputNumber placeholder="当前采购价" defaultValue={getProdPurchaseByIds.purchasePrice || '-'} readOnly />
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>*最新采购价(元)：</span>
                                    <span className={`${prefixCls}-barcode-input`}>
                                        <InputNumber defaultValue={getProdPurchaseByIds.newestPrice || '-'} readOnly />
                                    </span>
                                    <span className={`${prefixCls}-adjustment`}>
                                        调价百分比：{getProdPurchaseByIds.percentage || '-'}%
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>*条  码：</span>
                                    <span className={`${prefixCls}-barcode-input`}>
                                        <Input defaultValue={getProdPurchaseByIds.internationalCode || '-'} readOnly />
                                    </span>
                                </FormItem>
                                <div className={`${prefixCls}-sub-state`}>
                                    <FormItem>
                                        <span className={`${prefixCls}-label`}>最新采购价格状态：</span>
                                        <span><i className={`new-price-state-${getProdPurchaseByIds.auditStatus}`} />{getProdPurchaseByIds.newestPrice || '-'}</span>
                                    </FormItem>
                                    <FormItem>
                                        <span className={`${prefixCls}-label`}>提交人：</span>
                                        <span>{firstCreated() || '-'}</span>
                                    </FormItem>
                                    <FormItem>
                                        <span className={`${prefixCls}-label`}>审核人：</span>
                                        <span>{getProdPurchaseByIds.auditUserName || '-'}</span>
                                    </FormItem>
                                </div>
                            </div>
                        </div>
                        <div className={`${prefixCls}-item`}>
                            <div>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>*供应商：</span>
                                    <span className={`${prefixCls}-data-pic`}>
                                        <Input
                                            placeholder="供应商"
                                            readOnly
                                            defaultValue={
                                                `${getProdPurchaseByIds.spNo} - ${getProdPurchaseByIds.spName}`
                                            }
                                            style={{ width: '230px' }}
                                        />
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>*供应商地点：</span>
                                    <span className={`${prefixCls}-data-pic`}>
                                        <Input
                                            placeholder="供应商地点"
                                            readOnly
                                            defaultValue={
                                                `${getProdPurchaseByIds.spAdrId} - ${getProdPurchaseByIds.spAdrName}`
                                            }
                                            style={{ width: '230px' }}
                                        />
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>送货仓：</span>
                                    <span className={`${prefixCls}-data-pic`}>
                                        <Input
                                            placeholder="送货仓"
                                            readOnly
                                            defaultValue={
                                                `${getProdPurchaseByIds.distributeWarehouseId} - ${getProdPurchaseByIds.distributeWarehouseName}`}
                                            style={{ width: '230px' }}
                                        />
                                    </span>
                                </FormItem>
                                <FormItem>
                                    <span className={`${prefixCls}-label`}>主供应商：</span>
                                    <span className={`${prefixCls}-warehouse-input`}>
                                        <Checkbox
                                            checked={this.state.checked}
                                        />
                                    </span>
                                </FormItem>
                            </div>
                        </div>
                    </Form>
                </div>
            </Modal>
        );
    }
}

ProdModal.propTypes = {
    handleClose: PropTypes.func,
    getProdPurchaseByIds: PropTypes.objectOf(PropTypes.any)
};

export default ProdModal;
