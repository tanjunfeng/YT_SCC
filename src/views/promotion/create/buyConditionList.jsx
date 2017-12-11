/**
 * @author taoqiyu
 *
 * 促销管理 - 新增下单打折 - 购买条件
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
    Form, Row, Button
} from 'antd';

import { Category } from '../../../container/cascader';
import { AddingGoodsByTerm } from '../../../container/search';
import { buyType, conditionType, getRulesColumn } from './domHelper';
import BuyConditionModal from './buyConditionModal';

const FormItem = Form.Item;

class BuyConditionList extends PureComponent {
    state = {
        visible: false, // 是否显示模态框
        conditions: [] // 购买条件
    }

    handleAddCondition = () => {
        this.setState({ visible: true })
    }

    handleModalOk = () => {
        this.setState({ visible: false});
    }

    handleModalCancel = () => {
        this.setState({ visible: false});
    }

    render() {
        const { form } = this.props;
        const { getFieldValue, getFieldDecorator } = form;
        const { visible } = this.state;
        return (
            <ul className="list-panel">
                <li>
                    <h2>购买条件</h2>
                    <Button type="primary" onClick={this.handleAddCondition}>添加条件</Button>
                </li>
                <li>
                    <Row>
                        <div className="wd-396">
                            {buyType(form, 'licence')}
                            {getFieldValue('licence') === 'CATEGORY' ?
                                <FormItem>
                                    <Category onChange={this.handleCategorySelect} />
                                </FormItem> : null}
                            {getFieldValue('licence') === 'PRODUCT' ?
                                <FormItem className="product">
                                    {/* purchaseConditionProduct */}
                                    {getFieldDecorator('licenceProduct', {
                                        initialValue: {
                                            productId: '',
                                            productCode: '',
                                            productName: ''
                                        }
                                    })(<AddingGoodsByTerm />)}
                                </FormItem> : null}
                        </div>
                        <div className="wd-317"> {conditionType(form, 'licence')}</div>
                        <div className="wd-297">
                            {getRulesColumn(form, 'licence', getFieldValue('licence'))}
                        </div>
                    </Row>
                </li>
                <BuyConditionModal
                    visible={visible}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}
                />
            </ul>
        );
    }
}

BuyConditionList.propTypes = {
    form: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(BuyConditionList));
