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
    pubFetchValueList,
} from '../../../actions/pub';

import {
    fetchReturnPoRcvDetail
} from '../../../actions';

const Option = Select.Option;
const { TextArea } = Input;

@connect(state => ({
    // 详情数据
    data: state.toJS().salesManagement.detail
}), dispatch => bindActionCreators({
    // 请求详情数据
    fetchReturnPoRcvDetail,
    // 值列表
    pubFetchValueList
}, dispatch))

class ReturnGoodsModify extends PureComponent {
    static propTypes = {
        prefixCls: PropTypes.string,
        match: PropTypes.objectOf(PropTypes.any),
        pubFetchValueList: PropTypes.func,
        fetchReturnPoRcvDetail: PropTypes.func,
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
        }
    }

    onPageChange = () => {

    }

    getFormData = () => {
        return this.formContent.getValue();
    }

    render() {
        const { prefixCls } = this.props;

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
                />

                <List
                    getFormData={this.getFormData}
                />
            </div>
        )
    }
}

export default withRouter(ReturnGoodsModify)
