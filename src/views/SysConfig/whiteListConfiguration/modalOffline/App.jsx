/*
 * @Author: tanjf
 * @Description: 下线弹窗
 * @CreateDate: 2017-10-16 17:32:10
 * @Last Modified by: tanjf
 * @Last Modified time: 2017-10-16 17:35:31
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Modal, Form } from 'antd';
import { pubFetchValueList } from '../../../../actions/pub';
import { PAGE_SIZE } from '../../../../constant';
import {
    queryAliveCouponsList,
    clearCouponsList
} from '../../../../actions/promotion';

const FormItem = Form.Item;

@connect(state => ({
    couponsList: state.toJS().promotion.couponsList
}), dispatch => bindActionCreators({
    queryAliveCouponsList,
    clearCouponsList,
    pubFetchValueList
}, dispatch))

class ModalOffline extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            promoIds: [],
            modalOnlineVisible: false,
            warehouseCode: '',
            warehouseName: ''
        };
        this.param = {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            current: 1
        };
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value === '') {
            this.joiningSearchMind.reset();
        }
    }

    handleOk() {
        this.props.onOk();
    }

    handleCancel() {
        this.props.onCancel();
    }

    render() {
        return (
            <Modal
                title="确认"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <FormItem>
                    <div style={{textAlign: 'center'}}>确认下线选择的商家?</div>
                </FormItem>
            </Modal>
        );
    }
}

ModalOffline.propTypes = {
    visible: PropTypes.bool,
    value: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
}

export default withRouter(Form.create()(ModalOffline));
