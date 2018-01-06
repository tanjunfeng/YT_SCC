/**
 * 直营店查询表单
 *
 * @returns 分公司编号
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Row, Modal } from 'antd';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DirectStores } from '../../../container/search';
import {
    queryDirectInfo,
    clearDirectInfo
} from '../../../actions/procurement';

const FormItem = Form.Item;

@connect(state => ({
    directInfo: state.toJS().procurement.directInfo
}), dispatch => bindActionCreators({
    queryDirectInfo,
    clearDirectInfo
}, dispatch))

class SearchForm extends PureComponent {
    state = {
        record: null,
        tmp: null,
        modalRechooseVisible: false // 提示重新选择门店的模态框
    }

    componentWillMount() {
        this.props.clearDirectInfo();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value.shouldClear && !this.props.value.shouldClear) {
            this.clear();
        }
    }

    render() {
        const { form, directInfo = {} } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className="direct-sales-orders-form">
                <Form layout="inline">
                    <div className="search-box">
                        <h1>门店信息</h1>
                        <Row gutter={40}>
                            <FormItem label="选择门店">
                                {getFieldDecorator('stores', {
                                    initialValue: { storeId: '', storeName: '' },
                                    rules: [{ required: true, message: '请选择门店' }]
                                })(<DirectStores
                                    onChange={this.handleDirectStoresChange}
                                />)}
                            </FormItem>
                            <FormItem label="门店编号">
                                {getFieldDecorator('storeId', {
                                    initialValue: ''
                                })(<Input size="default" disabled />)}
                            </FormItem>
                            <FormItem label="收货地址">
                                {getFieldDecorator('receivingAddress', {
                                    initialValue: directInfo.receivingAddress
                                })(<Input size="default" disabled />)}
                            </FormItem>
                            <FormItem label="收货人">
                                {getFieldDecorator('consignee', {
                                    initialValue: directInfo.consignee
                                })(<Input size="default" disabled />)}
                            </FormItem>
                            <FormItem label="手机号">
                                {getFieldDecorator('phone', {
                                    initialValue: directInfo.phone
                                })(<Input size="default" disabled />)}
                            </FormItem>
                        </Row>
                    </div>
                </Form>
                <Modal
                    title="重新选择门店"
                    visible={this.state.modalRechooseVisible}
                    onOk={this.handleRechooseOk}
                    onCancel={this.handleRechooseCancel}
                >
                    <p>这个操作将要重新选择门店并清空已选择商品，确定吗？</p>
                </Modal>
            </div>
        );
    }
}

SearchForm.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    directInfo: PropTypes.objectOf(PropTypes.any),
    value: PropTypes.objectOf(PropTypes.any),
    shouldClear: PropTypes.bool,
    queryDirectInfo: PropTypes.func,
    clearDirectInfo: PropTypes.func,
    onChange: PropTypes.func
};

export default withRouter(Form.create()(SearchForm));
