/**
 * 促销管理查询条件
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Row, Col } from 'antd';
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
            <div className="search-box directSalesOrders">
                <Form layout="inline">
                    <div className="search-conditions">
                        <Row gutter={40}>
                            <Col span={8}>
                                <DirectStores
                                    onDirectStoresClear={this.handleDirectStoresClear}
                                    onDirectStoresChoose={this.handleDirectStoresChoose}
                                />
                            </Col>
                            <Col span={8}>
                                <FormItem label="活动名称">
                                    {getFieldDecorator('promotionName')(<Input size="default" />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
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
}

export default withRouter(Form.create()(SearchForm));
