/**
 * 区域组管理查询条件
 *
 * @author taoqiyu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Row, Col } from 'antd';
import { withRouter } from 'react-router';

import Util from '../../../util/util';
import { DirectStores } from '../../../container/search';
import { Address } from '../../../container/cascader';

const FormItem = Form.Item;

class SearchForm extends PureComponent {
    state = {
        code: '',
        resetAddress: false // 是否重置地址
    }

    getFormData = () => {
        const {
            areaGroupIdOrName,
            stores
        } = this.props.form.getFieldsValue();
        return Util.removeInvalid({
            areaGroupIdOrName,
            stores: stores.id
        });
    }

    handleSearch = () => {
        // 通知父页面执行搜索
        this.props.onSearch(this.getFormData());
    }

    handleReset = () => {
        this.props.onReset(); // 通知查询条件已清除
        // 点击重置时清除 seachMind 引用文本
        this.props.form.setFieldsValue({
            stores: { reset: true }
        });
        this.setState({ code: '', resetAddress: true });
    }

    handleAddressChange = (address, options) => {
        console.log(options);
        if (address === null) {
            this.setState({ code: '', resetAddress: false });
        } else {
            this.setState({
                code: address.code
            });
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { resetAddress } = this.state;
        return (
            <Form layout="inline" className="stores-search-form">
                <Row>
                    <Col>
                        <FormItem label="所属城市">
                            <Address
                                reset={resetAddress}
                                onChange={this.handleAddressChange}
                            />
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="门店">
                            {getFieldDecorator('stores', {
                                initialValue: { storeId: '', storeName: '' }
                            })(<DirectStores
                                onChange={this.handleDirectStoresChange}
                            />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="end">
                    <Col>
                        <Button type="primary" size="default" onClick={this.handleSearch}>
                            查询
                        </Button>
                        <Button size="default" onClick={this.handleReset}>
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm.propTypes = {
    onSearch: PropTypes.func,
    onReset: PropTypes.func,
    form: PropTypes.objectOf(PropTypes.any)
};

export default withRouter(Form.create()(SearchForm));
