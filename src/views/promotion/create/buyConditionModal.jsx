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
import { getFormData } from './dataHelper';

import './buyConditionModal.scss';

const FormItem = Form.Item;

class BuyConditionModal extends PureComponent {
    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.props.form.resetFields();
        }
    }

    handleOk = () => {
        getFormData({ state: this.state, form: this.props.form }, data => {
            console.log(data);
            this.props.onOk();
        });
    }

    handleCancel = () => {
        this.props.onCancel();
    }

    /**
     * 选择品类
     */
    handleCategorySelect = (categoryRL) => {
        this.props.onCategoryChange(categoryRL);
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
    onCategoryChange: PropTypes.func,
}

export default withRouter(Form.create()(BuyConditionModal));
