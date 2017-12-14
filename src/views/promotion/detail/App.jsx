/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 促销管理 - 促销管理列表
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Row, Col, Button, Input } from 'antd';
import { clearPromotionDetail, getPromotionDetail } from '../../../actions/promotion';
import {
    basicDetailBefore, basicDetailAfter,
    noConditions, purchageCondition,
    rewardListCondition, totalPurchaseCondition
} from '../columns';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect((state) => ({
    promotion: state.toJS().promotion.promotionDetail
}), dispatch => bindActionCreators({
    clearPromotionDetail,
    getPromotionDetail
}, dispatch))

class PromotionDetail extends PureComponent {
    state = {
        area: '', // 使用区域显示：全部区域；所选区域；指定门店
        storesVisible: false, // 门店编辑框是否可见
        submitVisible: false // 保存按钮是否可见
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.getPromotionDetail({ promotionId: id });
    }

    componentWillReceiveProps(nextProps) {
        const { promotion } = nextProps;
        const { stores, promotionRule, status } = promotion;
        // 存在门店编号的时候，门店编辑框可见
        if (stores && stores.storeId) {
            this.setState({ storesVisible: true }, () => {
                // 未发布和已发布状态才可修改门店编号列表
                if (status === 'unreleased' || status === 'released') {
                    this.setState({ submitVisible: true });
                }
            });
        }
        this.setState({ area: this.getArea(promotion) });
        if (promotionRule) {
            // 不制定条件
            if (!promotionRule.useConditionRule) {
                this.columns = noConditions;
            } else { // 指定条件
                switch (promotionRule.ruleName) {
                    case 'PURCHASECONDITION': // 购买条件
                        this.columns = purchageCondition;
                        break;
                    case 'REWARDLIST': // 奖励条件
                        this.columns = rewardListCondition;
                        break;
                    case 'TOTALPUCHASELIST': // 整个购买列表
                        this.columns = totalPurchaseCondition;
                        break;
                    default: break;
                }
            }
        }
    }

    componentWillUnmount() {
        this.props.clearPromotionDetail();
    }

    /**
     * 根据回传数据判断用户所选区域
     */
    getArea = (promotion) => {
        const { stores, companiesPoList } = promotion;
        if (stores === null && companiesPoList === null) {
            return '全部区域';
        }
        if (stores && stores.storeId) {
            return '指定门店';
        }
        if (companiesPoList && companiesPoList.length > 0) {
            return companiesPoList.map(c => c.companyName).join(', ');
        }
        return null;
    }

    getRowFromFields = (columns) => columns.map(column => {
        const { promotion, form } = this.props;
        const item = promotion[column.dataIndex];
        return (
            <Row key={column.dataIndex} type="flex" justify="start">
                <Col span={16}>
                    {column.render ?
                        <FormItem
                            label={column.title}
                        >
                            {column.render(item, promotion, form)}
                        </FormItem>
                        :
                        <FormItem label={column.title}>{item}</FormItem>
                    }
                </Col>
            </Row>);
    });

    columns = null;

    render() {
        const { form, promotion } = this.props;
        const { getFieldDecorator } = form;
        const { submitVisible, area, storesVisible } = this.state;
        const { promotionRule, stores } = promotion;
        return (
            <div className="promotion-form">
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <div className="promotion-add-item">
                        <div className="add-message promotion-add-license">
                            <div className="add-message-body">
                                {this.getRowFromFields(basicDetailBefore)}
                                <Row type="flex" justify="start">
                                    <Col span={16}>
                                        <FormItem label="优惠方式">{promotionRule}</FormItem>
                                    </Col>
                                </Row>
                                <Row key="area" type="flex" justify="start">
                                    <Col span={16}>
                                        <FormItem label="使用区域">{area}</FormItem>
                                    </Col>
                                </Row>
                                {storesVisible ?
                                    <Row type="flex" justify="start">
                                        <Col span={16}>
                                            <FormItem className="store">
                                                {getFieldDecorator('storeId', {
                                                    initialValue: stores.storeId,
                                                    rules: [{ required: true, message: '请输入指定门店' }]
                                                })(<TextArea
                                                    disabled={!submitVisible}
                                                    placeholder="请输入指定门店"
                                                    autosize={{ minRows: 4, maxRows: 6 }}
                                                />)}
                                            </FormItem>
                                        </Col>
                                    </Row> : null
                                }
                                {this.getRowFromFields(basicDetailAfter)}
                            </div>
                        </div>
                    </div>
                    {submitVisible ?
                        <Row className="center" >
                            <Button type="primary" size="default" htmlType="submit">保存</Button>
                        </Row> : null}
                </Form>
            </div>
        );
    }
}

PromotionDetail.propTypes = {
    clearPromotionDetail: PropTypes.func,
    getPromotionDetail: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any),
    form: PropTypes.objectOf(PropTypes.any),
    promotion: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(PromotionDetail));
