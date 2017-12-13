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
import { Form, Row, Col, Button } from 'antd';
import { clearPromotionDetail, getPromotionDetail } from '../../../actions/promotion';
import { noConditions, purchageCondition } from '../columns';

const FormItem = Form.Item;

@connect((state) => ({
    promotion: state.toJS().promotion.promotionDetail
}), dispatch => bindActionCreators({
    clearPromotionDetail,
    getPromotionDetail
}, dispatch))

class PromotionDetail extends PureComponent {
    state = {
        branch: -1,
        hasStoreIds: false
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.getPromotionDetail({ promotionId: id });
    }

    componentWillReceiveProps(nextProps) {
        const { promotion } = nextProps;
        if (promotion.promotionRule && !promotion.promotionRule.useConditionRule) {
            // 存在门店编号的时候，显示保存按钮
            if (promotion.stores && promotion.stores.storeId) {
                this.setState({ hasStoreIds: true });
            }
            this.setState({ branch: 0 });
        }
    }

    componentWillUnmount() {
        this.props.clearPromotionDetail();
    }

    getNoConditionsDetails = () => noConditions.map(column => {
        const { promotion, form } = this.props;
        const item = promotion[column.dataIndex];
        return (
            <Row key={column.dataIndex} type="flex" justify="start">
                <Col span={16}>
                    <FormItem label={column.title} >
                        {column.render ? column.render(
                            item, promotion, form) : item}
                    </FormItem>
                </Col>
            </Row>);
    });

    getDetails = () => {
        switch (this.state.branch) {
            case 0: return this.getNoConditionsDetails();
            default: return null;
        }
    }

    render() {
        const { hasStoreIds } = this.state;
        return (
            <div className="promotion-create">
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <div className="promotion-add-item">
                        <div className="add-message promotion-add-license">
                            <div className="add-message-body">
                                {this.getDetails()}
                            </div>
                        </div>
                    </div>
                    {hasStoreIds ?
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
