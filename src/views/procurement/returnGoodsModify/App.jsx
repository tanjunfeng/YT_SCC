/**
 * @file App.jsx
 * @author shijh
 *
 * 新建编辑采购退货单
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Select, DatePicker, Input, Table, Button } from 'antd';
import FormContent from './FormContent';
import List from './List';

import {
    getRefundNo,
    clearRefundNo,
    clearReturnInfo,    
    fetchReturnPoRcvDetail,
} from '../../../actions/procurement';

import {
    pubFetchValueList,
} from '../../../actions/pub';

const Option = Select.Option;
const { TextArea } = Input;


@connect(state => ({
    // 详情数据
    data: state.toJS().salesManagement.detail,
    // 退货单id
    getRefundNumebr: state.toJS().procurement.getRefundNumebr,
    // 采购退货详情
    poReturn: state.toJS().procurement.poReturn
}), dispatch => bindActionCreators({
    // 请求详情数据
    fetchReturnPoRcvDetail,
    // 值列表
    pubFetchValueList,
    // 获取退货单
    getRefundNo,
    // 清除退货单
    clearRefundNo,
    // 清除新增编辑采购退货单数据
    clearReturnInfo
}, dispatch))

class ReturnGoodsModify extends PureComponent {
    static propTypes = {
        prefixCls: PropTypes.string,
        match: PropTypes.objectOf(PropTypes.any),
        pubFetchValueList: PropTypes.func,
        fetchReturnPoRcvDetail: PropTypes.func,
        getRefundNo: PropTypes.func,
        getRefundNumebr: PropTypes.string,
        poReturn: PropTypes.objectOf(PropTypes.any),
        history: PropTypes.objectOf(PropTypes.any),
    }

    static defaultProps = {
        prefixCls: 'return-goods'
    }

    constructor(props) {
        super(props);

        const { match } = this.props;
        const { params } = match;

        if (params.id) {
            this.type = 'edit';
        } else {
            this.type = 'new';
        }

        this.state = {
            locDisabled: true
        }
    }

    componentDidMount() {
        const { match } = this.props;
        const { params } = match;

        if (this.type === 'edit') {
            this.props.fetchReturnPoRcvDetail({id: params.id})
        } else {
            this.props.getRefundNo()
        }
    }

    componentWillUnmount() {
        this.props.clearReturnInfo();
    }

    onPageChange = () => {

    }

    getFormData = () => {
        return this.formContent.getValue();
    }

    render() {
        const { prefixCls, getRefundNumebr, poReturn, history } = this.props;
        const { pmPurchaseRefundItems = [], ...formData } = poReturn;

        const cls = classnames(
            `${prefixCls}-modify`,
            {
                [`${prefixCls}-modify-${this.type}`]: this.type
            }
        )

        return (
            <div
                className={cls}
            >
                <FormContent
                    ref={node => { this.formContent = node }}
                    pubFetchValueList={this.props.pubFetchValueList}
                    type={this.type}
                    refundNumber={getRefundNumebr}
                    defaultValue={formData}
                />

                <List
                    getFormData={this.getFormData}
                    defaultValue={pmPurchaseRefundItems}
                    type={this.type}
                    status={formData.status}
                    id={formData.id}
                    history={history}
                />
            </div>
        )
    }
}

export default withRouter(ReturnGoodsModify)
