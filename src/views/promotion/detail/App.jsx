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
import { detail as columns } from '../columns';

const FormItem = Form.Item;

@connect((state) => ({
    promotion: state.toJS().promotion.promotionDetail
}), dispatch => bindActionCreators({
    clearPromotionDetail,
    getPromotionDetail
}, dispatch))

class PromotionDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.handleBack = this.handleBack.bind(this);
        this.getDetails = this.getDetails.bind(this);
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.getPromotionDetail({ promotionId: id });
    }

    componentWillUnmount() {
        this.props.clearPromotionDetail();
    }

    getDetails() {
        return columns.map(column => {
            const item = this.props.promotion[column.dataIndex];
            return (
                <Row key={column.key} type="flex" justify="start">
                    <Col span={16}>
                        <FormItem label={column.title} >
                            {column.render ? column.render(item) : item}
                        </FormItem>
                    </Col>
                </Row>);
        });
    }

    handleBack() {
        this.props.history.replace('/promotion');
    }

    render() {
        return (
            <div className="promotion-create">
                <Form layout="inline">
                    <div className="promotion-add-item">
                        <div className="add-message promotion-add-license">
                            <div className="add-message-body">
                                {this.getDetails()}
                                <Row gutter={40} type="flex" justify="center">
                                    <Col>
                                        <FormItem>
                                            <Button size="default" onClick={this.handleBack}>
                                                返回
                                            </Button>
                                        </FormItem>
                                    </Col>
                                </Row>
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
    promotion: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(PromotionDetail));