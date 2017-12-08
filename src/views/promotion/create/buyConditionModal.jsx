/**
 * @author taoqiyu
 *
 * 促销管理 - 新增下单打折 - 购买条件新增编辑模态框
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
    Form, Modal, Row
} from 'antd';

import { Category } from '../../../container/cascader';
import { AddingGoodsByTerm } from '../../../container/search';
import { buyType, conditionType, getRulesColumn } from './domHelper';
import Util from '../../../util/util';

import './buyConditionModal.scss';

const FormItem = Form.Item;

class BuyConditionModal extends PureComponent {
    getFormData = (callback) => {
        const { validateFields } = this.props.form;
        validateFields((err, values) => {
            const { buyCondition } = values;
            const { category } = this.state;
            if (err) {
                return;
            }
            // 使用条件 0: 不限制，1: 指定条件
            const dist = {};
            if (typeof callback === 'function') {
                callback(Util.removeInvalid(dist));
            }
        });
    }

    handleOk = () => {
        this.getFormData(() => {
            this.props.onOk();
        });
    }

    handleCancel = () => {
        this.props.onCancel();
    }

    /**
     * 购买条件品类选择器
     *
     * PC = PURCHASECONDITION
     */
    handleCategorySelect = (category) => {
        this.setState({ category });
    }

    render() {
        const { form, visible } = this.props;
        const { getFieldValue, getFieldDecorator } = form;
        return (
            <Modal
                className="buy-condition-modal"
                title="购买条件"
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
                        {conditionType(form, 'buyCondition')}
                    </Row>
                    <Row>
                        {getRulesColumn(form, 'buyCondition', getFieldValue('buyCondition'))}
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
    onCancel: PropTypes.func,
}

export default withRouter(Form.create()(BuyConditionModal));
