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
    state = {
        category: null, // 品类
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.props.form.resetFields();
        }
    }

    getFormData = (callback) => {
        const { validateFields } = this.props.form;
        validateFields((err, values) => {
            const { buyCondition } = values;
            const { category } = this.state;
            if (err) {
                return;
            }
            switch (buyCondition) {
                case 'ALL': break;
                case 'CATEGORY': break;
                case 'PRODUCT': break;
                default: break;
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
     * 选择品类
     */
    handleCategorySelect = (category) => {
        this.setState({ category });
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
