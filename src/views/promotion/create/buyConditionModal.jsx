/**
 * @author taoqiyu
 *
 * 促销管理 - 新增下单打折 - 购买条件新增编辑模态框
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
    Form, Modal, Row, message
} from 'antd';

import { Category } from '../../../container/cascader';
import { AddingGoodsByTerm } from '../../../container/search';
import { buyType, getConditionType } from './domHelper';
import { isCategoryExist } from './dataHelper';
import Util from '../../../util/util';

import './buyConditionModal.scss';

const FormItem = Form.Item;

class BuyConditionModal extends PureComponent {
    state = {
        category: null
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.props.form.resetFields();
        }
    }

    getBuyCondition = (formData, values) => {
        const { buyCondition, buyConditionProduct } = values;
        const { category } = this.state;
        switch (buyCondition) {
            case 'ALL':
                break;
            case 'CATEGORY':
                Object.assign(formData, { promoCategories: category });
                break;
            case 'PRODUCT':
                Object.assign(formData, {
                    promoProduct: {
                        productId: buyConditionProduct.record.productId,
                        productName: buyConditionProduct.record.productName,
                    }
                });
                break;
            default: break;
        }
    }

    getBuyConditionValue = (formData, values) => {
        const { buyConditionType, buyConditionTypeQuantity, buyConditionTypeAmount } = values;
        let conditionValue = '';
        switch (buyConditionType) {
            case 'QUANTITY':
                conditionValue = buyConditionTypeQuantity;
                break;
            case 'AMOUNT':
                conditionValue = buyConditionTypeAmount;
                break;
            default: break;
        }
        Object.assign(formData, { conditionValue });
    }

    getFormData = (callback) => {
        this.props.form.validateFields((err, values) => {
            const { buyCondition, buyConditionType } = values;
            const { category } = this.state;
            if (err) {
                if (buyCondition === 'CATEGORY' && !isCategoryExist(category)) {
                    message.error('请选择品类');
                    return;
                }
                return;
            }
            const formData = {
                key: String(new Date().getTime()),
                purchaseType: buyCondition,
                conditionType: buyConditionType
            };
            this.getBuyCondition(formData, values);
            this.getBuyConditionValue(formData, values);
            if (typeof callback === 'function') {
                callback(Util.removeInvalid(formData));
            }
        });
    }

    handleCategorySelect = (category) => {
        this.setState({ category });
    }

    handleOk = () => {
        this.getFormData(data => {
            this.props.onOk(data);
        });
    }

    handleCancel = () => {
        this.props.onCancel();
    }

    render() {
        const { form, visible } = this.props;
        const { getFieldValue, getFieldDecorator } = form;
        return (
            <Modal
                title="购买条件"
                className="buy-condition-modal"
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Form layout="inline">
                    <Row>
                        {buyType(form, 'buyCondition')}
                        {getFieldValue('buyCondition') === 'CATEGORY' ?
                            <FormItem>
                                <Category onChange={this.handleCategorySelect} />
                            </FormItem> : null}
                        {getFieldValue('buyCondition') === 'PRODUCT' ?
                            <FormItem className="product">
                                {/* buyConditionProduct */}
                                {getFieldDecorator('buyConditionProduct', {
                                    initialValue: {
                                        productId: '',
                                        productCode: '',
                                        productName: ''
                                    }
                                })(<AddingGoodsByTerm />)}
                            </FormItem> : null}
                    </Row>
                    <Row>
                        {getConditionType(form, 'buyCondition')}
                    </Row>
                </Form>
            </Modal>
        );
    }
}

BuyConditionModal.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func
}

export default withRouter(Form.create()(BuyConditionModal));
