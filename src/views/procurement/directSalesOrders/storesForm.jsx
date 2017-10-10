/**
 * 直营店查询
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Row } from 'antd';
import { withRouter } from 'react-router';
import { DirectStores } from '../../../container/search';

const FormItem = Form.Item;

class StoresForm extends PureComponent {
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="direct-sales-orders">
                <Form layout="inline">
                    <div className="search-box">
                        <h1>门店信息</h1>
                        <Row gutter={40}>
                            <FormItem label="门店编号">
                                {getFieldDecorator('storeId', {
                                    initialValue: { storeId: '', storeName: '' },
                                    rules: [{ required: true, message: '请选择门店' }]
                                })(<DirectStores />)}
                            </FormItem>
                            <FormItem label="收货地址">
                                {getFieldDecorator('promotionName')(<Input size="default" disabled />)}
                            </FormItem>
                            <FormItem label="收货人">
                                {getFieldDecorator('promotionName')(<Input size="default" disabled />)}
                            </FormItem>
                            <FormItem label="手机号">
                                {getFieldDecorator('promotionName')(<Input size="default" disabled />)}
                            </FormItem>
                        </Row>
                    </div>
                </Form>
            </div>
        );
    }
}

StoresForm.propTypes = {
    form: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(StoresForm));
