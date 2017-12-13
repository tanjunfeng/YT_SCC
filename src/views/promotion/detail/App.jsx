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
import { Form, Row, Col } from 'antd';
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
        branch: -1
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.getPromotionDetail({ promotionId: id });
    }

    componentWillReceiveProps(nextProps) {
        const { promotion } = nextProps;
        if (promotion.promotionRule && !promotion.promotionRule.useConditionRule) {
            this.setState({ branch: 0 });
        }
    }

    componentWillUnmount() {
        this.props.clearPromotionDetail();
    }

    getNoConditionsDetails = () => noConditions.map(column => {
        const item = this.props.promotion[column.dataIndex];
        return (
            <Row key={column.dataIndex} type="flex" justify="start">
                <Col span={16}>
                    <FormItem label={column.title} >
                        {column.render ? column.render(item, this.props.promotion) : item}
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
        return (
            <div className="promotion-create">
                <Form layout="inline">
                    <div className="promotion-add-item">
                        <div className="add-message promotion-add-license">
                            <div className="add-message-body">
                                {this.getDetails()}
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
}

PromotionDetail.propTypes = {
    clearPromotionDetail: PropTypes.func,
    getPromotionDetail: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any),
    promotion: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(PromotionDetail));
