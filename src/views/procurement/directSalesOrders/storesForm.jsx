/**
 * 直营店查询表单
 *
 * @returns 分公司编号
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

class StoresForm extends PureComponent {
    constructor(props) {
        super(props);
        this.handleDirectStoresChange = this.handleDirectStoresChange.bind(this);
    }

    componentWillMount() {
        this.props.clearDirectInfo();
    }

    handleDirectStoresChange({ record }) {
        if (record && record.storeId) {
            this.props.queryDirectInfo({ storeId: record.storeId }).then(res => {
                // 返回分公司 id 供父页面使用
                this.props.onChange(res.data.branchCompanyId);
            });
        } else {
            this.props.clearDirectInfo();
            this.props.onChange('');    // 通知副页面清空
        }
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
            </div>
        );
    }
}

StoresForm.propTypes = {
    form: PropTypes.objectOf(PropTypes.any),
    directInfo: PropTypes.objectOf(PropTypes.any),
    queryDirectInfo: PropTypes.func,
    clearDirectInfo: PropTypes.func,
    onChange: PropTypes.func
};

export default withRouter(Form.create()(StoresForm));
