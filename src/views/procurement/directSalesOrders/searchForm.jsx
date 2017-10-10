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
    constructor(props) {
        super(props);
        this.state = {
            storeId: ''
        };
        this.handleDirectStoresClear = this.handleDirectStoresClear.bind(this);
        this.handleDirectStoresChoose = this.handleDirectStoresChoose.bind(this);
    }

    handleDirectStoresChoose(storeId) {
        this.setState({ storeId });
    }

    handleDirectStoresClear() {
        this.setState({ storeId: '' });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="search-box direct-sales-orders">
                <Form layout="inline">
                    <Row gutter={40}>
                        <FormItem label="收货地址">
                            <DirectStores
                                onDirectStoresClear={this.handleDirectStoresClear}
                                onDirectStoresChoose={this.handleDirectStoresChoose}
                            />
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
            </div >
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
