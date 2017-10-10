/**
 * 促销管理查询条件
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Row } from 'antd';
import { withRouter } from 'react-router';
import { DirectStores } from '../../../container/search';

const FormItem = Form.Item;

class SearchForm extends PureComponent {
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="direct-sales-orders">
                <div className="search-box">
                    <h1>门店信息</h1>
                    <Form layout="inline">
                        <Row gutter={40}>
                            <FormItem label="门店编号">
                                {getFieldDecorator('store', {
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
                    </Form>
                </div>
                <div className="search-box">
                    <h1>商品信息</h1>
                    <Form layout="inline">
                        <Row gutter={40}>
                            <FormItem label="添加商品">
                                {getFieldDecorator('goodsId', {
                                    rules: [{ required: true, message: '请选择商品' }]
                                })(<Input size="default" disabled />)}
                            </FormItem>
                        </Row>
                    </Form>
                </div>
            </div>
        );
    }
}

SearchForm.propTypes = {
    form: PropTypes.objectOf(PropTypes.any)
};

SearchForm.defaultProps = {
    prefixCls: 'DirectSalesOrdersList'
};

export default withRouter(Form.create()(SearchForm));
