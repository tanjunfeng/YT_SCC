/**
 * @file App.jsx
 * @author taoqiyu,tanjf
 *
 * 促销管理 - 促销管理列表
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Row, Col } from 'antd';
import { clearCouponsDetail, getCouponsDetail } from '../../../actions/promotion';
import { couponsDetail as columns } from '../columns';

const FormItem = Form.Item;
@connect((state) => ({
    coupons: state.toJS().promotion.couponsDetail
}), dispatch => bindActionCreators({
    clearCouponsDetail,
    getCouponsDetail
}, dispatch))

class CouponDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.handleBack = this.handleBack.bind(this);
        this.getDetails = this.getDetails.bind(this);
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.getCouponsDetail({ promoId: id });
    }

    componentWillUnmount() {
        this.props.clearCouponsDetail();
    }

    getDetails() {
        return columns.map(column => {
            const item = this.props.coupons[column.dataIndex];
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
        this.props.history.replace('/coupon');
    }

    render() {
        return (
            <div className="coupons-form">
                <Form layout="inline">
                    <div className="coupons-add-item">
                        <div className="add-message coupons-add-license">
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

CouponDetail.propTypes = {
    clearCouponsDetail: PropTypes.func,
    getCouponsDetail: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any),
    coupons: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any)
}

export default withRouter(Form.create()(CouponDetail));
