/**
 * 直营店查询
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Row } from 'antd';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DirectStores } from '../../../container/search';
import {
    queryDirectInfo
} from '../../../actions/procurement';

const FormItem = Form.Item;

@connect(state => ({
    directInfo: state.toJS().procurement.directInfo
}), dispatch => bindActionCreators({
    queryDirectInfo
}, dispatch))

class StoresForm extends PureComponent {
    constructor(props) {
        super(props);
        this.handleDirectStoresChange = this.handleDirectStoresChange.bind(this);
    }

    handleDirectStoresChange({ record }) {
        this.props.queryDirectInfo({ storeId: record.storeId }).then(res => {
            this.props.onChange(res.data.branchCompanyId);
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const directInfo = this.props.directInfo || {};
        return (
            <div className="direct-sales-orders">
                <Form layout="inline">
                    <div className="search-box">
                        <h1>门店信息</h1>
                        <Row gutter={40}>
                            <FormItem label="门店编号">
                                {getFieldDecorator('stores', {
                                    initialValue: { storeId: '', storeName: '' },
                                    rules: [{ required: true, message: '请选择门店' }]
                                })(<DirectStores
                                    onChange={this.handleDirectStoresChange}
                                />)}
                            </FormItem>
                            <FormItem label="收货地址">
                                {getFieldDecorator('receivingAddress', {
                                    initialValue: directInfo.receivingAddress
                                })(<Input size="default" disabled />)}
                            </FormItem>
                            <FormItem label="收货人">
                                {getFieldDecorator('consignee', {
                                    initialValue: directInfo.consignee || '无'
                                })(<Input size="default" disabled />)}
                            </FormItem>
                            <FormItem label="手机号">
                                {getFieldDecorator('phone', {
                                    initialValue: directInfo.phone || '无'
                                })(<Input size="default" disabled />)}
                            </FormItem>
                        </Row>
                    </div>
                </Form>
            </div>
        );
    }
}

StoresForm.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    directInfo: PropTypes.objectOf(PropTypes.any),
    queryDirectInfo: PropTypes.func,
    onChange: PropTypes.func
};

export default withRouter(Form.create()(StoresForm));
