/**
 * @author taoqiyu
 *
 * 促销管理 - 新增下单打折 - 购买条件
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    Form, Row, Button, Popconfirm
} from 'antd';

import BuyConditionModal from './buyConditionModal';

const FormItem = Form.Item;

class BuyConditionList extends PureComponent {
    state = {
        visible: false // 是否显示模态框
    }

    getRow = (condition) => (
        <li key={condition.key}>
            <Row>
                {this.getBuyType(condition)}
                {this.getConditionType(condition)}
                <div className="wd-297 tr pr-60">
                    <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(condition.key)}>
                        <a href="#">删除</a>
                    </Popconfirm>
                </div>
            </Row>
        </li>
    )

    getConditionType = (condition) => {
        switch (condition.conditionType) {
            case 'AMOUNT':
                return (
                    <div className="wd-317">累计商品金额：{condition.conditionValue}元</div>
                );
            case 'QUANTITY':
                return (
                    <div className="wd-317">累计商品数量：{condition.conditionValue}</div>
                );
            default: return null;
        }
    }

    getBuyType = (condition) => {
        switch (condition.purchaseType) {
            case 'CATEGORY': return (
                <div className="wd-396">
                    <FormItem label="购买类型">
                        按品类，{condition.promoCategories.categoryName}
                    </FormItem>
                </div>
            );
            case 'PRODUCT': return (
                <div className="wd-396">
                    <FormItem label="购买类型">
                        按商品，{condition.promoProduct.productName}
                    </FormItem>
                </div>
            );
            case 'ALL': return (
                <div className="wd-396">
                    <FormItem label="购买类型">
                        全部
                    </FormItem>
                </div>
            );
            default: return null;
        }
    }

    handleDelete = (key) => {
        const conditions = [...this.props.value.conditions];
        const indexToDel = conditions.findIndex(c => c.key === key);
        conditions.splice(indexToDel, 1);
        this.props.onChange(conditions);
    }

    handleAddCondition = () => {
        this.setState({ visible: true })
    }

    handleModalOk = (data) => {
        const conditions = [...this.props.value.conditions];
        conditions.push(data);
        this.setState({ visible: false });
        this.props.onChange(conditions);
    }

    handleModalCancel = () => {
        this.setState({ visible: false });
    }

    render() {
        const conditions = this.props.value.conditions;
        const { visible } = this.state;
        return (
            <ul className="list-panel">
                <li>
                    <h2>购买条件</h2>
                    <Button type="primary" onClick={this.handleAddCondition}>添加条件</Button>
                </li>
                {conditions.map(condition => this.getRow(condition))}
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
    value: PropTypes.objectOf(PropTypes.any),
    onChange: PropTypes.func
}

export default BuyConditionList;
