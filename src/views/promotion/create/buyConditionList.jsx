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

import BuyConditionModal from './buyConditionModal';

class BuyConditionList extends PureComponent {
    state = {
        visible: false, // 是否显示模态框
        conditions: [] // 购买条件
    }

    getRow = (condition) => (
        <li>
            <Row>
                {this.getBuyType(condition)}
            </Row>
        </li>
    )

    getBuyType = (condition) => {
        switch (condition.purchaseType) {
            case 'CATEGORY': return (
                <div className="wd-396">
                    购买类型：按品类，{condition.promoCategories.categoryName}
                </div>
            );
            case 'PRODUCT': return (
                <div className="wd-396">
                    购买类型：按商品，{condition.promoProduct.productName}
                </div>
            );
            case 'ALL': return (
                <div className="wd-396">
                    购买类型：全部
                </div>
            );
            default: return null;
        }
    }

    handleAddCondition = () => {
        this.setState({ visible: true })
    }

    handleModalOk = () => {
        this.setState({ visible: false });
    }

    handleModalCancel = () => {
        this.setState({ visible: false });
    }

    render() {
        const { visible, conditions } = this.state;
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
    // form: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(BuyConditionList));
